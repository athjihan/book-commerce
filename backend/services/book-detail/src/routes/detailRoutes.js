const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(book);
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
