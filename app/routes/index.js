const router = require("express").Router();

const authRouter = require("./auth");
const errorRouter = require("./error");

module.exports = passport => {
  router
    .use("/auth", authRouter(passport))
    .use("/", errorRouter);

  return router;
};
