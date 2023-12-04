const JWT = require("jsonwebtoken");

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send({
      message: "Unauthorized, login first",
      statusMessage: "Unauthorized, login first",
      statusCode: 401,
    });
  } else {
    let token = req.headers.authorization.split(" ");
    if (token[0].toLowerCase() !== "bearer") {
      res.status(401).send({
        message: "Unauthorized!",
        statusMessage: "Unauthorized!",
        statusCode: 401,
      });
    } else {
      req.tokenVerify = token[1];
      next();
    }
  }
}

function verifyJWTToken(req, res, next) {
  let token = req.tokenVerify;
  let tokenVerify = JWT.verify(token, "Ems1");

  if (!tokenVerify) {
    res.status(401).send({
      message: "Unauthorized!",
      statusMessage: "Unauthorized!",
      statusCode: 401,
    });
  } else {
    req.tokenUser = tokenVerify;
    next();
  }
}

module.exports = {
  verifyToken,
  verifyJWTToken,
};
