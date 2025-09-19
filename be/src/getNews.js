import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { scrapeAndSaveNews } from "./controllers/news.controller.js";

// Load environment variables
dotenv.config();

const runTest = async () => {
  try {
    console.log("🔄 Đang kết nối database...");
    await connectDB();

    console.log("🚀 Bắt đầu scrape news...");
    await scrapeAndSaveNews();

    console.log("✅ Hoàn thành!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

runTest();
