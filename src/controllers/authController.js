

import User from '../models/user.js';
import * as userService from '../services/authSevice.js';
import { sendEmail } from '../utils/email.js';
import "dotenv/config"
const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
const frontendProd = process.env.FRONTEND_URL_PROD || "https://thr.org.rw/";

export const register = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;


  try {
    const user = new User({ username, email, password, isAdmin });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};


export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await userService.loginUser(username, password);
    console.log("Username and password", username, password);
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: error.message || "Error In Login API",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const { token, user } = await userService.generatePasswordResetToken(email);
    const resetUrl = `${frontend}/reset-password/${token}`; // or your frontend domain

    const html = `
      <h2>Hello, ${user.username}</h2>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html,
    });

    res.status(200).json({
      success: true,
      message: `Password reset link sent to your email, ${email} please check your email to reset your password`,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Reset Password (Use token)
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    await userService.resetPasswordWithToken(token, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};