const mongoose = require("mongoose");
const commentModel = new mongoose.Schema(
  {
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("Comment", commentModel);
module.exports = {
  Comment,
};
