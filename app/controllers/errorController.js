const httpStatus = require("http-status-codes");

const respondNotFound = (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    isAuthenticated: false,
    message: "Not Found",
  });
};

const respondInternalServerError = (req, res) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    isAuthenticated: false,
    message: "Internal Server Error",
  });
};

module.exports = {
  respondNotFound,
  respondInternalServerError
};
