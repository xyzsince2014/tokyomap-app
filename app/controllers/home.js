const httpStatus = require("http-status-codes");

/**
 * if it's already login, send the profile response,
 * otherwise, send a 401 response that the user is not authenticated
 */
const index = (req, res) => {
  res.status(httpStatus.OK).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
};

const checkAuth = (req, res, next) => {
  if (!req.user) {
    res.status(httpStatus.UNAUTHORIZED).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};

module.exports = {
  index,
  checkAuth,
};
