import express from "express";

import {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/", createBrand);
router.get("/", getAllBrands);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;
