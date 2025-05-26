const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const app = express();
const connectDB = require("./config/db");
const connectRabbitMQ = require("./config/rabbitmq");
const bookRoutes = require("./routes/searchRoutes");
const indexAllBooks = require("./scripts/indexBooks");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(cors());

connectRabbitMQ();

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
  sanitize(req.query);
  next();
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10000,
  message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
});
app.use(limiter);

app.use(express.json());

app.use("/api/search", bookRoutes);

connectDB().then(async () => {
  try {
    await indexAllBooks(); // Indeks semua buku ke Elasticsearch saat startup
    console.log("📚 Berhasil mengindeks semua buku ke Elasticsearch.");
  } catch (error) {
    console.error("❌ Gagal mengindeks buku ke Elasticsearch:", error);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Book-search service running on port ${PORT} 🔍`);
  });
});
