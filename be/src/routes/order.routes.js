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
router.get("/", verifyToken, getOrders);
router.get("/stats", verifyToken, getOrderStats);
router.get("/code/:orderCode", verifyToken, getOrderByCode);
router.get("/:id", verifyToken, getOrderById);

// Order management
router.put("/:id/status", verifyToken, updateOrderStatus);
router.put("/:id/cancel", verifyToken, cancelOrder);

// Admin-only operations
router.delete("/:id", verifyToken, deleteOrder);

export default router;
