const router = require("express").Router();

const authRouter = require("./auth");
const homeRouter = require("./home");
const errorRouter = require("./error");

module.exports = passport => {
  router
    .use("/auth", authRouter(passport))
    .use("/", homeRouter);
    // .use("/", errorRouter);

  return router;
};
