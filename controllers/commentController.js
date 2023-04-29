const expressAsyncHandler = require("express-async-handler");
const { Comment } = require("../models/commentModel");
const { User } = require("../models/userModel");

const getComments = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: { $in: req.params.postId },
    }).populate("commenter", "name picture");
    if (!comments) {
      res.status(400);
      throw new Error("an error has occured");
    }

    res.send(comments);
  } catch (error) {
    throw new Error(error.message);
  }
});
const addComment = expressAsyncHandler(async (req, res) => {
  try {
    let comment = await Comment.create({
      commenter: req.user._id,
      content: req.body.content,
      postId: req.params.postId,
    });
    comment = await User.populate(comment, {
      path: "commenter",
      select: "name picture",
    });

    if (!comment) {
      res.status(400);
      throw new Error("an error has occured");
    }
    res.send(comment);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteComment = expressAsyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      res.status(400);
      throw new Error("an error has occured");
    }
    res.send({ message: "the comment was deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getComments,
  addComment,
  deleteComment,
};
