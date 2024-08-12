const asyncHandler = require("express-async-handler");
const _ = require("lodash");
const bcrybt = require("bcrypt");
const { User } = require("../models/userModel");
const { Post } = require("../models/postModel");
const bcrypt = require("bcrypt");

const registerUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400);
      throw new Error("the user already exists");
    }
    user = await new User(_.pick(req.body, ["name", "email", "password"]));
    hashPassword(user);
    const token = user.generateAuthToken();
    await user.save();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(
        _.pick(user, [
          "_id",
          "name",
          "email",
          "picture",
          "followersNum",
          "followingNum",
          "followingList",
          "followersList",
        ])
      );
  } catch (error) {
    throw new Error(error.message);
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      res.status(400);
      throw new Error("the user with the given id was not found");
    }
    res.send(user);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getFollowersList = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("user was not found!");
    const followersusers = await User.find({
      _id: { $in: user.followersList },
    }).select("picture name _id followingList");
    res.send(followersusers);
  } catch (error) {
    throw new Error(error.message);
  }
});
const getFollowingList = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("user was not found!");
    const followingsusers = await User.find({
      _id: { $in: user.followingList },
    }).select("picture name _id followingList");
    res.send(followingsusers);
  } catch (error) {
    throw new Error(error.message);
  }
});

const sendFollow = asyncHandler(async (req, res) => {
  try {
    let senderUser = await User.findById(req.user._id);
    let reciverUser = await User.findOne({ _id: req.params.reciverUserId });

    if (!senderUser || !reciverUser) {
      res.status(400);
      throw new Error("the user was not found");
    }
    if (reciverUser.blockList.includes(senderUser._id)) {
      res.status(400);
      throw new Error("you have been blocked by this user");
    }
    if (senderUser.blockList.includes(reciverUser._id)) {
      res.status(400);
      throw new Error("you have blocked this user");
    }
    if (senderUser.followingList.includes(req.params.reciverUserId)) {
      res.status(400);
      throw new Error("you already have followed this user");
    }

    reciverUser = await User.findByIdAndUpdate(
      req.params.reciverUserId,
      {
        $push: {
          followersList: req.user._id,
        },
        $inc: { followersNum: 1 },
      },
      { new: true }
    );

    senderUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          followingList: reciverUser._id,
        },
        $inc: { followingNum: 1 },
      },
      { new: true }
    );
    res.send({ reciverUser, senderUser });
  } catch (error) {
    throw new Error(error.message);
  }
});

const sendUnfollow = asyncHandler(async (req, res) => {
  try {
    let senderUser = await User.findById(req.user._id);
    let reciverUser = await User.findById(req.params.reciverUserId);

    if (!senderUser || !reciverUser) {
      res.status(400);
      throw new Error("the user was not found");
    }
    if (reciverUser.blockList.includes(senderUser._id)) {
      res.status(400);
      throw new Error("you have been blocked by this user");
    }
    if (senderUser.blockList.includes(reciverUser._id)) {
      res.status(400);
      throw new Error("you have blocked this user");
    }
    if (!senderUser.followingList.includes(req.params.reciverUserId)) {
      res.status(400);
      throw new Error("you already have unfollowed this user");
    }

    reciverUser = await User.findByIdAndUpdate(
      req.params.reciverUserId,
      {
        $pull: {
          followersList: req.user._id,
        },
        $inc: { followersNum: -1 },
      },
      { new: true }
    );

    senderUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          followingList: reciverUser._id,
        },
        $inc: { followingNum: -1 },
      },
      { new: true }
    );

    res.send({ reciverUser, senderUser });
  } catch (error) {
    throw new Error(error.message);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    let targetUser = await User.findById(req.params.userId);
    if (!user || !targetUser) {
      res.status(400);
      throw new Error("the user was not found");
    }
    const isFollowingMe = await User.find({
      _id: targetUser._id,
      followingList: { $elemMatch: { $eq: user._id } },
    });
    const isFollowingHimHer = await User.find({
      _id: user._id,
      followingList: { $elemMatch: { $eq: targetUser._id } },
    });
    const isBlocked = await User.find({
      _id: req.user._id,
      blockList: { $elemMatch: { $eq: req.params.userId } },
    });

    if (isBlocked.length) {
      res.status(400);
      throw new Error("you already have blocked this user");
    }
    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          blockList: req.params.userId,
        },
      },
      {
        new: true,
      }
    );
    if (isFollowingHimHer.length) {
      user = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: {
            followingList: targetUser._id,
          },
          $inc: { followingNum: -1 },
        },
        { new: true }
      );
      targetUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: {
            followersList: user._id,
          },
          $inc: { followersNum: -1 },
        },
        {
          new: true,
        }
      );
    }
    if (isFollowingMe.length) {
      getUser = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: {
            followersList: targetUser._id,
          },
          $inc: { followersNum: -1 },
        },
        { new: true }
      );
      targetUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: {
            followingList: user._id,
          },
          $inc: { followingNum: -1 },
        },
        { new: true }
      );
    }

    await Post.updateMany(
      {
        publisher: targetUser._id,
        "comments.commenter": user._id,
      },
      {
        $pull: {
          comments: { commenter: { $in: user._id } },
        },
      }
    );
    const allTargetUserPosts = await Post.find({ publisher: user._id });
    const posts = allTargetUserPosts.filter(
      (p) => p.numOfComments !== p.comments.length
    );
    posts.map(async (p) => {
      await Post.findByIdAndUpdate(p._id, {
        numOfComments: p.comments.length,
      });
    });

    res.send(user);
  } catch (error) {
    throw new Error(error.message);
  }
});

const unBlockUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          blockList: req.params.userId,
        },
      },
      {
        new: true,
      }
    );

    res.send(user);
  } catch (error) {
    throw new Error(error.message);
  }
});

const editUserInfo = asyncHandler(async (req, res) => {
  try {
    const { name, picture } = req.query;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        picture,
      },
      { new: true }
    ).select("-password");
    if (!user) {
      res.status(400);
      throw new Error("error occured");
    }
    const posts = await Post.find({ publisher: req.user._id })
      .populate("publisher", "name _id picture")
      .sort("-createdAt");
    res.send({ user, posts });
  } catch (error) {
    throw new Error(error.message);
  }
});

const searchUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({
      $and: [
        {
          $or: [
            {
              name: { $regex: req.query.searchQuery.toString(), $options: "i" },
            },
            {
              email: {
                $regex: req.query.searchQuery.toString(),
                $options: "i",
              },
            },
          ],
        },
        { _id: { $ne: req.user._id } },
      ],
    }).select("email name picture");
    if (!users) {
      res.status(400);
      throw new Error("searching failed");
    }
    res.send(users);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getBlockList = asyncHandler(async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.user._id })
      .select("blockList -_id")
      .populate("blockList", "name picture");
    if (!users) {
      res.status(400);
      throw new Error("failed to get block list");
    }
    res.send(users);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getPublicUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        { $or: [{ isNutritionist: true }, { isTrainer: true }] },
      ],
    }).select("picture name followingList followersList");

    res.send(users);
  } catch (error) {
    throw new Error(error.message);
  }
});
const changePassword = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    const { oldPassword, newPassword1, newPassword2 } = req.body;

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      res.status(400);
      throw new Error("invalid password");
    }
    if (newPassword1 !== newPassword2) {
      res.status(400);
      throw new Error("the new passwords aren't the same");
    }
    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: newPassword1,
      },
      {
        new: true,
      }
    );
    hashPassword(user);

    res.send({ message: "the password is changed successfully !" });
  } catch (error) {
    throw new Error(error.message);
  }
});
async function hashPassword(user) {
  const salt = await bcrybt.genSalt(10);
  user.password = await bcrybt.hash(user.password, salt);
  await user.save();
}
module.exports = {
  registerUser,
  getUser,
  getFollowersList,
  getFollowingList,
  sendFollow,
  sendUnfollow,
  blockUser,
  unBlockUser,
  changePassword,
  searchUser,
  getBlockList,
  getPublicUsers,
  editUserInfo,
};
