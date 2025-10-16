import authService from "../services/auth.services.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//đăng ký
export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
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
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      ok: true,
      message: "Đăng ký thành công",
      user: userObj,
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
    //check trạng thái 
    if (user.status === "blocked") {
      return res.status(400).json({ message: "Tài khoản đã bị vô hiệu hóa" })
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

//Tạo user bên admin 
export const createStaff = async (req, res) => {
  try {
    const { email, name, username, password } = req.body

    if (!email || !name || !username || !password) {
      return res.status(400).json({ ok: false, message: "Thiếu thông tin bắt buộc" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ ok: false, message: "Email đã tồn tại" });
    }

    const user = await User.create({
      username,
      name,
      email,
      password,
      role: "staff",
      phone: "",
      address: [],
    });
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      ok: true,
      message: "Tạo nhân viên mới thành công",
      user: userObj,
    });
  } catch (error) {
    // Trả về message chi tiết để FE hiển thị rõ nguyên nhân
    return res.status(500).json({ ok: false, message: error.message || "Tạo nhân viên thất bại" })
  }

}

//Đăng nhập bên admin 
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("Không tìm thấy tài khoản");
      return res.status(400).json({ ok: false, message: "Không tìm thấy tài khoản" });
    }

    //check trạng thái tài khoản
    if (user.status === "blocked") {
      console.log("Tài khoản đã bị vô hiệu hóa");
      return res.status(400).json({ ok: false, message: "Tài khoản đã bị vô hiệu hóa" });
    }

    //check role account 
    if (user.role !== "admin" && user.role !== "staff") {
      console.log("Không có quyền truy cập trang quản trị");
      return res.status(403).json({ ok: false, message: "Không có quyền truy cập trang quản trị" });
    }

    //check pass 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Sai mật khẩu");
      return res.status(400).json({ ok: false, message: "Sai mật khẩu" });
    }

    // Set a URL-encoded cookie via Express helper to avoid malformed values
    res.cookie("user", encodeURIComponent(JSON.stringify({
      id: user._id,
      name: user.name,
      role: user.role,
    })), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      ok: true,
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ ok: false, message: "Lỗi server khi đăng nhập admin", error: error.message })
  }
}

//Lấy tài khoản admin
export const getAdminAccount = async (req, res) => {
  try {
    // Lấy thông tin user từ cookie đã được cookie-parser parse
    const rawUserCookie = req.cookies?.user;
    const userData = rawUserCookie || null;

    if (!userData) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const user = JSON.parse(decodeURIComponent(userData));

    // Tìm user trong database để lấy thông tin mới nhất
    const currentUser = await User.findById(user.id).select('-password');
    if (!currentUser) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Kiểm tra quyền truy cập
    if (currentUser.role !== "admin" && currentUser.role !== "staff") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    return res.status(200).json({
      ok: true,
      message: "Lấy thông tin admin thành công",
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        username: currentUser.username,
        phone: currentUser.phone,
        address: currentUser.address,
        status: currentUser.status,
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Lỗi server khi lấy thông tin admin",
      error: error.message
    });
  }
}
// Logout Admin
export const logoutAdmin = async (req, res) => {
  try {
    // Xóa cookie user
    res.clearCookie("user", {
      path: "/",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      ok: true,
      message: "Đăng xuất admin thành công"
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Lỗi server khi đăng xuất admin",
      error: error.message
    });
  }
}