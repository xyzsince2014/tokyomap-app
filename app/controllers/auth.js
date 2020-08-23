const index = (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
};

const notifyLoginFailure = (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
};

const logout = (req, res) => {
  req.logout();
  res.redirect(process.env.DOMAIN_DEV);
};

module.exports = {
  index,
  notifyLoginFailure,
  logout
};
