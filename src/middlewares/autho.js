import JWT from "jsonwebtoken";
import User from "../models/user.js";
import 'dotenv/config';

export const isAuth = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized User",
    });
  }

  try {
    const decodeData = JWT.verify(token, process.env.JWT_SECRET);
    console.log(decodeData);
    req.user = await User.findById(decodeData._id);
    req.user.isAdmin = decodeData.isAdmin;  
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized User",
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send({
      success: false,
      message: "Admin only",
    });
  }
  next();
};
