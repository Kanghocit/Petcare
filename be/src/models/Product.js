import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      default: 0,
      // Giá bán (selling price)
    },
    importPrice: {
      type: Number,
      default: 0,
      // Giá nhập (import/cost price) - mặc định bằng 75% giá bán
    },
    //đang bán/tạm ngừng bán/ngừng hẳn
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    discount: {
      type: Number,
      default: 0,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isSaleProduct: {
      type: Boolean,
      default: false,
    },
    star: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
    images: {
      type: [String],
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  // Luôn tạo slug nếu chưa có hoặc title đã thay đổi
  if (!this.slug || this.isModified("title")) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
