const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const redisClient = require("../config/redis");

router.get("/", async (req, res) => {
  try {
    const query = {};

    if (!req.query.title && !req.query.author) {
      return res.status(400).json({ error: "Tidak ada title atau author untuk pencarian." });
    }

    const title = req.query.title?.toLowerCase() || "";
    const author = req.query.author?.toLowerCase() || "";
    const cacheKey = `search:${title}:${author}`;

    // Cek cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("📦 Hasil dari cache");
      return res.json(JSON.parse(cached));
    }

    // Validasi input title
    if (req.query.title && typeof req.query.title === "string") {
      if (req.query.title.length > 100) {
        return res.status(400).json({ error: "Judul terlalu panjang." });
      }
      query.title = { $regex: req.query.title, $options: "i" };
    }

    // Validasi input author
    if (req.query.author && typeof req.query.author === "string") {
      if (req.query.author.length > 100) {
        return res.status(400).json({ error: "Nama penulis terlalu panjang." });
      }
      query.author = { $regex: req.query.author, $options: "i" };
    }

    const books = await Book.find(query);

    await redisClient.setEx(cacheKey, 604800, JSON.stringify(books));

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
