const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const staffSchema = new mongoose.Schema({
  // no: { type: Number },
  staff_name: { type: String },
  salary: { type: Number },
  email: { type: String },
  phone_number: { type: String },
  created_date: { type: Date },
  updated_date: { type: Date },
  business_id: {
    type: String,
  },
});

// staffSchema.plugin(AutoIncrement, { inc_field: "no" });

const Staff = mongoose.model("Staff_Expenses", staffSchema);

module.exports = Staff;
