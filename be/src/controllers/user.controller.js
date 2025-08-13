import mongoose from "mongoose";
import User from "../models/user.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

// lấy danh sách người dùng
export const getAllUser = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const searchRaw = (req.query.search || "").trim();

    // Escape ký tự regex đặc biệt để tìm kiếm an toàn
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const filter = { role: "user" };
    if (searchRaw) {
      const rx = new RegExp(escapeRegex(searchRaw), "i");
      filter.$or = [
        { name: rx },
        { email: rx },
        { phone: rx },
        { username: rx },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      ok: true,
      message: "Lấy thành công thông tin người dùng",
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: error.message || "Lỗi server!" });
  }
};
//lấy thông tin người dùng bằng id
export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).lean();
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người này", ok: false });
    }
    return res
      .status(200)
      .json({ ok: true, message: "Đã tìm thấy người dùng", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi khi lấy người dùng", ok: false });
  }
};
// cập nhật người dùng
export const updateUser = async (req, res) => {
  try {
    const id = req.params._id || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: "ID không hợp lệ" });
    }

    // Chỉ cho phép sửa các trường hồ sơ (KHÔNG password/role...)
    const ALLOWED = [
      "name",
      "phone",
      "address",
      "avatar",
      "email",
      "username",
      "status",
      "note",
    ];
    const update = {};
    for (const k of ALLOWED) if (k in req.body) update[k] = req.body[k];
    delete update.password; // phòng hờ client gửi lên

    // Nếu không có trường hợp lệ nào để cập nhật
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Không có trường hợp lệ để cập nhật" });
    }

    // Nếu đổi email/username → kiểm tra trùng (tùy nhu cầu, giữ để an toàn)
    if (update.email) {
      const dup = await User.exists({ email: update.email, _id: { $ne: id } });
      if (dup)
        return res.status(409).json({ ok: false, message: "Email đã tồn tại" });
    }
    if (update.username) {
      const dup = await User.exists({
        username: update.username,
        _id: { $ne: id },
      });
      if (dup)
        return res
          .status(409)
          .json({ ok: false, message: "Username đã tồn tại" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: update }, // PATCH = chỉ set các field có trong body
      { new: true, runValidators: true, context: "query" } // bật validator khi update
    ).select("-password -__v"); // ẩn field nhạy cảm

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy người này" });
    }

    return res.status(200).json({
      ok: true,
      message: "Cập nhật thông tin thành công",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ ok: false, message: "Giá trị trùng lặp (email/username)" });
    }
    return res
      .status(500)
      .json({ ok: false, message: error.message || "Lỗi server" });
  }
};
