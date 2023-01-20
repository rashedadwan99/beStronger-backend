const asyncHandler = require("express-async-handler");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const authUser = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body["email"] });
  if (!user) return res.status(400).send({message:"invalid email or password"});
  const validPassword = await bcrypt.compare(
    req.body["password"],
    user.password
  );
  if (!validPassword) return res.status(400).send({ message: "invalid email or password" });
  const token = user.generateAuthToken();
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
});

module.exports = {
  authUser,
};
