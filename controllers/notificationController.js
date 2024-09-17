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
      isPostNotification: req.body.isPostNotification,
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
    })
      .populate("sender", "name picture")
      .sort("-createdAt");
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
    if (!notitication && post && post.publisher === req.query.senderId) {
      res.status("400");
      throw new Error("the notification is not found");
    }
    res.send(notitication);
  } catch (error) {
    throw new Error(error.message);
  }
});

const readNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
    if (!notification) {
      res.status(400);
      throw new Error("the notification was not found");
    }
    res.send(notification);
  } catch (error) {
    throw new Error(error.message);
  }
});

const deleteMobileNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(
      req.query.notificationId
    );
    if (!notification) {
      res.status(400);
      throw new Error("the notification was not found");
    } else res.send({ message: "the notification is deleted successfully !" });
  } catch (error) {
    throw new Error(error.message);
  }
});
const sendMobileNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.create({
      reciver: req.body.reciverId,
      sender: req.user._id,
      message: req.body.message,
      postId: req.body.postId,
      commentId: req.body.commentId,
      followId: req.body.followId,
      isPostNotification: req.body.isPostNotification,
    });
    if (!notification) {
      res.status(400);
      throw new Error("error happens when pushing a new notification");
    }
    notification = await notification.populate("sender", "name picture");
    res.status(200).send(notification);
  } catch (error) {
    throw new Error(error.message);
  }
});
const deleteNoticiationFromSender = asyncHandler(async (req, res) => {
  try {
    let notification;
    if (req.query.commentId) {
      console.log(req.user._id, " 1 ", req.query);
      notification = await Notification.deleteOne({
        $and: [{ sender: req.user._id }, { commentId: req.query.commentId }],
      });
    } else if (req.query.postId) {
      console.log(req.user._id, " 2 ", req.query);

      notification = await Notification.deleteOne({
        $and: [{ sender: req.user._id }, , { postId: req.query.postId }],
      });
    } else if (req.query.followId) {
      console.log(req.user._id, " 3 ", req.query);

      notification = await Notification.deleteOne({
        $and: [{ sender: req.user._id }, { followId: req.query.followId }],
      });
    }
    if (!notification) {
      res.status(400);
      throw new Error("the notification was not found");
    } else res.send({ message: "the notification is deleted successfully !" });
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = {
  sendNotification,
  getNotifications,
  deleteNotification,
  readNotification,
  deleteMobileNotification,
  sendMobileNotification,
  deleteNoticiationFromSender,
};
