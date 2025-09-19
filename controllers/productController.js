import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    console.log("createProduct: req.body:", req.body);
    console.log("createProduct: req.file:", req.file);

    let imageUrl = undefined;
    if (req.file) {
      console.log("createProduct: file upload detected");
      imageUrl = req.file.url || req.file.path || req.file.secure_url;
      console.log("createProduct: imageUrl from file:", imageUrl);
    } else if (req.body.imageUrl) {
      console.log("createProduct: imageUrl from body:", req.body.imageUrl);
      imageUrl = req.body.imageUrl;
    } else {
      console.log("createProduct: No image provided");
    }
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl,
    });
    await product.save();
    console.log("createProduct: saved product:", product);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  console.log("getProducts: products:", products);
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log("getProductById: product:", product);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

export const updateProduct = async (req, res) => {
  try {
    console.log("updateProduct: req.body:", req.body);
    console.log("updateProduct: req.file:", req.file);
    const update = { ...req.body };
    if (req.file) {
      update.imageUrl = req.file.path; // Use Cloudinary URL
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    console.log("updateProduct: updated product:", product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  console.log("deleteProduct: deleted:", deleted);
  res.json({ message: "Deleted" });
};
// ✅ Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params; // URL se category
    console.log("getProductsByCategory: category:", category);

    const products = await Product.find({ category }).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
