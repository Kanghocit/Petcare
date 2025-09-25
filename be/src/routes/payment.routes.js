import express from "express";

import {
  createPayment,
  callbackPayment,
  transactionStatus,
  updateStatusPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", createPayment);
router.post("/callback", callbackPayment);
router.post("/transaction-status", transactionStatus);
router.post("/status", updateStatusPayment);

export default router;
