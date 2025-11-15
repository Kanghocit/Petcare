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
    // Tính doanh số (sales) - tổng giá trị bán
    const [orderAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          sales: { $sum: { $add: ["$subtotal", "$shipping.fee"] } },
          canceled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    // Tính doanh thu (revenue) - lợi nhuận = doanh số - chi phí nhập
    const [itemsAgg] = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          sold: { $sum: "$items.quantity" },
          returnedQty: { $sum: "$items.returnedQty" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                {
                  $subtract: [
                    "$items.priceAtPurchase",
                    { $ifNull: ["$items.importPriceAtPurchase", 0] },
                  ],
                },
              ],
            },
          },
          totalCost: {
            $sum: {
              $multiply: [
                "$items.quantity",
                { $ifNull: ["$items.importPriceAtPurchase", 0] },
              ],
            },
          },
        },
      },
    ]);

    const newCustomers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: start, $lte: end },
    });

    const lowStock = await Product.find({ quantity: { $gte: 1, $lte: 10 } });
    const outOfStock = await Product.find({ quantity: 0 });

    // Lấy sản phẩm bán chạy (best selling products) trong khoảng thời gian
    const bestSelling = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.priceAtPurchase"],
            },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Lấy thông tin chi tiết sản phẩm
    const bestSellingProductIds = bestSelling.map((item) => item._id);
    const bestSellingProducts = await Product.find({
      _id: { $in: bestSellingProductIds },
    })
      .select("_id title slug images brand price importPrice quantity")
      .lean();

    // Merge thông tin sản phẩm với số lượng đã bán
    const bestSellingMap = new Map(
      bestSelling.map((item) => [item._id.toString(), item])
    );
    const bestSellingWithDetails = bestSellingProducts
      .map((product) => {
        const salesData = bestSellingMap.get(product._id.toString());
        return {
          ...product,
          soldQuantity: salesData?.totalSold || 0,
          totalRevenue: salesData?.totalRevenue || 0,
        };
      })
      .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));

    // Lấy sản phẩm bán chậm (slow selling products) trong khoảng thời gian
    // Lấy tất cả sản phẩm đã bán ít hoặc không bán được
    const allProductsWithSales = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.priceAtPurchase"],
            },
          },
        },
      },
    ]);

    // Tạo map tất cả sản phẩm đã bán
    const allProductsSalesMap = new Map(
      allProductsWithSales.map((item) => [item._id.toString(), item])
    );

    // Lấy tất cả sản phẩm active để so sánh
    const allActiveProducts = await Product.find({ status: "active" })
      .select("_id title slug images brand price importPrice quantity")
      .lean();

    // Tính toán sản phẩm bán chậm
    // Sản phẩm bán chậm = sản phẩm có ít đơn hàng nhất hoặc không bán được
    const slowSellingWithDetails = allActiveProducts
      .map((product) => {
        const salesData = allProductsSalesMap.get(product._id.toString());
        return {
          ...product,
          soldQuantity: salesData?.totalSold || 0,
          totalRevenue: salesData?.totalRevenue || 0,
        };
      })
      .sort((a, b) => (a.soldQuantity || 0) - (b.soldQuantity || 0))
      .slice(0, 10); // Top 10 sản phẩm bán chậm nhất

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

    // Tính doanh số và doanh thu theo thời gian
    const timeSeriesOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: dateGroup,
          sales: { $sum: { $add: ["$subtotal", "$shipping.fee"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const timeSeriesItems = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: dateGroup,
          revenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                {
                  $subtract: [
                    "$items.priceAtPurchase",
                    { $ifNull: ["$items.importPriceAtPurchase", 0] },
                  ],
                },
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge sales and revenue by date
    const salesMap = new Map(
      timeSeriesOrders.map((item) => [item._id, item.sales])
    );
    const revenueMap = new Map(
      timeSeriesItems.map((item) => [item._id, item.revenue || 0])
    );

    // Get all unique dates
    const allDates = new Set([
      ...timeSeriesOrders.map((item) => item._id),
      ...timeSeriesItems.map((item) => item._id),
    ]);

    const timeSeries = Array.from(allDates)
      .sort()
      .map((date) => ({
        _id: date,
        sales: salesMap.get(date) || 0,
        revenue: revenueMap.get(date) || 0,
      }));

    // =============================
    // 3) Kết quả trả về
    // =============================
    const stats = {
      revenue: itemsAgg?.totalRevenue || 0, // Doanh thu = lợi nhuận (giá bán - giá nhập)
      sales: orderAgg?.sales || 0, // Doanh số = tổng giá trị bán
      cost: itemsAgg?.totalCost || 0, // Chi phí nhập
      sold: itemsAgg?.sold || 0,
      refund: itemsAgg?.returnedQty || 0,
      canceled: orderAgg?.canceled || 0,
      newCustomers,
      range: { start, end },
      products: {
        lowStock,
        outOfStock,
        bestSelling: bestSellingWithDetails,
        slowSelling: slowSellingWithDetails,
      },
      chart: timeSeries, // << dữ liệu cho biểu đồ
    };

    res
      .status(200)
      .json({ ok: true, message: "Lấy thống kê thành công", stats });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, message: "Lỗi khi lấy thống kê", error: err.message });
  }
};
