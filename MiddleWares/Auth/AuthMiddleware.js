const JWT = require("jsonwebtoken");

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: "Unauthorized, login first",
      statusMessage: "Unauthorized, login first",
      statusCode: 401,
    });
  }

  let token = req.headers.authorization.split(" ");
  if (token[0].toLowerCase() !== "bearer") {
    return res.status(401).send({
      message: "Unauthorized!",
      statusMessage: "Unauthorized!",
      statusCode: 401,
    });
  }

  req.tokenVerify = token[1];
  next();
}

function verifyJWTToken(req, res, next) {
  let token = req.tokenVerify;

  JWT.verify(token, "Ems1", (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
        statusMessage: "Unauthorized!",
        statusCode: 401,
      });
    }

    req.tokenUser = decoded;
    next();
  });
}

function bodyValidationRegister(req, res, next) {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).send({
      message: "Field is not complete!",
      statusText: "Field is not complete!",
      statusCode: 400,
    });
  } else {
    next();
  }
}

function passwordValidation(req, res, next) {
  const { username, password, email } = req.body;

  if (password.length >= 8 && password.length <= 16) {
    next();
  } else {
    res.status(400).send({
      message:
        "Your Password doesn't reach 8 character minimal and 16 character maximal",
      statusCode: 400,
    });
  }
}

function bodyValidationLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({
      message: "Field is not complete!",
      statusText: "Field is not complete!",
      statusCode: 400,
    });
  } else {
    next();
  }
}

module.exports = {
  verifyToken,
  verifyJWTToken,
  bodyValidationRegister,
  passwordValidation,
  bodyValidationLogin,
};
