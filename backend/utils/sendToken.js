export default (user, statusCode, res) => {
  // create a token
  const token = user.getJwtToken();

  // cookies options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //send the res
  res.status(statusCode).cookie("token", token, options).json({
    token,
  });
};
