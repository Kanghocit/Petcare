import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cookieParser from "cookie-parser";
import { startNewsCronJob } from "./cron/scape.task.js";
import newsRoutes from "./routes/news.routes.js";
import orderRoutes from "./routes/order.routes.js";

import uploadRoutes from "./routes/upload.routes.js";
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
    origin: "http://localhost:3000",
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
console.log("Serving images from:", imagesDirSrc);
console.log("Fallback images from:", imagesDirRoot);
app.use("/images", express.static(imagesDirSrc));
// Fallback if files are stored in be/public/images instead of be/src/public/images
app.use("/images", express.static(imagesDirRoot));
// Provide a placeholder image path
app.get("/images/product/placeholder.png", (req, res) => {
  res.status(200).send();
});

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", uploadRoutes);
app.use("/api/orders", orderRoutes);

//Error handling middleware

//Cron job
startNewsCronJob();

//Server running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
