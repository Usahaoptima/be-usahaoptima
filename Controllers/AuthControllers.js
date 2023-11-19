const UsersModels = require("../Models/scheme/User");
const Cryptr = require("cryptr");
const CryptrNew = new Cryptr("Ems1");
const JWT = require("jsonwebtoken");

async function Register(req, res, next) {
  const { username, password, email, active } = req.body;

  try {
    let getUser = await UsersModels.findOne({
      username: username,
    });

    if (getUser) {
      res.status(400).send({
        message: "Data is exists, please create another one!",
        statusCode: 400,
      });
    } else {
      let data = {
        username: username,
        password: CryptrNew.encrypt(password),
        email: email,
        active: active,
        create_at: Date.now(),
      };

      let createdData = await UsersModels.create(data);

      if (!createdData) {
        res.status(400).send({
          message: "wrong username or password",
          statusCode: 400,
        });
      } else {
        res.status(201).send({
          message: "successfull to create data users!",
          statusCode: 201,
          data: createdData,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something Wrong",
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

    if (getUser.length < 1) {
      res.status(400).send({
        message: "Data is not exists!",
        statusCode: 401,
      });
    } else {
      let passwordUser = CryptrNew.decrypt(getUser[0].password);

      if (password !== passwordUser) {
        res.status(400).send({
          message: "Username or Password is wrong!",
          statusCode: 401,
        });
      } else {
        let expiredToken = Math.floor(Date.now() / 1000) + 60 * 60;
        let createAccessToken = JWT.sign(
          {
            exp: expiredToken,
            data: {
              user: getUser[0].username,
              id: getUser[0]._id,
            },
          },
          "Ems1"
        );

        let dataPassingClient = {
          access_token: createAccessToken, // access token expired 1 day
          refresh_token: createAccessToken, // refresh token expired 1 month
          expired_date: expiredToken,
          user: getUser[0].username,
          id: getUser[0]._id,
        };

        res.status(200).send({
          message: "Successfull to login user!",
          statusText: "Successfull to login user!",
          statusCode: 200,
          data: dataPassingClient,
        });
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
