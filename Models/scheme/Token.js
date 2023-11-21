const Mongoose = require("mongoose");
const User = require("./User");
const Schema = Mongoose.Schema;

var newSchema = new Mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: User,
    uniqe: true,
  },
  token: { type: String, required: true },
  created_date: { type: Date, default: Date.now(), expires: 3600 },
});

const Token = Mongoose.model("Token", newSchema);

module.exports = Token;
