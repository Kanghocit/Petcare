import Voicher from "../models/Voicher.js";
import User from "../models/user.js";

export const createVoicher = async (req, res) => {
  try {
    const {
      name,
      code,
      discountValue,
      startDate,
      endDate,
      maxUsers,
      status,
      minOrderValue,
    } = req.body;
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
      minOrderValue,
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
        "_id name code discountValue startDate endDate maxUsers usedCount status minOrderValue"
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

export const validateVoicher = async (req, res) => {
  try {
    const { code, userId, orderTotal } = req.body;

    // Validate input
    if (!code || !userId || orderTotal === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Mã voicher, userId và orderTotal là bắt buộc",
      });
    }

    // Find voicher
    const voicher = await Voicher.findOne({ code });
    if (!voicher) {
      return res.status(404).json({
        ok: false,
        message: "Mã voicher không tồn tại",
      });
    }

    // Check voicher status
    if (voicher.status !== "active") {
      return res.status(400).json({
        ok: false,
        message: "Voicher không còn hoạt động",
      });
    }

    // Check if voicher has reached max users
    if (voicher.usedCount >= voicher.maxUsers) {
      return res.status(400).json({
        ok: false,
        message: "Voicher đã hết số lượng sử dụng",
      });
    }

    // Check voicher validity period
    const now = new Date();
    if (voicher.startDate > now) {
      return res.status(400).json({
        ok: false,
        message: "Voicher chưa đến thời gian sử dụng",
      });
    }
    if (voicher.endDate < now) {
      return res.status(400).json({
        ok: false,
        message: "Voicher đã hết hạn",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Check if order total meets minimum order value requirement
    if (voicher.minOrderValue > orderTotal) {
      return res.status(400).json({
        ok: false,
        message: "Đơn hàng không đủ giá trị để sử dụng voicher",
      });
    }

    // Return voicher information for frontend to use
    res.status(200).json({
      ok: true,
      message: "Voicher hợp lệ",
      voicher: {
        _id: voicher._id,
        name: voicher.name,
        code: voicher.code,
        discountValue: voicher.discountValue,
        startDate: voicher.startDate,
        endDate: voicher.endDate,
        maxUsers: voicher.maxUsers,
        usedCount: voicher.usedCount,
        status: voicher.status,
      },
    });
  } catch (error) {
    console.error("Voicher validation error:", error);
    res.status(500).json({
      ok: false,
      message: "Lỗi khi kiểm tra voicher",
      error: error.message,
    });
  }
};

export const useVoicher = async (req, res) => {
  try {
    const { code, userId, orderTotal } = req.body;

    // Validate input
    if (!code || !userId || orderTotal === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Mã voicher, userId và orderTotal là bắt buộc",
      });
    }

    // Find voicher
    const voicher = await Voicher.findOne({ code });
    if (!voicher) {
      return res.status(404).json({
        ok: false,
        message: "Mã voicher không tồn tại",
      });
    }

    // Check voicher status
    if (voicher.status !== "active") {
      return res.status(400).json({
        ok: false,
        message: "Voicher không còn hoạt động",
      });
    }

    // Check if voicher has reached max users
    if (voicher.usedCount >= voicher.maxUsers) {
      return res.status(400).json({
        ok: false,
        message: "Voicher đã hết số lượng sử dụng",
      });
    }

    // Check voicher validity period
    const now = new Date();
    if (voicher.startDate > now) {
      return res.status(400).json({
        ok: false,
        message: "Voicher chưa đến thời gian sử dụng",
      });
    }
    if (voicher.endDate < now) {
      return res.status(400).json({
        ok: false,
        message: "Voicher đã hết hạn",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Check if order total meets minimum order value requirement
    if (voicher.minOrderValue > orderTotal) {
      return res.status(400).json({
        ok: false,
        message: "Đơn hàng không đủ giá trị để sử dụng voicher",
      });
    }

    // Update voicher usage count
    voicher.usedCount++;
    if (voicher.usedCount >= voicher.maxUsers && voicher.status === "active") {
      voicher.status = "inactive";
    }
    await voicher.save();

    // Update user total spend and rank
    let discountValue = 0;
    if (voicher.discountValue.includes("%")) {
      discountValue = parseInt(voicher.discountValue.replace("%", ""));
    } else {
      discountValue = parseInt(voicher.discountValue);
    }
    user.total_spend += discountValue;
    user.rank =
      user.total_spend >= 3000000
        ? "vip"
        : user.total_spend >= 500000
          ? "loyal"
          : user.total_spend >= 100000
            ? "regular"
            : "new";
    await user.save();

    res.status(200).json({
      ok: true,
      message: "Sử dụng voicher thành công",
      voicher: {
        _id: voicher._id,
        name: voicher.name,
        code: voicher.code,
        minOrderValue: voicher.minOrderValue,
        discountValue: voicher.discountValue,
        usedCount: voicher.usedCount,
        status: voicher.status,
      },
    });
  } catch (error) {
    console.error("Voicher usage error:", error);
    res.status(500).json({
      ok: false,
      message: "Lỗi khi sử dụng voicher",
      error: error.message,
    });
  }
};

export const updateVoicher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      discountValue,
      startDate,
      endDate,
      maxUsers,
      status,
      minOrderValue,
    } = req.body;
    const voicher = await Voicher.findByIdAndUpdate(
      id,
      {
        name,
        code,
        discountValue,
        startDate,
        endDate,
        maxUsers,
        status,
        minOrderValue,
      },
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
