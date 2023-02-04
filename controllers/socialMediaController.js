const expressAsyncHandler = require("express-async-handler");
const { SocialMedia } = require("../models/SocialMediaModel");

const addSocialMediaLinks = expressAsyncHandler(async (req, res) => {
  try {
    const socialMedia = await SocialMedia.create({
      link: req.body.link,
      app: req.body.app,
    });
    if (!socialMedia) {
      res.status(400);
      throw new Error("an error occured");
    }
    res.send("social media link is added successfully");
  } catch (error) {
    throw new Error(error.message);
  }
});
const getSocialMediaLinks = expressAsyncHandler(async (req, res) => {
  try {
    const socialMedia = await SocialMedia.find();
    if (!socialMedia) {
      res.status(400);
      throw new Error("an error occured");
    }
    res.send(socialMedia);
  } catch (error) {
    throw new Error(error.message);
  }
});
module.exports = {
  addSocialMediaLinks,
  getSocialMediaLinks,
};
