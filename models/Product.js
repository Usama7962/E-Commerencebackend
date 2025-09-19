import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },   // image ka path save hoga
  createdAt: { type: Date, default: Date.now },
   category: { type: String, required: true },
},
 { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;


