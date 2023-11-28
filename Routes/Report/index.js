const express = require("express");
const routes = express.Router();

// Controllers
const ReportControllers = require("../../Controllers/Report/report");

routes.get("/", ReportControllers.getAllDataGrouping);

routes.get("/total-sales", ReportControllers.totalSales);

routes.get("/total-expense", ReportControllers.totalExpense);

routes.get("/total/:criteria", ReportControllers.totalExpenseByCriteria);

module.exports = routes;
