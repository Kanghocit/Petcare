import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { startNewsCronJob } from "./cron/scape.task.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import newsRoutes from "./routes/news.routes.js";
import orderRoutes from "./routes/order.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import voicherRoutes from "./routes/voicher.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware để parse cookies - PHẢI ĐẶT TRƯỚC CORS
app.use(cookieParser());

//cấu hình để truy cập từ FE
app.use(
  cors({
    origin: [
      "http://localhost:3000", // FE app
      "http://localhost:3001", // alternate FE
    ],
    credentials: true,
  })
);

//cấu hình để nhận dữ liệu từ FE
app.use(express.json());

// Middleware để xử lý form data (file upload)
app.use(express.urlencoded({ extended: true }));

// Serve static files từ thư mục public
const imagesDirSrc = path.join(__dirname, "public", "images");
const imagesDirRoot = path.join(__dirname, "..", "public", "images");
app.use("/images", express.static(imagesDirSrc));
// Fallback if files are stored in be/public/images instead of be/src/public/images
app.use("/images", express.static(imagesDirRoot));
// Alias to avoid ad-blockers blocking paths containing "banner"
app.use("/images/hero", express.static(path.join(imagesDirSrc, "banner")));
app.use("/images/hero", express.static(path.join(imagesDirRoot, "banner")));

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/voicher", voicherRoutes);
app.use("/api/brands", brandRoutes);

//Error handling middleware

//Cron job
startNewsCronJob();

//Server running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
