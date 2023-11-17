const mongoose = require("mongoose");

const url =
  "mongodb+srv://usahaoptima:us4h4optim4@cluster0.gzalqws.mongodb.net/UMKM";

const ConnectionDB = async () => {
  try {
    const Connect = await mongoose.connect(url);
    console.log(`Mongo Connected : ${Connect.connection.host}`);
  } catch (error) {
    console.log(error);
    // process.exit(1)
  }
};

module.exports = ConnectionDB;
