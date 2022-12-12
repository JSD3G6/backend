module.exports = (err, req, res, next) => {
  // console.log(Object.keys(err));

  if (err.name === "CastError") {
    res.status(400).json({ message: `${err.kind} invalid`, error: true });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({ message: message, error: true });
};
