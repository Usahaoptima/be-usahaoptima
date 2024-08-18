const express = require("express");
const routes = express.Router();

// Controllers
const SalesController = require("../../Controllers/Sales/sales");

// Middlewares
const SalesMiddleware = require("../../MiddleWares/Sales/salesValidation");
const JWTMiddleware = require("../../MiddleWares/Auth/Authorization");

routes.get(
  "/",
  [JWTMiddleware.verifyToken, JWTMiddleware.verifyJWTToken],
  SalesController.GetSales
);
routes.post(
  "/",
  [
    JWTMiddleware.verifyToken,
    JWTMiddleware.verifyJWTToken,
    JWTMiddleware.authorize(["admin", "karyawan"]),
  ],
  SalesMiddleware.salesValidation,
  SalesController.CreateSales
);
routes.put("/:id", SalesController.UpdateSales);
routes.delete("/:id", SalesController.DeleteSales);

module.exports = routes;
