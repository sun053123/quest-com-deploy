const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
const dotenv = require("dotenv");
const routes = require("./api");
const limiter = require("./utils/lateLimiter");

dotenv.config();

module.exports = async (app) => {

  app.use(limiter());
  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({extended: true},{ limit: "50mb" }));
  app.use(express.static(__dirname + "/public"));

  app.use(routes);
};
