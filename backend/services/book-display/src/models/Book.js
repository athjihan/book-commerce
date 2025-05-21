const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  store_name: String,
  store_phoneNumber: String,
  store_email: String,
  store_address: String,
  store_city: String,
  store_country: String,
}, { _id: false });

const bookSchema = new mongoose.Schema({
  book_type: String,
  serial_number: String,
  title: String,
  author: [String],
  release_date: Date,
  genre: [String],
  synopsis: String,
  description: String,
  price: Number,
  stock: Number,
  cover_url: String,
  store: storeSchema,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BookDisplayP", bookSchema);
