import Product from "../models/Product.js";
import Brand from "../models/Brand.js";

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
      status,
      quantity,
      brand,
      images,
    } = req.body;
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(400).json({ message: "Sản phẩm đã tồn tại" });
    }
    // Tìm brand theo tên để lấy _id
    const brandDoc = await Brand.findOne({ name: brand });
    if (!brandDoc) {
      return res.status(400).json({ message: "Brand không tồn tại" });
    }

    const productData = {
      title,
      description,
      price,
      discount,
      isNewProduct,
      isSaleProduct,
      star,
      status,
      quantity,
      brand, // Sử dụng _id thay vì tên
      images,
    };

    const product = await Product.create(productData);

    // Cập nhật số lượng sản phẩm của brand
    await Brand.findByIdAndUpdate(brandDoc._id, {
      $inc: { numberProducts: 1 },
    });
    res.status(201).json({
      ok: true,
      message: "Tạo sản phẩm thành công",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: "Lỗi khi tạo sản phẩm",
      error: error.message,
      details: error,
    });
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
          "_id title slug description price discount quantity isNewProduct isSaleProduct star brand images status"
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
      status,
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
      ...(status !== undefined && { status }),
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

    // Lấy sản phẩm cũ trước khi update
    const oldProduct = await Product.findOne({ slug });
    if (!oldProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const updated = await Product.findOneAndUpdate({ slug }, update, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // Nếu brand thay đổi → update lại số lượng sản phẩm trong brand
    console.log("Brand comparison:", {
      newBrand: brand,
      oldBrand: oldProduct.brand,
      oldBrandType: typeof oldProduct.brand,
      newBrandType: typeof brand,
    });

    // Tìm brand cũ theo _id để lấy tên
    let oldBrandDoc = null;
    let oldBrandName = null;

    if (
      oldProduct.brand &&
      typeof oldProduct.brand === "string" &&
      oldProduct.brand.length === 24
    ) {
      try {
        oldBrandDoc = await Brand.findById(oldProduct.brand);
        oldBrandName = oldBrandDoc ? oldBrandDoc.name : null;
      } catch (error) {
        console.error("Lỗi khi tìm brand cũ:", error);
      }
    } else {
      console.log("Brand cũ không hợp lệ:", oldProduct.brand);
    }

    console.log("Brand names comparison:", {
      oldBrandName,
      newBrandName: brand,
      isDifferent: brand && brand !== oldBrandName,
    });

    if (brand && brand !== oldBrandName) {
      try {
        // Tìm brand mới theo tên để lấy _id
        const newBrandDoc = await Brand.findOne({ name: brand });
        if (!newBrandDoc) {
          console.error("Brand mới không tồn tại:", brand);
          return res.status(400).json({ message: "Brand mới không tồn tại" });
        }

        console.log("Updating brand counts:", {
          oldBrandId: oldProduct.brand,
          newBrandId: newBrandDoc._id,
        });

        // Giảm số lượng sản phẩm của brand cũ
        if (
          oldProduct.brand &&
          typeof oldProduct.brand === "string" &&
          oldProduct.brand.length === 24
        ) {
          await Brand.findByIdAndUpdate(oldProduct.brand, {
            $inc: { numberProducts: -1 },
          });
        }

        // Tăng số lượng sản phẩm của brand mới
        await Brand.findByIdAndUpdate(newBrandDoc._id, {
          $inc: { numberProducts: 1 },
        });

        console.log("Brand counts updated successfully");
      } catch (brandError) {
        console.error("Lỗi khi update brand count:", brandError);
        // Không throw error để không ảnh hưởng đến việc update product
      }
    } else {
      console.log("Brand không thay đổi hoặc không có brand mới");
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
      .json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
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
    await Brand.findByIdAndUpdate(product.brand, {
      $inc: { numberProducts: -1 },
    });
    res.status(200).json({
      ok: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
