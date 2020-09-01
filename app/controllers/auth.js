const httpStatus = require("http-status-codes")

const CLIENT = "http://localhost:3000";

const verify = (req, res) => {
  if (req.user) {
    res.status(httpStatus.OK).json({
      authenticated: true,
      user: req.user,
      cookies: req.cookies
    });
  }

  res.status(httpStatus.FORBIDDEN).json({
    authenticated: false,
  });
};

const signout = (req, res) => {
  req.logout();
  res.redirect(CLIENT);
};

module.exports = {
  verify,
  signout
};
