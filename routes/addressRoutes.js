import express from "express";
import {
  getAddressesByUser,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { validateAddress, validateMongoId } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getAddressesByUser);
router.post("/", validateAddress, addAddress);
router.put("/:id", validateMongoId, validateAddress, updateAddress);
router.delete("/:id", validateMongoId, deleteAddress);

export default router;
