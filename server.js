require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");

const createDB = require("./config/db");
createDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Hello Express" });
});

app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/cart", cartRouter);       // ✅ auth handled in routes
app.use("/orders", ordersRouter);   // ✅ auth handled in routes

app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userData.id).select("-password");
  res.status(200).json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
