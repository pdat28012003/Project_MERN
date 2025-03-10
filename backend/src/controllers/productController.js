const Product = require("../models/Product");

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      category,
      search,
    } = req.query;

    // Xây dựng query
    let query = {};

    // Lọc theo danh mục nếu có
    if (category) {
      query.category = category;
    }

    // Tìm kiếm theo tên sản phẩm nếu có
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

// Lấy chi tiết sản phẩm
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin sản phẩm",
      error: error.message,
    });
  }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể tạo sản phẩm",
      error: error.message,
    });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể cập nhật sản phẩm",
      error: error.message,
    });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Sản phẩm đã được xóa",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa sản phẩm",
      error: error.message,
    });
  }
};
