import { Router } from 'express';
import { forgotPassword, loginController, register, resetPassword } from '../controllers/authController.js';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', loginController);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password/:token', resetPassword);

export default authRoutes;
