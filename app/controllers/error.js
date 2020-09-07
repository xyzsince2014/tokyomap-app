const httpStatus = require("http-status-codes");

const respondNotFound = (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    authenticated: false,
    message: "Not Found",
  });
};

const respondInternalServerError = (req, res) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    authenticated: false,
    message: "Internal Server Error",
  });
};

module.exports = {
  respondNotFound,
  respondInternalServerError
};
