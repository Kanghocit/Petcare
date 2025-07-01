import express from "express";
import { getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile", verifyToken, getUser);

export default router;
