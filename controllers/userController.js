import { BadRequestError } from "../errors/customError.js";
import User from "../modals/UserModal.js";
import { sendMail } from "../utils/nodeMailerConfig.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { origin } from "../utils/origin.js";
import { StatusCodes } from "http-status-codes";

export const forgotPasswordRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please enter email");
  }
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    //TODO:CHANGE THIS
    const resetURL = `${origin}/reset-password?token=${token}&email=${email}`;
    const subject = "reset password for Social";
    const html = `<p>Please reset password by clicking on the following link : <a href="${resetURL}">Reset Password</a></p>`;

    await sendMail({ to: email, subject, html });
    const tenMinutes = 1000 * 60 * 10;
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
  if (user.passwordTokenExpirationDate < currentDate) {
    throw new BadRequestError("Invalid Request try again...");
  }
  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.passwordTokenExpirationDate = null;
    await user.save();
    const subject = "Password Changed for Social";
    const html = `<p>Your Password has been changed</p>`;
    await sendMail({ to: email, subject, html });
    res.status(StatusCodes.OK).json({ msg: "Password Reset Successful" });
  } else {
    throw new BadRequestError("Invalid Request try again...");
  }
};
