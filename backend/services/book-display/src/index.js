const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const bookRoutes = require("./routes/displayRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/catalog", bookRoutes);

// Start server
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Book service running on port ${PORT} 🚀`);
  });
});