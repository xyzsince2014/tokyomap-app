const httpStatus = require("http-status-codes")

const verify = (req, res) => {
  if (req.user) {
    res.json({
      status: httpStatus.OK,
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }

  res.json({
    status: httpStatus.FORBIDDEN,
    success: false,
    message: "user failed to authenticate."
  });
};

// const notifyLoginFailure = (req, res) => {
  // res.status(401).json({
  //   success: false,
  //   message: "user failed to authenticate."
  // });
// };

const signout = (req, res) => {
  req.logout();
  res.redirect(process.env.DOMAIN_DEV);
};

module.exports = {
  verify,
  // notifyLoginFailure,
  signout
};
