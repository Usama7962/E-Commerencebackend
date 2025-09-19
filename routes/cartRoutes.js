import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import {isAuthenticated} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, addToCart);
router.get("/", isAuthenticated, getCart);
router.delete("/:productId", isAuthenticated, removeFromCart);

export default router;
