const express = require("express");
const router = express.Router();
const { createChat, getChat } = require("../controllers/chatController");
const auth = require("../middleware/auth");
router.route("/").post(auth, createChat);
router.get("/:chatId", auth, getChat);
module.exports = router;
