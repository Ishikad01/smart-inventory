const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be negative"],
  },
  category: {
    type: String,
    default: "General",
  },
  imageUrl: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);