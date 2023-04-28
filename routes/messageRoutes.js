const express = require("express");
const { sendMessage } = require("../controllers/messageController");
const auth = require("../middleware/auth");
const router = express.Router();
router.route("/").post(auth, sendMessage);

module.exports = router;
