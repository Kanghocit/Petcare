import FlashSales from "../models/FlashSales.js";
import Product from "../models/Product.js";
import dayjs from "dayjs";

// Chuẩn hoá chuỗi thời gian về ISO UTC. Trả về null nếu không hợp lệ
const normalizeDateStringToISO = (value) => {
  try {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch (_) {
    return null;
  }
};

const formatDDMMYYYY = (value) => {
  try {
    return dayjs(value).isValid() ? dayjs(value).format("DD MM YYYY") : "";
  } catch (_) {
    return "";
  }
};

export const createFlashSale = async (req, res) => {
  try {
    const { name, products, startDate, endDate, status, discountType } =
      req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Thiếu danh sách sản phẩm" });
    }

    //check sản phẩm xem tồn tại không và lấy ObjectId
    const productIds = [];
    for (let item of products) {
      const exsistProduct = await Product.findOne({ slug: item.productId });
      if (!exsistProduct) {
        return res
          .status(404)
          .json({ ok: false, message: "Sản phẩm không tồn tại" });
      }
      productIds.push(exsistProduct._id);
    }

    const normalizedStart = normalizeDateStringToISO(startDate);
    const normalizedEnd = normalizeDateStringToISO(endDate);

    if (!normalizedStart || !normalizedEnd) {
      return res.status(400).json({
        ok: false,
        message: "Ngày bắt đầu/kết thúc không hợp lệ",
      });
    }

    if (new Date(normalizedStart) >= new Date(normalizedEnd)) {
      return res.status(400).json({
        ok: false,
        message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
      });
    }

    // Map products with ObjectId
    const productsWithObjectId = products.map((item, index) => ({
      productId: productIds[index],
      flashSalePrice: item.flashSalePrice,
      quantity: item.quantity,
    }));

    const flashSale = await FlashSales.create({
      name,
      products: productsWithObjectId,
      discountType,
      startDate: normalizedStart,
      endDate: normalizedEnd,
      status: status || "active",
    });
    // cập nhật trạng thái sản phẩm là isSaleProduct và phần trăm giảm giá
    for (let item of productsWithObjectId) {
      const product = await Product.findById(item.productId).lean();
      if (!product) continue;
      const basePrice = Number(product.price) || 0;
      const salePrice = Number(item.flashSalePrice) || 0;
      const rawPercent = basePrice > 0 ? (1 - salePrice / basePrice) * 100 : 0;
      const computedDiscount = Math.max(
        0,
        Math.min(100, Math.round(rawPercent))
      );

      await Product.findByIdAndUpdate(
        item.productId,
        {
          isSaleProduct: true,
          discount: computedDiscount,
        },
        { new: true }
      );
    }
    res.status(201).json({
      ok: true,
      message: "Tạo chương trình giảm giá thành công",
      flashSale: {
        ...flashSale.toObject(),
        formattedStartDate: formatDDMMYYYY(flashSale.startDate),
        formattedEndDate: formatDDMMYYYY(flashSale.endDate),
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Tạo chương trình giảm giá thất bại",
      error: error.message,
    });
  }
};

export const getFlashSale = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);

    const rawSearch = req.query.search;
    const searchRaw =
      rawSearch && rawSearch !== "undefined" && rawSearch !== "null"
        ? String(rawSearch).trim()
        : "";

    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {};

    if (searchRaw) {
      query.$or = [
        { name: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
      ];
    }

    const skip = (page - 1) * limit;

    const [flashSales, total] = await Promise.all([
      FlashSales.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("products.productId")
        .lean(),
      FlashSales.countDocuments(query),
    ]);

    const withFormatted = flashSales.map((fs) => ({
      ...fs,
      formattedStartDate: formatDDMMYYYY(fs.startDate),
      formattedEndDate: formatDDMMYYYY(fs.endDate),
    }));

    res.status(200).json({
      ok: true,
      message: "Lấy chương trình giảm giá thành công",
      flashSales: withFormatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Không lấy được chương trình giảm giá",
      error: error.message,
    });
  }
};

export const getFlashSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const flashSale = await FlashSales.findById(id).populate(
      "products.productId"
    );
    res.status(200).json({
      ok: true,
      message: "Lấy chương trình giảm giá thành công",
      flashSale: {
        ...flashSale.toObject(),
        formattedStartDate: formatDDMMYYYY(flashSale.startDate),
        formattedEndDate: formatDDMMYYYY(flashSale.endDate),
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Không lấy được chương trình giảm giá",
      error: error.message,
    });
  }
};

export const updateFlashSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, products, startDate, endDate, status, discountType } =
      req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Thiếu danh sách sản phẩm" });
    }

    const normalizedStart = normalizeDateStringToISO(startDate);
    const normalizedEnd = normalizeDateStringToISO(endDate);

    if (!normalizedStart || !normalizedEnd) {
      return res.status(400).json({
        ok: false,
        message: "Ngày bắt đầu/kết thúc không hợp lệ",
      });
    }

    if (new Date(normalizedStart) >= new Date(normalizedEnd)) {
      return res.status(400).json({
        ok: false,
        message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
      });
    }

    const resolvedProducts = [];
    for (let item of products) {
      const product = await Product.findOne({ slug: item.productId });
      if (!product) {
        return res
          .status(404)
          .json({ ok: false, message: "Sản phẩm không tồn tại" });
      }
      resolvedProducts.push({
        productId: product._id,
        flashSalePrice: item.flashSalePrice,
        quantity: item.quantity,
      });
    }

    const updated = await FlashSales.findByIdAndUpdate(
      id,
      {
        name,
        products: resolvedProducts,
        startDate: normalizedStart,
        endDate: normalizedEnd,
        discountType,
        status: status || "active",
      },
      { new: true }
    ).populate("products.productId");

    if (!updated) {
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy chương trình" });
    }

    // cập nhật lại discount cho sản phẩm theo flash sale mới
    for (let item of resolvedProducts) {
      const product = await Product.findById(item.productId).lean();
      if (!product) continue;
      const basePrice = Number(product.price) || 0;
      const salePrice = Number(item.flashSalePrice) || 0;
      const rawPercent = basePrice > 0 ? (1 - salePrice / basePrice) * 100 : 0;
      const computedDiscount = Math.max(
        0,
        Math.min(100, Math.round(rawPercent))
      );

      await Product.findByIdAndUpdate(
        item.productId,
        {
          isSaleProduct: true,
          discount: computedDiscount,
        },
        { new: true }
      );
    }

    res.status(200).json({
      ok: true,
      message: "Cập nhật chương trình giảm giá thành công",
      flashSale: {
        ...updated.toObject(),
        formattedStartDate: formatDDMMYYYY(updated.startDate),
        formattedEndDate: formatDDMMYYYY(updated.endDate),
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Cập nhật chương trình giảm giá thất bại",
      error: error.message,
    });
  }
};

export const deleteFlashSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FlashSales.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy chương trình" });
    }
    res.status(200).json({
      ok: true,
      message: "Xóa chương trình giảm giá thành công",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Xóa chương trình giảm giá thất bại",
      error: error.message,
    });
  }
};

export const toggleFlashSaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ ok: false, message: "Trạng thái không hợp lệ" });
    }
    const updated = await FlashSales.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy chương trình" });
    }
    res.status(200).json({
      ok: true,
      message: "Cập nhật trạng thái thành công",
      flashSale: updated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Cập nhật trạng thái thất bại",
      error: error.message,
    });
  }
};
