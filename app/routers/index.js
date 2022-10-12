const router = require("express").Router();

const authRouter = require("./authRouter");
const errorRouter = require("./errorRouter");

module.exports = passport => {
  router
    .use("/auth", authRouter(passport))
    .use("/", errorRouter);

  return router;
};
