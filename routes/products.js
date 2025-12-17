const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProducts,
  deleteProductById,
} = require("../controllers/productsController");

// GET all products
router.get("/", getProducts);

// GET product by product_id
router.get("/:id", getProductById);

// CREATE product
router.post("/", createProduct);

// DELETE all products
router.delete("/", deleteProducts);

// DELETE product by product_id
router.delete("/:id", deleteProductById);

module.exports = router;
