// Script migration để cập nhật importPrice cho tất cả sản phẩm hiện có
// importPrice = price * 0.75

import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const migrateImportPrice = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Lấy tất cả sản phẩm
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);

    let updated = 0;
    let skipped = 0;

    // Cập nhật từng sản phẩm
    for (const product of products) {
      if (product.price > 0) {
        const importPrice = Math.round(product.price * 0.75);

        // Chỉ update nếu importPrice chưa có hoặc bằng 0
        if (!product.importPrice || product.importPrice === 0) {
          await Product.updateOne(
            { _id: product._id },
            { $set: { importPrice } }
          );
          updated++;
          console.log(
            `Updated product "${product.title}": price=${product.price}, importPrice=${importPrice}`
          );
        } else {
          skipped++;
          console.log(
            `Skipped product "${product.title}": already has importPrice=${product.importPrice}`
          );
        }
      } else {
        skipped++;
        console.log(`Skipped product "${product.title}": price is 0`);
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Total products: ${products.length}`);
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

migrateImportPrice();















