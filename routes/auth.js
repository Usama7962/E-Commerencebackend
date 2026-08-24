import express from "express";
import {
  login,
  logout,
  refreshToken,
  forgetPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import {
  validateLogin,
  validateForgotPassword,
  validateOtp,
  validateResetPassword,
} from "../middleware/validate.js";

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forget-password", validateForgotPassword, forgetPassword);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/reset-password", validateResetPassword, resetPassword);

export default router;
