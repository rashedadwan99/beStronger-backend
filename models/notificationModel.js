const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: { type: String },
    targetId: { type: String },
    isRead: { type: Boolean, default: false },
    isPostNotification: { type: Boolean, default: false },
    commentId: { type: String },
    postId: { type: String },
    followId: { type: String },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = {
  Notification,
  notificationSchema,
};
