import mongoose from "mongoose";

const flashSalesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        flashSalePrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
        },
        sold: {
          type: Number,
          default: 0,
        },
      },
    ],
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percent"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const FlashSales =
  mongoose.models.FlashSales || mongoose.model("FlashSales", flashSalesSchema);

export default FlashSales;
