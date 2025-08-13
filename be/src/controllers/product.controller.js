import Product from "../models/Product.js";

//tạo sản phẩm
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discount,
      isNewProduct,
      isSaleProduct,
      star,
      quantity,
      brand,
      images,
    } = req.body;
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(400).json({ message: "Sản phẩm đã tồn tại" });
    }
    const product = await Product.create({
      title,
      description,
      price,
      discount,
      isNewProduct,
      isSaleProduct,
      star,
      quantity,
      brand,
      images,
    });
    res.status(201).json({
      ok: true,
      message: "Tạo sản phẩm thành công",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo sản phẩm", error });
  }
};

//lấy danh sách sản phẩm
export const getProducts = async (req, res) => {
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
        { title: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        { brand: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
      ];
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "_id title slug description price discount quantity isNewProduct isSaleProduct star brand images"
        )
        .lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      ok: true,
      message: "Lấy danh sách sản phẩm thành công",
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
};

//lấy sản phẩm theo slug
export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json({
      ok: true,
      message: "Lấy sản phẩm thành công",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
};

//cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  const { slug } = req.params;

  try {
    // Chỉ cho phép cập nhật các field này
    const {
      title,
      description,
      price,
      discount,
      isNewProduct,
      isSaleProduct,
      star,
      quantity,
      brand,
      images,
    } = req.body || {};

    // Tạo object update
    const update = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(isNewProduct !== undefined && { isNewProduct }),
      ...(isSaleProduct !== undefined && { isSaleProduct }),
      ...(star !== undefined && { star }),
      ...(quantity !== undefined && { quantity }),
      ...(brand !== undefined && { brand }),
      ...(images !== undefined && { images }),
    };

    // Ràng buộc giảm giá: nếu đang sale mới giữ discount
    if (isSaleProduct === true) {
      if (discount !== undefined) update.discount = discount;
    } else if (isSaleProduct === false) {
      update.discount = undefined; // hoặc 0 nếu bạn muốn
    } else if (discount !== undefined) {
      // nếu client chỉ gửi discount mà không gửi isSaleProduct
      update.discount = discount;
    }

    const updated = await Product.findOneAndUpdate({ slug }, update, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!updated) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    return res.status(200).json({
      ok: true,
      message: "Cập nhật sản phẩm thành công",
      product: updated,
    });
  } catch (error) {
    // Lỗi trùng key (ví dụ title/slug unique)
    if (error?.code === 11000) {
      return res
        .status(400)
        .json({ message: "Giá trị bị trùng (title/slug đã tồn tại)", error });
    }
    return res
      .status(500)
      .json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

//xóa sản phẩm
export const deleteProduct = async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug });
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
  try {
    await Product.findOneAndDelete({ slug });
    res.status(200).json({
      ok: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
