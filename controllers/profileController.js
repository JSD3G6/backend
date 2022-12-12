const UserModel = require("../models/User");
const AppError = require("../utils/appError");

exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params; // params : {userId:8}

    // #1 Find User
    let foundedUser = await UserModel.findById({ _id: userId }, { password: 0 });
    if (!foundedUser) {
      throw new AppError("user not found", 404);
    }

    // #2 Calc age
    foundedUser = foundedUser.toObject();
    const now = new Date();
    const nowYr = now.getFullYear();

    const birth = new Date(foundedUser.birthDate);
    const birthYr = birth.getFullYear();
    let age = nowYr - birthYr;
    foundedUser.age = age;

    res.status(200).json({ message: "success", error: false, profile: foundedUser });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  res.status(200).json({ message: "updateProfileFN" });
};

exports.updateImageProfileFromFront = async (req, res, next) => {
  res.status(200).json({ message: "updateImageProfileFromFront" });
};

exports.updateImageProfile = async (req, res, next) => {
  res.status(200).json({ message: "updateImageProfile" });
};
