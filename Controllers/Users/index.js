const UserModels = require("../../Models/scheme/User");
const TokenModels = require("../../Models/scheme/Token");
const crypto = require("crypto");
require("dotenv").config();
const Cryptr = require("cryptr");
const CryptrNew = new Cryptr("Ems1");

const getUsers = async (req, res) => {
  const token = req.tokenUser.data;
  const users = await UserModels.find({ business_id: token.business_id });

  if (!users) {
    res.status(401).send({
      message: "belum ada data",
      statusText: "belum ada data",
      statusCode: 401,
    });
  }

  res.status(200).send({
    message: "berhasil mendapatkan data",
    statusText: "berhasil mendapatkan data",
    statusCode: 200,
    data: users,
  });
};

async function userPost(req, res, next) {
  const { username, password, email, role } = req.body;
  const tokenJWT = req.tokenUser.data;
  try {
    const getUser = await UserModels.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!username || !password || !email || !role) {
      res.status(401).send({
        message: "Data tidak Komplit",
        statusCode: 401,
      });
    }

    if (getUser) {
      res.status(401).send({
        message: "Akun Sudah Tersedia, Buat akun baru!",
        statusCode: 401,
      });
    } else {
      let data = {
        username: username,
        password: CryptrNew.encrypt(password),
        email: email,
        active: true,
        role: role,
        business_id: tokenJWT.business_id,
        create_at: Date.now(),
      };

      let createdData = await UserModels.create(data);

      if (!createdData) {
        res.status(401).send({
          message: "username atau password salah",
          statusCode: 401,
        });
      }
      const token = await new TokenModels({
        user_id: createdData._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}user/${createdData._id}/password/${token.token}`;

      await SendEmail(
        createdData.email,
        "Verifikasi Akun",
        "Silahkan verifikasi akun anda",
        `<br/> <a href="${url}">Verifikasi</a>`
      );

      res.status(201).send({
        message: "Berhasil membuat user, verifikasi email terlebih dahulu",
        statusCode: 201,
        data: createdData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "ada yang salah",
      error: error,
      statusCode: 500,
    });
  }
}

module.exports = {
  getUsers,
  userPost,
};
