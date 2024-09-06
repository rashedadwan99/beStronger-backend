const asyncHandler = require("express-async-handler");
const _ = require("lodash");
const { Notification } = require("../models/notificationModel");
const { Post } = require("../models/postModel");
const { User } = require("../models/userModel");
const getAllPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    const posts = await Post.find({
      $or: [
        { publisher: { $in: user.followingList } },
        { publisher: req.user._id },
      ],
    })
      .sort("-createdAt -comments.createdAt")
      .populate("publisher", "name _id picture");

    res.send(posts);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addPost = asyncHandler(async (req, res) => {
  /** create post object */
  try {
    let post = await Post.create({
      content: req.body["content"],
      picture: req.body["picture"],
      publisher: req.user._id,
    });
    if (!post) {
      res.status(400);
      throw new Error("the post was not published successfully");
    }
    post = await Post.findById(post._id);
    post = await User.populate(post, {
      path: "publisher",
      select: "name picture _id",
    });

    res.send(post);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getPostsOfExactUser = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({
      publisher: req.params.userId,
    })
      .sort("-createdAt")
      .populate("publisher", "name _id picture");

    const blockedMe = await User.findOne({
      $and: [
        {
          _id: req.params.userId,
        },
        { blockList: { $in: req.user._id } },
      ],
    });
    if (blockedMe) return res.status(403).send("you have blocked by this user");
    res.send(posts);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getOnePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.postId })
      .select("-comments")
      .populate("publisher", "name _id picture");
    if (!post) {
      res.status(400);
      throw new Error("the post was not found");
    }
    res.send(post);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getPostFans = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(400);
      throw new Error("the post was not found");
    }
    const postFans = await User.find({
      _id: { $in: post.likes },
    }).select("picture name _id ");
    if (!post) {
      res.status(400);
      throw new Error("the post was not found");
    }
    res.send(postFans);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deletePost = asyncHandler(async (req, res) => {
  try {
    await Notification.deleteMany({ targetId: req.params.postId });
    const post = await Post.findByIdAndRemove(req.params.postId);
    if (!post) {
      res.status(400);
      throw new Error("the post was not found");
    }
    if (req.user._id != post.publisher)
      return res.status(401).send("unauthorized");

    res.send(post);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updatePostContent = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        content: req.body.content,
        picture: req.body.picture,
      },
      {
        new: true,
      }
    ).populate("publisher", "name email _id picture");

    if (!post) {
      res.status(400);
      throw new Error("the post was not found");
    }
    res.send(post);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const likePost = asyncHandler(async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(400);
      throw new Error("the post was deleted");
    }
    if (post.likes.includes(req.user._id)) {
      res.send(400);
      throw new Error("you have already liked this post");
    }
    post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { likes: req.user._id },
        $inc: { numOfLikes: 1 },
      },
      { new: true }
    ).populate("publisher", "name email _id picture");

    if (!post) {
      res.status(400);
      throw new Error("the post was not found");
    }

    res.send(req.user._id);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const disLikePost = asyncHandler(async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(400);
      throw new Error("the post was deleted");
    }
    if (!post.likes.includes(req.user._id)) {
      res.status(400);
      throw new Error("you already have unLiked this post");
    }
    post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { likes: req.user._id },
        $inc: { numOfLikes: -1 },
      },
      { new: true }
    ).populate("publisher", "name email _id picture");
    if (!post) {
      res.status(400);
      throw new Error("the post was not found");
    }

    res.send(req.user._id);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  getAllPosts,
  addPost,
  getPostsOfExactUser,
  getOnePost,
  getPostFans,
  deletePost,
  updatePostContent,
  likePost,
  disLikePost,
};
