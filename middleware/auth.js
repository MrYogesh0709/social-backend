import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/customError.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Invalid Authentication");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Invalid Authentication");
  }
};

export default auth;
