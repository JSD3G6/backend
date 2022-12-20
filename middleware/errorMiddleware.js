module.exports = (err, req, res, next) => {
  // console.log(Object.keys(err));
  console.log(err.name);

  let statusCode = err.statusCode || 500;
  let message = err.message || "internal server error";

  // JWT
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    console.log("HERE");
    statusCode = 401; // Unauthorize
  }

  // MONGOOSE
  if (err.name === "CastError") {
    statusCode = 400;
    message = `${err.kind} invalid`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  res.status(statusCode).json({ message: message, error: true });
  console.log("AFTER SEND RES");
};
