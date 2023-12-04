const express = require("express");
const routes = express.Router();

// Controllers
const ProductController = require("../../Controllers/Product/product");

// Middlewares
const ProductMiddleware = require("../../MiddleWares/Product/productValidation");
const JWTMiddleware = require("../../MiddleWares/Auth/Authorization");

routes.get(
  "/",
  [JWTMiddleware.verifyToken, JWTMiddleware.verifyJWTToken],
  ProductController.GetProduct
);
routes.post(
  "/",
  [
    ProductMiddleware.productValidation,
    JWTMiddleware.verifyToken,
    JWTMiddleware.verifyJWTToken,
  ],
  ProductController.CreateProduct
);
routes.put("/:id", ProductController.UpdateProduct);
routes.delete("/:id", ProductController.DeleteProduct);

module.exports = routes;
