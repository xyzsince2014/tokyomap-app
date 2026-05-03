const router = require("express").Router();

const authRouter = require("./authRouter");
const cognitoRouter = require("./cognitoRouter");
const errorRouter = require("./errorRouter");

module.exports = () => {
  router
    .use("/auth", authRouter())
    .use("/cognito", cognitoRouter())
    .use("/", errorRouter);

  return router;
};
