import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";

// import all routes here
import productRoutes from "./routes/products.js";

const app = express();

// set the env
dotenv.config({ path: "backend/config/config.env" });

// connect to database
connectDatabase();

// parse the body
app.use(express.json());

// using routes here
app.use("/api/v1", productRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `Server start at the port:${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
