import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Index để tối ưu query
categorySchema.index({ parentId: 1, level: 1 });
categorySchema.index({ isActive: 1 });

categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.name = this.name.replace(/\s+/g, " ").trim();

    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }

  if (this.isModified("parentId")) {
    this.level = this.parentId ? 2 : 1;
  }
  next();
});

categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentId",
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
