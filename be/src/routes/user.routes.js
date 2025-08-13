import express from "express";
import {
  getAllUser,
  getUser,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// List all users (admin)
router.get("/", getAllUser);
// Current user profile - PHẢI ĐẶT TRƯỚC route động
router.get("/profile", verifyToken, getUser);
//get user by id
router.get("/:id", getUserById);
// update user
router.patch("/:id", updateUser);
export default router;
