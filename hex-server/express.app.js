const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./api");
const limiter = require("./utils/lateLimiter");

dotenv.config();

module.exports = async (app) => {

  app.use(limiter());
  app.use(cors());
  app.use(express.json({ extended: true }, { limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }, { limit: "10mb" }));
  app.use(express.static(__dirname + "/public"));

  app.use(routes);
};
