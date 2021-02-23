require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var index_router = require('./routes/index');
var locations_router = require('./routes/location');
var channels_router = require('./routes/channel');

function create_server() {
    const app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    //~ app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', index_router);
    app.use('/v1/locations', locations_router);
    app.use('/v1/channels', channels_router); 

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
      res.json({ 'message' : err.message});
    });
    
    return app
}

module.exports = create_server;
