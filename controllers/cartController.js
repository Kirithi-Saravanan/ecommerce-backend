const Cart = require("../models/Cart");
const Product = require("../models/Product");

// =======================
// GET CART WITH PRODUCTS
// =======================
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userData.id });

    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    const detailedProducts = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findOne({
          product_id: item.productId,
        });

        return {
          product,
          quantity: item.quantity,
        };
      })
    );

    res.status(200).json({ products: detailedProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// ADD TO CART
// =======================
const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userData.id;

  const product = await Product.findOne({ product_id: productId });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      products: [{ productId, quantity: 1 }],
    });
  } else {
    const existingItem = cart.products.find(
      (p) => p.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    await cart.save();
  }

  res.status(200).json(cart);
};

// =======================
// UPDATE QUANTITY
// =======================
const updateQuantity = async (req, res) => {
  const { productId, change } = req.body;
  const userId = req.userData.id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const item = cart.products.find((p) => p.productId === productId);
  if (!item) return res.status(404).json({ error: "Item not found" });

  item.quantity += change;

  if (item.quantity <= 0) {
    cart.products = cart.products.filter(
      (p) => p.productId !== productId
    );
  }

  await cart.save();
  res.status(200).json(cart);
};

// =======================
// REMOVE ITEM
// =======================
const removeItem = async (req, res) => {
  const productId = Number(req.params.id);
  const userId = req.userData.id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.products = cart.products.filter(
    (p) => p.productId !== productId
  );

  await cart.save();
  res.status(200).json(cart);
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
};
