import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { getSessionFilter } from "../utils/session.js";

// ✅ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedSize } = req.body;
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ msg: "Quantity must be a positive integer" });
    }

    const sessionFilter = getSessionFilter(req, res);

    let cart = await Cart.findOne(sessionFilter);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (!cart) {
      cart = new Cart({ ...sessionFilter, items: [], totalPrice: 0 });
    }

    // check if same product + same size already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (itemIndex > -1) {
      // agar same product aur size hai to quantity badhao
      cart.items[itemIndex].quantity += parsedQuantity;
    } else {
      // otherwise new entry push karo
      cart.items.push({ product: productId, quantity: parsedQuantity, selectedSize });
    }

    // update total price
    cart.totalPrice = await Promise.all(
      cart.items.map(async (item) => {
        const prod = await Product.findById(item.product);
        return item.quantity * (prod?.price || 0);
      })
    ).then((values) => values.reduce((acc, val) => acc + val, 0));

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne(getSessionFilter(req, res)).populate("items.product");
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne(getSessionFilter(req, res)).populate("items.product");
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    // ✅ Remove the product
    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productId
    );

    // ✅ Recalculate total safely
    cart.totalPrice = cart.items.reduce((acc, item) => {
      const price = item.product?.price || 0; // agar price undefined hai to 0 le lo
      return acc + item.quantity * price;
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

