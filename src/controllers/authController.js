

import User from '../models/user';
import * as userService from '../services/authSevice';


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

      res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
      }).send({
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
