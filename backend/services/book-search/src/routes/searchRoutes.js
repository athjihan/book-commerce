const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const redisClient = require("../config/redis");
const esClientPromise = require("../config/elasticsearch");

router.get("/", async (req, res) => {
  let actualEsClient;
  try {
    try {
      actualEsClient = await esClientPromise;
    } catch (initError) {
      console.error("🔴 Gagal menginisialisasi koneksi ke Elasticsearch:", initError.message);
      return await fallbackToMongo(req, res);
    }

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

    try {
      const should = [];
      if (title) {
        should.push({
          match: {
            title: {
              query: title,
              operator: "or",
              fuzziness: "AUTO"
            }
          }
        });
      }
      if (author && author.trim() !== "") {
        should.push({
          multi_match: {
            query: author,
            type: "text",
            fields: ["author"],
            operator: "or"
          }
        });
      }


      if (should.length === 0) {
        console.log("Tidak ada kriteria pencarian valid untuk Elasticsearch, fallback ke MongoDB.");
        return await fallbackToMongo(req, res, cacheKey);
      }

      const esResponse = await actualEsClient.search({
        index: "books",
        query: {
          bool: {
            should,
            minimum_should_match: 1
          },
        },
      });

      const results = esResponse.hits.hits.map(hit => hit._source);
      await redisClient.setEx(cacheKey, 604800, JSON.stringify(results));
      console.log("🔍 Hasil dari Elasticsearch");
      return res.json(results);
    } catch (esErr) {
      console.warn("❗ Elasticsearch error saat pencarian, fallback ke MongoDB:", esErr.message);
      if (esErr.meta && esErr.meta.body) {
        console.error("Detail error Elasticsearch:", JSON.stringify(esErr.meta.body, null, 2));
      }
      return await fallbackToMongo(req, res, cacheKey);
    }

  } catch (err) {
    console.error("❌ Error pada handler pencarian utama:", err);
    res.status(500).json({ error: "Terjadi kesalahan internal pada server." });
  }
});

async function fallbackToMongo(req, res, cacheKey) {
  try {
    console.log("📚 Melakukan fallback pencarian ke MongoDB...");
    const title = req.query.title?.toLowerCase() || "";
    const author = req.query.author?.toLowerCase() || "";

    const query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (author) {
      query.author = { $elemMatch: { $regex: author, $options: "i" } };
    }

    const books = await Book.find(query);
    if (cacheKey) {
      await redisClient.setEx(cacheKey, 604800, JSON.stringify(books));
    }
    console.log("📚 Hasil dari MongoDB fallback");
    if (!res.headersSent) {
      return res.json(books);
    }
  } catch (mongoErr) {
    console.error("❌ Error saat fallback ke MongoDB:", mongoErr);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Terjadi kesalahan saat fallback ke MongoDB." });
    }
  }
}

module.exports = router;