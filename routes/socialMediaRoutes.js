const express = require("express");
const router = express.Router();
const {
  addSocialMediaLinks,
  getSocialMediaLinks,
} = require("../controllers/socialMediaController");
router.route("/").post(addSocialMediaLinks).get(getSocialMediaLinks);
module.exports = router;
