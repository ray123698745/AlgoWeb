/**
 * Created by rayfang on 9/14/16.
 */
'use strict';

var annotationBatch = require('./annotation.model.js');
var log = require('log4js').getLogger('annotation');


module.exports = {

    insertBatch: function(req, res) {

        var query = req.body;

        log.debug('query: ', query);

        var newAnnotationBatch = new annotationBatch(query);

        log.debug('20');

        newAnnotationBatch.save(function (err, data) {
            if (err) {
                log.debug("insertBatch failed: ", err);
            } else {
                log.debug('Saved : ', data );
                res.status(200);
                res.send({res: 'ok', _id: data._id});
            }
        });
    },

    removeBatch: function(req, res) {

        var query = req.body;

        log.debug('query: ', query);

        annotationBatch.remove( query, function(err, result) {
            if (err) throw err;


            res.send(result);
        });
    }

};




