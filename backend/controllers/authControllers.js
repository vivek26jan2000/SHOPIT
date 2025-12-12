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

// current login user ==> api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
});

// update password ==> api/v1/update/password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  const isPasswordMatched = await user.isPasswordCorrect(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("OldPassword is incorrect", 400));
  }

  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    success: true,
  });
});

// update profile ==> api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req?.user?._id, newData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// get all users (admin) ==> api/v1/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

// get user details (admin) ==> api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User is not found with id:${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    user,
  });
});

//  update user (admin) ==> api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req?.user?._id, newData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// delete user (admin) ==> api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User is not found with id:${req.params.id}`, 404)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
