const ProductModel = require("./models/product-model");
const { createDocument, updateDocument } = require("./utils/db-methods");

module.exports = function (req, res) {
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
          res.writeHead(201);
        } else if (foundProduct.currentPrice > item.currentPrice) {
          ret = await updateDocument(item);
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
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
          res.writeHead(200);
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
        res.writeHead(400);
        res.end("Invalid request!");
        break;
      }
      console.log(req.method);
      if (req.method === "GET") {
        ProductModel.find({ name })
          .exec()
          .then((product) => {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
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
          const item = JSON.parse(body);
          ProductModel.updateOne(
            { name },
            { confirmed: item.confirmed, arukeresoUrl: item.arukeresoUrl }
          )
            .exec()
            .then((product) => {
              res.setHeader("Content-Type", "application/json");
              res.writeHead(200);
              res.end(JSON.stringify(product));
            })
            .catch((err) => {
              console.log(err);
              res.writeHead(500);
              res.end("Something went wrong. :(");
            });
        });
      }
      break;
    default:
      res.writeHead(404);
      res.end("Page not found. :(");
  }
};
