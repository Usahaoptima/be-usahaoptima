const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema({
  expense_name: { type: String },
  total_cost: { type: Number },
  created_date: { type: Date },
  updated_date: { type: String },
});

const Expenses = mongoose.model("Expenses", expensesSchema);

module.exports = Expenses;
