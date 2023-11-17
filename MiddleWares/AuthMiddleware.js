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
        "Your Password does'nt reach 8 character minimal and 16 character maximal",
      statusCode: 400,
    });
  }
}

module.exports = {
  bodyValidationRegister,
  passwordValidation,
};
