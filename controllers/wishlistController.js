// controllers/wishlistController.js
import User from "../models/User.js";

export const toggleWishlist = async (req, res) => {
  try {
  const userId = req.user._id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // check product in wishlist
    if (user.wishlist.includes(productId)) {
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
  const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
    console.log("getWishlist: wishlist:", user.wishlist);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // check if product exists in wishlist
    if (!user.wishlist.includes(productId)) {
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
