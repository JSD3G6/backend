const { findEndDayOfMonth } = require("./date");

const genArrayLinearChart = (type, dateInMonth) => {
  // dateInMonth is Optional in type == week or year
  let length;
  if (type === "week") length = 7;
  if (type === "month") length = findEndDayOfMonth(dateInMonth);
  if (type === "year") length = 12;
  return Array.from({ length }).fill(0);
};

module.exports = {
  genArrayLinearChart,
};
