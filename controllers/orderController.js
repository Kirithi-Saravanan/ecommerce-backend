const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// =======================
// PLACE ORDER
// =======================
const placeOrder = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { address, paymentMethod } = req.body;

    if (!address || !paymentMethod) {
      return res
        .status(400)
        .json({ error: "Address and payment method required" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const items = await Promise.all(
      cart.products.map(async (item) => {
        const product = await Product.findOne({
          product_id: item.productId,
        });

        return {
          productId: product.product_id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: item.quantity,
        };
      })
    );

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentStatus:
        paymentMethod === "COD" ? "Pending" : "Paid",
    });

    // clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order failed" });
  }
};

// =======================
// GET USER ORDERS
// =======================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.userData.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// CANCEL ORDER (SOFT DELETE)
// =======================
const cancelOrder = async (req, res) => {
  try {
    const userId = req.userData.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.orderStatus !== "Placed") {
      return res
        .status(400)
        .json({ error: "Order cannot be cancelled" });
    }

    order.orderStatus = "Cancelled";
    order.paymentStatus = "Failed";
    await order.save();

    res.status(200).json({ message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed" });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  cancelOrder,
};
