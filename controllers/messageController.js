const asyncHandler = require("express-async-handler");
const { Chat } = require("../models/chatModel");
const { Message } = require("../models/messageModel");

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user._id,
      chatId: req.body.chatId,
      content: req.body.content,
    });
    if (!message) {
      res.status(400);
      throw new Error("error occured when sending a message");
    }
    await Chat.findByIdAndUpdate(
      message.chatId,
      {
        latestMessage: message._id,
      },
      {
        new: true,
      }
    );
    res.send(message);
  } catch (error) {
    throw new Error(error.message);
  }
});
const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .select("-chatId")
      .populate("sender", "name picture")
      .sort("-createdAt");
    if (!messages) {
      res.status(400);
      throw new Error("error occured when getting the messages");
    }
    res.send(messages);
  } catch (error) {
    throw new Error(error.message);
  }
});
module.exports = {
  sendMessage,
  getMessages,
};
