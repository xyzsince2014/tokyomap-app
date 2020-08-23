const httpStatus = require("http-status-codes");

const logErrors = (err, req, res, next) => {
  console.log(err.stack); // logs the error stack
  next(err);
};

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
  logErrors,
  respondNotFound,
  respondInternalServerError
};
