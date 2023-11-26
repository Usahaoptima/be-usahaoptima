const express = require("express");
const routes = express.Router();

// Routes
const AuthentificationRoutes = require("./Auth/index");
const ProductRoutes = require("./Product/index");
const SalesRoutes = require("./Sales/index");
const UsersRoutes = require("./Users/index");
const StaffRoutes = require("./Staff/index");
const ItemRoutes = require("./Item/index");
const ExpensesRoutes = require("./Expenses/index");

routes.get("/", (req, res) => {
  res.send("Welcome to api v1 routes!");
});

routes.use("/auth", AuthentificationRoutes);
routes.use("/product", ProductRoutes);
routes.use("/sales", SalesRoutes);
routes.use("/users", UsersRoutes);
routes.use("/staff", StaffRoutes);
routes.use("/item", ItemRoutes);
routes.use("/expenses", ExpensesRoutes);

module.exports = routes;
