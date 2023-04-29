const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const auth = require("../middleware/auth");
const router = express.Router();
router.route("/").post(auth, sendMessage);
router.route("/:chatId").get(auth, getMessages);

module.exports = router;
