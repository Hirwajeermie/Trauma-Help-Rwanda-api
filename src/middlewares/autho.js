import JWT from "jsonwebtoken";
import User from "../models/user";

export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;

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
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized User",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "Admin only",
    });
  }
  next();
};
