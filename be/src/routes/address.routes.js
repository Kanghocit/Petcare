import express from "express";
import {
  createAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/", createAddress);
router.get("/", getAllAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
