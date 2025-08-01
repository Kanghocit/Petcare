import cron from "node-cron";
import { scrapeAndSaveNews } from "../controllers/news.controller.js";

export const startNewsCronJob = () => {
  // phút giờ ngày tháng ngày trong tuần
  cron.schedule("0 12 * * *", async () => {
    console.log("🕛 Chạy cron scrape lúc 12h...");
    await scrapeAndSaveNews();
  });
};
