import Order from "../models/PlaceOrder.js";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js"; // ✅ agar alag collection hai

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.body.addressId; // frontend se sirf address ka id aayega
    console.log("placeOrder: userId:", userId, "addressId:", addressId,);
    // 1️⃣ Get user cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Find address from DB
    const address = await Address.findOne({
      _id: addressId,
      userId: userId,
    });
    console.log("placeOrder: address:", address);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // 3️⃣ Create new order with address reference
    const newOrder = new Order({
      user: userId,
      items: cart.items,
      address: addressId,
    
      totalPrice: cart.totalPrice,
    });

    await newOrder.save();

    // 4️⃣ Clear cart after placing order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Fetch the complete order with populated address before sending response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("address")
      .populate("items.product");

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllOrders = async (req, res) => {
    console
  try {
    const orders = await Order.find()
      .populate("user", "name email firstName") // sirf name aur email chahiye user ka
      .populate("address") // 👈 pura address aayega
      .populate("items.product");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 🟢 Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params; // 👈 match karega
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
