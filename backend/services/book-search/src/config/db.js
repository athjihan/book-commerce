const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_PRIMARY);
    console.log("✅ MongoDB Connected (Primary Atlas)");
  } catch (errPrimary) {
    console.error("❌ Failed to connect to PRIMARY:", errPrimary.message);
    try {
      await mongoose.connect(process.env.MONGO_URI_SECONDARY);
      console.log("✅ MongoDB Connected (Secondary Atlas)");
    } catch (errSecondary) {
      console.error("❌ Failed to connect to SECONDARY:", errSecondary.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
