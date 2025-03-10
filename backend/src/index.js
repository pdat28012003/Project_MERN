const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:19006", "exp://192.168.1.5:19000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Phục vụ các file tĩnh từ thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Có lỗi xảy ra!",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
