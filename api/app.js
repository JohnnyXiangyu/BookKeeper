var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require("body-parser");

var loginAPI = require("./routes/login");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use body-parser to parse POST request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use given static path
app.use(express.static(path.join(__dirname, "../frontend/build")));

// use cors to enable localhost
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// use login router
app.use("/login", loginAPI);

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
