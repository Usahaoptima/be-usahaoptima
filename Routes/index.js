const express = require("express");
const routes = express.Router();

// Routes
const AuthentificationRoutes = require("./Auth/index");
const ProductRoutes = require("./Product/index");
const SalesRoutes = require("./Sales/index");

routes.get("/", (req, res) => {
  res.send("Welcome to api v1 routes!");
});

routes.use("/auth", AuthentificationRoutes);
routes.use("/product", ProductRoutes);
routes.use("/sales", SalesRoutes);

module.exports = routes;
