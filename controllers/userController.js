import { BadRequestError } from "../errors/customError.js";
import User from "../modals/UserModal.js";
import {
  invoiceTemplateForForgotPassword,
  invoiceTemplateForResetPassWord,
  sendMail,
} from "../utils/nodeMailerConfig.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";

export const forgotPasswordRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please enter email");
  }
  const user = await User.findOne({ email: email });
  console.log(user);
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    const tenMinutes = 1000 * 60 * 10;
    const resetURL = `${process.env.ORIGIN}/reset-password?token=${token}&email=${email}`;
    const subject = "Reset password Social";
    const html = invoiceTemplateForForgotPassword({
      user,
      expirationTime: tenMinutes,
      resetURL,
    });
    sendMail({ to: email, subject, html });
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.resetPasswordToken = token;
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your Email for Reset Password " });
};

export const resetPassword = async (req, res) => {
  const { email, token, password, confirmPassword } = req.body;
  if (!token || !email || !password || !confirmPassword) {
    throw new BadRequestError("Please provide all values");
  }
  if (password !== confirmPassword) {
    throw new BadRequestError("Password Does not match");
  }
  const user = await User.findOne({ email: email, resetPasswordToken: token });
  const currentDate = new Date();
  if (!user || user.passwordTokenExpirationDate < currentDate) {
    throw new BadRequestError("Invalid Request try again...");
  }
  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.passwordTokenExpirationDate = null;
    await user.save();
    const subject = "Password Changed for Social.";
    const html = invoiceTemplateForResetPassWord(user);
    sendMail({ to: email, subject, html });
    res.status(StatusCodes.OK).json({ msg: "Password Reset Successful" });
  } else {
    throw new BadRequestError("Invalid Request try again...");
  }
};
