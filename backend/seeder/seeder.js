import mongoose from "mongoose";
import Product from "../models/product.js";
import products from "./data.js";

const seeder = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/SHOPIT");
    console.log("Database connected successfully");

    await Product.deleteMany();
    console.log("All products deleted");

    await Product.insertMany(products);
    console.log("All products inserted");

    process.exit();
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit();
  }
};

seeder();
