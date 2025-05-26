const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const cache = require("../config/cache");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10000,
  message: "Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.",
  standardHeaders: true,
  legacyHeaders: false,
});
router.get("/:serial_number/:book_type", limiter, async (req, res) => {

  const { serial_number, book_type } = req.params;

  if (!serial_number || !book_type) {
    return res.status(400).json({ error: "Serial number dan book_type wajib diisi di path URL." });
  }

  const cacheKey = `book-detail:${serial_number}:${book_type}`;

  try {
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      console.log(`📦 [Backend] Data detail buku dari cache: ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`🔍 [Backend] Mencari buku di DB dengan serial_number: '${serial_number}', book_type: '${book_type}'`);
    const book = await Book.findOne({
      serial_number: serial_number,
      book_type: book_type,
    });

    if (!book) {
      console.log(`❌ [Backend] Buku tidak ditemukan untuk serial_number: '${serial_number}', book_type: '${book_type}'`);
      return res.status(404).json({ error: "Buku tidak ditemukan" });
    }

    await cache.setEx(cacheKey, 604800, JSON.stringify(book));
    console.log(`✅ [Backend] Buku ditemukan dan disimpan ke cache: ${cacheKey}`);
    res.json(book);

  } catch (err) {
    console.error("🚨 [Backend] Error saat mengambil detail buku:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server saat memproses permintaan Anda." });
  }
});

module.exports = router;