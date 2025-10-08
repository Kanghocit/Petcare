import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/user.js";

// Create order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    const {
      items,
      shippingAddress,
      shipping = {},
      discount = {},
      payment = {},
      note,
    } = req.body || {};

    if (!userId) return res.status(400).json({ message: "Thiếu userId" });
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống" });
    if (!shippingAddress)
      return res
        .status(400)
        .json({ message: "Thiếu thông tin địa chỉ giao hàng" });

    // Validate shipping address
    const requiredAddressFields = ["fullName", "phone", "email", "address"];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ message: `Thiếu thông tin: ${field}` });
      }
    }

    // Normalize and validate items, also compute total
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id price title slug images brand")
      .lean();

    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = items.map((i) => {
      const quantity = Math.max(1, Number(i.quantity) || 1);
      const productId = String(i.product);
      const product = productMap.get(productId);

      if (!product) {
        throw new Error(`Sản phẩm không tồn tại: ${productId}`);
      }

      const priceAtPurchase = Number(i.priceAtPurchase ?? product.price ?? 0);

      const chosenImage =
        typeof i.image === "string" && i.image.trim()
          ? i.image.trim()
          : Array.isArray(product.images) && product.images[0]
            ? product.images[0]
            : "/images/product/placeholder.png";

      return {
        product: i.product,
        quantity,
        priceAtPurchase,
        productSnapshot: {
          title: i.name || product.title,
          slug: product.slug,
          image: chosenImage,
          brand: product.brand || "",
        },
      };
    });

    const subtotal = orderItems.reduce(
      (sum, it) => sum + it.quantity * it.priceAtPurchase,
      0
    );

    // Calculate shipping fee based on method
    const shippingFees = {
      standard: 30000,
      express: 50000,
      same_day: 100000,
    };

    const shippingFee =
      shipping.fee || shippingFees[shipping.method || "standard"] || 0;
    const discountAmount = discount.amount || 0;
    // Prevent over-discount: cap discount to (subtotal + shippingFee)
    const maxDiscount = Math.max(
      0,
      Math.min(discountAmount, subtotal + shippingFee)
    );
    const totalAmount = subtotal + shippingFee - maxDiscount;

    const orderData = {
      user: userId,
      items: orderItems,
      subtotal,
      totalAmount,
      shipping: {
        method: shipping.method || "standard",
        fee: shippingFee,
        estimatedDays: shipping.estimatedDays || 3,
        ...shipping,
      },
      shippingAddress,
      discount: {
        amount: discountAmount,
        code: discount.code,
        type: discount.type || "fixed",
        description: discount.description,
      },
      payment: {
        method: payment.method || "cod",
        status: payment.status || "unpaid",
        ...payment,
      },
      note: note || "",
      source: req.body.source || "web",
    };

    // Set payment expiration for COD orders
    if (orderData.payment.method === "cod") {
      orderData.paymentExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }

    const created = await Order.create(orderData);

    // cập nhật số lượng sản phẩm
    for (const item of created.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        await product.save();
      }
    }

    // Cập nhật tổng tiền của user
    const user = await User.findById(userId);
    if (user) {
      user.total_spend += created.totalAmount;
      await user.save();
    }

    return res.status(201).json({
      ok: true,
      message: "Tạo đơn hàng thành công",
      order: created,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      message: "Lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
};

// Get orders (admin)
export const getOrders = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Add filters
    // Chuẩn hóa giá trị search: bỏ qua các giá trị 'undefined' hoặc 'null' dạng string
    const rawSearch = req.query.search;
    const searchRaw =
      rawSearch && rawSearch !== "undefined" && rawSearch !== "null"
        ? String(rawSearch).trim()
        : "";

    // Escape ký tự đặc biệt trong regex
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {};
    // Free-text search across orderCode and buyer name
    if (searchRaw) {
      query.$or = [
        { orderCode: { $regex: new RegExp(escapeRegex(searchRaw), "i") } },
        {
          "shippingAddress.fullName": {
            $regex: new RegExp(escapeRegex(searchRaw), "i"),
          },
        },
      ];
    }

    // Filters: payment method/status, fulfillment status, overall status
    if (req.query.paymentMethod) {
      query["payment.method"] = String(req.query.paymentMethod);
    }
    if (req.query.paymentStatus) {
      query["payment.status"] = String(req.query.paymentStatus);
    }
    if (req.query.fulfillmentStatus) {
      query["fulfillment.status"] = String(req.query.fulfillmentStatus);
    }
    if (req.query.status) {
      query.status = String(req.query.status);
    }
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email phone rank")
        .populate("items.product", "title price images slug brand quantity")
        .lean(),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      ok: true,
      message: "Lấy danh sách đơn hàng thành công",
      orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};
//get orders from user id
export const getOrdersByUserId = async (req, res) => {
  try {
    const { id } = req.params; // lấy từ URL /user/:id/orders

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // base filter: chỉ lấy theo userId
    const filter = { user: id };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email phone rank")
        .populate("items.product", "title price images slug brand quantity")
        .lean(),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      ok: true,
      message: "Lấy danh sách đơn hàng theo userId thành công",
      orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi lấy danh sách đơn hàng theo userId",
      error: error.message,
    });
  }
};
// Get order detail by id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user", "name email phone rank")
      .populate("items.product", "title price images slug brand quantity")
      .populate("cancelledBy", "name")
      .lean();

    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    return res.status(200).json({ ok: true, order });
  } catch (error) {
    console.error("Get order by id error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// Get order by order code
export const getOrderByCode = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await Order.findByOrderCode(orderCode)
      .populate("user", "name email phone rank")
      .populate("items.product", "title price images slug brand quantity")
      .populate("cancelledBy", "name")
      .lean();

    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    // Only owner or admin can see
    if (
      String(order.user?._id) !== String(req.user?.userId) &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    return res.status(200).json({ ok: true, order });
  } catch (error) {
    console.error("Get order by code error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    // if (req.user?.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ message: "Chỉ admin mới có quyền cập nhật đơn hàng" });
    // }

    const { id } = req.params;
    const {
      fulfillmentStatus,
      paymentStatus,
      itemUpdates = [],
      note,
    } = req.body || {};

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Update fulfillment status
    if (fulfillmentStatus) {
      const allowedFulfillmentStatuses = [
        "unfulfilled",
        "processing",
        "shipping",
        "shipped",
        "delivered",
        "returned",
        "cancelled",
      ];

      if (!allowedFulfillmentStatuses.includes(fulfillmentStatus)) {
        return res
          .status(400)
          .json({ message: "Trạng thái giao nhận không hợp lệ" });
      }

      order.fulfillment.status = fulfillmentStatus;

      // Set timestamps
      if (fulfillmentStatus === "shipped" && !order.fulfillment.shippedAt) {
        order.fulfillment.shippedAt = new Date();
      }
      if (fulfillmentStatus === "delivered" && !order.fulfillment.deliveredAt) {
        order.fulfillment.deliveredAt = new Date();
      }
    }

    // Update payment status
    if (paymentStatus) {
      const allowedPaymentStatuses = [
        "unpaid",
        "authorized",
        "paid",
        "partially_refunded",
        "refunded",
        "failed",
        "voided",
        "chargeback",
      ];

      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res
          .status(400)
          .json({ message: "Trạng thái thanh toán không hợp lệ" });
      }

      order.payment.status = paymentStatus;

      if (paymentStatus === "paid" && !order.payment.paidAt) {
        order.payment.paidAt = new Date();
      }
    }

    // Update individual items
    if (Array.isArray(itemUpdates) && itemUpdates.length > 0) {
      for (const update of itemUpdates) {
        const item = order.items.id(update.itemId);
        if (item) {
          if (update.fulfillmentStatus) {
            item.fulfillment.status = update.fulfillmentStatus;
            if (
              update.fulfillmentStatus === "shipped" &&
              !item.fulfillment.shippedAt
            ) {
              item.fulfillment.shippedAt = new Date();
            }
            if (
              update.fulfillmentStatus === "delivered" &&
              !item.fulfillment.deliveredAt
            ) {
              item.fulfillment.deliveredAt = new Date();
            }
          }
          if (update.trackingNumber) {
            item.fulfillment.trackingNumber = update.trackingNumber;
          }
          if (update.carrier) {
            item.fulfillment.carrier = update.carrier;
          }
          if (update.returnedQty !== undefined) {
            item.returnedQty = Math.max(
              0,
              Math.min(update.returnedQty, item.quantity)
            );
          }
        }
      }
    }

    // Update note
    if (note !== undefined) {
      order.note = note;
    }

    await order.save();

    return res.status(200).json({
      ok: true,
      message: "Cập nhật đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi cập nhật đơn hàng", error: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Check permissions
    const isOwner = String(order.user) === String(req.user?.userId);
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Không có quyền hủy đơn hàng này" });
    }

    // Check if order can be cancelled
    if (!order.canCancel()) {
      return res.status(400).json({
        message:
          "Không thể hủy đơn hàng này. Đơn hàng đã được thanh toán hoặc đang giao.",
      });
    }

    order.fulfillment.status = "cancelled";
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelledBy = req.user?.userId;
    order.cancelReason = reason || "";

    await order.save();

    // cập nhật số lượng sản phẩm
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    return res.status(200).json({
      ok: true,
      message: "Hủy đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi hủy đơn hàng", error: error.message });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Chỉ admin mới có quyền xem thống kê" });
    }

    const userId = req.query.userId || null;
    const stats = await Order.getStatusStats(userId);

    return res.status(200).json({
      ok: true,
      stats,
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi lấy thống kê", error: error.message });
  }
};

// Delete order (admin)
export const deleteOrder = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Chỉ admin mới có quyền xóa đơn hàng" });
    }
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    return res
      .status(200)
      .json({ ok: true, message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.error("Delete order error:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi xóa đơn hàng", error: error.message });
  }
};
