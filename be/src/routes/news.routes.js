import express from "express";
import {
  deleteNews,
  getAllNews,
  getNewsBySlug,
  getNewsByStatus,
  updateNews,
} from "../controllers/news.controller.js";

const router = express.Router();

// GET /api/news - Lấy danh sách tin tức
router.get("/", getAllNews);

// GET /api/news/:slug - Lấy tin tức theo slug
router.get("/:slug", getNewsBySlug);

// GET /api/news/status - Lấy tin theo trạng thái
router.get("/status", getNewsByStatus);

// PUT /api/news/:slug - Cập nhật trạng thái tin tức
router.put("/:slug", updateNews);

//DELETE /api/news/:slug - Xóa tin tức
router.delete("/:slug", deleteNews);

export default router;
