const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Lấy giỏ hàng
exports.getCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    let cart;

    if (cartId) {
      cart = await Cart.findById(cartId).populate("items.product");
    }

    if (!cart) {
      cart = await Cart.create({ items: [] });
      res.cookie("cartId", cart._id, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy giỏ hàng",
      error: error.message,
    });
  }
};

// Thêm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log("Request body:", req.body);

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    console.log("Found product:", product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const cartId = req.cookies.cartId;
    console.log("Cart ID from cookie:", cartId);
    let cart;

    if (cartId) {
      cart = await Cart.findById(cartId);
      console.log("Found existing cart:", cart);
    }

    if (!cart) {
      cart = await Cart.create({ items: [] });
      console.log("Created new cart:", cart);
      res.cookie("cartId", cart._id, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "none",
        secure: true,
      });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    console.log("Existing item in cart:", existingItem);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    console.log("Updated cart:", cart);
    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Không thể thêm vào giỏ hàng",
      error: error.message,
    });
  }
};

// Cập nhật số lượng sản phẩm
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartId = req.cookies.cartId;

    if (!cartId) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật giỏ hàng",
      error: error.message,
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartId = req.cookies.cartId;

    if (!cartId) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    await cart.populate("items.product");

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa sản phẩm khỏi giỏ hàng",
      error: error.message,
    });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    if (!cartId) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa giỏ hàng",
      error: error.message,
    });
  }
};
