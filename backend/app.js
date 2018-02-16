var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var RateLimit = require('express-rate-limit');
var compression = require('compression');

var ServiceData = require("./bin/serviceData");
var routeApi = require('./routes/api');
var routeIndex = require('./routes/index');
var routeIntranet = require('./routes/intranet');
var forceSsl = require('force-ssl')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(compression());
/** nastavení bezpečnostních hlaviček **/
 app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"]
    }
}));
app.use(helmet.referrerPolicy({ policy: 'origin' }));

process.env.NODE_ENV === 'production' && app.use(forceSsl); /** přesměrování na https **/
process.env.NODE_ENV === 'production' && app.use(helmet());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var apiLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 100,
  delayMs: 0 // disabled
});
app.use('/api/', apiLimiter);
app.use('/api', routeApi(new ServiceData()));
app.use('/intranet', routeIntranet);
app.use('/', routeIndex)
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
