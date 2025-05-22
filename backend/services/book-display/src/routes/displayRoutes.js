const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
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

router.post("/create", async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
