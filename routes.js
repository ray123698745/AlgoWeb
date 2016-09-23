/**
 * Main application routes
 */

'use strict';

var path = require('path');

var express = require('express');

module.exports = function(app) {



    // Insert routes below
    app.use('/api/sequence', require('./server/api/sequence'));
    app.use('/api/script', require('./server/api/script'));
    app.use('/api/command', require('./server/api/command'));
    app.use('/api/upload', require('./server/api/upload'));
    app.use('/api/annotation', require('./server/api/annotation'));



    app.route('/*')
        .get(function(req, res) {
            res.render(path.join(__dirname, '/client/index.ejs'));
        });


    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


}
