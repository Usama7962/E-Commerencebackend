import Order from "../models/PlaceOrder.js";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import { getSessionFilter } from "../utils/session.js";

export const placeOrder = async (req, res) => {
  try {
    const { addressId } = req.body;
    if (!addressId) {
      return res.status(400).json({ msg: "Shipping address is required" });
    }

    const sessionFilter = getSessionFilter(req, res);

    const cart = await Cart.findOne(sessionFilter).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const address = await Address.findOne({ _id: addressId, ...sessionFilter });
    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    const newOrder = new Order({
      ...sessionFilter,
      items: cart.items,
      address: addressId,
      totalPrice: cart.totalPrice,
    });

    await newOrder.save();

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("address")
      .populate("items.product");

    res.status(201).json({
      msg: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName email")
      .populate("address")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({ success: true, msg: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
