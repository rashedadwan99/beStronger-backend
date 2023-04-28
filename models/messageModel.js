const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    chatId: String,
    content: String,
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = {
  Message,
};
