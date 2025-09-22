// orderRoutes.js
import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { placeOrder,getAllOrders, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", isAuthenticated, placeOrder);
router.get("/", isAuthenticated, getAllOrders);
router.delete("/:id", isAuthenticated, deleteOrder);

export default router;
