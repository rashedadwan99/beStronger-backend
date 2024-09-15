const express = require("express");
const {
  sendNotification,
  getNotifications,
  deleteNotification,
  readNotification,
  deleteMobileNotification,
} = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const router = express.Router();

router.route("/").post(auth, sendNotification).get(auth, getNotifications);
router.delete("/", auth, deleteNotification);
router.delete("/", auth, deleteMobileNotification);
router.put("/:notificationId/readNotification", auth, readNotification);
module.exports = router;
