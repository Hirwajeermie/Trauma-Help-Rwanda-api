import File from "../models/document";
import path from "path";
import fs from "fs";

export const uploadFile = async (req, res) => {
  try {
    const files = req.files; // Access the files array
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileDataArray = files.map(file => ({
      filename: file.originalname,
      path: file.path,
      size: file.size,
      uploadedBy: req.user._id
    }));

    const savedFiles = await File.insertMany(fileDataArray);
    res.status(201).send(savedFiles);
  } catch (error) {
    console.error('Upload File Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({}).populate('uploadedBy', 'username');
    if (!files) {
      return res.status(404).send({ error: 'No files found' });
    } else {
      return res.status(200).send({ files });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getFileContent = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findByIdAndDelete(id);
    if (!file) {
      return res.status(404).send({ error: 'File not found' });
    } else {
      const filePath = path.join(__dirname, '../../uploads', file.filename);
      fs.unlinkSync(filePath); // Remove the file from the filesystem
      return res.status(200).json({ message: "File deleted successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
