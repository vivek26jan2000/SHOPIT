import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ApiFilters from "../utils/apiFilters.js";

// get all products => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  // Implementing search functionality
  const apiFilters = new ApiFilters(Product, req.query).search().filters();

  let products = await apiFilters.query;

  const filteredProductsCount = products.length;
  const resPerPage = 4;

  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();
  // Return the products
  res.status(200).json({
    filteredProductsCount,
    resPerPage,
    products,
  });
});

// create new product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res, next) => {
  // add the login user id to the req body
  req.body.user = req.user._id;

  const newProduct = await Product.create(req.body);

  res.status(200).json({
    newProduct,
  });
});

// get product details => /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    next(new ErrorHandler("Product not found", 404));
    return;
  }

  res.status(200).json({
    product,
  });
});

// update product => /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  // if (!product) {
  //   return res.status(404).json({
  //     error: "Product not found",
  //   });
  // }
  if (!product) {
    next(new ErrorHandler("Product not found", 404));
    return;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    product,
  });
});

// delete product => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    next(new ErrorHandler("Product not found", 404));
    return;
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
  });
});
