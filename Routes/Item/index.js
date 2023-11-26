const express = require("express");
const router = express.Router();

// Controllers
const ItemController = require("../../Controllers/Item/item");

// Middlewares
const ItemMiddleware = require("../../MiddleWares/Item/itemValidation");

router.post(
  "/",
  ItemMiddleware.validateItemCreation,
  ItemController.CreateItem
);
router.get("/", ItemController.GetItems);
router.put(
  "/:id",
  ItemMiddleware.validateItemUpdate,
  ItemController.UpdateItem
);
router.delete("/:id", ItemController.DeleteItem);

module.exports = router;
