import Address from "../models/Address.js";

export const createAddress = async (req, res) => {
  try {
    const { name, image, address, addressLink } = req.body;

    const existAddress = await Address.findOne({ name });
    if (existAddress) {
      return res.status(409).json({
        ok: false,
        message: "Địa chỉ này đã tồn tại",
      });
    }

    // Xử lý image: nếu là array thì lấy phần tử đầu tiên, nếu là string thì dùng trực tiếp
    const imageUrl = Array.isArray(image) ? image[0] || "" : image || "";

    const newAddress = await Address.create({
      name,
      image: imageUrl,
      address,
      addressLink,
    });

    res.status(201).json({
      ok: true,
      message: "Tạo địa chỉ mới thành công",
      newAddress,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({
      ok: false,
      message: "Tạo địa chỉ mới thất bại",
    });
  }
};

export const getAllAddress = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  try {
    const [addresses, total] = await Promise.all([
      Address.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Address.countDocuments(),
    ]);

    res.status(200).json({
      ok: true,
      message: "Lấy danh sách địa chỉ thành công",
      addresses,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      ok: false,
      message: "Lỗi khi lấy danh sách địa chỉ",
    });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { name, image, address, addressLink } = req.body;

  try {
    const existAddress = await Address.findById(id);
    if (!existAddress) {
      console.log("Địa chỉ không tồn tại");
      return res
        .status(404)
        .json({ ok: false, message: "Địa chỉ không tồn tại" });
    }

    // Xử lý image: nếu là array thì lấy phần tử đầu tiên, nếu là string thì dùng trực tiếp
    const imageUrl = Array.isArray(image) ? image[0] || "" : image || "";

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { name, image: imageUrl, address, addressLink },
      { new: true }
    );

    res.status(200).json({
      ok: true,
      message: "Cập nhật địa chỉ thành công",
      updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    res.status(500).json({
      ok: false,
      message: "Cập nhật địa chỉ không thành công",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findByIdAndDelete(id);
    res.status(200).json({ ok: true, message: "Xóa địa chỉ thành công" });
  } catch (error) {
    console.log("Lỗi khi xóa địa chỉ", error);
    res.status(500).json({ ok: false, message: "Lỗi khi xóa địa chỉ", error });
  }
};
