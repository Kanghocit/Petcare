import express from "express";
import {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/banners.controller.js";

const router = express.Router();

router.post("/", createBanner);
router.get("/", getBanners);
router.patch("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;
