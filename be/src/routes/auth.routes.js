import express from "express";

import {
  register,
  login,
  logout,
  refreshToken,
  loginAdmin,
  getAdminAccount,
  logoutAdmin,
  createStaff,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", verifyToken, logout);

// Admin auth and staff management
router.post("/admin/login", loginAdmin);
router.get("/admin/me", getAdminAccount);
router.post("/admin/logout", logoutAdmin);
router.post("/admin/create-staff", createStaff);

export default router;
