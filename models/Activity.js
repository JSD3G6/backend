const mongoose = require("mongoose");
const ACTIVITY_CONST = require("../constant/activityType");

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ACTIVITY_CONST.NAME,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  durationMin: {
    type: Number,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  distanceKM: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  photo: {
    type: String,
  },
  caloriesBurnedCal: {
    type: Number,
    required: true,
  },
});

const ActivityModel = mongoose.model("Activity", ActivitySchema);

module.exports = ActivityModel;
