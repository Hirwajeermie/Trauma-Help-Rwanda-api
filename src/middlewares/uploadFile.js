import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes =
      /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/pdf/;

    const isValid = allowedTypes.test(file.mimetype);
    const error = isValid ? null : new Error("Invalid file type");
    cb(error, isValid);
  },
}).single("file");
