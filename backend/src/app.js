const express = require("express");
const router = require("./router.js");

const app = express();

app.use(router);

module.exports = app;