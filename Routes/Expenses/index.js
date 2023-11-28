const express = require("express");
const router = express.Router();

// Controllers
const ExpensesController = require("../../Controllers/Expenses/expenses");

// Middleware
const ExpensesMiddleware = require("../../MiddleWares/Expenses/shopExpensesValidation");

router.post(
  "/",
  ExpensesMiddleware.validateExpensesCreation,
  ExpensesController.createExpenses
);
router.get("/", ExpensesController.getExpenses);
router.put(
  "/:id",
  ExpensesMiddleware.validateExpensesUpdate,
  ExpensesController.updateExpenses
);
router.delete("/:id", ExpensesController.deleteExpenses);

module.exports = router;
