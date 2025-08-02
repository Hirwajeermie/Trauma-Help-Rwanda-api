import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const loginUser = async (username, password) => {
    if (!username || !password) {
      throw new Error("Please Add Email OR Password");
    }
  
    const user = await User.findOne({ username });
  
    if (!user) {
      throw new Error("User Not Found");
    }
  
    const isMatch = await user.comparePassword(password);
  
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
  
    const token = user.generateToken();
    return { user, token };
  };

  // Generate Reset Token
export const generatePasswordResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with this email doesn't exist");

  const token = crypto.randomBytes(32).toString('hex');
  const expiration = Date.now() + 1000 * 60 * 15; // 15 minutes

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expiration;
  await user.save();

  return { token, user };
};

// Reset password with token
export const resetPasswordWithToken = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Reset token is invalid or expired");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return user;
};