/**
 * Created by rayfang on 6/26/16.
 */
'use strict';
var log = require('log4js').getLogger('command');
var kue = require('kue');
var queue = kue.createQueue();


module.exports = {

    encode: function(req, res) {

        var seqObj = req.body.seqObj;
        var ituner = req.body.ituner;


        log.debug('seqObj: ' + seqObj);
        log.debug('ituner: ' + ituner);

        var encode = queue.create('encode', {
            sequenceObj: seqObj,
            ituner: ituner,
            isInitEncode: false,
            channel: 'left'
        });
        encode.save();

        encode = queue.create('encode', {
            sequenceObj: seqObj,
            ituner: ituner,
            isInitEncode: false,
            channel: 'right'
        });
        encode.save();

        // if (req.body.isStereo) {
        //
        //     log.debug('Add encode job left');
        //
        //     var encodeLeft = queue.create('encode', {
        //         inputPath: req.body.path + "/L/decompressed_raw",
        //         outputPath: req.body.path + "/L/yuv/temp",
        //         frameNum: req.body.frameNum,
        //         ituner: req.body.ituner
        //     });
        //     encodeLeft.save();
        //
        //     // log.debug('Add encode job right');
        //
        //     // var encodeLeft = queue.create('encode', {
        //     //     inputPath: req.body.path + "/R/decompressed_raw",
        //     //     outputPath: req.body.path + "/R/yuv/temp",
        //     //     frameNum: req.body.frameNum,
        //     //     ituner: req.body.ituner
        //     // });
        //     // encodeLeft.save();
        //
        // } else {
        //
        //     var encode = queue.create('encode', {
        //         path: req.body.path,
        //         ituner: req.body.ituner
        //     });
        //     encode.save();
        // }

        res.send('Request sent!');
    },

    processSequence: function (req, res) {

        log.debug('processSequence');

        var queries = req.body;
        var batchSequenceCount = 30;
        var parts = 1;
        var remains = 30;

        if(queries.length > 30){
            parts = parseInt(queries.length / 30)+1;
            remains = queries.length % 30;
        }

        for (var i = 0; i < parts; i++){

            if (i == parts-1) batchSequenceCount = remains;

            for (var j = 0; j < batchSequenceCount; j++){
                var processSequence = queue.create('processSequence', {
                    sequenceObj: queries[j],
                    batchSequenceCount: (batchSequenceCount - j)
                });
                processSequence.save();
            }
        }



        // for (var i = 0; i < queries.length; i++){
        //
        //     // log.debug('query: ', queries[i]);
        //
        //     // if(queries[i].title == '16-08-03-071110-it'){
        //     //     log.debug('title: ', queries[i].title);
        //     //
        //     //     var processSequence = queue.create('processSequence', {
        //     //         sequenceObj: queries[i]
        //     //     });
        //     //     processSequence.save();
        //     // }
        //
        //
        //     var processSequence = queue.create('processSequence', {
        //         sequenceObj: queries[i],
        //         batchSequenceCount: (queries.length - i)
        //     });
        //     processSequence.save();
        //
        // }

        res.send('Start processing');
    }


};





// When raw2yuv done
// queue.process('update_db', function (job, done){
//
//
//     console.log('update_db: ', job.id);
//
//     Sequence.update(data.condition, data.update, data.options, function(err, numAffected) {
//         if (err) {
//             log.debug("Result error: ", err);
//             throw err;
//         } else{
//             log.debug("numAffected: ", numAffected);
//             res.send(numAffected);
//         }
//     });
//
//
//
//     // move to version folder
//
//     done(null, 'update_db_done');
//
// });

// queue.process('import_db', function (job, done){
//
//
//     console.log('import_db: ', job.id);
//
//     // var newSequence = new Sequence(queries[i]);
//     //
//     // newSequence.save(function (err, data) {
//     //     if (err) {
//     //         log.debug("Insert failed: ", err);
//     //         // rollback
//     //     } else {
//     //         log.debug('Saved : ', data );
//     //         done++;
//     //         if(done == queries.length){
//     //             res.status(200);
//     //             res.send({res: 'ok'});
//     //             // res.send(data);
//     //         }
//     //
//     //     }
//     // });
//
//
//
//     // move to version folder
//
//     done(null, 'import_db_done');
//
// });


