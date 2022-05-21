const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
const dotenv = require("dotenv");
const helmet = require("helmet");
const routes = require("./api");
const limiter = require("./utils/lateLimiter");
const HandleErrors = require('./utils/errorHandler')

dotenv.config();

module.exports = async (app) => {

  app.use(helmet());
  app.use(limiter());

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({extended: true},{ limit: "50mb" }));

  if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname + '/../client/build'));
  }

  app.use(routes);
  app.use(HandleErrors);
};
