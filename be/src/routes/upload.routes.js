import express from "express";
import {
  upload,
  uploadMultiple,
  uploadImage,
  uploadMultipleImages,
  getImagesByFolder,
  deleteImage,
  cleanupOldFiles,
  getFolderStats,
} from "../controllers/upload.controller.js";

const router = express.Router();

// Route upload 1 ảnh
router.post("/upload-image", upload.single("image"), uploadImage);

// Route upload nhiều ảnh
router.post(
  "/upload-multiple-images",
  uploadMultiple.array("images", 3),
  uploadMultipleImages
);

// Route để lấy danh sách ảnh trong thư mục
router.get("/images/:folder", getImagesByFolder);

// Route để xóa ảnh
router.delete("/images/:folder/:filename", deleteImage);

// Route để dọn dẹp file cũ
router.post("/images/:folder/cleanup", cleanupOldFiles);

// Route để lấy thống kê thư mục
router.get("/images/:folder/stats", getFolderStats);

export default router;
