const httpStatus = require("http-status-codes")

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
  res.redirect(process.env.DOMAIN_DEV);
};

module.exports = {
  verify,
  signout
};
