const httpStatus = require("http-status-codes")

const authenticate = (req, res) => {
  if(req.isAuthenticated()) {
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
  res.redirect(process.env.DOMAIN_CLIENT);
};

module.exports = {
  authenticate,
  signout
};
