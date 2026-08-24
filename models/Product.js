import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String, required: true },
  ingredients: { type: String },
  usage: { type: String },
  benefits: { type: String },
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
