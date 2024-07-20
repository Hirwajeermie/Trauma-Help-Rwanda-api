import { Router } from 'express';
import { isAdmin, isAuth } from '../middlewares/autho';
import { deleteFile, getFiles, uploadFile } from '../controllers/fileController';
import upload from '../middlewares/uploadFile';
import setCookie from '../middlewares/setCookie';


const fileRoutes = Router();
fileRoutes.use(setCookie);
fileRoutes.post('/upload', isAuth, isAdmin, upload.single('file'), uploadFile);
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
