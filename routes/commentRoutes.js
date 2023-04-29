const express = require("express");
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/commentController");
const auth = require("../middleware/auth");
const router = express.Router();
router.get("/:postId/getComments", auth, getComments);
router.post("/:postId/addComment", auth, addComment);
router.delete("/:commentId/deleteComment", auth, deleteComment);
module.exports = router;
