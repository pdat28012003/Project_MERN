const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  login,
  register,
  updateProfile,
  changePassword,
  getProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

// Validation rules
const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
];

const registerValidation = [
  body("name").notEmpty().withMessage("Tên là bắt buộc"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
];

// Routes
router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;
