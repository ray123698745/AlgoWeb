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



    // move to version folder

    done(null, 'update_db_done');

});


module.exports = {

    encode: function(req, res) {

        log.debug('path: ' + req.body.path);
        log.debug('ituner: ' + req.body.ituner);
        log.debug('is stereo: ' + req.body.isStereo);
        log.debug('frameNum: ' + req.body.frameNum);




        if (req.body.isStereo) {

            log.debug('Add encode job left');

            var encodeLeft = queue.create('encode', {
                inputPath: req.body.path + "/L/decompressed_raw",
                outputPath: req.body.path + "/L/yuv/temp",
                frameNum: req.body.frameNum,
                ituner: req.body.ituner
            });
            encodeLeft.save();

            // log.debug('Add encode job right');

            // var encodeLeft = queue.create('encode', {
            //     inputPath: req.body.path + "/R/decompressed_raw",
            //     outputPath: req.body.path + "/R/yuv/temp",
            //     frameNum: req.body.frameNum,
            //     ituner: req.body.ituner
            // });
            // encodeLeft.save();


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
