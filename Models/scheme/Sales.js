const Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
  sales_name: { type: String },
  product_name: { type: String },
  quantity: { type: Number },
  total_price: { type: Number },
  business_id: {
    type: String,
  },
  created_date: { type: Date },
  updated_date: { type: String },
});

Schema.pre('save', async function (next) {
  try {
    // Ambil harga produk berdasarkan nama produk (asumsi Anda memiliki model produk)
    const Product = Mongoose.model('Product');
    const product = await Product.findOne({ product_name: this.product_name });

    if (!product) {
      throw new Error('Product not found');
    }

    // Periksa apakah stok cukup untuk memenuhi penjualan
    if (product.quantity < this.quantity) {
      throw new Error('Insufficient stock');
    }

    // Kurangi stok produk
    product.quantity -= this.quantity;

    // Simpan perubahan pada stok produk
    await product.save();

    // Hitung total_price dari harga produk dikalikan dengan quantity
    // this.total_price = product.price * this.quantity;

    // Tandai tanggal pembuatan dan pembaruan
    this.created_date = Date.now();
    this.updated_date = Date.now();

    next();
  } catch (error) {
    next(error);
  }
});

Schema.pre('findOneAndUpdate', async function (next) {
  try {
    const Product = Mongoose.model('Product');

    // Ambil data penjualan sebelum diperbarui
    const salesBeforeUpdate = await this.model.findOne(this.getQuery());

    // Ambil data produk berdasarkan nama produk sebelum diperbarui
    const productBeforeUpdate = await Product.findOne({
      product_name: salesBeforeUpdate.product_name,
    });

    if (!productBeforeUpdate) {
      throw new Error('Product not found');
    }

    // Kembalikan stok yang sudah dikurangkan sebelumnya
    productBeforeUpdate.quantity += salesBeforeUpdate.quantity;

    // Simpan perubahan pada stok produk sebelumnya
    await productBeforeUpdate.save();

    // Ambil data produk setelah diperbarui
    const productAfterUpdate = await Product.findOne({
      product_name: this._update.product_name,
    });

    if (!productAfterUpdate) {
      throw new Error('Product not found');
    }

    // Hitung total_price dari harga produk dikalikan dengan quantity yang diperbarui
    this._update.total_price = productAfterUpdate.price * this._update.quantity;

    // Perbarui tanggal pembaruan
    this._update.updated_date = Date.now();

    // Kurangi stok produk setelah diperbarui
    productAfterUpdate.quantity -= this._update.quantity;

    // Simpan perubahan pada stok produk setelah diperbarui
    await productAfterUpdate.save();

    next();
  } catch (error) {
    next(error);
  }
});

const Sales = Mongoose.model('Sales', Schema);

module.exports = Sales;
