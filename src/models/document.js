import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const File = model('File', fileSchema);
export default File;
