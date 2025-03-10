const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Kết nối database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
    );
    console.log("Connected to MongoDB");

    // Xóa tài khoản admin cũ nếu có
    await User.deleteOne({ email: "admin@example.com" });
    console.log("Deleted old admin account if exists");

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Tạo tài khoản admin
    const admin = new User({
      name: "Administrator",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      fullName: "Administrator",
    });

    await admin.save();
    console.log("Admin account created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin account:", error);
    process.exit(1);
  }
};

createAdmin();
