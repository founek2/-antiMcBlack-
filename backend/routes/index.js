  var express = require('express');
var router = express.Router();
var  path =  require('path');

router.get('trida/:id', function(req, res, next) {
      res.sendFile('index.html', { root: path.join(__dirname, '../public') });
  });

router.get("intranet", function(req, res, next) {
    res.sendFile("index.html", {
          root: path.join(__dirname, "../public/intranet")
    });
});

module.exports = router;
