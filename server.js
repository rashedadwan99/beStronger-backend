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
  cors: {
    origin: "https://bestrong-client.onrender.com/",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
    console.log("user connected with ID " + userId);
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
});
