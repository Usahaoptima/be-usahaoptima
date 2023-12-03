const express = require("express");
const router = express.Router();

// Controllers
const StaffController = require("../../Controllers/Staff/staff");

// Middlewares
const StaffMiddleware = require("../../MiddleWares/Staff/staffValidation");

router.post(
  "/",
  StaffMiddleware.validateStaffCreation,
  StaffController.createStaffExpenses
);
router.get("/", StaffController.getStaffExpenses);
router.put(
  "/:id",
  StaffMiddleware.validateStaffUpdate,
  StaffController.updateStaffExpenses
);
router.delete("/:id", StaffController.deleteStaffExpenses);
router.delete("/", StaffController.deleteAllStaffExpenses);

module.exports = router;
