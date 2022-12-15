const fs = require("fs");
const UserModel = require("../models/User");
const AppError = require("../utils/appError");
const cloudinaryUtil = require("../utils/cloudinary");

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
  try {
    console.log(req.file);
    // #1 Validate userId inParam with userId from Token
    const { userId } = req.params;
    const user = req.user.toObject();
    validateRouteParamsWithUserID(user, userId);

    // #2 Check file exist
    if (!req.file) {
      throw new AppError("image profile is required", 400);
    }

    // #3 Upload to Cloudinary
    let oldPhotoUrl = user.profilePhoto;
    let publicId; // undefined
    if (oldPhotoUrl) {
      publicId = cloudinaryUtil.getPublicId(oldPhotoUrl); // cr4mxeqx5zb8rlakpfkg, ""
    }
    const secure_url = await cloudinaryUtil.upload(req.file.path, publicId); // " cr4mxeqx5zb8rlakpfkg", undefined

    // #4 Save URL TO mongoDB in own user Record
    const newProfileUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      { profilePhoto: secure_url },
      { new: true, fields: { password: 0 }, runValidators: true }
    );

    // #5 response
    res
      .status(200)
      .json({ message: "updateImageProfile", profilePhoto: newProfileUpdated.profilePhoto });
  } catch (error) {
    next(error);
  } finally {
    // #6 remove pic file from local machine
    fs.unlinkSync(req.file.path);
  }
};
