import { Router } from 'express';
import { isAdmin, isAuth } from '../middlewares/autho.js';
import { deleteFile, getFileContent, getFiles, uploadFile } from '../controllers/fileController.js';
import upload from '../middlewares/uploadFile.js';

const fileRoutes = Router();

fileRoutes.post('/upload', isAuth, isAdmin, upload.array('file'), uploadFile);
fileRoutes.get('/', getFiles);
fileRoutes.get('/uploads/:filename', getFileContent);
fileRoutes.delete('/:id', isAuth, isAdmin, deleteFile);

export default fileRoutes;
