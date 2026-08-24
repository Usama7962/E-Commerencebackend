import express from "express";
import * as controller from "../controllers/productController.js";
import upload from "../middleware/upload.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { validateProduct, validateMongoId } from "../middleware/validate.js";

const router = express.Router();

// Public routes (no auth needed for users)
router.get("/", controller.getProducts);
router.get("/categories", controller.getCategories);
router.get("/category/:category", controller.getProductsByCategory);
router.get("/:id", validateMongoId, controller.getProductById);

// Admin only routes
router.post("/", isAuthenticated, isAdmin, upload.single("image"), validateProduct, controller.createProduct);
router.put("/:id", isAuthenticated, isAdmin, validateMongoId, upload.single("image"), controller.updateProduct);
router.delete("/:id", isAuthenticated, isAdmin, validateMongoId, controller.deleteProduct);

export default router;
