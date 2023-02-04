const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const {
  addSocialMediaLinks,
  getSocialMediaLinks,
} = require("../controllers/socialMediaController");
router.route("/").post(addSocialMediaLinks).get(getSocialMediaLinks);
module.exports = router;
// [auth,admin],
