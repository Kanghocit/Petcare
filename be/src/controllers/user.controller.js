import User from "../models/user.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};
