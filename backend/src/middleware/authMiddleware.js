const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Không có token, quyền truy cập bị từ chối",
    });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Không có quyền admin",
    });
  }
};
