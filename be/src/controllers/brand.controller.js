import Brand from "../models/Brand.js";

export const createBrand = async (req, res) => {
  try {
    const { name, image, numberProducts } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand đã tồn tại" });
    }
    const brand = await Brand.create({ name, image, numberProducts });
    res.status(201).json({
      ok: true,
      message: "Tạo brand thành công",
      brand,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Tạo brand thất bại",
      error: error.message,
    });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    // Chuẩn hóa giá trị search: bỏ qua các giá trị 'undefined' hoặc 'null' dạng string
    const rawSearch = req.query.search;
    const searchRaw =
      rawSearch && rawSearch !== "undefined" && rawSearch !== "null"
        ? String(rawSearch).trim()
        : "";

    // Escape ký tự đặc biệt trong regex
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {};
    if (searchRaw) {
      query.$or = [
        { name: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
      ];
    }

    const skip = (page - 1) * limit;
    const brands = await Brand.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Brand.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      ok: true,
      message: "Lấy danh sách brand thành công",
      brands,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Lấy danh sách brand thất bại",
      error: error.message,
    });
  }
};
export const updateBrand = async (req, res) => {
  try {
    const { name, image, numberProducts } = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
      name,
      image,
      numberProducts,
    });
    if (!brand) {
      return res.status(404).json({
        ok: false,
        message: "Brand không tồn tại",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Cập nhật brand thành công",
      brand,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Cập nhật brand thất bại",
      error: error.message,
    });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({
        ok: false,
        message: "Brand không tồn tại",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Xóa brand thành công",
      brand,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Xóa brand thất bại",
      error: error.message,
    });
  }
};
