import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import * as controller from "../controllers/productController.js";
dotenv.config();
import upload from "../middleware/upload.js";

const router = express.Router();


router.post("/", upload.single("image"), controller.createProduct);
router.get("/", controller.getProducts);
router.get("/category/:category", controller.getProductsByCategory);
router.get("/:id", controller.getProductById);
router.put("/:id", upload.single("image"), controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
