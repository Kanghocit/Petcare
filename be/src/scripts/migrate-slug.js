// Script để migrate slug cho các sản phẩm chưa có slug
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import slugify from "slugify";

dotenv.config();

const migrateSlug = async () => {
  try {
    // Kết nối database
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error(
        "MONGO_URI or MONGODB_URI not found in environment variables"
      );
    }
    await mongoose.connect(mongoUri);

    // Lấy tất cả sản phẩm không có slug hoặc slug rỗng
    const products = await Product.find({
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
    });

    let updated = 0;
    let skipped = 0;

    // Cập nhật từng sản phẩm
    for (const product of products) {
      if (product.title) {
        const newSlug = slugify(product.title, { lower: true, strict: true });

        // Kiểm tra xem slug đã tồn tại chưa
        const existingProduct = await Product.findOne({ slug: newSlug });

        if (
          existingProduct &&
          existingProduct._id.toString() !== product._id.toString()
        ) {
          // Nếu slug đã tồn tại, thêm ID vào cuối để unique
          const uniqueSlug = `${newSlug}-${product._id.toString().slice(-6)}`;
          product.slug = uniqueSlug;
        } else {
          product.slug = newSlug;
        }

        await product.save();
        updated++;
      } else {
        skipped++;
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Total products without slug: ${products.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log("Migration completed!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migrateSlug();
