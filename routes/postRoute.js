import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getPost,
  likePost,
  updatePost,
  commentPost,
} from "../controllers/postController.js";
import auth from "../middleware/auth.js";
import uploadMiddleware from "../middleware/multer.js";

const router = express.Router();

router
  .route("/")
  .get(getPosts)
  .post(auth, uploadMiddleware("selectedFile"), createPost);

router
  .route("/:postId")
  .get(getPost)
  .patch(auth, updatePost)
  .delete(auth, deletePost);

router.patch("/:postId/likePost", auth, likePost);
router.patch("/:postId/commentPost", auth, commentPost);

export default router;
