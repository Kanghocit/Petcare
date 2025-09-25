import express from "express";

import {
  createVoicher,
  getVoichers,
  updateVoicher,
  deleteVoicher,
  useVoicher,
  validateVoicher,
} from "../controllers/voicher.controller.js";

const router = express.Router();

router.post("/", createVoicher);
router.get("/", getVoichers);
router.post("/validate", validateVoicher);
router.post("/use", useVoicher);
router.put("/:id", updateVoicher);
router.delete("/:id", deleteVoicher);
export default router;
