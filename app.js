var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var mIndexRouter = require('./routes/mIndex');
var mCalendarRouter = require('./routes/mCalendar');
var mGroupRouter = require('./routes/mGroup');
var mNewGroupRouter = require('./routes/mNewGroup');
var mNewOrderRouter = require('./routes/mNewOrder');
var mNewVoteRouter = require('./routes/mNewVote');
var mNoticeRouter = require('./routes/mNotice');
var mOrderRouter = require('./routes/mOrder');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/mIndex', mIndexRouter);
app.use('/mCalendar', mCalendarRouter);
app.use('/mGroup', mGroupRouter);
app.use('/mNewGroup', mNewGroupRouter);
app.use('/mNewOrder', mNewOrderRouter);
app.use('/mNewVote', mNewVoteRouter);
app.use('/mNotice', mNoticeRouter);
app.use('/mOrder', mOrderRouter);

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
