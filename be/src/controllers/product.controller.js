import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import { meiliClient, productIndex } from "../services/meilisearch.services.js";

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
      category,
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
    // Kiểm tra category name có tồn tại không
    if (!category || String(category).trim() === "") {
      return res.status(400).json({ message: "Vui lòng chọn danh mục" });
    }

    // Tìm category theo tên để lấy _id và xác thực
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    const productData = {
      title,
      description,
      price,
      discount,
      isNewProduct,
      isSaleProduct,
      category: categoryDoc.name,
      star,
      status,
      quantity,
      brand,
      images,
    };

    const product = await Product.create(productData);

    // Cập nhật số lượng sản phẩm của brand
    await Brand.findByIdAndUpdate(brandDoc._id, {
      $inc: { numberProducts: 1 },
    });

    // Cập nhật số lượng sản phẩm của category
    if (categoryDoc?._id) {
      await Category.findByIdAndUpdate(categoryDoc._id, {
        $inc: { productCount: 1 },
      });
    }
    // thêm vào meilisearch (nếu có)
    if (productIndex) {
      try {
        await productIndex.addDocuments([
          {
            id: product._id.toString(), // nên set id để đồng bộ
            title,
            description,
            price,
            discount,
            isNewProduct,
            isSaleProduct,
            category,
            star,
            status,
            quantity,
            brand: brandDoc.name, // hoặc brandDoc._id tùy bạn muốn search theo gì
            images,
          },
        ]);
        console.log("Product added to MeiliSearch successfully");
      } catch (meiliError) {
        console.warn(
          "Failed to add product to MeiliSearch:",
          meiliError.message
        );
        // Continue without throwing error - product is still created in MongoDB
      }
    } else {
      console.warn("MeiliSearch not available - skipping search index update");
    }

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

    const parseMultiParam = (value) => {
      if (!value) return [];
      const raw = Array.isArray(value) ? value : [value];
      return raw
        .flatMap((v) => String(v).split(","))
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
    };
    if (searchRaw) {
      query.$or = [
        { title: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        { category: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        // { brand: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        // { color: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        // { isNewProduct: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        // { isSaleProduct: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        // { price: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
      ];
    }

    const titles = parseMultiParam(req.query.title);
    if (titles.length > 0) {
      query.title = { $in: titles };
    }

    const categories = parseMultiParam(req.query.category);
    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    const brands = parseMultiParam(req.query.brand);
    if (brands.length > 0) {
      query.brand = { $in: brands };
    }

    const colors = parseMultiParam(req.query.color);
    if (colors.length > 0) {
      query.color = { $in: colors };
    }

    const statuses = parseMultiParam(req.query.status);
    if (statuses.length > 0) {
      query.status = { $in: statuses };
    }

    // Boolean flags for new and sale products
    const parseBool = (v) =>
      v !== undefined &&
      v !== null &&
      String(v).toLowerCase() !== "false" &&
      String(v) !== "0";
    if (parseBool(req.query.isNewProduct)) {
      query.isNewProduct = true;
    }
    if (parseBool(req.query.isSaleProduct)) {
      query.isSaleProduct = true;
    }

    const price = {};
    if (req.query.price_min !== undefined && req.query.price_min !== "") {
      price.$gte = Number(req.query.price_min);
    }
    if (req.query.price_max !== undefined && req.query.price_max !== "") {
      price.$lte = Number(req.query.price_max);
    }
    if (Object.keys(price).length > 0) {
      query.price = price;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "_id title slug description price discount quantity isNewProduct category isSaleProduct star brand images status"
        )
        .collation({ locale: "vi", strength: 3 })
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

//tìm kiếm sản phẩm
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || "";
    // Fix pagination: ensure page >= 1 and limit within sensible bounds
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const result = await meiliClient.index("products").search(query, {
      attributesToHighlight: ["title", "description", "category"],
      limit,
      offset: (page - 1) * limit,
      showRankingScore: true,
    });
    res.status(200).json({
      ok: true,
      message: "Tìm sản phẩm thành công",
      query,
      products: result.hits,
      total: result.estimatedTotalHits,
      page,
      totalPages: Math.ceil(result.estimatedTotalHits / limit),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Không tìm được sản phẩm",
      error: error.message,
    });
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
      category,
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
      ...(category !== undefined && { category }),
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

    // Tìm brand cũ theo _id để lấy tên
    let oldBrandDoc = null;
    let oldBrandName = null;

    if (oldProduct.brand) {
      try {
        oldBrandDoc = await Brand.findById(oldProduct.brand);
        oldBrandName = oldBrandDoc ? oldBrandDoc.name : null;
      } catch (error) {
        console.error("Lỗi khi tìm brand cũ:", error);
      }
    }

    if (brand && brand !== oldBrandName) {
      try {
        // Tìm brand mới theo tên để lấy _id
        const newBrandDoc = await Brand.findOne({ name: brand });
        if (!newBrandDoc) {
          console.error("Brand mới không tồn tại:", brand);
          return res.status(400).json({ message: "Brand mới không tồn tại" });
        }

        // Giảm số lượng sản phẩm của brand cũ
        if (oldProduct.brand) {
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

    if (category && category !== oldProduct.category) {
      try {
        // Kiểm tra category mới có tồn tại không
        const newCategoryDoc = await Category.findOne({ name: category });
        if (!newCategoryDoc) {
          console.error("Category mới không tồn tại:", category);
          return res
            .status(400)
            .json({ message: "Category mới không tồn tại" });
        }

        console.log("Updating category counts:", {
          oldCategory: oldProduct.category,
          newCategory: category,
        });

        // Giảm số lượng sản phẩm của category cũ
        if (oldProduct.category) {
          const oldCatDoc = await Category.findOne({
            name: oldProduct.category,
          });
          if (oldCatDoc?._id) {
            await Category.findByIdAndUpdate(oldCatDoc._id, {
              $inc: { productCount: -1 },
            });
          }
        }

        // Tăng số lượng sản phẩm của category mới
        await Category.findByIdAndUpdate(newCategoryDoc._id, {
          $inc: { productCount: 1 },
        });

        console.log("Category counts updated successfully");
      } catch (categoryError) {
        console.error("Lỗi khi update category count:", categoryError);
        // Không throw error để không ảnh hưởng đến việc update product
      }
    } else {
      console.log("Category không thay đổi hoặc không có category mới");
    }

    // Cập nhật MeiliSearch nếu có thay đổi category hoặc brand
    if (productIndex && (category || brand)) {
      try {
        // Lấy thông tin category mới nếu có thay đổi
        let newCategoryName = null;
        if (category && category !== oldProduct.category) {
          newCategoryName = category;
        }

        // Lấy thông tin brand mới nếu có thay đổi
        let newBrandName = null;
        if (brand && brand !== oldBrandName) {
          const newBrandDoc = await Brand.findOne({ name: brand });
          newBrandName = newBrandDoc ? newBrandDoc.name : null;
        }

        // Cập nhật document trong MeiliSearch
        const meiliUpdateData = {
          id: updated._id.toString(),
          title: updated.title,
          description: updated.description,
          price: updated.price,
          discount: updated.discount,
          isNewProduct: updated.isNewProduct,
          isSaleProduct: updated.isSaleProduct,
          category: updated.category,
          status: updated.status,
          quantity: updated.quantity,
          brand:
            newBrandName ||
            (updated.brand
              ? await Brand.findById(updated.brand).then((b) => b?.name)
              : null),
          images: updated.images,
        };

        // Nếu có thay đổi category, cập nhật category name
        if (newCategoryName) {
          meiliUpdateData.category = newCategoryName;
        }

        await productIndex.updateDocuments([meiliUpdateData]);
        console.log("Product updated in MeiliSearch successfully");
      } catch (meiliError) {
        console.warn(
          "Failed to update product in MeiliSearch:",
          meiliError.message
        );
        // Continue without throwing error - product is still updated in MongoDB
      }
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

    // Giảm số lượng sản phẩm của brand
    if (product.brand) {
      await Brand.findByIdAndUpdate(product.brand, {
        $inc: { numberProducts: -1 },
      });
    }

    // Giảm số lượng sản phẩm của category (theo tên)
    if (product.category) {
      const catDoc = await Category.findOne({ name: product.category });
      if (catDoc?._id) {
        await Category.findByIdAndUpdate(catDoc._id, {
          $inc: { productCount: -1 },
        });
      }
    }

    res.status(200).json({
      ok: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
