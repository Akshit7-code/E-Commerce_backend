const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  cartItems: Array,
  paymentMethod: String, // COD or Online
  orderStatus: {
    type: String,
    default: "Pending",
  }
});

module.exports = mongoose.model("Order", orderSchema);
