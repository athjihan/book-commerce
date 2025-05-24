const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const consumeEvent = require("./config/consumer");
const bookRoutes = require("./routes/detailRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/detail", bookRoutes);

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Book service running on port ${PORT} 🚀`);
  });
  console.log("📡 [book-detail] Service is ready to consume events...");
  consumeEvent();
});