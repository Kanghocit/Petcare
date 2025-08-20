import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByCode,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

// Authenticated routes
router.post("/create", verifyToken, createOrder);
router.get("/", getOrders);
router.get("/stats", getOrderStats);
router.get("/code/:orderCode", getOrderByCode);
router.get("/:id", getOrderById);

// Order management
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

// Admin-only operations
router.delete("/:id", deleteOrder);

export default router;
