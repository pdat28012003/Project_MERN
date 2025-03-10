const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả sản phẩm là bắt buộc"],
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá không thể âm"],
    },
    imageUrl: {
      type: String,
      required: [true, "Hình ảnh sản phẩm là bắt buộc"],
    },
    inventory: {
      type: Number,
      required: [true, "Số lượng tồn kho là bắt buộc"],
      min: [0, "Số lượng tồn kho không thể âm"],
    },
    category: {
      type: String,
      required: [true, "Danh mục sản phẩm là bắt buộc"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
