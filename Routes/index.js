const express = require("express");
const routes = express.Router();

// Routes
const AuthentificationRoutes = require("./Auth/index");

routes.get("/", (req, res) => {
  res.send("Welcome to api v1 routes!");
});

routes.use("/auth", AuthentificationRoutes);

module.exports = routes;
