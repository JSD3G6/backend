const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.DB_ENDPOINT); // take time, maybe success or failed
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };
