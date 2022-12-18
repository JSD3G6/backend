const findWeekInterval = (date) => {
  let dateInLocale = `${date} GMT+07:00`;
  const now = new Date(dateInLocale);
  now;
  const MS_IN_DAY = 86400 * 1000;

  let dayInWeek = now.getDay(); // 3 เขยิบมา 3 วัน
  const mySundayTime = now.getTime() - MS_IN_DAY * dayInWeek;
  const mySaturdayTime = now.getTime() + MS_IN_DAY * (6 - dayInWeek);

  const sunday = new Date(mySundayTime); // gte
  const saturday = new Date(mySaturdayTime); // lte
  const start = sunday.toLocaleString().split(", ")[0];
  const end = saturday.toLocaleString().split(", ")[0];
  return [start, end];
};

module.exports = { findWeekInterval };
