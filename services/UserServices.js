const UserModel = require("../models/User");

exports.getUserByEmail = async (email) => {
  // find userBy Email
  const user = await UserModel.findOne({ email });
  return user;
};

exports.getUserById = async (userId) => {
  const user = await UserModel.findById({ _id: userId }, { password: 0 });
  return user;
};

exports.findOneAndUpdateUserId = async (userId, changeProfileField) => {
  const newUpdatedUser = await UserModel.findOneAndUpdate(
    { _id: userId },
    { ...changeProfileField },
    { new: true, fields: { password: 0 }, runValidators: true }
  );
  return newUpdatedUser;
};
