import express from "express";

import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/create", createProduct);
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.put("/:slug", updateProduct);
router.delete("/:slug", deleteProduct);

export default router;
