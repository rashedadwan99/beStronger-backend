const express = require("express");
const router = express.Router();
const {
  createChat,
  getSingleChat,
  getAllChat,
} = require("../controllers/chatController");
const auth = require("../middleware/auth");
router.route("/").post(auth, createChat).get(auth, getAllChat);
router.get("/:chatId", auth, getSingleChat);
module.exports = router;
