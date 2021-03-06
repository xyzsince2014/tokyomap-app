const httpStatus = require("http-status-codes");

const authenticate = (req, res) => {
  if(req.isAuthenticated()) {
    res.status(httpStatus.OK).json({
      isAuthenticated: true,
      user: {userId: req.user.userId}
    });
    return;
  }

  res.status(httpStatus.FORBIDDEN).json({
    isAuthenticated: false,
  });
};

const signout = (req, res) => {
  req.logout();
  res.redirect(process.env.DOMAIN_WEB);
};

module.exports = {
  authenticate,
  signout
};
