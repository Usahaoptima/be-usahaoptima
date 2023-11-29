const express = require("express");
const routes = express.Router();

// Controllers
const ReportControllers = require("../../Controllers/Report/report");
const AuthMiddleware = require("../../MiddleWares/Auth/Authorization");

routes.get(
  "/",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.getAllDataGrouping
);

routes.get(
  "/total-sales",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.totalSales
);

routes.get(
  "/total-expense",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.totalExpense
);

routes.get(
  "/total/:criteria",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.totalExpenseByCriteria
);

module.exports = routes;
