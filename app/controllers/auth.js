const statusCodes = require("http-status-codes");

const authenticate = (req, res) => {
  if(req.isAuthenticated()) {
    res.status(statusCodes.OK).json({userId: req.user.userId});
    return;
  }

  res.status(statusCodes.UNAUTHORIZED).json({userId: ''});
};

const signout = (req, res) => {
  req.logout();
  res.redirect(process.env.DOMAIN_WEB);
};

module.exports = {
  authenticate,
  signout
};
