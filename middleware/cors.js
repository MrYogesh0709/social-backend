export const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, multipart/form-data"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};
