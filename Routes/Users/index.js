const express = require("express");
const routes = express.Router();

const UsersController = require("../../Controllers/Users/index");
const UserMiddlewares = require("../../MiddleWares/Auth/Authorization");

routes.get(
  "/",
  [UserMiddlewares.verifyToken, UserMiddlewares.verifyJWTToken],
  UsersController.getUsers
);

module.exports = routes;
