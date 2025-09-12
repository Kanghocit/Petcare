import express from "express";

import {
  createPayment,
  callbackPayment,
  transactionStatus,
  getStatusPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", createPayment);
router.post("/callback", callbackPayment);
router.post("/transaction-status", transactionStatus);
router.post("/status", getStatusPayment);

export default router;
