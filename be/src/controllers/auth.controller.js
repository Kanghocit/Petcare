import authService from "../services/auth.services.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

//đăng ký
export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    console.log(name, email, username, password);
    //kiểm tra xem user đã tồn tại chưa
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    //tạo user mới
    const user = await User.create({
      username,
      name,
      email,
      password,
      phone: "",
      address: "",
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      ok: true,
      message: "Đăng ký thành công",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Đăng ký thất bại", error });
  }
};
//đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //kiểm tra xem user đã tồn tại chưa
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy tài khoản" });
    }
    //so sánh mật khẩu
    const isMatch = await authService.matchPassword(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }
    //tạo access token
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    //lưu access token vào cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    //lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      ok: true,
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};
//đăng xuất
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      ok: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

//tạo lại access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    const newAccessToken = authService.generateAccessToken(user);

    //lưu access token mới vào cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      ok: true,
      message: "Tạo lại access token thành công",
      accessToken: newAccessToken,
    });

    console.log("đã tạo lại access token");
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};
