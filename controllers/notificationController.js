const asyncHandler = require("express-async-handler");
const { Notification } = require("../models/notificationModel");
const { Post } = require("../models/postModel");

const sendNotification = asyncHandler(async (req, res) => {
  try {
    let notification = await Notification.create({
      reciver: req.body.reciverId,
      sender: req.user._id,
      message: req.body.message,
      targetId: req.body.targetId,
    });
    if (!notification) {
      res.status(400);
      throw new Error("error happens when pushing a new notification");
    }
    notification = await notification.populate("sender", "name picture");
    res.status(200).send(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      reciver: req.user._id,
    }).populate("sender", "name picture");
    if (!notifications) {
      res.status(400);
      throw new Error("error happens when fetch the notifications");
    }
    res.send(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const notitication = await Notification.findOneAndRemove({
      $and: [{ sender: req.query.senderId }, { targetId: req.query.targetId }],
    });
    const post = await Post.findById(req.query.targetId);
    if (!notitication && post.publisher === req.query.senderId) {
      res.status("400");
      throw new Error("the notification is not found");
    }
    res.send(notitication);
  } catch (error) {
    throw new Error(error.message);
  }
});
module.exports = {
  sendNotification,
  getNotifications,
  deleteNotification,
};
