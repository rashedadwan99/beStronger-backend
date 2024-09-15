const express = require("express");
const {
  sendNotification,
  getNotifications,
  deleteNotification,
  readNotification,
  deleteMobileNotification,
  deleteNoticiationFromSender,
  sendMobileNotification,
} = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const router = express.Router();

router.route("/").post(auth, sendNotification).get(auth, getNotifications);
router.delete("/", auth, deleteNotification);
router.post("/mobile/sendNotification", auth, sendMobileNotification);
router.delete("/mobile/swipe/delete", auth, deleteMobileNotification);
router.delete("/mobile/deleteFromSender", auth, deleteNoticiationFromSender);
router.put("/:notificationId/readNotification", auth, readNotification);
module.exports = router;
