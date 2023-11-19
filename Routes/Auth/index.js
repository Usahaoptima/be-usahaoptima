const express = require("express");
const routes = express.Router();

// Controller

const AuthentificationControllers = require("../../Controllers/AuthControllers");

// midlewares

const AuthMiddleware = require("../../MiddleWares/Auth/AuthMiddleware");

routes.post(
  "/register",
  [AuthMiddleware.bodyValidationRegister, AuthMiddleware.passwordValidation],
  AuthentificationControllers.Register
);

routes.post(
  "/login",
  [AuthMiddleware.bodyValidationLogin],
  AuthentificationControllers.Login
);

routes.get("/", (req, res, next) => {
  res.send("Auth Endpoint");
});

module.exports = routes;
