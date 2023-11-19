const express = require("express");
const routes = express.Router();

// Controllers
const ProductController = require("../../Controllers/Product/product");

// Middlewares
const ProductMiddleware = require("../../MiddleWares/Product/productValidation");

routes.get("/", ProductController.GetProduct);
routes.post(
  "/",
  ProductMiddleware.productValidation,
  ProductController.CreateProduct
);
routes.put("/:id", ProductController.UpdateProduct);
routes.delete("/:id", ProductController.DeleteProduct);

module.exports = routes;
