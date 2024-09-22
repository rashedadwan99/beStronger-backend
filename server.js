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
  // pingTimeout: 15000, // consider the connection dead if no message received within 15 seconds
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.emit("connected");
  console.log("socket connected");
  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log("user connected with ID " + userId + " socket id", socket.id);
  });
  socket.on("new notification", (notification) => {
    if (notification.reciver === notification.sender._id) return;

    socket.in(notification.reciver).emit("notification recived", notification);
  });
  socket.on("delete notification", (reciverId, notification) => {
    socket.in(reciverId).emit("remove notification", notification);
  });
  socket.on("leave room", (userId) => {
    socket.leave(userId);
    console.log("user disconnected with ID " + userId);
  });
  socket.off("setup", (userId) => {
    console.log("USER DISCONNECTED");

    socket.leave(userId);
  });
  socket.on("disconnect", () => {
    console.log("WebSocket connection closed");
  });
});
