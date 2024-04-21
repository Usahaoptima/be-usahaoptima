const UsersModels = require('../Models/scheme/User');
const BusinessesModels = require('../Models/scheme/Businesses');
const TokenModels = require('../Models/scheme/Token');
const SendEmail = require('../utils/sendEmail');
const Cryptr = require('cryptr');
const CryptrNew = new Cryptr('Ems1');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

async function Register(req, res, next) {
  const {
    username,
    password,
    email,
    business_name,
    business_type,
    business_description,
  } = req.body;

  try {
    const getUser = await UsersModels.findOne({
      $or: [{ username: username }, { email: email }],
    });

    let getBusiness = await BusinessesModels.findOne({
      business_name: business_name,
    });

    if (
      !username ||
      !password ||
      !email ||
      !business_name ||
      !business_type ||
      !business_description
    ) {
      res.status(401).send({
        message: 'Data tidak Komplit',
        statusCode: 401,
      });
    }

    if (getBusiness) {
      res.status(401).send({
        message: 'Bisnis/Usaha Sudah Tersedia, Buat Usaha Baru!',
        statusCode: 401,
      });
    } else {
      let dataBusiness = {
        business_name: business_name,
        business_type: business_type,
        business_description: business_description,
        create_at: Date.now(),
      };

      let createdDataBusiness = await BusinessesModels.create(dataBusiness);

      if (!createdDataBusiness) {
        res.status(400).send({
          message: 'tidak bisa membuat usaha',
          statusCode: 400,
        });
      }

      if (getUser) {
        res.status(401).send({
          message: 'Akun Sudah Tersedia, Buat akun baru!',
          statusCode: 401,
        });
      } else {
        let data = {
          username: username,
          password: CryptrNew.encrypt(password),
          email: email,
          active: false,
          role: 'admin',
          business_id: createdDataBusiness._id,
          create_at: Date.now(),
        };

        let createdData = await UsersModels.create(data);

        if (!createdData) {
          res.status(401).send({
            message: 'username atau password salah',
            statusCode: 401,
          });
        } else {
          const token = await new TokenModels({
            user_id: createdData._id,
            token: crypto.randomBytes(32).toString('hex'),
          }).save();

          const url = `${process.env.BASE_URL}user/${createdData._id}/verify/${token.token}`;

          await SendEmail(
            createdData.email,
            'Verifikasi Akun',
            'Silahkan verifikasi akun anda',
            `<p>Hai Sobat Optima!,<br>Sebelum lanjut verifikasi email, konfirmasi detail akunmu dulu, yuk:</p>
            <p>Username&nbsp;&nbsp;&nbsp;&nbsp;: ${username}<br>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${email}</p>
            <p>Kalau semua detail di atas udah benar, tekan tombol di bawah buat verifikasi emailmu.</p>
            <a href="${url}" style="display: inline-block; border: none;
            padding: 8px; background-color: #19A7CE; color: white; text-align: center; line-height: 10px; border-radius: 12px; text-decoration: none;">Verifikasi email</a>
            <p>Jika tombolnya bermasalah, salin dan tempel link dibawah ini ke browser kamu<br>${url}</p>
            <p>Detail akunmu salah? Jangan verifikasi, lalu kamu bisa abaikan email ini.</p>
            <p>Email ini dikirimkan secara otomatis. Mohon tidak membalas ke email ini.</p>`
          );

          res.status(201).send({
            message: 'Berhasil membuat user, verifikasi email terlebih dahulu',
            statusCode: 201,
            data: createdData,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'ada yang salah',
      error: error,
      statusCode: 500,
    });
  }
}

async function Login(req, res, next) {
  const { username, password } = req.body;
  try {
    let getUser = await UsersModels.aggregate([
      {
        $match: {
          $or: [{ username: username }, { email: username }],
        },
      },
    ]);

    console.log(getUser);

    if (getUser.length < 1) {
      res.status(400).send({
        message: 'Username atau password belum terdaftar!',
        statusCode: 400,
      });
    } else {
      let passwordUser = CryptrNew.decrypt(getUser[0].password);

      if (password !== passwordUser) {
        res.status(401).send({
          message: 'password atau username salah!',
          statusCode: 401,
        });
      }
      if (getUser[0].active === false) {
        res.status(401).send({
          message: 'user tidak aktif silahkan verifikasi email!',
          statusCode: 401,
        });
      }

      let createAccessToken = JWT.sign(
        {
          data: {
            user: getUser[0].username,
            user_id: getUser[0]._id,
            business_id: getUser[0].business_id,
          },
        },
        'Ems1'
      );

      let dataPassingClient = {
        access_token: createAccessToken,
        user: getUser[0].username,
        id: getUser[0]._id,
      };

      res.status(200).send({
        message: 'berhasil login!',
        statusCode: 200,
        data: dataPassingClient,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}

async function Verify(req, res, next) {
  const { id, token } = req.params;

  try {
    const user = await UsersModels.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        message: 'User Tidak Ditemukan',
        statusCode: 404,
      });
    }

    const tokenData = await TokenModels.findOne({
      user_id: user._id,
      token: token,
    });

    if (!tokenData) {
      return res.status(404).send({
        message: 'Token Tidak Ditemukan',
        statusCode: 404,
      });
    }

    await UsersModels.findByIdAndUpdate(user._id, {
      active: true,
    });
    await TokenModels.deleteOne({ _id: tokenData._id });

    res.status(200).send({
      message: 'Akun Berhasil Verifikasi, silahkan login',
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'ada yang salah',
      error: error,
      statusCode: 400,
    });
  }
}

module.exports = {
  Register,
  Login,
  Verify,
};
