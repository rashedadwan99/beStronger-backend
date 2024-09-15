const express = require("express");
const {
  sendNotification,
  getNotifications,
  deleteNotification,
  readNotification,
  deleteMobileNotification,
  deleteNoticiationFromSender,
} = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const router = express.Router();

router.route("/").post(auth, sendNotification).get(auth, getNotifications);
router.delete("/", auth, deleteNotification);
router.delete("/mobile/sendNotification", auth, deleteMobileNotification);
router.delete("/mobile/swipe/delete", auth, deleteMobileNotification);
router.delete("/mobile/deleteFromSender", auth, deleteNoticiationFromSender);
router.put("/:notificationId/readNotification", auth, readNotification);
module.exports = router;
