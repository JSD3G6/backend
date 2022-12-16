const Activity = require("../models/Activity");
const AppError = require("../utils/appError");

exports.createActivity = async (req, res, next) => {
  try {
    const activity = req.body;
    if (!activity) {
      throw new AppError("cannot create activity with empty data", 400);
    }
    const newActivity = await Activity.create(activity);
    if (!newActivity) {
      return res.status(400).json();
    }

    res.status(201).json(newActivity);
  } catch (error) {
    next(error);
  }
};
