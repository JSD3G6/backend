const UserModel = require("../models/User");
const AppError = require("../utils/appError");

exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params; // params : {userId:8}
    const user = req.user.toObject();

    // #1 Validate userId === user._id (founded by token payload)
    let id = user._id.toString();
    if (id !== userId) {
      throw new AppError("forbidden", 403);
    }

    // #2 Calc age
    const now = new Date();
    const nowYr = now.getFullYear();

    const birth = new Date(user.birthDate);
    const birthYr = birth.getFullYear();
    const age = nowYr - birthYr;
    user.age = age;

    res.status(200).json({ message: "success", error: false, profile: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  const { ...changeProfileField } = req.body;
  console.log(changeProfileField);
  res.status(200).json({ message: "updateProfileFN" });
};

exports.updateImageProfileFromFront = async (req, res, next) => {
  res.status(200).json({ message: "updateImageProfileFromFront" });
};

exports.updateImageProfile = async (req, res, next) => {
  res.status(200).json({ message: "updateImageProfile" });
};
