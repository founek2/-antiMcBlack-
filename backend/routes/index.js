var express = require('express');
var router = express.Router();

/* GET home page. */



module.exports = function (ServiceData) {

    router.get('/json', function(req, res, next) {
        let json = ServiceData.getObjectParser();
        const date0 = new Date();
        let date = new Date();
        const numberOfday = date0.getDay()-1;
        if(numberOfday === 5) date = new Date(date0.getFullYear(), date0.getMonth(), date0.getDate() +2)
        if(numberOfday === -1) date = new Date(date0.getFullYear(), date0.getMonth(), date0.getDate() +1)
        date = date.getHours() >= 19 ? new Date(date.getFullYear(), date.getMonth(), date.getDate()+1) : date;
        date.setHours(0, 0, 0, 0);
        /** odpověď na požadavek **/
        res.send({jsonObject: json.origCopy, date: date, suplDates: json.suplDates, original: json.original, hours: json.hours});
    });

    return router;
};
