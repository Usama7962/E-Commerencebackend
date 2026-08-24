import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { validateCart, validateProductId } from "../middleware/validate.js";

const router = express.Router();

router.post("/add", validateCart, addToCart);
router.get("/", getCart);
router.delete("/:productId", validateProductId, removeFromCart);

export default router;
