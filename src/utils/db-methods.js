const mongoose = require("mongoose");
const ProductModel = require("../models/product-model");

async function createDocument(item) {
  const product = new ProductModel({
    _id: mongoose.Types.ObjectId(),
    group: item.group,
    name: item.name,
    url: item.url,
    date: Date.now(),
    discount: item.discount,
    currentPrice: item.currentPrice,
    foundByName: item.foundByName,
    arukeresoUrl: item.arukeresoUrl,
  });
  const result = await product.save();

  return JSON.stringify({ product: result });
}

async function updateDocument(item) {
  const product = await ProductModel.updateOne(
    { name: item.name },
    {
      url: item.url,
      currentPrice: item.currentPrice,
      date: Date.now(),
    }
  );

  return JSON.stringify({ product });
}

module.exports = {
  createDocument,
  updateDocument,
};
