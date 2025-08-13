// models/Order.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const { Schema } = mongoose;

/** ───────── Shipping Address Schema ───────── **/
const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    ward: { type: String, required: true, trim: true },
    zipCode: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

/** ───────── Order Item Schema ───────── **/
const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Số lượng phải lớn hơn 0"],
      validate: {
        validator: Number.isInteger,
        message: "Số lượng phải là số nguyên",
      },
    },

    // Giá tại thời điểm mua (VND)
    priceAtPurchase: {
      type: Number,
      required: true,
      min: [0, "Giá không được âm"],
      validate: {
        validator: Number.isInteger,
        message: "Giá phải là số nguyên",
      },
    },

    // Snapshot thông tin sản phẩm lúc mua
    productSnapshot: {
      title: { type: String, required: true },
      slug: { type: String, required: true },
      image: { type: String, required: true },
      sku: String,
      brand: String,
    },

    // Trạng thái giao nhận theo từng item
    fulfillment: {
      status: {
        type: String,
        enum: {
          values: [
            "unfulfilled",
            "processing",
            "shipped",
            "delivered",
            "returned",
            "cancelled",
          ],
          message: "Trạng thái không hợp lệ",
        },
        default: "unfulfilled",
      },
      shippedAt: Date,
      deliveredAt: Date,
      trackingNumber: String,
      carrier: String,
      notes: String,
    },

    // Số lượng đã trả (đổi/trả)
    returnedQty: {
      type: Number,
      default: 0,
      min: [0, "Số lượng trả không được âm"],
      validate: {
        validator: function (value) {
          return value <= this.quantity;
        },
        message: "Số lượng trả không được vượt quá số lượng đã mua",
      },
    },

    // Đánh giá sản phẩm
    reviewed: { type: Boolean, default: false },
    reviewId: { type: Schema.Types.ObjectId, ref: "Review" },
  },
  {
    _id: true,
    timestamps: true,
  }
);

// Virtual field: số lượng còn lại (chưa trả)
orderItemSchema.virtual("remainingQty").get(function () {
  return this.quantity - this.returnedQty;
});

// Virtual field: tổng tiền item
orderItemSchema.virtual("itemTotal").get(function () {
  return this.quantity * this.priceAtPurchase;
});

/** ───────── Payment Transaction Schema ───────── **/
const paymentTxnSchema = new Schema(
  {
    kind: {
      type: String,
      enum: {
        values: ["capture", "refund", "void", "chargeback"],
        message: "Loại giao dịch không hợp lệ",
      },
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Số tiền không được âm"],
      validate: {
        validator: Number.isInteger,
        message: "Số tiền phải là số nguyên",
      },
    },
    gateway: { type: String, required: true }, // 'stripe', 'paypal', 'vnpay', 'cod'
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
    raw: Schema.Types.Mixed, // payload gốc từ gateway
  },
  { _id: false }
);

/** ───────── Order Schema ───────── **/
const orderSchema = new Schema(
  {
    orderCode: {
      type: String,
      unique: true,
      index: true,
      default: () => `ORD-${nanoid(8)}`,
      immutable: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        {
          validator: function (arr) {
            return Array.isArray(arr) && arr.length > 0;
          },
          message: "Đơn hàng phải có ít nhất 1 sản phẩm",
        },
      ],
    },

    // Thông tin vận chuyển
    shipping: {
      method: {
        type: String,
        enum: ["standard", "express", "same_day"],
        default: "standard",
      },
      fee: {
        type: Number,
        default: 0,
        min: [0, "Phí vận chuyển không được âm"],
      },
      estimatedDays: {
        type: Number,
        default: 3,
        min: [1, "Số ngày ước tính phải lớn hơn 0"],
      },
      trackingNumber: String,
      carrier: String,
      notes: String,
    },

    // Thông tin địa chỉ giao hàng
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    // Tổng tiền các mặt hàng (chưa tính phí ship)
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Tổng tiền không được âm"],
      validate: {
        validator: Number.isInteger,
        message: "Tổng tiền phải là số nguyên",
      },
    },

    // Tổng tiền cuối cùng (đã tính phí ship, giảm giá)
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Tổng tiền không được âm"],
      validate: {
        validator: Number.isInteger,
        message: "Tổng tiền phải là số nguyên",
      },
    },

    // Thông tin giảm giá
    discount: {
      amount: { type: Number, default: 0, min: 0 },
      code: String,
      type: { type: String, enum: ["percentage", "fixed"], default: "fixed" },
      description: String,
    },

    /** ── Trạng thái thanh toán ── **/
    payment: {
      status: {
        type: String,
        enum: {
          values: [
            "unpaid",
            "authorized",
            "paid",
            "partially_refunded",
            "refunded",
            "failed",
            "voided",
            "chargeback",
          ],
          message: "Trạng thái thanh toán không hợp lệ",
        },
        default: "unpaid",
        index: true,
      },
      method: {
        type: String,
        enum: ["cod", "vnpay", "stripe", "paypal", "momo"],
        required: true,
      },
      paidAt: Date,
      refundedAmount: {
        type: Number,
        default: 0,
        min: [0, "Số tiền hoàn không được âm"],
      },
      transactions: [paymentTxnSchema],
    },

    /** ── Trạng thái giao nhận tổng ── **/
    fulfillment: {
      status: {
        type: String,
        enum: {
          values: [
            "unfulfilled",
            "processing",
            "partially_shipped",
            "shipped",
            "partially_delivered",
            "delivered",
            "returned",
            "cancelled",
          ],
          message: "Trạng thái giao nhận không hợp lệ",
        },
        default: "unfulfilled",
        index: true,
      },
      shippedAt: Date,
      deliveredAt: Date,
      estimatedDelivery: Date,
    },

    // Trạng thái tổng quan của đơn
    status: {
      type: String,
      enum: {
        values: ["open", "completed", "cancelled", "closed"],
        message: "Trạng thái đơn hàng không hợp lệ",
      },
      default: "open",
      index: true,
    },

    // Ghi chú
    note: {
      type: String,
      default: "",
      maxlength: [500, "Ghi chú không được quá 500 ký tự"],
    },

    // Thông tin bổ sung
    source: {
      type: String,
      enum: ["web", "mobile", "admin"],
      default: "web",
    },

    // Thời gian hết hạn thanh toán (cho COD)
    paymentExpiresAt: Date,

    // Thời gian hủy đơn
    cancelledAt: Date,
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancelReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/** ───────── Virtual Fields ───────── **/
// Tổng số sản phẩm
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Số sản phẩm đã giao
orderSchema.virtual("deliveredItems").get(function () {
  return this.items.reduce((sum, item) => {
    return sum + (item.fulfillment.status === "delivered" ? item.quantity : 0);
  }, 0);
});

// Số sản phẩm đã trả
orderSchema.virtual("returnedItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.returnedQty, 0);
});

// Trạng thái thanh toán dễ đọc
orderSchema.virtual("paymentStatusText").get(function () {
  const statusMap = {
    unpaid: "Chưa thanh toán",
    authorized: "Đã ủy quyền",
    paid: "Đã thanh toán",
    partially_refunded: "Hoàn tiền một phần",
    refunded: "Đã hoàn tiền",
    failed: "Thanh toán thất bại",
    voided: "Đã hủy",
    chargeback: "Tranh chấp",
  };
  return statusMap[this.payment.status] || this.payment.status;
});

// Trạng thái giao nhận dễ đọc
orderSchema.virtual("fulfillmentStatusText").get(function () {
  const statusMap = {
    unfulfilled: "Chưa xử lý",
    processing: "Đang xử lý",
    partially_shipped: "Giao một phần",
    shipped: "Đã giao hàng",
    partially_delivered: "Nhận một phần",
    delivered: "Đã nhận hàng",
    returned: "Đã trả hàng",
    cancelled: "Đã hủy",
  };
  return statusMap[this.fulfillment.status] || this.fulfillment.status;
});

/** ───────── Instance Methods ───────── **/
// Tính toán lại tổng tiền
orderSchema.methods.recalculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + item.quantity * item.priceAtPurchase;
  }, 0);

  this.totalAmount = this.subtotal + this.shipping.fee - this.discount.amount;
  return this;
};

// Cập nhật trạng thái giao nhận
orderSchema.methods.updateFulfillmentStatus = function () {
  const itemStatuses = this.items.map((item) => item.fulfillment.status);

  if (itemStatuses.every((status) => status === "delivered")) {
    this.fulfillment.status = "delivered";
    this.fulfillment.deliveredAt = new Date();
  } else if (itemStatuses.some((status) => status === "delivered")) {
    this.fulfillment.status = "partially_delivered";
  } else if (itemStatuses.every((status) => status === "shipped")) {
    this.fulfillment.status = "shipped";
  } else if (itemStatuses.some((status) => status === "shipped")) {
    this.fulfillment.status = "partially_shipped";
  } else if (itemStatuses.some((status) => status === "processing")) {
    this.fulfillment.status = "processing";
  }

  return this;
};

// Kiểm tra có thể hủy không
orderSchema.methods.canCancel = function () {
  return (
    ["unfulfilled", "processing"].includes(this.fulfillment.status) &&
    this.payment.status !== "paid"
  );
};

// Kiểm tra có thể trả hàng không
orderSchema.methods.canReturn = function () {
  return (
    this.fulfillment.status === "delivered" && this.payment.status === "paid"
  );
};

/** ───────── Static Methods ───────── **/
// Tìm đơn hàng theo mã
orderSchema.statics.findByOrderCode = function (orderCode) {
  return this.findOne({ orderCode });
};

// Thống kê đơn hàng theo trạng thái
orderSchema.statics.getStatusStats = function (userId = null) {
  const match = userId ? { user: userId } : {};
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$fulfillment.status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);
};

/** ───────── Middleware ───────── **/
// Pre-save: Tính toán lại tổng tiền
orderSchema.pre("save", function (next) {
  if (
    this.isModified("items") ||
    this.isModified("shipping.fee") ||
    this.isModified("discount.amount")
  ) {
    this.recalculateTotals();
  }
  next();
});

// Pre-save: Cập nhật trạng thái giao nhận
orderSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.updateFulfillmentStatus();
  }
  next();
});

// Pre-save: Cập nhật trạng thái tổng quan
orderSchema.pre("save", function (next) {
  if (
    this.fulfillment.status === "delivered" &&
    this.payment.status === "paid"
  ) {
    this.status = "completed";
  } else if (this.fulfillment.status === "cancelled") {
    this.status = "cancelled";
  }
  next();
});

/** ───────── Indexes ───────── **/
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "items.product": 1 });
orderSchema.index({ "payment.status": 1, createdAt: -1 });
orderSchema.index({ "fulfillment.status": 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderCode: 1 });
orderSchema.index({ "shippingAddress.phone": 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);
