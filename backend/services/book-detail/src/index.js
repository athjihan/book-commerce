const express = require("express");
const app = express();
const connectDB = require("./config/db");
const bookRoutes = require("./routes/detailRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/detail", bookRoutes);

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Book service running on port ${PORT} 🚀`);
  });
});
