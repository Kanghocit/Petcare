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
    const products = await Product.find();
    res.status(200).json({
      ok: true,
      message: "Lấy danh sách sản phẩm thành công",
      products,
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
  const product = await Product.findOne({ slug });
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
  try {
    const product = await Product.findOneAndUpdate({ slug }, req.body, {
      new: true,
    });
    res.status(200).json({
      ok: true,
      message: "Cập nhật sản phẩm thành công",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
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
