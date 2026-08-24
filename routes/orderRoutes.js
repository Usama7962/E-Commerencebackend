import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { placeOrder, getAllOrders, deleteOrder } from "../controllers/orderController.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { validateOrder, validateMongoId } from "../middleware/validate.js";

const router = express.Router();

router.post("/", validateOrder, placeOrder);
router.get("/", isAuthenticated, isAdmin, getAllOrders);
router.delete("/:id", isAuthenticated, isAdmin, validateMongoId, deleteOrder);

export default router;
