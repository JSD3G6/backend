const UserModel = require("../models/User");

exports.getUserByEmail = async (email) => {
  // find userBy Email
  const user = await UserModel.findOne({ email });
  return user;
};
