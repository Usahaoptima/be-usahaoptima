const Mongoose = require("mongoose");

var Schema = new Mongoose.Schema({
  productId: { type: String },
  product_name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  created_date: { type: Date },
  updated_date: { type: String },
});

const Product = Mongoose.model("Product", Schema);

module.exports = Product;
