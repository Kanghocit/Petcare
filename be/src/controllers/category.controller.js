import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Tên danh mục không hợp lệ",
      });
    }

    const existCategory = await Category.findOne({ name });
    if (existCategory) {
      return res.status(400).json({
        ok: false,
        message: "Danh mục đã tồn tại",
      });
    }

    const category = await Category.create({
      name,
      parentId: parentId || null,
    });

    return res.status(201).json({
      ok: true,
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục sản phẩm", error);
    return res.status(500).json({
      ok: false,
      message: "Lỗi khi tạo danh mục",
      error: error.message,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({ level: 1 })
      .populate("children")
      .sort({ createdAt: -1 })
      .lean();
    res
      .status(200)
      .json({ ok: true, message: "Lấy danh mục thành công", categories });
  } catch (error) {
    console.log("Có lỗi khi lấy danh mục sản phẩm");
    res.status(500).json({
      ok: false,
      message: "Có lỗi khi lấy danh mục sản phẩm",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const { slug } = req.params;

  try {
    const { name, parentId, level, isActive, productCount } = req.body || {};

    if (Object.keys(req.body || {}).length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const oldCategory = await Category.findOne({ slug });
    if (!oldCategory) {
      return res.status(404).json({
        ok: false,
        message: "Danh mục không tồn tại",
      });
    }

    if (parentId !== undefined) {
      if (parentId === oldCategory._id.toString()) {
        return res.status(400).json({
          ok: false,
          message: "Không thể đặt danh mục làm cha của chính nó",
        });
      }

      // Kiểm tra parent tồn tại và là level 1
      if (parentId && parentId !== null) {
        const parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
          return res.status(400).json({
            ok: false,
            message: "Danh mục cha không tồn tại",
          });
        }
        if (parentCategory.level !== 1) {
          return res.status(400).json({
            ok: false,
            message: "Danh mục cha phải là cấp 1",
          });
        }
      }
    }

    const update = {
      ...(name !== undefined && { name }),
      ...(parentId !== undefined && { parentId: parentId || null }), // Handle empty string
      ...(level !== undefined && { level }),
      ...(isActive !== undefined && { isActive }),
      ...(productCount !== undefined && { productCount }),
    };

    const updated = await Category.findOneAndUpdate({ slug }, update, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.status(200).json({
      ok: true,
      message: "Cập nhật danh mục thành công",
      data: updated,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        message: "Dữ liệu không hợp lệ",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: "Tên danh mục đã tồn tại",
      });
    }

    res.status(500).json({
      ok: false,
      message: "Lỗi server khi cập nhật danh mục",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
    try {
      const { slug } = req.params;
      const { force } = req.query; // ?force=true để force delete
      
      // 1. Kiểm tra category tồn tại
      const category = await Category.findOne({ slug });
      if (!category) {
        return res.status(404).json({
          ok: false,
          message: "Danh mục không tồn tại",
        });
      }
  
      // 2. Kiểm tra có children không
      const childrenCount = await Category.countDocuments({ 
        parentId: category._id 
      });
      
      if (childrenCount > 0 && force !== 'true') {
        return res.status(400).json({
          ok: false,
          message: `Không thể xóa danh mục này vì có ${childrenCount} danh mục con. Sử dụng ?force=true để xóa cả danh mục con.`,
          childrenCount
        });
      }
  
      // 3. Kiểm tra có sản phẩm không (nếu có Product model)
      if (category.productCount > 0 && force !== 'true') {
        return res.status(400).json({
          ok: false,
          message: `Không thể xóa danh mục này vì có ${category.productCount} sản phẩm. Di chuyển sản phẩm trước hoặc sử dụng ?force=true.`,
          productCount: category.productCount
        });
      }
  
      // 4. Thực hiện xóa
      if (force === 'true') {
        // Xóa tất cả children trước
        await Category.deleteMany({ parentId: category._id });
        
        // TODO: Cập nhật products nếu cần
        // await Product.updateMany(
        //   { categoryId: category._id }, 
        //   { $unset: { categoryId: 1 } }
        // );
      }
  
      // Xóa category chính
      await Category.findOneAndDelete({ slug });
  
      res.status(200).json({ 
        ok: true, 
        message: force === 'true' 
          ? "Xóa danh mục và các danh mục con thành công" 
          : "Xóa danh mục thành công",
        deletedCategory: {
          id: category._id,
          name: category.name,
          childrenDeleted: force === 'true' ? childrenCount : 0
        }
      });
  
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      res.status(500).json({
        ok: false,
        message: "Có lỗi khi xóa danh mục",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };