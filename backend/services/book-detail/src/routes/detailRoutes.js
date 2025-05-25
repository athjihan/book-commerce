const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const cache = require("../config/cache");
const { param, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: "Terlalu banyak permintaan, silakan coba lagi nanti.",
});

const validateId = [
    param("id")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid book ID format"),
];

router.get("/:serial_number/:book_type", async (req, res) => {
    const { serial_number, type } = req.query;

    if (!serial_number && !type) {
        return res.status(400).json({ error: "serial_number dan type wajib diisi" });
    }

    const cacheKey = `book-detail:${serial_number}:${type}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }

    try {
        const book = await Book.findOne({
            serial_number,
            book_type,
        });

        if (!book) {
            return res.status(404).json({ error: "Buku tidak ditemukan" });
        }

        await cache.setEx(cacheKey, 604800, JSON.stringify(book)); // cache 7 hari
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
