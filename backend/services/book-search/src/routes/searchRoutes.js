const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
    try {
        const query = {};
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.author) {
            query.author = { $regex: req.query.author, $options: "i" };
        }
        // Tambahin filter lainnya klk mau

        const books = await Book.find(query);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//CREATE INI SEMENTARA, KARENA MAU TAMBAHIN DATA BUANYAK KE DATABASE
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
