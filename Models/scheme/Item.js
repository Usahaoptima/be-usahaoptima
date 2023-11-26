const Mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(Mongoose);

const itemSchema = new Mongoose.Schema({
  // no: { type: Number },
  item_name: { type: String },
  total_cost: { type: Number },
  quantity: { type: Number },
  created_date: { type: Date },
  updated_date: { type: String },
});

// itemSchema.plugin(AutoIncrement, { inc_field: "no" });

const Item = Mongoose.model("Item", itemSchema);

module.exports = Item;
