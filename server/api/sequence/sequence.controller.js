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

        var queries = req.body;


        for (var i = 0; i < queries.length; i++){

            log.debug('query: ', queries[i]);

            var newSequence = new Sequence(queries[i]);

            newSequence.save(function (err, data) {
                if (err) {
                    log.debug("Insert failed: ", err);
                    // rollback
                } else {
                    log.debug('Saved : ', data );
                    res.status(200);
                    // res.send({res: 'ok'});
                    res.send(data);

                }
            });


            // use job queue to:

            // 1. create request folder and package
            // 2. remove unselected sequence
            // 3. start raw to yuv process
            // 4. update db

        }

    },

    getUnfinished: function(req, res) {

        // Change condition to state != finish

        Sequence.find({$where: 'this.cameras[0].annotation.length > 0' }, null, {sort: {capture_time: -1}}, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });
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
