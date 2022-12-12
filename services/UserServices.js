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
