const express = require("express");

const auth = require("../middleware/auth");
const { getAllPosts, addPost, getPostsOfExactUser, getOnePost, getPostFans, deletePost, updatePostContent, likePost, disLikePost, getComments, addComment, deleteComment } = require("../controllers/postController");
const router = express.Router();

/**get all posts */ /** add post */
router.route("/").get(auth, getAllPosts).post(auth, addPost);

/**get post of exact user */
router.get("/:userId/userPosts", auth, getPostsOfExactUser);

/** get one post*/
router.get("/:postId/onePost", auth, getOnePost);

/** get post fans */
router.get("/:postId/postFans", auth, getPostFans);
/**delete post */
router.delete("/:postId/deletePost", auth, deletePost);
/**update post content */
router.put("/:postId/updatePostContent", auth, updatePostContent);
/**like the post */
router.put("/:postId/like", auth, likePost);

/** disLike the post */
router.put("/:postId/disLike", auth, disLikePost);
/** get comments */

router.get("/:postId/getComments", auth, getComments);

/** add comment */
router.put("/:postId/addComment", auth, addComment);

/** remove comment */
router.put("/:postId/:commentId/deleteComment", auth, deleteComment);
module.exports = router;
