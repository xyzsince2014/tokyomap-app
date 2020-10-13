const httpStatus = require("http-status-codes")

const CLIENT = "http://localhost:3000"; // todo: use process.env.DOMAIN_CLIENT

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
  res.redirect(CLIENT);
};

module.exports = {
  authenticate,
  signout
};
