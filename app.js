var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var forceSsl = require('express-force-ssl');
var ServiceData = require("./bin/serviceData");
var helmet = require('helmet');
var RateLimit = require('express-rate-limit');
var compression = require('compression');

var apiLimiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100,
    delayMs: 0 // disabled
});

/** předání objectu do ROUTE **/
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(compression());
/** nastavení bezpečnostních hlaviček **/
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"]
    }
}));
app.use(helmet.referrerPolicy({ policy: 'origin' }));
app.use(helmet());
process.env.NODE_ENV === 'production' && app.use(forceSsl); /** přesměrování na https **/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use('/api/', apiLimiter); /** limit pro requesty kvůli přehlcení požadavky **/
app.use('/api', index(new ServiceData()));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
