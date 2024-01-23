import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";
import postRoutes from "./routes/postRoute.js";
import authRoutes from "./routes/authRoute.js";
import { connectDB } from "./config/db.js";
import {
  errorHandlerMiddleware,
  notFoundMiddleware,
} from "./middleware/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { corsOptions } from "./config/corsOptions.js";
import { corsMiddleware } from "./middleware/cors.js";

const app = express();
dotenv.config();

app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(corsMiddleware);
app.use(cors(corsOptions));
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(helmet());
app.use(xss());

//v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`connected to port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
