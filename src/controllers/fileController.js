import { getDataUri } from "../utils/getDataUri.js";
import cloudinary from "cloudinary";
import File from "../models/document.js";
import fetch from 'node-fetch';
import { error } from "console";


export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate that the file is a PDF or other allowed types
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    if (!allowedTypes.test(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    const fileUri = getDataUri(req.file);
    console.log("Uploading to Cloudinary...");

    // Upload the file to Cloudinary
    const result = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "uploads",
      resource_type: "raw", 
      public_id: req.file.originalname.replace(/\s+/g, "_"), 
      access_mode: "public", 
    });

    console.log("Cloudinary upload result:", result);

    const fileData = {
      filename: req.file.originalname,
      url: result.secure_url, 
      size: req.file.size,
      uploadedBy: req.user._id,
      public_id: result.public_id,
    };

    const savedFile = await File.create(fileData);

    res.status(201).json({
      message: "File uploaded successfully",
      file: savedFile,
    });

  } catch (error) {
    console.error("Upload File Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getFiles = async (req, res) => {
  try {
    const files = await File.find({}).populate("uploadedBy", "username");
    if (!files) {
      return res.status(404).send({ error: "No files found" });
    } else {
      return res.status(200).send({ files });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};


export const getFileContent = async (req, res) => {
  try {
    const { filename } = req.params;
    const file = await File.findOne({ filename });

    if (file) {
      const fileUrl = file.url;
      console.log({fileUrl});
      

      res.set({
        'Content-Disposition': `attachment; filename="${file.filename}"`,
        'Content-Type': 'application/octet-stream',
      });

      const response = await fetch(fileUrl);

      if (!response.ok) {
        console.log("Error fetching file from Cloudinary:", response.status, response.statusText);
        return res.status(404).send({ error: "File not found on Cloudinary" });
      }

      response.body.pipe(res);
    } else {
      res.status(404).send({ error: "File not found" });
    }
  } catch (error) {
    console.log("Error in getFileContent:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};




export const deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findByIdAndDelete(id);
    if (!file) {
      return res.status(404).send({ error: "File not found" });
    } else {
      await cloudinary.v2.uploader.destroy(file.public_id);
      return res.status(200).json({ message: "File deleted successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
