// scripts/indexBooks.js
const Book = require("../models/Book");
const esClient = require("../config/elasticsearch");

async function indexAllBooks() {
  try {
    const books = await Book.find({});
    console.log(`📚 Mengindeks ${books.length} buku ke Elasticsearch...`);

    for (const book of books) {
      await esClient.index({
        index: "books",
        id: book._id.toString(),
        document: {
          title: book.title,
          author: book.author,
          description: book.description,
        },
      });
    }

    console.log("✅ Semua buku berhasil diindeks ke Elasticsearch.");
  } catch (error) {
    console.error("❌ Gagal mengindeks data:", error.message);
  }
}

module.exports = indexAllBooks;
