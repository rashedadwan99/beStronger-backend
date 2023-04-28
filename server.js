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
    origin: ["https://bestrong-client.onrender.com", "http://localhost:3000"],
  },
});
const connectedUsers = {};
io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    if (connectedUsers[userId]) {
      connectedUsers[userId].disconnect(true);
    }
    connectedUsers[userId] = socket;
    connectedUsers[userId].join(userId);
    connectedUsers[userId].emit("connected");
    console.log("user connected with ID " + userId);
    connectedUsers[userId].on("new notification", (notification) => {
      if (notification.reciver === notification.sender._id) return;
      connectedUsers[userId]
        .in(notification.reciver)
        .emit("notification recived", notification);
    });
    connectedUsers[userId].on(
      "delete notification",
      (reciverId, notification) => {
        connectedUsers[userId]
          .in(reciverId)
          .emit("remove notification", notification);
      }
    );
    connectedUsers[userId].on("leave room", (userId) => {
      connectedUsers[userId].leave(userId);
      console.log("user disconnected with ID " + userId);
    });
    connectedUsers[userId].off("setup", (userId) => {
      console.log("USER DISCONNECTED");
      connectedUsers[userId].leave(userId);
    });
  });
});
