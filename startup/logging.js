const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
module.exports = function () {
  // winston.handleExceptions(
  //   new winston.transports.File({ filename: "uncaughtException.log" })
  // );
  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost/vidly-app",
    level: "info",
  });
  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });
  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
    // throw ex;
  });
  // throw new Error("something is wrong");
  // const p = Promise.reject(new Error("unhandled is wrong"));
  // p.then(() => console.log("done"));
};
