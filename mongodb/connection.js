const mongoose = require("mongoose");

const connect = async () => {
  try {
    mongoose.set("useNewUrlParser", true);
    await mongoose.connect(process.env.DB_ENDPOINT); // take time, maybe success or failed
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connect };
