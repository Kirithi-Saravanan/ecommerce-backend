const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
} = require("../controllers/cartController");

// 🔐 PROTECT ALL CART ROUTES
router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.patch("/", auth, updateQuantity);
router.delete("/:id", auth, removeItem);

module.exports = router;
