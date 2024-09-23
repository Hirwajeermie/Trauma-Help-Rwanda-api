import { getDataUri } from "../utils/getDataUri.js";
import cloudinary from "cloudinary";
import File from "../models/document.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Received file:", req.file);
    const fileUri = getDataUri(req.file);
    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "uploads",
      resource_type: "auto",
      timeout: 60000,
    });

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
      res.redirect(file.url);
    } else {
      res.status(404).send({ error: "File not found" });
    }
  } catch (error) {
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
