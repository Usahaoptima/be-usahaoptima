const Mongoose = require("mongoose");

var Schema = new Mongoose.Schema({
  business_name: {
    type: String,
    required: true,
    unique: true,
  },
  business_type: {
    type: String,
    enum: ["jasa", "barang"],
    default: "jasa",
  },
  create_at: {
    type: Date,
  },
});

const Businesses = Mongoose.model("Businesses", Schema);

module.exports = Businesses;
