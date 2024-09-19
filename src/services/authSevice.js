
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