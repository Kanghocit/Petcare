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
    // Tính doanh số (sales) - tổng giá trị bán (doanh số gộp)
    // Lưu ý: loại bỏ đơn đã hủy khỏi doanh số
    const [orderAgg] = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
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

    // Tính doanh thu (revenue) và lợi nhuận (profit)
    // Quy ước:
    // - Đơn bị hủy: không tính vào doanh thu / lợi nhuận
    // - Hàng trả lại: không tính vào doanh thu / lợi nhuận (chỉ tính vào refund)
    const [itemsAgg] = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $addFields: {
          "items.effectiveQty": {
            $max: [
              0,
              { $subtract: ["$items.quantity", "$items.returnedQty"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          sold: { $sum: "$items.effectiveQty" },
          returnedQty: { $sum: "$items.returnedQty" },
          // Doanh thu: (số lượng - số lượng trả) * giá bán tại thời điểm mua
          totalRevenue: {
            $sum: {
              $multiply: ["$items.effectiveQty", "$items.priceAtPurchase"],
            },
          },
          // Chi phí nhập: (số lượng - số lượng trả) * giá nhập tại thời điểm mua
          totalCost: {
            $sum: {
              $multiply: [
                "$items.effectiveQty",
                { $ifNull: ["$items.importPriceAtPurchase", 0] },
              ],
            },
          },
          // Lợi nhuận: (giá bán - giá nhập) * (số lượng - số lượng trả)
          totalProfit: {
            $sum: {
              $multiply: [
                "$items.effectiveQty",
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
    ]);

    const newCustomers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: start, $lte: end },
    });

    const lowStock = await Product.find({ quantity: { $gte: 1, $lte: 10 } });
    const outOfStock = await Product.find({ quantity: 0 });

    // Lấy sản phẩm bán chạy (best selling products) trong khoảng thời gian
    const bestSelling = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $addFields: {
          "items.effectiveQty": {
            $max: [
              0,
              { $subtract: ["$items.quantity", "$items.returnedQty"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.effectiveQty" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.effectiveQty", "$items.priceAtPurchase"],
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
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $addFields: {
          "items.effectiveQty": {
            $max: [
              0,
              { $subtract: ["$items.quantity", "$items.returnedQty"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.effectiveQty" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.effectiveQty", "$items.priceAtPurchase"],
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

    // Tính doanh thu (revenue) và lợi nhuận (profit) theo thời gian
    const timeSeriesItems = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $addFields: {
          "items.effectiveQty": {
            $max: [
              0,
              { $subtract: ["$items.quantity", "$items.returnedQty"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: dateGroup,
          // Doanh thu theo thời gian = (số lượng - số lượng trả) * giá bán
          revenue: {
            $sum: {
              $multiply: ["$items.effectiveQty", "$items.priceAtPurchase"],
            },
          },
          // Lợi nhuận theo thời gian = (giá bán - giá nhập) * (số lượng - số lượng trả)
          profit: {
            $sum: {
              $multiply: [
                "$items.effectiveQty",
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

    // Chuẩn hóa dữ liệu biểu đồ: mỗi mốc thời gian có doanh thu & lợi nhuận
    const timeSeries = timeSeriesItems
      .map((item) => ({
        _id: item._id,
        revenue: item.revenue || 0,
        profit: item.profit || 0,
      }))
      .sort((a, b) => (a._id > b._id ? 1 : a._id < b._id ? -1 : 0));

    // =============================
    // 3) Kết quả trả về
    // =============================
    const stats = {
      // Doanh thu = tổng tiền bán ra (số lượng * giá bán)
      revenue: itemsAgg?.totalRevenue || 0,
      // Lợi nhuận = doanh thu - chi phí nhập
      profit: itemsAgg?.totalProfit || 0,
      // Doanh số = tổng giá trị đơn hàng (giá bán + phí ship), vẫn giữ nếu cần dùng ở nơi khác
      sales: orderAgg?.sales || 0,
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
