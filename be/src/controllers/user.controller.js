import mongoose from "mongoose";
import User from "../models/user.js";

// Chuẩn hóa mảng địa chỉ: nếu phần tử là string thì chuyển về object { name, isDefault }
const normalizeAddresses = (addressArray) => {
  if (!Array.isArray(addressArray)) return [];
  return addressArray.map((addr) => {
    if (typeof addr === "string") {
      return { name: addr, isDefault: false };
    }
    if (addr && typeof addr === "object") {
      return {
        ...addr,
        name: typeof addr.name === "string" ? addr.name : "",
        isDefault: !!addr.isDefault,
      };
    }
    return { name: "", isDefault: false };
  });
};

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

//thêm địa chỉ của người dùng 
export const addAddress = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ ok: false, message: "Dữ liệu không hợp lệ" });
    }
    const { name, isDefault } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ ok: false, message: "Tên địa chỉ không hợp lệ" });
    }
    const user = await User.findById(req.user.userId);

    if (!user)
      return res.status(404).json({ ok: false, message: "Người dùng không tồn tại" });

    // Đảm bảo mảng địa chỉ luôn tồn tại
    if (!Array.isArray(user.address)) {
      user.address = [];
    }

    // Chuẩn hóa dữ liệu địa chỉ cũ (trường hợp lưu dạng string)
    user.address = normalizeAddresses(user.address);

    // nếu là địa chỉ mặc định -> reset các địa chỉ khác
    if (isDefault) {
      user.address.forEach((addr) => (addr.isDefault = false));
    }

    user.address.push({ name, isDefault });
    await user.save();

    res.status(200).json({ ok: true, message: "Thêm địa chỉ thành công", data: user.address });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Lỗi server", error: error.message });
  }
};

//cập nhật địa chỉ
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ ok: false, message: "Dữ liệu không hợp lệ" })
    }
    const { name, isDefault } = req.body

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ ok: false, message: "Người dùng không tồn tại" })
    }

    if (!Array.isArray(user.address)) {
      user.address = []
    }

    // Chuẩn hóa trước khi thao tác
    user.address = normalizeAddresses(user.address)

    const addr = user.address.id(addressId)
    if (!addr) {
      return res.status(404).json({ ok: false, message: "Không tìm thấy địa chỉ" })
    }

    if (isDefault) {
      user.address.forEach((addr) => (addr.isDefault = false))
    }

    addr.name = name || addr.name
    addr.isDefault = isDefault ?? addr.isDefault

    await user.save()

    res.status(200).json({ ok: true, message: "Cập nhật địa chỉ thành công", data: user.address })
  } catch (error) {
    res.status(500).json({ ok: false, messsage: "Lỗi server", error: error.message })
  }
}

//xóa địa chỉ 
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ ok: false, message: "Người dùng không tồn tại" })
    }

    if (!Array.isArray(user.address)) {
      user.address = []
    }

    // Chuẩn hóa trước khi thao tác
    user.address = normalizeAddresses(user.address)

    user.address = user.address.filter((addr) => addr._id.toString() !== addressId)
    await user.save()

    res.status(200).json({ ok: true, message: "Xóa địa chỉ thành công", data: user.address })
  } catch (error) {
    res.status(500).json({ ok: false, message: "Lỗi server" })
  }

}

// đặt địa chỉ mặc định

export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ ok: false, message: "Người dùng không tồn tại" })
    }

    if (!Array.isArray(user.address)) {
      user.address = []
    }

    // Chuẩn hóa trước khi thao tác
    user.address = normalizeAddresses(user.address)

    user.address.forEach((addr) => (addr.isDefault = addr._id.toString() === addressId))
    await user.save()

    res.status(200).json({ ok: true, message: "Đã đặt địa chỉ mặc định", data: user.address })
  } catch (error) {
    res.status(500).json({ ok: false, message: "Lỗi server" })
  }
}