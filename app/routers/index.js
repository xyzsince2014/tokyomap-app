const router = require("express").Router();

const authRouter = require("./authRouter");
const errorRouter = require("./errorRouter");

module.exports = () => {
  router
    .use("/auth", authRouter())
    .use("/", errorRouter);

  return router;
};
