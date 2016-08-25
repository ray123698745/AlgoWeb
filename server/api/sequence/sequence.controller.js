'use strict';

var Sequence = require('./sequence.model.js').sequence;
var unfilteredSequence = require('./sequence.model.js').unfilteredsequence;

var log = require('log4js').getLogger('db');


module.exports = {

    index: function(req, res) {

        Sequence.find({}, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });
    },

    findByID: function(req, res) {

        Sequence.find({ _id: req.params.id }, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });
    },

    result: function(req, res) {

        var query = req.body;

        // log.debug("Query object: ", query);

        Sequence.find(query, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) {
                log.debug("Result error: ", err);
                throw err;
            } else{
                // log.debug("Result found: ", sequence);
                res.send(sequence);
            }
        });

    },

    insert: function(req, res) {

        // log.debug('Insert: ', req.body);
        var query = req.body;

        // log.debug('query: ', query);

        var newSequence = new Sequence(query);

        newSequence.save(function (err, data) {
            if (err) {
                log.debug("Insert failed: ", err);
                // rollback
            } else {
                log.debug('Saved : ', data );
                res.status(200);
                res.send({res: 'ok'});
            }
        });


        // for (var i = 0; i < queries.length; i++){
        //
        //     log.debug('query: ', queries[i]);
        //
        //     var newSequence = new Sequence(queries[i]);
        //
        //     newSequence.save(function (err, data) {
        //         if (err) {
        //             log.debug("Insert failed: ", err);
        //             // rollback
        //         } else {
        //             log.debug('Saved : ', data );
        //             done++;
        //             if(done == queries.length){
        //                 res.status(200);
        //                 res.send({res: 'ok'});
        //                 // res.send(data);
        //             }
        //
        //         }
        //     });
        // }

    },

    getUnfinished: function(req, res) {

        // Change condition to not all state == Accepted

        Sequence.find( {$or: [
            { 'cameras.0.annotation': { $elemMatch: { state: "Pending"} }},
            { 'cameras.0.annotation': { $elemMatch: { state: "Annotating"} }},
            { 'cameras.0.annotation': { $elemMatch: { state: "Reviewing"} }},
            { 'cameras.0.annotation': { $elemMatch: { state: "Finished"} }},
            { 'cameras.0.annotation': { $elemMatch: { state: "Modifying"} }}

        ] }, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) throw err;

            // log.debug('getUnfinished: ' + sequence);

            res.send(sequence);
        });

        // Sequence.
        // find().
        // // where('cameras[0].annotation.length').gt(0).
        // // elemMatch('this.cameras[0].annotation', {"category":"Finished"}).
        // // where('age').gt(17).lt(66).
        // // where('likes').in(['vaporizing', 'talking']).
        // // limit(10).
        // sort('-capture_time').
        // // select('name occupation').
        // exec(function(err, sequence) {
        //     if (err) throw err;
        //     console.log('sequence: ' + sequence);
        //
        //     res.send(sequence);
        // });
    },

    getAccepted: function(req, res) {

        // Change condition to not all state == Accepted

        Sequence.find( { 'cameras.0.annotation': { $elemMatch: { state: "Accepted"} } }, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) throw err;

            // log.debug('getUnfinished: ' + sequence);

            res.send(sequence);
        });

        // Sequence.
        // find().
        // // where('cameras[0].annotation.length').gt(0).
        // // elemMatch('this.cameras[0].annotation', {"category":"Finished"}).
        // // where('age').gt(17).lt(66).
        // // where('likes').in(['vaporizing', 'talking']).
        // // limit(10).
        // sort('-capture_time').
        // // select('name occupation').
        // exec(function(err, sequence) {
        //     if (err) throw err;
        //     console.log('sequence: ' + sequence);
        //
        //     res.send(sequence);
        // });
    },


    update: function(req, res) {

        var data = req.body;

        log.debug('data: ', data);


        Sequence.update(data.condition, data.update, data.options, function(err, numAffected) {
            if (err) {
                log.debug("Result error: ", err);
                throw err;
            } else{
                log.debug("numAffected: ", numAffected);
                res.send(numAffected);
            }
        });

    },

    insertUnfiltered: function(req, res) {


        var data = req.body;

        log.debug('data: ', data);

        var newUnfilteredSequence = new unfilteredSequence(data);

        newUnfilteredSequence.save(function (err, data) {
            if (err) {
                log.debug("insertUnfiltered failed: ", err);
                // rollback
            } else {
                log.debug('Saved : ', data );
                res.status(200);
                res.send({res: 'ok', _id: data._id});
            }
        });

    },

    getAllUnfiltered: function(req, res) {

        unfilteredSequence.find({}, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });

    },

    getRequested: function(req, res) {

        unfilteredSequence.find({$where: 'this.cameras[0].annotation.length > 0' }, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });
    },

    updateUnfiltered: function(req, res) {


        var queries = req.body;
        log.debug('queries: ', queries);

        var numUpdated = 0;

        for (var i = 0; i < queries.length; i++){

            log.debug('condition: ', queries[i].condition);
            log.debug('update: ', queries[i].update);
            log.debug('options: ', queries[i].options);


            unfilteredSequence.update(queries[i].condition, queries[i].update, queries[i].options, function(err, numAffected) {
                if (err) {
                    log.debug("Result error: ", err);
                    throw err;
                } else{
                    log.debug("numAffected: ", numAffected);
                    numUpdated += numAffected.nModified;
                    if (numUpdated === queries.length)
                        res.send(numUpdated + " Sequence selected!");
                }
            });
        }

    }

};
