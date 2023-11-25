const Mongoose = require("mongoose");

var Schema = new Mongoose.Schema({
  sales_name: { type: String },
  product_name: { type: String },
  quantity: { type: Number },
  total_price: { type: Number },
  created_date: { type: Date },
  updated_date: { type: String },
});

Schema.pre("save", async function (next) {
  try {
    // Ambil harga produk berdasarkan nama produk (asumsi Anda memiliki model produk)
    const Product = Mongoose.model("Product");
    const product = await Product.findOne({ product_name: this.product_name });

    if (!product) {
      throw new Error("Product not found");
    }

    // Hitung total_price dari harga produk dikalikan dengan quantity
    this.total_price = product.price * this.quantity;

    // Tandai tanggal pembuatan dan pembaruan
    this.created_date = Date.now();
    this.updated_date = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

Schema.pre("findOneAndUpdate", async function (next) {
  try {
    // Ambil harga produk berdasarkan nama produk
    const Product = Mongoose.model("Product");
    const product = await Product.findOne({
      product_name: this._update.product_name,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Hitung total_price dari harga produk dikalikan dengan quantity yang diperbarui
    this._update.total_price = product.price * this._update.quantity;

    // Perbarui tanggal pembaruan
    this._update.updated_date = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});
const Sales = Mongoose.model("Sales", Schema);

module.exports = Sales;
