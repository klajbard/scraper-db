"use strict";
const http = require("http");
const mongoose = require("mongoose");
const router = require("./router");

const urldb = process.ENV.urldb || "mongodb://localhost/scraper";
const host = process.ENV.hostname || "localhost";
const port = process.ENV.port || 8000;

mongoose.connect(urldb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database");
});

const server = http.createServer(router);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});