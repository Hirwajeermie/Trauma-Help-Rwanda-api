import { Router } from 'express';
import { loginController, register } from '../controllers/authController.js';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', loginController);

export default authRoutes;
