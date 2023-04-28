const expressAsyncHandler = require("express-async-handler");
const { Chat } = require("../models/chatModel");
const { Message } = require("../models/messageModel");
const { User } = require("../models/userModel");

const createChat = expressAsyncHandler(async (req, res) => {
  try {
    let chat = await Chat.create({
      users: [...req.body.users],
      chatType: req.body.chatType,
    });
    if (!chat) {
      res.status(400);
      throw new Error("the chat was not found");
    }
    chat = await chat.populate("users", "_id name picture");
    res.send(chat);
  } catch (error) {
    throw new Error(error.message);
  }
});
const getChat = expressAsyncHandler(async (req, res) => {
  try {
    let chat = await Chat.findById(req.params.chatId).populate(
      "users",
      "_id name picture"
    );
    if (!chat) {
      res.status(400);
      throw new Error("the chat was not found");
    }
    chat = await Message.populate(chat, {
      path: "latestMessage",
      select: "sender content createdAt updatedAt",
    });
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name _id picture",
    });
    res.send(chat);
  } catch (error) {
    throw new Error(error.message);
  }
});
module.exports = {
  createChat,
  getChat,
};
