import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

// check if the user is login or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // get the token from  cookie
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }

  // verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECERT);

  //   console.log("decode", decoded);

  //get the currecnt user
  const user = await User.findById(decoded.id);

  //   console.log("user", user);

  //   user not found
  if (!user) {
    return next(new ErrorHandler("Invalid token", 401));
  }

  //   mounted the user
  req.user = user;

  next();
});

// authorized the roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to  access this resource`,
          403
        )
      );
    }
    next();
  };
};
