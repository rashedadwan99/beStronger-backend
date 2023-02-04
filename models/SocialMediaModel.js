const mongoose = require("mongoose");
const socialMediaSchema = new mongoose.Schema({
  link: { type: String, required: true },
  app: { type: String, required: true },
});
const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema);
module.exports = {
  socialMediaSchema,
  SocialMedia,
};
