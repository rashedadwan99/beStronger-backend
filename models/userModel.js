const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      match: [emailPattern, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 1024,
    },

    isAdmin: { type: Boolean, default: false },
    isNutritionist: { type: Boolean, default: false },
    isTrainer: { type: Boolean, default: false },
    bio: { type: String, default: "" },
    picture: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    followersNum: { type: Number, default: 0, min: 0 },
    followingNum: { type: Number, default: 0, min: 0 },
    blockList: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    followingList: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    followersList: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      isNutritionist: this.isNutritionist,
      isTrainer: this.isTrainer,
      email: this.email,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("User", userSchema);
const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(3).max(20).required().label("name"),
    email: Joi.string().regex(emailPattern).required().label("email"),
    password: Joi.string().min(5).max(1024).required().label("password"),
    password2: Joi.string().min(5).max(1024).required().label("password2"),
  };
  const { error } = Joi.validate(user, schema);
  return error;
};

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validate = validateUser;
