import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cookieParser from "cookie-parser";

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

// app.use(express.urlencoded({ extended: true }));

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
//Error handling middleware

//Server running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
