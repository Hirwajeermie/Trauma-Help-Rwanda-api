import { Router } from 'express';
import { isAdmin, isAuth } from '../middlewares/autho';
import { deleteFile, getFiles, uploadFile } from '../controllers/fileController';
import upload from '../middlewares/uploadFile';



const fileRoutes = Router();

fileRoutes.post('/upload', isAuth, isAdmin, upload.array('file'), uploadFile);
fileRoutes.get('/', getFiles);
fileRoutes.delete('/:id', isAuth, isAdmin, deleteFile);
fileRoutes.use('/uploads', (req, res, next) => {
    const filePath = path.join(__dirname, '../../uploads', req.path);
    res.sendFile(filePath, (err) => {
      if (err) {
        next(err);
      }
    });
  });

export default fileRoutes;
