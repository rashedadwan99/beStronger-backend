const mongoose = require("mongoose");
const winston = require("winston");
module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log("connecting to mongoDB"));
};
