import jwt from "jsonwebtoken";
import User from "../modals/UserModal.js";
import bcrypt from "bcryptjs";
import { BadRequestError, NotFoundError } from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Provide all credentials");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("Invalid credentials.");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid credentials.");
  }

  const token = jwt.sign(
    { email: user.email, userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );

  const result = { name: user.name, email: user.email, id: user._id };
  res.status(StatusCodes.OK).json({ result, token });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new BadRequestError("Please Provide All credentials");
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new NotFoundError("User already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign(
    { email: user.email, userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
  const result = { name: user.name, email: user.email, id: user._id };

  res.status(StatusCodes.CREATED).json({ result, token });
};
