const express = require("express");
const router = express.Router();

// Controllers
const ItemController = require("../../Controllers/Item/item");

// Middlewares
const ItemMiddleware = require("../../MiddleWares/Item/itemValidation");

router.post(
  "/",
  ItemMiddleware.validateItemCreation,
  ItemController.CreateItemExpenses
);
router.get("/", ItemController.GetItemsExpenses);
router.put(
  "/:id",
  ItemMiddleware.validateItemUpdate,
  ItemController.UpdateItemExpenses
);
router.delete("/:id", ItemController.DeleteItemExpenses);

module.exports = router;
