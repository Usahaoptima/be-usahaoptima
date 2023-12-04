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

routes.get(
  "/total-month/:month",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.totalMonthly
);

routes.get(
  "/total-sales/:month",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.totalSalesMonthly
);

routes.get(
  "/total-expense/:month",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.totalExpenseMonthly
);

routes.get(
  "/total/:criteria/:month",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ReportControllers.totalExpenseByCriteriaMonthly
);

module.exports = routes;
