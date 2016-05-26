'use strict';

var Sequence = require('./sequence.model.js');

module.exports = {

    index: function(req, res) {
        
        Sequence.find({}, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });
    },
    sequenceID: function(req, res) {

        Sequence.find({ sequenceID: req.params.sequenceID }, function(err, sequence) {
            if (err) throw err;

            res.send(sequence);
        });
    },

    result: function(req, res) {

        var data = req.body;

        console.log(req.body);

        // res.send(data);


        Sequence.find({
            // location: req.body.location,
            weather: req.body.weather,
            theme: req.body.theme
            }

            , function(err, sequence) {
                if (err) throw err;

                res.send(sequence);
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