/**
 * Created by rayfang on 6/26/16.
 */
'use strict';

var Sequence = require('../sequence/sequence.model.js');
var log = require('log4js').getLogger('command');
var spawn = require('child_process').spawn;
var kue = require('kue');
var queue = kue.createQueue();


queue.process('update_db', function (job, done){


    console.log('update_db: ', job.id);

    // Sequence.update(data.condition, data.update, data.options, function(err, numAffected) {
    //     if (err) {
    //         log.debug("Result error: ", err);
    //         throw err;
    //     } else{
    //         log.debug("numAffected: ", numAffected);
    //         res.send(numAffected);
    //     }
    // });

    done(null, 'update_db_done');

});


module.exports = {

    encode: function(req, res) {

        log.debug('path: ' + req.body.path);
        log.debug('ituner: ' + req.body.ituner);
        log.debug('is stereo: ' + req.body.isStereo);



        if (req.body.isStereo) {

            log.debug('add job1');

            var encodeLeft = queue.create('encode', {
                path: req.body.path,
                ituner: req.body.ituner
            });
            encodeLeft.save();

            log.debug('add job2');


            var encodeRight = queue.create('encode', {
                path: req.body.path,
                ituner: req.body.ituner
            });
            encodeRight.save();

        } else {

            var encode = queue.create('encode', {
                path: req.body.path,
                ituner: req.body.ituner
            });
            encode.save();

        }


        res.send(req.body);


    }


}
