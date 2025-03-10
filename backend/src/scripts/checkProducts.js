const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

async function checkProducts() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");

    const products = await Product.find({});

    console.log("\nProduct List:");
    products.forEach((product) => {
      console.log(`\nID: ${product._id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Image URL: ${product.imageUrl}`);
      console.log(`Category: ${product.category}`);
      console.log(`Price: ${product.price}`);
      console.log(`Inventory: ${product.inventory}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkProducts();
