const express = require("express");
const routes = express.Router();

// Controllers
const SalesController = require("../../Controllers/Sales/sales");

// Middlewares
const SalesMiddleware = require("../../MiddleWares/Sales/salesValidation");

routes.get("/", SalesController.GetSales);
routes.post("/", SalesMiddleware.salesValidation, SalesController.CreateSales);
routes.put("/:id", SalesController.UpdateSales);
routes.delete("/:id", SalesController.DeleteSales);

module.exports = routes;
