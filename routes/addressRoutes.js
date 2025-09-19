import express from "express";
import {
  getAddressesByUser,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all addresses for logged-in user
router.get("/", isAuthenticated, getAddressesByUser);

// ✅ Add new address
router.post("/", isAuthenticated, addAddress);

// ✅ Update address by ID
router.put("/:id", isAuthenticated, updateAddress);

// ✅ Delete address by ID
router.delete("/:id", isAuthenticated, deleteAddress);

export default router;
