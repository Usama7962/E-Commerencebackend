import express from "express";
import {
  getWishlist,
  toggleWishlist,
    removeFromWishlist,
} from "../controllers/wishlistController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:productId", isAuthenticated, toggleWishlist); // add/remove
router.get("/", isAuthenticated, getWishlist);
router.delete("/:productId", isAuthenticated, removeFromWishlist);

export default router;
