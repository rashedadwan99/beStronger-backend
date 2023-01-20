const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  getFollowersList,
  getFollowingList,
  sendFollow,
  sendUnfollow,
  blockUser,
  unBlockUser,
  editUserInfo,
  searchUser,
  getBlockList,
  getPublicUsers,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

router.route("/").post(registerUser).get(auth, searchUser);

router.get("/:userId/followersList", auth, getFollowersList);
router.get("/:userId/followingList", auth, getFollowingList);
router.put("/:reciverUserId/follow", auth, sendFollow);
router.put("/:reciverUserId/unfollow", auth, sendUnfollow);
router.put("/:userId/block", auth, blockUser);
router.put("/:userId/unBlock", auth, unBlockUser);
router.get("/blockList", auth, getBlockList);
router.put("/editUserInfo", auth, editUserInfo);
router.get("/:userId/getUser", auth, getUser);
router.get("/publicUsers", auth, getPublicUsers);
module.exports = router;
