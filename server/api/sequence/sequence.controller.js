'use strict';

var Sequence = require('./sequence.model.js');
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

        console.log(query);
        log.debug("Result function");


        Sequence.find(query, function(err, sequence) {
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
            usage: req.body.usage,
            file_location: req.body.file_location,
            yuv: req.body.yuv,
            annotation: req.body.annotation
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
                res.send({res: 'ok', _id: data._id, origin_path: req.body.origin_path});
            }
        });

    }


}

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