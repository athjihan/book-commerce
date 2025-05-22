const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const app = express();
const connectDB = require("./config/db");
const bookRoutes = require("./routes/searchRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (/^\$/.test(key) || /\./.test(key)) {
        delete obj[key];
      }
    }
  };
  sanitize(req.body);
  sanitize(req.params);
  sanitize(req.query); // Tidak overwrite req.query, hanya bersihkan properti di dalamnya
  next();
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
});
app.use(limiter);

app.use(express.json());

app.use("/api/search", bookRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Book-search service running on port ${PORT} 🔍`);
  });
});
