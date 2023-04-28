const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", chatSchema);
module.exports = {
  Chat,
};
