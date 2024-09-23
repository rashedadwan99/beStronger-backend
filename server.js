require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
const app = express();
const winston = require("winston");
require("./startup/cors")(app);

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`listening on port ${port}`);
});
io = socket(server, {
  pingInterval: 5000, // send a heartbeat message every 5 seconds
  pingTimeout: 30000, // consider the connection dead if no ping response within 30 seconds
  cors: {
    origin: "*", // Open for all origins, but for security, limit to necessary origins in production
  },
});

io.on("connection", (socket) => {
  socket.emit("connected");
  console.log("socket connected with ID", socket.id);

  // Join room based on user ID
  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log("user connected with ID " + userId + " socket id", socket.id);
  });

  // Emit new notification
  socket.on("new notification", (notification) => {
    if (notification.reciver === notification.sender._id) return;
    socket.in(notification.reciver).emit("notification recived", notification);
  });

  // Handle notification deletion
  socket.on("delete notification", (reciverId, notification) => {
    socket.in(reciverId).emit("remove notification", notification);
  });

  // User leaves room
  socket.on("leave room", (userId) => {
    socket.leave(userId);
    console.log("user disconnected with ID " + userId);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  // Handle off events like "setup" if necessary
  socket.off("setup", (userId) => {
    console.log("User disconnected (off event) with ID " + userId);
    socket.leave(userId);
  });
});
