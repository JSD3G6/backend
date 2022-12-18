const ActivityModel = require("../models/Activity");
const AppError = require("../utils/appError");
const validateUtils = require("../utils/validate");
const dateUtils = require("../utils/date");

exports.getStatistics = async (req, res, next) => {
  try {
    const user = req.user.toObject();
    const { activityType, duration = "week", range } = req.query; // activityType = undefined === allType

    let filterCondition = { userId: user._id };
    // filter condition
    // 1.By userId
    // 2.By type
    // 3.By time {dateTime : {$gte: "2022-10-12", $lte: new Date()}}
    //   - day : complete
    //   - month :
    //   - year :
    //   - range :

    if (activityType) {
      let { errorMessage } = validateUtils.validateType(activityType);
      if (errorMessage) throw new AppError(errorMessage, 400);
      filterCondition.type = activityType; //{type:"running"}
    }

    let start, end;
    let searchDay = new Date(); // UTC
    searchDay = searchDay.toISOString().split("T")[0]; // YYYY-MM-DD
    if (duration === "week") {
      [start, end] = dateUtils.findWeekInterval(searchDay);
    } else if (duration === "month") {
      [start, end] = dateUtils.findMonthInterval(searchDay);
    } else if (duration === "year") {
      [start, end] = dateUtils.findYearInterval(searchDay);
    }

    filterCondition.dateTime = {
      $gte: new Date(start),
      $lte: new Date(end),
    };

    const activityLists = await ActivityModel.find(filterCondition);
    res.status(200).json({ message: "get stat", activityLists });
  } catch (error) {
    next(error);
  }
};
