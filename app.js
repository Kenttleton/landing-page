var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var astronomyRouter = require('./routes/astronomy');
var gochatRouter = require('./routes/gochat');

var app = express();

app.set('trust proxy', 'loopback')
app.use(logger(function (tokens, req, res){
  var tokens = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' | ');
  return `${tokens}\nRequest | ${req}\nResponse | ${res}`;
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/GoChat', gochatRouter);
app.use('/astronomy', astronomyRouter);
app.use('/users', usersRouter);

module.exports = app;
