const mongoose = require("mongoose");
require("dotenv").config();

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

const URIS = [
  process.env.MONGO_URI_PRIMARY,
  process.env.MONGO_URI_SECONDARY
];

const connectDB = async () => {
  let attempt = 0;
  let uriIndex = 0;

  while (attempt < MAX_RETRIES) {
    const uri = URIS[uriIndex];
    const label = uriIndex === 0 ? "Primary Atlas" : "Secondary Atlas";
    try {
      await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected (${label})`);
      return;
    } catch (err) {
      console.error(`❌ Failed to connect to ${label}:`, err.message);
      attempt++;
      if (attempt >= MAX_RETRIES) {
        console.error("❌ Maximum retry attempts reached. Exiting.");
        process.exit(1);
      }
      uriIndex = 1 - uriIndex; // Switch between 0 and 1
      console.log(`🔄 Retrying in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
    }
  }
};

module.exports = connectDB;

module.exports = connectDB;
