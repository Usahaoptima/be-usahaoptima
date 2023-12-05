const express = require("express");
const router = express.Router();

// Controllers
const StaffController = require("../../Controllers/Staff/staff");

// Middlewares
const StaffMiddleware = require("../../MiddleWares/Staff/staffValidation");
const AuthMiddleware = require("../../MiddleWares/Auth/Authorization");

router.post(
  "/",
  [
    StaffMiddleware.validateStaffCreation,
    AuthMiddleware.verifyToken,
    AuthMiddleware.verifyJWTToken,
  ],
  StaffController.createStaffExpenses
);
router.get(
  "/",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  StaffController.getStaffExpenses
);
router.put(
  "/:id",
  [
    StaffMiddleware.validateStaffUpdate,
    AuthMiddleware.verifyToken,
    AuthMiddleware.verifyJWTToken,
  ],
  StaffController.updateStaffExpenses
);
router.delete(
  "/:id",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  StaffController.deleteStaffExpenses
);
router.get(
  "/total",
  [AuthMiddleware.verifyToken, AuthMiddleware.verifyJWTToken],
  StaffController.TotalCost
);

module.exports = router;
