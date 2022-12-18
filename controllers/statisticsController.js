const ActivityModel = require("../models/Activity");
const AppError = require("../utils/appError");
const validateUtils = require("../utils/validate");
const dateUtils = require("../utils/date");

exports.getStatistics = async (req, res, next) => {
  try {
    const user = req.user.toObject();
    const { activityType, duration = "week", date } = req.query; // activityType = undefined === allType

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
    let searchDayObj = date ? new Date(date) : new Date(); // UTC:000 : UTC with SpecificTime
    // searchDay = searchDay.toISOString().split("T")[0]; // YYYY-MM-DD
    if (duration === "week") {
      [start, end] = dateUtils.findWeekInterval(searchDayObj);
    } else if (duration === "month") {
      [start, end] = dateUtils.findMonthInterval(searchDayObj);
    } else if (duration === "year") {
      [start, end] = dateUtils.findYearInterval(searchDayObj);
    }
    console.log("START", start);
    console.log("END", end);
    filterCondition.dateTime = {
      $gte: new Date(`${start}T00:00:00.000+0700`),
      $lt: new Date(`${end}T00:00:00.000+0700`),
    };

    const activityLists = await ActivityModel.find(filterCondition);
    res.status(200).json({ message: "get stat", activityLists });
  } catch (error) {
    next(error);
  }
};
