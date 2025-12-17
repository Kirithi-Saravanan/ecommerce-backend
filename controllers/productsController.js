const Product = require("../models/Product");

// --------------------
// GET ALL PRODUCTS
// --------------------
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------
// GET PRODUCT BY ID
// --------------------
const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const product = await Product.findOne({ product_id: productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------
// CREATE PRODUCT
// --------------------
const createProduct = async (req, res) => {
  try {
    const { product_id, name, price, image_url, rating } = req.body;

    const product = await Product.create({
      product_id,
      name,
      price,
      image_url,
      rating,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --------------------
// DELETE ALL PRODUCTS
// --------------------
const deleteProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    res.status(200).json({ message: "All products deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------
// DELETE PRODUCT BY ID
// --------------------
const deleteProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const deleted = await Product.findOneAndDelete({
      product_id: productId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProducts,
  deleteProductById,
};
