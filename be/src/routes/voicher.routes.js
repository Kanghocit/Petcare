import express from "express";

import {
  createVoicher,
  getVoichers,
  updateVoicher,
  deleteVoicher,
  useVoicher,
} from "../controllers/voicher.controller.js";

const router = express.Router();

router.post("/", createVoicher);
router.get("/", getVoichers);
router.post("/:id/use", useVoicher);
router.put("/:id", updateVoicher);
router.delete("/:id", deleteVoicher);
export default router;
