const express = require("express");
const router = express.Router();

// Controllers
const StaffController = require("../../Controllers/Staff/staff");

// Middlewares
const StaffMiddleware = require("../../MiddleWares/Staff/staffValidation");

router.post(
  "/",
  StaffMiddleware.validateStaffCreation,
  StaffController.CreateStaff
);
router.get("/", StaffController.GetStaff);
router.put(
  "/:id",
  StaffMiddleware.validateStaffUpdate,
  StaffController.UpdateStaff
);
router.delete("/:id", StaffController.DeleteStaff);

module.exports = router;
