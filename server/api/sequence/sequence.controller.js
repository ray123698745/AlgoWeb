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

        log.debug("Query object: ", query);

        Sequence.find(query, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) {
                log.debug("Result error: ", err);
                throw err;
            } else{
                log.debug("Result found: ", sequence);
                res.send(sequence);
            }
        });

    },

    insert: function(req, res) {

        log.debug('Insert: ', req.body);

        var data = {
            location: req.body.location,
            keywords: req.body.keywords,
            gps: req.body.gps,
            avg_speed: req.body.avg_speed,
            capture_time: req.body.capture_time,
            frame_number: req.body.frame_number,
            usage: req.body.usage,
            file_location: req.body.file_location,
            cameras: req.body.cameras
        };

        log.debug('data: ', data);


        var newSequence = new Sequence(data);

        newSequence.save(function (err, data) {
            if (err) {
                log.debug("Insert failed: ", err);
                // rollback
            } else {
                log.debug('Saved : ', data );
                res.status(200);
                res.send({res: 'ok', _id: data._id});
            }
        });

    },

    update: function(req, res) {

        log.debug('keywords: ', req.body);

        var data = {
            condition: req.body.condition,
            update: req.body.update,
            options: req.body.options,
        };

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

        log.debug('insertUnfiltered: ', req.body);

        var data = {
            title: req.body.title,
            capture_time: req.body.capture_time,
            frame_number: req.body.frame_number,
            file_location: req.body.file_location,
            cameras: req.body.cameras
        };


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

        unfilteredSequence.find({$where: 'this.cameras[0].annotate_request.length > 0' }, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });

        // unfilteredSequence
        //     .aggregate({ $match: { age: { $gte: 21 }}})
        //     .unwind('$cameras[0].annotate_request')
        //     .exec(function(err, sequence) {
        //         if (err) throw err;
        //
        //         res.send(sequence);
        //     });


        // unfilteredSequence.aggregate([
        //     // { $match: {
        //     //     _id: '$_id'
        //     // }},
        //     { $unwind: "$cameras" },
        //     { $unwind: "$annotate_request" }
        //     // { $group: {
        //     //     _id: "$_id",
        //     //     sumPriority: { $sum: "$cameras[0].annotate_request.priority"  }
        //     // }}
        // ], function(err, sequence) {
        //     if (err) throw err;
        //     log.debug('aggregate: ', sequence );
        //
        //     res.send(sequence);
        // });
    },

    updateUnfiltered: function(req, res) {

        log.debug('keywords: ', req.body);

        var data = {
            condition: req.body.condition,
            update: req.body.update,
            options: req.body.options,
        };

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

    }

};

// GET example:
// http://example.com/api/users?id=4&token=sdfa3&geo=us

// routes will go here
// app.get('/api/users', function(req, res) {
//     var user_id = req.param('id');
//     var token = req.param('token');
//     var geo = req.param('geo');
//
//     res.send(user_id + ' ' + token + ' ' + geo);
// });




// module.exports = function(app) {
//
//
//

//     app.use(bodyParser.json());
//     app.use(bodyParser.urlencoded({ extended: true }));
//
//     app.get('/api/todos/:uname', function(req, res) {
//
//         Sequences.find({ username: req.params.uname }, function(err, todos) {
//             if (err) throw err;
//
//             res.send(todos);
//         });
//
//     });
    //
    // app.get('/api/todo/:id', function(req, res) {
    //
    //     Sequence.findById({ _id: req.params.id }, function(err, todo) {
    //        if (err) throw err;
    //
    //        res.send(todo);
    //    });
    //
    // });
    //
    // app.post('/api/todo', function(req, res) {
    //
    //     if (req.body.id) {
    //         Todos.findByIdAndUpdate(req.body.id, { todo: req.body.todo, isDone: req.body.isDone, hasAttachment: req.body.hasAttachment }, function(err, todo) {
    //             if (err) throw err;
    //
    //             res.send('Success');
    //         });
    //     }
    //
    //     else {
    //
    //        var newTodo = Todos({
    //            username: 'test',
    //            todo: req.body.todo,
    //            isDone: req.body.isDone,
    //            hasAttachment: req.body.hasAttachment
    //        });
    //        newTodo.save(function(err) {
    //            if (err) throw err;
    //            res.send('Success');
    //        });
    //
    //     }
    //
    // });
    //
    // app.delete('/api/todo', function(req, res) {
    //
    //     Todos.findByIdAndRemove(req.body.id, function(err) {
    //         if (err) throw err;
    //         res.send('Success');
    //     })
    //
    // });

// }
