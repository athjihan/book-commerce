const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const rateLimit = require("express-rate-limit");

// ✅ Middleware: Batasi 100 request per menit per IP
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10000,
    message: {
        status: 429,
        error: "Terlalu banyak permintaan, silakan coba lagi nanti.",
    },
});

router.get("/", limiter, async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json({
            message: "Berhasil mengambil semua data buku",
            data: books
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
