const UsersModels = require("../Models/scheme/User");
const Cryptr = require("cryptr");
const CryptrNew = new Cryptr("Ems1");

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

module.exports = {
  Register,
};
