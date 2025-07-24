import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

//so sánh mật khẩu
const matchPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

//tạo access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      isVerified: user.isVerified,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

//tạo refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default { matchPassword, generateAccessToken, generateRefreshToken };
