const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true, // actual original price
  },
  salePrice: {
    type: Number, // discounted selling price
  },
  description: {
    type: String,
  },
  images: {
    type: [String], // array of image URLs
    default: [],    // default empty array
  },
  category: {
    type: String,
  },
  sizes: {
    type: [String], // array of sizes like ["S", "M", "L", "XL"]
    default: [],
  },
  colors: {
    type: [String], // array of colors like ["White", "Black"]
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MenProduct", productSchema, "MenProduct");
