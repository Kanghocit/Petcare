// controllers/statistic.controller.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/user.js";

export const getStatistic = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 ngày trước

    // 1) Tổng quan theo Order
    const [orderAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
          sales: { $sum: 1 },
          canceled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    // 2) Tính sold (tổng số lượng đã bán) và số lượng trả hàng (refund count)
    const [itemsAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          sold: { $sum: "$items.quantity" },
          returnedQty: { $sum: "$items.returnedQty" },
        },
      },
    ]);

    // 3) Đếm khách hàng mới
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    // Lấy ra sản phẩm sắp hết hàng và đã hết hàng
    const lowStock = await Product.find({
      quantity: { $gte: 1, $lte: 10 },
    });
    const outOfStock = await Product.find({
      quantity: 0,
    });

    const stats = {
      revenue: orderAgg?.revenue || 0,
      sales: orderAgg?.sales || 0,
      sold: itemsAgg?.sold || 0,
      // Theo UI, "Trả hàng" là số lượng trả về.
      refund: itemsAgg?.returnedQty || 0,
      canceled: orderAgg?.canceled || 0,
      newCustomers,
      range: { start, end },
      products: {
        lowStock,
        outOfStock,
      },
    };

    res
      .status(200)
      .json({ ok: true, message: "Lấy thống kê thành công", stats });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, message: "Lỗi khi lấy thống kê", error: err.message });
    console.error("Lỗi khi lấy thống kê:", err);
  }
};
