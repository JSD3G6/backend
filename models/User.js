// Model === Class == Object Generator
const mongoose = require("mongoose");

// Define Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["female", "male", "not-specified"],
    required: true,
  },
  bio: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  weeklyGoalCal: {
    type: Number,
  },
});

// Crate Model
const UserModel = mongoose.model("User", UserSchema);

// Export Model for another file use
module.exports = UserModel;
