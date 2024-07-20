import File from "../models/document";

export const uploadFile = async (req, res) => {
try {
    const { file } = req;
  const fileData = new File({
    filename: file.originalname,
    path: file.path,
    size: file.size,
    uploadedBy: req.user._id
  });
  await fileData.save();
  res.status(201).send(fileData);
} catch (error) {
  res.status(500).json({error:error})
}
};

export const getFiles = async (req, res) => {
 try {
   const files = await File.find({}).populate('uploadedBy', 'username');
   if(!files){
    return res.status(404).send({ error: 'No files found' });
   }
   else{
    return res.status(200).send({files});
   }
  
 } catch (error) {
  res.status(500).json({error:error})
 }
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
      const file = await File.findByIdAndDelete(id);
      if(!file){
        return res.status(404).send({ error: 'File not found' });
      }
      else{
       return res.status(200).json({message:"File deleted successfully!"})
      }
  } catch (error) {
    res.status(500).json({error:error})
  }

};
