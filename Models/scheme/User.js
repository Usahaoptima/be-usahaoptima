const Mongoose = require("mongoose");

var Schema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "karyawan", "bendahara"],
    default: "karyawan",
  },
  bussines_id: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  create_at: {
    type: Date,
  },
});

const User = Mongoose.model("User", Schema);

module.exports = User;
