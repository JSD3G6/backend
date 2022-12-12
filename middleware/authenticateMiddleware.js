const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const UserServices = require("../services/UserServices");

module.exports = async (req, res, next) => {
  // do something for authentication

  try {
    // #1 : Extract token from Header
    const { authorization } = req.headers;
    // console.log(authorization);
    if (!authorization || !authorization.startsWith("Bearer")) {
      throw new AppError("unauthenticated", 401);
    }
    const token = authorization.split(" ")[1]; // ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."]
    if (!token) {
      throw new AppError("unauthenticated", 401);
    }

    // #2 : Verify Token
    const privateKey = process.env.JWT_SECRET_KEY || "S3c12et";
    const payload = jwt.verify(token, privateKey); // error : invalid signature => Throw Error

    // #3 Find USER belong userID
    const userId = payload.userId;
    const user = await UserServices.getUserById(userId);
    if (!user) {
      throw new AppError("unauthenticated", 401);
    }
    req.user = user;

    // #4 : call next middleware
    next();
  } catch (error) {
    next(error);
  }
};
