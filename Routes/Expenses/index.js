const express = require("express");
const router = express.Router();

// Controllers
const ExpensesController = require("../../Controllers/Expenses/expenses");

// Middleware
const ExpensesMiddleware = require("../../MiddleWares/Expenses/shopExpensesValidation");
const AuthMiddleware = require("../../MiddleWares/Auth/Authorization");

router.post(
  "/",
  [
    ExpensesMiddleware.validateExpensesCreation,
    AuthMiddleware.verifyToken,
    AuthMiddleware.verifyJWTToken,
    AuthMiddleware.authorize(["admin"]),
  ],
  ExpensesController.createExpenses
);
router.get(
  "/",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ExpensesController.getExpenses
);
router.put(
  "/:id",
  [
    ExpensesMiddleware.validateExpensesUpdate,
    AuthMiddleware.verifyToken,
    AuthMiddleware.verifyJWTToken,
    AuthMiddleware.authorize(["admin"]),
  ],
  ExpensesController.updateExpenses
);
router.delete(
  "/:id",
  [
    AuthMiddleware.verifyToken,
    AuthMiddleware.verifyJWTToken,
    AuthMiddleware.authorize(["admin"]),
  ],
  ExpensesController.deleteExpenses
);
router.get(
  "/total",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ExpensesController.TotalCost
);

module.exports = router;
