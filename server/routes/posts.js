import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
// grab user fedd when on home page
router.get("/", verifyToken, getFeedPosts);
// جوا صفحة المستخدم يجيب بوستات اليوزر دا بس
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
