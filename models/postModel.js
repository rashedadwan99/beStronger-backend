const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 1,
    },
    picture: { type: String, default: "" },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    numOfLikes: { type: Number, default: 0, min: 0 },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    comments: {
      type: [
        new mongoose.Schema(
          {
            commenter: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            content: String,
            picture: String,
          },
          {
            timestamps: true,
          }
        ),
      ],
      default: [],
    },

    numOfComments: { type: Number, default: 0, min: 0, default: 0 },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", postSchema);
module.exports.Post = Post;

module.exports.postSchema = postSchema;
