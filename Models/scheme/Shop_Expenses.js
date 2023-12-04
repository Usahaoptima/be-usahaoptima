const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema({
  expense_name: { type: String },
  cost: { type: Number },
  total_cost: { type: Number },
  created_date: { type: Date },
  updated_date: { type: String },
  business_id: {
    type: String,
  },
});

const Expenses = mongoose.model("Shop_Expenses", expensesSchema);

module.exports = Expenses;
