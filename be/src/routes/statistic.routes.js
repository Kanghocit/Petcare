import express from "express";
import { getStatistic } from "../controllers/statistic.controller.js";

const router = express.Router();

// GET /api/statistics?startDate=2025-01-01&endDate=2025-01-31
router.get("/", getStatistic);

export default router;
