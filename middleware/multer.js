import multer from "multer";
import { BadRequestError } from "../errors/customError.js";

const storage = multer.diskStorage({});

const upload = multer({ storage });

const uploadMiddleware = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        throw new BadRequestError("Error to upload file");
      }
      next();
    });
  };
};

export default uploadMiddleware;
