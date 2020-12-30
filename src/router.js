const ProductModel = require("./models/product-model");
const { createDocument, updateDocument } = require("./utils/db-methods");

module.exports = function (req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS, PATCH, POST',
    'Access-Control-Max-Age': 2592000,
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }
  switch (true) {
    case /\/add/.test(req.url):
      // '/add'
      let body = "";
      req.on("data", function (chunk) {
        body += chunk;
      });
      req.on("end", async function () {
        let ret = "Record not updated.";
        const item = JSON.parse(body);
        const foundProduct = await ProductModel.findOne({ name: item.name });
        if (!foundProduct) {
          ret = await createDocument(item);
          res.setHeader("Content-Type", "application/json");
          res.writeHead(201, headers);
        } else {
          ret = await updateDocument(item);
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200, headers);
        }
        res.end(ret);
      });
      break;
    case /\/products/.test(req.url):
      // '/products'
      ProductModel.find({})
        .exec()
        .then((products) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200, headers);
          res.end(JSON.stringify(products));
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    case /^\/product\/[^\/]+$/.test(req.url):
      // Get parameter from url as '/product/:name'
      const name = unescape(req.url.split("/")[2].split("?")[0]);
      if (!name) {
        res.writeHead(400, headers);
        res.end("Invalid request!");
        break;
      }
      if (req.method === "GET") {
        ProductModel.find({ name })
          .exec()
          .then((product) => {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200, headers);
            res.end(JSON.stringify(product));
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (req.method === "PATCH") {
        let body = "";
        req.on("data", function (chunk) {
          body += chunk;
        });
        req.on("end", async function () {
          console.log(body);
          console.log(name)
          const item = JSON.parse(body);
          ProductModel.updateOne(
            { name },
            { confirmed: item.confirmed, arukeresoUrl: item.arukeresoUrl }
          )
            .exec()
            .then((product) => {
              res.setHeader("Content-Type", "application/json");
              res.writeHead(200, headers);
              res.end(JSON.stringify(product));
            })
            .catch((err) => {
              console.log(err);
              res.writeHead(500, headers);
              res.end("Something went wrong. :(");
            });
        });
      }
      break;
    default:
      res.writeHead(404, headers);
      res.end("Page not found. :(");
  }
};
