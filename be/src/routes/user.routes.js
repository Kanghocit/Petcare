import express from "express";
import {
  addAddress,
  deleteAddress,
  getAllUser,
  getUser,
  getUserById,
  setDefaultAddress,
  updateAddress,
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

//address
router.post("/address", verifyToken, addAddress);

router.put("/address/:addressId", verifyToken, updateAddress);

router.delete("/address/:addressId", verifyToken, deleteAddress);

router.patch("/address/:addressId/default", verifyToken, setDefaultAddress);

export default router;
