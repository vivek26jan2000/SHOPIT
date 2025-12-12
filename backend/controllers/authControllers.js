import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";

// create a new user ==> api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const token = user.getJwtToken();

  res.status(200).json({
    token,
  });
});

// login user ==> api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email or password", 401));
  }

  const user = await User.findOne({ email }).select("+password");

  //user in not found
  if (!user) {
    return next(new ErrorHandler("Invalide email or password", 401));
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  //check the password
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalide email or password", 401));
  }

  // if the password an email is correct
  // send cookies and res
  sendToken(user, 200, res);
});

// logout user ==> api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged out",
  });
});
