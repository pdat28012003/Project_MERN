const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Lấy danh sách đơn hàng của user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId")
      .sort("-createdAt");

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

// Lấy chi tiết đơn hàng
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin đơn hàng",
      error: error.message,
    });
  }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống",
      });
    }

    // Kiểm tra số lượng tồn kho
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product.name} không đủ số lượng trong kho`,
        });
      }
    }

    // Tạo đơn hàng
    const order = await Order.create({
      userId: req.user._id,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
    });

    // Cập nhật số lượng tồn kho
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { inventory: -item.quantity },
      });
    }

    // Xóa giỏ hàng
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tạo đơn hàng",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái đơn hàng (chỉ admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: "pending",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng hoặc đơn hàng không thể hủy",
      });
    }

    // Hoàn lại số lượng tồn kho
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { inventory: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Đã hủy đơn hàng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể hủy đơn hàng",
      error: error.message,
    });
  }
};
