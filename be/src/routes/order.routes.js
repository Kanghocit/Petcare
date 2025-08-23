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
  getOrdersByUserId,
} from "../controllers/order.controller.js";

const router = express.Router();

// Authenticated routes
router.post("/create", verifyToken, createOrder);
router.get("/", getOrders);
router.get("/stats", getOrderStats);
router.get("/code/:orderCode", getOrderByCode);
router.get("/:id/orders", verifyToken, getOrdersByUserId);
router.get("/:id", getOrderById);

// Order management
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/cancel", verifyToken, cancelOrder);

// Admin-only operations
router.delete("/:id", deleteOrder);

export default router;
