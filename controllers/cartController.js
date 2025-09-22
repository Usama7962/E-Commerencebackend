import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ✅ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // user token se aayega
    const { productId, quantity, selectedSize } = req.body;

    let cart = await Cart.findOne({ user: userId });
    console.log(cart,"vsfedfdedfd")
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    // check if same product + same size already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (itemIndex > -1) {
      // agar same product aur size hai to quantity badhao
      cart.items[itemIndex].quantity += quantity;
    } else {
      // otherwise new entry push karo
      cart.items.push({ product: productId, quantity, selectedSize });
    }

    // update total price
    cart.totalPrice = await Promise.all(
      cart.items.map(async (item) => {
        const prod = await Product.findById(item.product);
        return item.quantity * prod.price;
      })
    ).then((values) => values.reduce((acc, val) => acc + val, 0));

    await cart.save();
        console.log(cart,"saveddd")

    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");
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

