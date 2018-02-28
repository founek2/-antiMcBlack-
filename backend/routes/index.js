var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
var path = require("path");
var sqlite = require("sqlite");
var Promise = require("bluebird");



var db;
const dbPromise = sqlite
      .open("./db.sqlite", { Promise })
      .then(con => {
		con.run('CREATE TABLE IF NOT EXISTS log (ID INTEGER PRIMARY KEY, time INTEGER, cmd TEXT)')
            console.log("connected to db");
            db = con;
      })
      .catch(e => console.log(e));
var fetchesFront = [];

var saveDataToLog = function(date, cmd) {
      console.log("saved");
      db.run("INSERT INTO log (time, cmd) VALUES (?, ?)", date.getTime(), cmd);
};
var handleSendReq = function() {
      var item = fetchesFront[0];

      if (item) {
            saveDataToLog(new Date(), item.res.req.body.command);
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
            fetch("http://fourpoint.tk:7867/intranetapiproxy", {
                  method: "POST",
                  body: JSON.stringify(req.body),
                  headers: req.headers
            });

      fetchesFront.push({ fetch: re, res: res });
});

module.exports = router;
