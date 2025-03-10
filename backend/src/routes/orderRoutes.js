const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// Tất cả các routes đều cần xác thực
router.use(protect);

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder).put(admin, updateOrderStatus);

router.post("/:id/cancel", cancelOrder);

module.exports = router;
