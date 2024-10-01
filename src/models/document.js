import { Schema, model } from "mongoose";

// Define the schema for File
const fileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true, // Automatically removes leading and trailing whitespace
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          // Regular expression to validate URL format
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    size: {
      type: Number,
      required: true,
      min: 0, // Ensure size is a non-negative number
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure that the user uploading the file is always set
    },
    public_id: {
      type: String,
      required: true,
      unique: true, // Ensure that public IDs are unique
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the File model
const File = model("File", fileSchema);

export default File;
