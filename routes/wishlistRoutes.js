import express from "express";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { validateProductId } from "../middleware/validate.js";

const router = express.Router();

router.post("/:productId", validateProductId, toggleWishlist);
router.get("/", getWishlist);
router.delete("/:productId", validateProductId, removeFromWishlist);

export default router;
