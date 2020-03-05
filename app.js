var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
require('dotenv').config()

var index_route = require('./routes/index');
var auth_route = require('./routes/auth');
var onboard_route = require('./routes/onboard');
var sharepoint_route = require('./routes/sharepoint');
var mail_route = require('./routes/mail');
var license_route = require('./routes/license');
var group_route = require('./routes/group');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public\\images', 'favicon.ico')));

app.use('/', index_route);
app.use('/auth', auth_route);
app.use('/onboard', onboard_route);
app.use('/sharepoint', sharepoint_route);
app.use('/mail', mail_route);
app.use('/license', license_route);
app.use('/group', group_route);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
