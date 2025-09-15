import express from "express";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentsInAdmin,
  replyComment,
  updateCommentStatus,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/admin", getCommentsInAdmin);
router.post("/reply", replyComment);
router.post("/:productSlug", createComment);
router.get("/:productSlug", getComments);
router.patch("/status", updateCommentStatus);
router.put("/", updateComment);
router.delete("/", deleteComment);
router.post("/reply", replyComment);

export default router;
