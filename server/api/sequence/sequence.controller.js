'use strict';

var Sequence = require('./sequence.model.js').sequence;
var unfilteredSequence = require('./sequence.model.js').unfilteredsequence;

var log = require('log4js').getLogger('db');
require('shelljs/global');
var util = require('util');

module.exports = {

    index: function(req, res) {

        Sequence.find({}, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });
    },

    genTitle: function(req, res) {


        var query = {
            capture_time: {"$gte": '2016-10-020T00:00:00.000Z', "$lte": '2016-10-25T00:00:00.000Z'}
        };

        log.debug(query);

        Sequence.find(query, {title: 1, _id: 0}, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) {
                log.debug("Result error: ", err);
                throw err;
            } else{

                var text = "";

                sequence.forEach(function (seq) {
                    text += seq.title + "\n";
                });

                res.send(text);
            }
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
        // console.log(util.inspect(query, false, null));

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
            { 'cameras.0.annotation': { $elemMatch: { state: "Finished_Basic"} }},
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

    // getRequested: function(req, res) {
    //
    //     unfilteredSequence.find({$where: 'this.cameras[0].annotation.length > 0' }, null, {sort: {capture_time: -1}}, function(err, sequence) {
    //         if (err) throw err;
    //
    //         res.send(sequence);
    //     });
    // },

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

    },


    removeUnfiltered: function (req, res) {

        unfilteredSequence.remove( {}, function(err, result) {
            if (err) throw err;

            res.send(result);
        });

    },

    deleteSequence: function (req, res) {

        log.debug('deleteSequence');

        var id = req.body.id;
        var path = req.body.path;

        rm('-rf', '/supercam' + path);

        Sequence.remove( {_id: id}, function(err, result) {
            if (err) throw err;

            log.debug('deleteSequence result: ' + result);

            res.send('ok!');
        });

    },

    addAnnotationRequest: function (req, res) {

        var params = req.body;
        numUpdated = 0;


        for (var i = 0; i < params.length; i++) {

            compareRequest(params[i], res, params.length);
        }

    },

    seqCount: function (req, res) {

        var countObj = req.body;
        // log.debug('countObj:', countObj);

        Sequence.count(countObj, function(err, result) {
            if (err) throw err;

            // log.debug('keywordCount result:', result);
            // log.debug('keyword:', keyword);
            // log.debug('key', req.body.key);

            res.send({
                count: result
            });
        });

    },

    allSeqCount: function (req, res) {

        Sequence.count({}, function(err, result) {
            if (err) throw err;

            // log.debug('allSeqCount result:', result);
            res.send({count: result});
        });

    },

    keywordCount: function (req, res) {

        var countObj = req.body.query;

        // log.debug('countObj:', countObj);

        Sequence.count(countObj, function(err, result) {
            if (err) throw err;

            // log.debug('keywordCount result:', result);
            // log.debug('keyword:', keyword);
            // log.debug('key', req.body.key);

            res.send({
                count: result,
                keyword: countObj.keywords,
                key: req.body.key
            });
        });

    },

    getAllGPS: function (req, res) {

        var countObj = req.body.query;

        // log.debug('countObj:', countObj);

        Sequence.find({"batchNum.country":"ITA", "batchNum.num":5},{title:1, gps:1, file_location:1, keywords:1},{sort: {capture_time: 1}}, function(err, result) {
            if (err) throw err;

            log.debug('result', result);

            res.send({result: result});

        });

    },

    getGPS: function (req, res) {

        var query = req.body;

        // log.debug('query:', query);

        Sequence.find(query,{title:1, gps:1, file_location:1, keywords:1},{sort: {capture_time: 1}}, function(err, result) {
            if (err) throw err;

            // log.debug('result', result);

            res.send({result: result});

        });

    }

};


var numUpdated = 0;
var compareRequest = function (param, res, totalRequest) {

    unfilteredSequence.find({_id: param.id}, function(err, sequence){

        if (err) throw err;

        var removeFreeSpace = false;
        var updateType = "$push";
        var index = 0;

        if (sequence[0].cameras[0].annotation.length > 0){

            for (var i = 0; i < sequence[0].cameras[0].annotation.length; i++){



                if (sequence[0].cameras[0].annotation[i].category == "free_space_with_curb"
                    && param.category == "free_space"){

                    param.category = "free_space_with_curb";
                    if (sequence[0].cameras[0].annotation[i].fps > param.fps)
                        param.fps = sequence[0].cameras[0].annotation[i].fps;
                    if (sequence[0].cameras[0].annotation[i].priority > param.priority)
                        param.priority = sequence[0].cameras[0].annotation[i].priority;
                }

                if (sequence[0].cameras[0].annotation[i].category == "free_space"
                    && param.category == "free_space_with_curb"){

                    removeFreeSpace = true;
                    if (sequence[0].cameras[0].annotation[i].fps > param.fps)
                        param.fps = sequence[0].cameras[0].annotation[i].fps;
                    if (sequence[0].cameras[0].annotation[i].priority > param.priority)
                        param.priority = sequence[0].cameras[0].annotation[i].priority;
                }

                if (sequence[0].cameras[0].annotation[i].category == param.category){
                    updateType = "$set";
                    if (sequence[0].cameras[0].annotation[i].fps > param.fps)
                        param.fps = sequence[0].cameras[0].annotation[i].fps;
                    if (sequence[0].cameras[0].annotation[i].priority > param.priority)
                        param.priority = sequence[0].cameras[0].annotation[i].priority;

                    index = i;
                }
            }
        }


        var updateObj = {};

        if (updateType == "$push"){

            updateObj = {$push: {
                "cameras.0.annotation": {
                    "category": param.category,
                    "fps": param.fps,
                    "priority": param.priority,
                    "state" : 'Pending',
                    "version" : [{version_number: 1, comments: "Initial request"}]
                }
            }};
        } else {
            var set_Obj = {};
            var set_key = "cameras.0.annotation." + index;

            set_Obj[set_key] = {
                "category": param.category,
                "fps": param.fps,
                "priority": param.priority,
                "state" : 'Pending',
                "version" : [{version_number: 1, comments: "Initial request"}]
            };

            updateObj = {$set: set_Obj};
        }

        var query = {
            condition: {_id: param.id},
            update: updateObj,
            options: {multi: false}
        };

        unfilteredSequence.update(query.condition, query.update, query.options, function(err, numAffected) {
            if (err) {
                log.debug("addAnnotationRequest Result error: ", err);
                throw err;
            } else{
                log.debug("addAnnotationRequest numAffected: ", numAffected);

                if(removeFreeSpace){

                    var query = {
                        condition: {_id: param.id},
                        update: {$pull: { 'cameras.0.annotation': { category: "free_space" } }},
                        options: {multi: false}
                    };

                    unfilteredSequence.update(query.condition, query.update, query.options, function(err, numAffected) {
                        if (err) {
                            log.debug("removeFreeSpace Result error: ", err);
                            throw err;
                        } else{
                            log.debug("removeFreeSpace numAffected: ", numAffected);
                            // numUpdated += numAffected.nModified;
                            numUpdated += 1;

                            if (numUpdated == totalRequest)
                                res.send("ok!");

                        }
                    });

                } else {
                    // numUpdated += numAffected.nModified;
                    numUpdated += 1;
                    if (numUpdated == totalRequest)
                        res.send("ok!");
                }


            }
        });
    });
};
