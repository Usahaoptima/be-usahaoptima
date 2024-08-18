const express = require("express");
const routes = express.Router();

const UsersController = require("../../Controllers/Users/index");
const UserMiddlewares = require("../../MiddleWares/Auth/Authorization");

routes.get(
  "/",
  [UserMiddlewares.verifyToken, UserMiddlewares.verifyJWTToken],
  UsersController.getUsers
);

routes.post(
  "/",
  [
    UserMiddlewares.verifyToken,
    UserMiddlewares.verifyJWTToken,
    UserMiddlewares.authorize(["admin"]),
  ],
  UsersController.userPost
);

routes.delete("/:id", [
  UsersController.deleteUser,
  UserMiddlewares.authorize(["admin"]),
]);

routes.put(
  "/",
  [
    UserMiddlewares.verifyToken,
    UserMiddlewares.verifyJWTToken,
    UserMiddlewares.authorize(["admin"]),
  ],
  UsersController.UpdateUser
);

module.exports = routes;
