const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  group: String,
  name: String,
  url: String,
  date: Number,
  discount: Number,
  currentPrice: Number,
  foundByName: String,
});

module.exports = mongoose.model("Product", productSchema, "products");
