const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  placeOrder,
  getOrders,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/", auth, placeOrder);
router.get("/", auth, getOrders);
router.delete("/:id", auth, cancelOrder);

module.exports = router;

