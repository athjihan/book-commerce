const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const maxRetries = 10;
  const retryDelay = 5000; // 5 seconds
  let attempt = 0;
  let usePrimary = true;

  while (attempt < maxRetries) {
    try {
      const uri = usePrimary ? process.env.MONGO_URI_PRIMARY : process.env.MONGO_URI_SECONDARY;
      await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected (${usePrimary ? "Primary" : "Secondary"} Atlas)`);
      return;
    } catch (err) {
      console.error(`❌ Failed to connect to ${usePrimary ? "PRIMARY" : "SECONDARY"}:`, err.message);
      console.error(`Detail error ${usePrimary ? "PRIMARY" : "SECONDARY"}:`, err.stack);
      attempt++;
      if (attempt >= maxRetries) {
        console.error("❌ Maximum retry attempts reached. Exiting process.");
        process.exit(1);
      }
      usePrimary = !usePrimary; // Switch between primary and secondary
      console.log(`🔄 Retrying to connect in 5 seconds... (Attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(res => setTimeout(res, retryDelay));
    }
  }
};

module.exports = connectDB;
