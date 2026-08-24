import Address from "../models/Address.js";
import { getSessionFilter } from "../utils/session.js";

// ✅ Get All Addresses by UserId
export const getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find(getSessionFilter(req, res));
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Add New Address
export const addAddress = async (req, res) => {
  try {
    const { fullName, phone, state, city, postalCode, address } = req.body;

    if (!fullName || !phone || !city || !postalCode || !address) {
      return res.status(400).json({ msg: "All address fields are required" });
    }

    const sessionFilter = getSessionFilter(req, res);

    const newAddress = new Address({
      ...sessionFilter,
      fullName,
      phone,
      state,
      city,
      postalCode,
      address,
    });

    await newAddress.save();
    res.status(201).json({ msg: "Address added", address: newAddress });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Update Address by ID
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params; // Address ID
    const sessionFilter = getSessionFilter(req, res);

    const updated = await Address.findOneAndUpdate(
      { _id: id, ...sessionFilter },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Address not found" });
    }

    res.status(200).json({ msg: "Address updated", address: updated });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Delete Address by ID
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params; // Address ID
    const sessionFilter = getSessionFilter(req, res);

    const deleted = await Address.findOneAndDelete({ _id: id, ...sessionFilter });
    if (!deleted) {
      return res.status(404).json({ msg: "No address found to delete" });
    }

    res.status(200).json({ msg: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
