import Address from "../models/Address.js";

// ✅ Get All Addresses by UserId
export const getAddressesByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId });

    if (!addresses || addresses.length === 0) {
      return res.status(200).json({ msg: "No address found", addresses: [] });
    }

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// ✅ Add New Address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, state, city, postalCode, address } = req.body;

    const newAddress = new Address({
      userId,
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
    const userId = req.user.id;

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId },
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
    const userId = req.user.id;

    const deleted = await Address.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ msg: "No address found to delete" });
    }

    res.status(200).json({ msg: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
