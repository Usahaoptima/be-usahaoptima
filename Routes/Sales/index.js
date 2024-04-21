const express = require('express');
const routes = express.Router();

// Controllers
const SalesController = require('../../Controllers/Sales/sales');

// Middlewares
const SalesMiddleware = require('../../MiddleWares/Sales/salesValidation');
const JWTMiddleware = require('../../MiddleWares/Auth/Authorization');

routes.get(
  '/',
  [JWTMiddleware.verifyToken, JWTMiddleware.verifyJWTToken],
  SalesController.GetSales
);

routes.get('/report/:id', SalesController.GetReport);

routes.post(
  '/',
  [JWTMiddleware.verifyToken, JWTMiddleware.verifyJWTToken],
  SalesMiddleware.salesValidation,
  SalesController.CreateSales
);

routes.post(
  '/payment',
  [JWTMiddleware.verifyToken, JWTMiddleware.verifyJWTToken],
  SalesMiddleware.salesValidation,
  SalesController.Payment
);

routes.put('/:id', SalesController.UpdateSales);
routes.delete('/:id', SalesController.DeleteSales);

module.exports = routes;
