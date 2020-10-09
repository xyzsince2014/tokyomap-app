const httpStatus = require("http-status-codes")

const CLIENT = "http://localhost:3000"; // todo: use process.env.DOMAIN_CLIENT

const verify = (req, res) => {
  if (req.user) {
    res.status(httpStatus.OK).json({
      isAuthenticated: true,
      user: req.user,
      cookies: req.cookies
    });
    return;
  }

  res.status(httpStatus.FORBIDDEN).json({
    isAuthenticated: false,
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
