const mongoose = require("mongoose");
require("dotenv").config();

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

const connectDB = async () => {
  let retries = 0;
  let usePrimary = true;

  while (retries < MAX_RETRIES) {
    const uri = usePrimary ? process.env.MONGO_URI_PRIMARY : process.env.MONGO_URI_SECONDARY;
    const label = usePrimary ? "Primary Atlas" : "Secondary Atlas";
    try {
      await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected (${label})`);
      return;
    } catch (err) {
      console.error(`❌ Failed to connect to ${label}:`, err.message);
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error("❌ Maximum retry attempts reached. Exiting...");
        process.exit(1);
      }
      usePrimary = !usePrimary; // Switch between primary and secondary
      console.log(`🔄 Retrying in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
    }
  }
};

module.exports = connectDB;
