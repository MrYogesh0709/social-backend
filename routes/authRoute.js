import express from "express";
import { signIn, signup } from "../controllers/authController.js";
import {
  forgotPasswordRequest,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/signin").post(signIn);
router.route("/signup").post(signup);
router.route("/forgot-password").post(forgotPasswordRequest);
router.route("/reset-password").post(resetPassword);

export default router;
