const UserModel = require("../models/User");
const AppError = require("../utils/appError");

const validateRouteParamsWithUserID = (user, checkId) => {
  let id = user._id.toString();
  if (id !== checkId) {
    throw new AppError("forbidden", 403);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params; // params : {userId:8}
    const user = req.user.toObject();

    // #1 Validate userId === user._id (founded by token payload)
    validateRouteParamsWithUserID(user, userId);

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
  try {
    // #1 Extract Input from Request
    const { userId } = req.params;
    const { ...changeProfileField } = req.body; // object destruct + rest syntax (rest of field)
    const user = req.user.toObject();

    // #2 Validate
    validateRouteParamsWithUserID(user, userId);

    // #3 Update
    const newProfileUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      { ...changeProfileField },
      { new: true, fields: { password: 0 }, runValidators: true }
    );

    // # LastStep
    // const newProfileUpdated = { ...user, ...changeProfileField };
    res
      .status(200)
      .json({ message: "profile detail updated", error: false, profile: newProfileUpdated });
  } catch (error) {
    next(error);
  }
};

exports.updateImageProfile = async (req, res, next) => {
  res.status(200).json({ message: "updateImageProfile" });
};
