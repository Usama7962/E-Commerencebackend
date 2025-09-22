import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true }, // ✅ reference
  totalPrice: Number,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
