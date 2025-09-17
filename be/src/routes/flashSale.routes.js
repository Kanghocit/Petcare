import express from "express";

import {
  createFlashSale,
  getFlashSale,
  getFlashSaleById,
  updateFlashSale,
  deleteFlashSale,
  toggleFlashSaleStatus,
} from "../controllers/flashSale.controller.js";

const router = express.Router();

router.post("/", createFlashSale);
router.get("/", getFlashSale);
router.get("/:id", getFlashSaleById);
router.put("/:id", updateFlashSale);
router.delete("/:id", deleteFlashSale);
router.patch("/:id/status", toggleFlashSaleStatus);

export default router;
