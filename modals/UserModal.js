import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide Your Name"],
      minLength: [2, "Name can not be less than 2 characters"],
      maxLength: [50, "Name can not More than 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      // TODO: Add StrongPassword
      required: [true, "Please provide password"],
      minlength: 6,
    },
    resetPasswordToken: { type: String, default: "" },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
