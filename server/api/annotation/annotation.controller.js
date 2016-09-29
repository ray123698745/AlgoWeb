/**
 * Created by rayfang on 9/14/16.
 */
'use strict';

var annotationBatch = require('./annotation.model.js');
var log = require('log4js').getLogger('annotation');
require('shelljs/global');


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

    getAllBatch: function(req, res) {

        annotationBatch.find({}, null, {sort: {batchName: -1}}, function(err, batch) {
            if (err) throw err;

            res.send(batch);
        });

    },

    removeBatch: function(req, res) {

        var id = req.body.id;
        var batchName = req.body.batchName;

        log.debug('removeBatch id: ', id);


        annotationBatch.remove( {_id: id}, function(err, result) {
            if (err) throw err;

            rm('/supercam/vol1/annotation/tasks_batch/' + batchName + '.tar.gz');
            log.debug('removeBatch done!: ' + result);

            res.send('ok!');
        });
    }

};




