import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import dotenv from "dotenv";
import { meiliClient, productIndex } from "./services/meilisearch.services.js";

dotenv.config();

async function syncProducts() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    console.log("📦 Fetching products from MongoDB...");
    const products = await Product.find().lean();
    console.log(`✅ Found ${products.length} products in MongoDB`);

    if (!meiliClient) {
      console.error("❌ MeiliSearch client not available");
      process.exit(1);
    }

    if (!productIndex) {
      console.error("❌ MeiliSearch product index not available");
      process.exit(1);
    }

    console.log("🔍 Testing MeiliSearch connection...");
    try {
      const health = await meiliClient.health();
      console.log("✅ MeiliSearch is healthy:", health);
    } catch (healthError) {
      console.error("❌ MeiliSearch health check failed:", healthError.message);
      console.error(
        "Make sure MeiliSearch is running on:",
        process.env.MEILI_HOST || "http://localhost:7700"
      );
      process.exit(1);
    }

    if (products.length === 0) {
      console.log("⚠️  No products found to sync");
      process.exit(0);
    }

    console.log("📤 Syncing products to MeiliSearch...");

    // Transform products to match MeiliSearch format (same as controller)
    const transformedProducts = products.map((product) => ({
      id: product._id.toString(), // Important: MeiliSearch needs string ID
      title: product.title,
      slug: product.slug, // Add slug to Meilisearch index
      description: product.description,
      price: product.price,
      discount: product.discount,
      isNewProduct: product.isNewProduct,
      isSaleProduct: product.isSaleProduct,
      category: product.category,
      star: product.star,
      status: product.status,
      quantity: product.quantity,
      brand: product.brand,
      images: product.images,
    }));

    console.log("🔄 Transformed products for MeiliSearch format");

    // Process products in smaller batches to avoid issues
    const batchSize = 100;
    let totalSynced = 0;

    for (let i = 0; i < transformedProducts.length; i += batchSize) {
      const batch = transformedProducts.slice(i, i + batchSize);

      try {
        const result = await productIndex.addDocuments(batch);
        console.log(`✅ Batch synced, taskUid: ${result.taskUid}`);
        totalSynced += batch.length;
      } catch (batchError) {
        console.error(
          `❌ Failed to sync batch starting at index ${i}:`,
          batchError.message
        );
        // Continue with next batch instead of failing completely
      }
    }
  } catch (error) {
    console.error("❌ Failed to sync products to MeiliSearch:");
    console.error("Error details:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }

  console.log("🎉 Sync process completed successfully!");
  process.exit(0);
}

syncProducts();
