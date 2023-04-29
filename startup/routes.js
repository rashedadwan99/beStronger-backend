const express = require("express");
const error = require("../middleware/admin");

const users = require("../routes/usersRoutes");
const auth = require("../routes/auth");
const posts = require("../routes/postsRoutes");
const notifications = require("../routes/notificationRoutes");
const socialMedia = require("../routes/socialMediaRoutes");
const message = require("../routes/messageRoutes");
const chat = require("../routes/chatRoutes");
const comment = require("../routes/commentRoutes");
const { notFound, errorHandler } = require("../middleware/error");
module.exports = (app) => {
  app.use(express.json());

  app.use("/uploads", express.static("uploads"));
  app.use(express.urlencoded({ extended: false }));
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/posts", posts);
  app.use("/api/notifications", notifications);
  app.use("/api/socialMedia", socialMedia);
  app.use("/api/message", message);
  app.use("/api/chat", chat);
  app.use("/api/comment", comment);
  app.use(notFound);
  app.use(errorHandler);
  app.use(error);
};
