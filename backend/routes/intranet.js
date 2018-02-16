var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
var  path =  require('path');

router.post('/api', function(req, res, next) {
    req.headers.host = "api.spse.cz";
    req.headers.origin = "https://i3.spse.cz";
    req.headers.referer = "https://i3.spse.cz/";
    console.log(req.headers)
    fetch("https://api.spse.cz/i3/index.php",
        {method:"POST",
         body:JSON.stringify(
             req.body
        ),
        headers: req.headers
    }).then((response)=>response.json()).then((json)=>
        res.send(JSON.stringify(json))
    )
    /** odpověď na požadavek **/
});

router.get('/', function(req, res, next) {
      res.sendFile('index.html', { root: path.join(__dirname, '../public/intranet') });
  });


module.exports = router;
