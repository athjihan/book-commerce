// scripts/indexBooks.js
const Book = require("../models/Book");
const esClientPromise = require("../config/elasticsearch");
async function indexAllBooks() {
  try {
    const actualEsClient = await esClientPromise; // <--- TUNGGU PROMISE DI SINI

    const books = await Book.find({});
    console.log(`📚 Mengindeks ${books.length} buku ke Elasticsearch...`);

    const indexExists = await actualEsClient.indices.exists({ index: "books" });
    if (!indexExists) {
      console.log("Indeks 'books' tidak ditemukan, membuat indeks...");
      await actualEsClient.indices.create({ index: "books" });
      console.log("Indeks 'books' berhasil dibuat.");
    }

    for (const book of books) {
      await actualEsClient.index({
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
    console.error("❌ Gagal dalam proses pengindeksan data:", error.message);
    if (error.message.includes("ENOTFOUND") || error.message.includes("Elasticsearch Client gagal permanen")) {
        console.error("Pengindeksan dihentikan karena masalah koneksi ke Elasticsearch.");
    }
  }
}

module.exports = indexAllBooks;