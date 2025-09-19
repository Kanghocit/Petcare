import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import dotenv from "dotenv";
import { productIndex } from "./services/meilisearch.services.js";

dotenv.config();

async function syncProducts() {
  await connectDB();

  const products = await Product.find().lean();
  console.log(`Found ${products.length} products in MongoDB`);

  if (!productIndex) {
    console.error("MeiliSearch not available - cannot sync products");
    process.exit(1);
  }

  try {
    const { taskUid } = await productIndex.addDocuments(products);
    console.log("Sync started, taskUid:", taskUid);
  } catch (error) {
    console.error("Failed to sync products to MeiliSearch:", error);
    process.exit(1);
  }

  process.exit(0);
}

syncProducts();
