const Mongoose = require("mongoose");

var Schema = new Mongoose.Schema({
  sales_name: { type: String },
  product_id: { type: Mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number },
  total_price: { type: Number },
  created_date: { type: Date },
  updated_date: { type: String },
});

const Sales = Mongoose.model("Sales", Schema);

module.exports = Sales;