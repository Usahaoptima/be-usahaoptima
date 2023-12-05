const express = require("express");
const router = express.Router();

// Controllers
const ItemController = require("../../Controllers/Item/item");

// Middlewares
const ItemMiddleware = require("../../MiddleWares/Item/itemValidation");
const AuthMiddleware = require("../../MiddleWares/Auth/Authorization");

router.post(
  "/",
  [
    ItemMiddleware.validateItemCreation,
    AuthMiddleware.verifyToken,
    AuthMiddleware.verifyJWTToken,
  ],
  ItemController.CreateItemExpenses
);
router.get(
  "/",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ItemController.GetItemsExpenses
);
router.put(
  "/:id",
  [
    ItemMiddleware.validateItemUpdate,
    AuthMiddleware.verifyToken,
    AuthMiddleware.verifyJWTToken,
  ],
  ItemController.UpdateItemExpenses
);
router.delete(
  "/:id",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ItemController.DeleteItemExpenses
);

router.get(
  "/total",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  ItemController.TotalCost
);

module.exports = router;
