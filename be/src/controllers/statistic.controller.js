// controllers/statistic.controller.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/user.js";

export const getStatistic = async (req, res) => {
  try {
    const { startDate, endDate, type = "date" } = req.query;

    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 ngày

    // =============================
    // 1) Tổng quan
    // =============================
    const [orderAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          sales: { $sum: { $add: ["$subtotal", "$shipping.fee"] } },
          revenue: {
            $sum: "$totalAmount",
          },
          canceled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

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

    const newCustomers = await User.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const lowStock = await Product.find({ quantity: { $gte: 1, $lte: 10 } });
    const outOfStock = await Product.find({ quantity: 0 });

    // =============================
    // 2) Thống kê theo mốc thời gian
    // =============================
    let dateGroup = {};
    switch (type) {
      case "year":
        dateGroup = { $dateToString: { format: "%Y", date: "$createdAt" } };
        break;
      case "quarter":
        // Lấy quý theo tháng
        dateGroup = {
          $concat: [
            { $toString: { $year: "$createdAt" } },
            "-Q",
            {
              $toString: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } },
            },
          ],
        };
        break;
      case "month":
        dateGroup = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        break;
      case "week":
        dateGroup = {
          $concat: [
            { $toString: { $isoWeekYear: "$createdAt" } },
            "-W",
            { $toString: { $isoWeek: "$createdAt" } },
          ],
        };
        break;
      default: // "date"
        dateGroup = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
    }

    const timeSeries = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: dateGroup,
          sales: { $sum: { $add: ["$subtotal", "$shipping.fee"] } },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // =============================
    // 3) Kết quả trả về
    // =============================
    const stats = {
      revenue: orderAgg?.revenue || 0,
      sales: orderAgg?.sales || 0,
      sold: itemsAgg?.sold || 0,
      refund: itemsAgg?.returnedQty || 0,
      canceled: orderAgg?.canceled || 0,
      newCustomers,
      range: { start, end },
      products: { lowStock, outOfStock },
      chart: timeSeries, // << dữ liệu cho biểu đồ
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
