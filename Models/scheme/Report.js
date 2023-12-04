const Mongoose = require("mongoose");

var Schema = new Mongoose.Schema({
  total_amount: {
    type: Number,
    required: true,
    trim: true,
  },
  criteria: {
    type: String,
    enum: ["pengeluaran", "pemasukan"],
    default: "pemasukan",
  },
  create_at: {
    type: Date,
  },
  report_id: {
    type: String,
  },
  business_id: {
    type: String,
  },
});

const Report = Mongoose.model("Report", Schema);

module.exports = Report;
