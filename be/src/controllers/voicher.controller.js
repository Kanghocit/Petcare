import Voicher from "../models/Voicher.js";
import User from "../models/user.js";

export const createVoicher = async (req, res) => {
  try {
    const { name, code, discountValue, startDate, endDate, maxUsers, status } =
      req.body;
    const existedVoicher = await Voicher.findOne({ $or: [{ name }, { code }] });
    if (existedVoicher) {
      return res.status(409).json({ ok: false, message: "Voicher đã tồn tại" });
    }
    const voicher = await Voicher.create({
      name,
      code,
      discountValue,
      startDate,
      endDate,
      maxUsers,
      usedCount: 0,
      status,
    });
    res.status(200).json({
      ok: true,
      message: "Tạo voicher thành công",
      voicher,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Tạo voicher thất bại",
      error,
    });
  }
};

export const getVoichers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: new RegExp(req.query.search, "i") } },
        { code: { $regex: new RegExp(req.query.search, "i") } },
      ];
    }

    const voichers = await Voicher.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "_id name code discountValue startDate endDate maxUsers usedCount status"
      );
    const total = await Voicher.countDocuments(query);
    res.status(200).json({
      ok: true,
      message: "Lấy danh sách voichers thành công",
      voichers,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách voichers", error });
  }
};

export const useVoicher = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const voicher = await Voicher.findById(id);
    if (!voicher) {
      return res.status(404).json({ message: "Voicher không tồn tại" });
    }
    if (voicher.userCount >= voicher.maxUsers) {
      return res.status(400).json({ message: "Voicher đã hết số lượng" });
    }
    const now = new Date();
    if (voicher.startDate > now || voicher.endDate < now) {
      return res.status(400).json({ message: "Voicher đã hết hạn" });
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User không tồn tại" });
    }
    user.total_spend += voicher.discountValue;
    user.rank =
      user.total_spend >= 3000000
        ? "vip"
        : user.total_spend >= 500000
        ? "loyal"
        : user.total_spend >= 100000
        ? "regular"
        : "new";
    await user.save();
    voicher.userCount++;
    if (voicher.userCount >= voicher.maxUsers && voicher.status === "active") {
      voicher.status = "inactive";
    }
    await voicher.save();
    res
      .status(200)
      .json({ ok: true, message: "Sử dụng voicher thành công", voicher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi sử dụng voicher", error });
  }
};

export const updateVoicher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, discountValue, startDate, endDate, maxUsers, status } =
      req.body;
    const voicher = await Voicher.findByIdAndUpdate(
      id,
      { name, code, discountValue, startDate, endDate, maxUsers, status },
      { new: true }
    );
    res
      .status(200)
      .json({ ok: true, message: "Cập nhật voicher thành công", voicher });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Lỗi khi cập nhật voichers", error });
  }
};

export const deleteVoicher = async (req, res) => {
  try {
    const { id } = req.params;
    await Voicher.findByIdAndDelete(id);
    res.status(200).json({ ok: true, message: "Xóa voicher thành công" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Lỗi khi xóa voicher", error });
  }
};
