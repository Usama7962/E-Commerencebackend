// controllers/wishlistController.js
import User from "../models/User.js";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import { getSessionFilter } from "../utils/session.js";

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!await Product.exists({ _id: productId })) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (!req.user) {
      const sessionFilter = getSessionFilter(req, res);
      let wishlist = await Wishlist.findOne(sessionFilter);
      if (!wishlist) wishlist = new Wishlist({ ...sessionFilter, products: [] });
      const productIndex = wishlist.products.findIndex((id) => id.toString() === productId);
      if (productIndex >= 0) wishlist.products.splice(productIndex, 1);
      else wishlist.products.push(productId);
      await wishlist.save();
      return res.json({ msg: productIndex >= 0 ? "Removed from wishlist" : "Added to wishlist", wishlist: wishlist.products });
    }

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // check product in wishlist
    if (user.wishlist.some((id) => id.toString() === productId)) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      return res.json({
        msg: "Removed from wishlist",
        wishlist: user.wishlist,
      });
    }

    // add if not exists
    user.wishlist.push(productId);
    await user.save();
    res.json({ msg: "Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    if (!req.user) {
      const wishlist = await Wishlist.findOne(getSessionFilter(req, res)).populate("products");
      return res.json(wishlist?.products || []);
    }

  const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
    console.log("getWishlist: wishlist:", user.wishlist);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.user) {
      const wishlist = await Wishlist.findOne(getSessionFilter(req, res));
      if (!wishlist) return res.status(404).json({ msg: "Product not in wishlist" });
      wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
      await wishlist.save();
      return res.json({ msg: "Removed from wishlist successfully", wishlist: wishlist.products });
    }

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // check if product exists in wishlist
    if (!user.wishlist.some((id) => id.toString() === productId)) {
      return res.status(400).json({ msg: "Product not in wishlist" });
    }

    // remove from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({
      msg: "Removed from wishlist successfully",
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
