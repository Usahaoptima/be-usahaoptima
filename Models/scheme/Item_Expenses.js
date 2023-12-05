const Mongoose = require("mongoose");

const itemSchema = new Mongoose.Schema({
  item_name: { type: String },
  cost: { type: Number },
  quantity: { type: Number },
  created_date: { type: Date },
  updated_date: { type: String },
  business_id: {
    type: String,
  },
});

const Item = Mongoose.model("Item_Expenses", itemSchema);

module.exports = Item;
