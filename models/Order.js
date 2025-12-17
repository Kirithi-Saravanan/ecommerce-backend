const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: Number,
        name: String,
        price: Number,
        image_url: String,
        quantity: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: ["Placed", "Cancelled", "Processing", "Shipped", "Delivered"],
      default: "Placed",
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
