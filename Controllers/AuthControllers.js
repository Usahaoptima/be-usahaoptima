const UsersModels = require("../Models/scheme/User");
const BusinessesModels = require("../Models/scheme/Businesses");
const Cryptr = require("cryptr");
const CryptrNew = new Cryptr("Ems1");
const JWT = require("jsonwebtoken");

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
        message: "Data tidak Komplit",
        statusCode: 401,
      });
    }

    if (getBusiness) {
      res.status(401).send({
        message: "Usahama Sudah Tersedia, Buat Usaha Baru!",
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
          message: "tidak bisa membuat usaha",
          statusCode: 400,
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
          active: false,
          role: "admin",
          business_id: createdDataBusiness._id,
          create_at: Date.now(),
        };

        let createdData = await UsersModels.create(data);

        if (!createdData) {
          res.status(401).send({
            message: "username atau password salah",
            statusCode: 401,
          });
        } else {
          res.status(201).send({
            message: "Berhasil membuat user",
            statusCode: 201,
            data: createdData,
          });
        }
      }
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
        message: "Username atau password belum terdaftar!",
        statusCode: 400,
      });
    } else {
      let passwordUser = CryptrNew.decrypt(getUser[0].password);

      if (password !== passwordUser) {
        res.status(401).send({
          message: "password atau username salah!",
          statusCode: 401,
        });
      } else {
        if (getUser[0].active === false) {
          res.status(402).send({
            message: "user tidak aktif silahkan kontak admin untuk diaktifkan!",
            user_id: getUser[0]._id,
            statusCode: 402,
          });
        } else {
          let expiredToken = Math.floor(Date.now() / 1000) + 60 * 60;
          let createAccessToken = JWT.sign(
            {
              exp: expiredToken,
              data: {
                user: getUser[0].username,
                user_id: getUser[0]._id,
                business_id: getUser[0].business_id,
              },
            },
            "Ems1"
          );

          let dataPassingClient = {
            access_token: createAccessToken, // access token expired 1 day
            expired_date: expiredToken,
            user: getUser[0].username,
            id: getUser[0]._id,
          };

          res.status(200).send({
            message: "berhasil login!",
            statusCode: 200,
            data: dataPassingClient,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}

module.exports = {
  Register,
  Login,
};
