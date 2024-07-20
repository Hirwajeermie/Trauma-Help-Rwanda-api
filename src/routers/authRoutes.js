import { Router } from 'express';
import { loginController, register } from '../controllers/authController';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', loginController);

export default authRoutes;
