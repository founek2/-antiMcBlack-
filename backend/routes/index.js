var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
var path = require("path");
var Promise = require("bluebird");


var fetchesFront = [];

var handleSendReq = function() {
      var item = fetchesFront[0];

      if (item) {
            item
                  .fetch()
                  .then(response => response.json())
                  .then(json => item.res.send(JSON.stringify(json)))
                  .catch(e => item.res.status(204).send({ status: "forbidden" }));
            fetchesFront.splice(0, 1);
            console.log("handle");
      }
};

setInterval(handleSendReq, 600);

router.post("/api", function(req, res, next) {
      req.headers.host = "api.spse.cz";
      req.headers.origin = "https://i3.spse.cz";
      req.headers.referer = "https://i3.spse.cz/";

      var re = () =>
     //       fetch("http://10.8.0.10:3333/intranetapiproxy", {
      fetch("https://api.spse.cz/i3/index.php", {
                  method: "POST",
                  body: JSON.stringify(req.body),
                  headers: req.headers
            });

      fetchesFront.push({ fetch: re, res: res });
});

module.exports = router;
