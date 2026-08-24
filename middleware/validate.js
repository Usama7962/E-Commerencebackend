import { body, param, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }
  next();
};

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

export const validateForgotPassword = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  handleValidation,
];

export const validateOtp = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
  handleValidation,
];

export const validateResetPassword = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidation,
];

export const validateProduct = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  handleValidation,
];

export const validateAddress = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("postalCode").trim().notEmpty().withMessage("Postal code is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  handleValidation,
];

export const validateCart = [
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  handleValidation,
];

export const validateOrder = [
  body("addressId").isMongoId().withMessage("Valid address ID is required"),
  handleValidation,
];

export const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  handleValidation,
];

export const validateProductId = [
  param("productId").isMongoId().withMessage("Invalid product ID format"),
  handleValidation,
];
