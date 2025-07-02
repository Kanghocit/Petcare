import express from "express";

import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", verifyToken, logout);

export default router;
