var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
var path = require("path");

var fetchesFront = [];
var handleSendReq = function() {
  var item = fetchesFront[0];

  if (item) {
    item
      .fetch()
      .then(response => response.json())
      .then(json => item.res.send(JSON.stringify(json)))
      .catch(e => item.res.status(403).send("forbidden"));
    fetchesFront.splice(0, 1);
    console.log("handle");
  }
};

setInterval(handleSendReq, 250);

router.post("/api", function(req, res, next) {
  if (false) {
    req.headers.host = "api.spse.cz";
    req.headers.origin = "https://i3.spse.cz";
    req.headers.referer = "https://i3.spse.cz/";

    var re = () =>
      fetch("https://api.spse.cz/i3/index.php", {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: req.headers
      });

    fetchesFront.push({ fetch: re, res: res });
  } else {
    res.send({ status: "critical", message: "pristup odepren" });
  }
});

router.get("/", function(req, res, next) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../public/intranet")
  });
});

module.exports = router;
