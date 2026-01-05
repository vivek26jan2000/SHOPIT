import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";

// import all routes here
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auths.js";
import orderRoutes from "./routes/order.js";

const app = express();

// uncaught Exception handling
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// set the env
dotenv.config({ path: "backend/config/config.env" });

// connect to database
connectDatabase();

// parse the body
// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
// parse the cookies
app.use(cookieParser());

// using routes here
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);

// it's for handling errors
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server start at the port:${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
