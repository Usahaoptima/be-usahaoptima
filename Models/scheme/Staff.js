const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const staffSchema = new mongoose.Schema({
  // no: { type: Number },
  staff_name: { type: String },
  salary: { type: Number },
  phone_number: { type: String },
  email: { type: String },
  created_date: { type: Date },
  updated_date: { type: Date },
});

// staffSchema.plugin(AutoIncrement, { inc_field: "no" });

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
