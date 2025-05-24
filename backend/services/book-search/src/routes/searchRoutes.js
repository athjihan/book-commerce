const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const redisClient = require("../config/redis");
const esClient = require("../config/elasticsearch");

router.get("/", async (req, res) => {
  try {
    if (!req.query.title && !req.query.author) {
      return res.status(400).json({ error: "Tidak ada title atau author untuk pencarian." });
    }

    const title = req.query.title?.toLowerCase() || "";
    const author = req.query.author?.toLowerCase() || "";
    const cacheKey = `search:${title}:${author}`;

    // Cek cache Redis
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("📦 Hasil dari cache");
      return res.json(JSON.parse(cached));
    }

    // Coba search Elasticsearch dulu
    try {
      const should = [];
      if (title) {
        should.push({ match: { title } });
      }
      if (author) {
        should.push({ match: { author } });
      }

      const { hits } = await esClient.search({
        index: "books",
        query: {
          bool: {
            should,
          },
        },
      });

      const results = hits.hits.map(hit => hit._source);
      await redisClient.setEx(cacheKey, 604800, JSON.stringify(results));
      console.log("🔍 Hasil dari Elasticsearch");
      return res.json(results);
    } catch (esErr) {
      console.warn("❗ Elasticsearch error, fallback ke MongoDB:", esErr.message);
    }

    // Fallback ke MongoDB jika ES gagal
    const query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (author) query.author = { $regex: author, $options: "i" };

    const books = await Book.find(query);
    await redisClient.setEx(cacheKey, 604800, JSON.stringify(books));
    console.log("📚 Hasil dari MongoDB fallback");
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
