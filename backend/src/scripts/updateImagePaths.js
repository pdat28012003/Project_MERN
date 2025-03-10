const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

async function updateImagePaths() {
  try {
    // Kết nối database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");

    // Lấy tất cả sản phẩm
    const products = await Product.find({});

    for (const product of products) {
      const imageUrl = product.imageUrl;

      // Lấy tên file từ URL hoặc đường dẫn
      let fileName;
      if (imageUrl.includes("/uploads/")) {
        fileName = imageUrl.split("/uploads/").pop();
      } else if (imageUrl.includes("\\")) {
        fileName = imageUrl.split("\\").pop();
      } else if (imageUrl.includes("/")) {
        fileName = imageUrl.split("/").pop();
      } else {
        fileName = imageUrl;
      }

      // Cập nhật lại đường dẫn
      const newImageUrl = `uploads/${fileName}`;

      await Product.findByIdAndUpdate(product._id, {
        imageUrl: newImageUrl,
      });

      console.log(`Updated image path for product ${product._id}:`);
      console.log(`  From: ${imageUrl}`);
      console.log(`  To: ${newImageUrl}`);
    }

    console.log("Finished updating image paths");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateImagePaths();
