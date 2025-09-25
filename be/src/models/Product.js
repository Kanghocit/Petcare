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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    brand: {
      type: String,
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
