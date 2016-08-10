/**
 * Created by rayfang on 6/26/16.
 */
'use strict';

var Sequence = require('../sequence/sequence.model.js').sequence;
var log = require('log4js').getLogger('upload');
require('shelljs/global');


module.exports = {

    uploadAnnotation: function(req, res) {


        var files = req.files;
        var path = req.body.path;
        var id = req.body.id;
        var index = req.body.index;
        var title = req.body.title;
        var category = req.body.category;



        // log.debug('files: ', files);
        // log.debug('path: ', path);
        // log.debug('id: ', id);
        // log.debug('index: ', index);
        // log.debug('title: ', title);
        // log.debug('category: ', category);


        // check if result.title match filename!!
        var fileName = title + '_' + category + '.json';
        var statFileName = title + '_' + category + '_stat.json';

        if ((files[0].originalname == fileName && files[1].originalname == statFileName) || (files[1].originalname == fileName && files[0].originalname == statFileName)){

            for (var i = 0; i < files.length; i++){
                // log.debug('original: ', __dirname + '/uploads/' + files[i].filename);
                // log.debug('dest: ', '/mnt/supercam' + path + '/Front_Stereo/annotation/' + files[i].originalname);
                mv(__dirname + '/uploads/' + files[i].filename, '/supercam' + path + '/Front_Stereo/annotation/' + files[i].originalname);
            }


            var set_obj = {};

            var state_key = 'cameras.0.annotation.' + index + '.state';
            set_obj[state_key] = 'Finished';

            var query = {
                condition: {_id: id},
                update: {$set: set_obj},
                options: {multi: false}
            };

            log.debug('query.condition: ', query.condition);
            log.debug('query.update: ', query.update);
            log.debug('query.options: ', query.options);


            Sequence.update(query.condition, query.update, query.options, function(err, numAffected) {
                if (err) {
                    log.debug("uploadAnnotation error: ", err);
                    throw err;
                } else{
                    log.debug("uploadAnnotation numAffected: ", numAffected);
                    res.send('Upload success!');
                }
            });
        } else {
            rm(__dirname + '/uploads/' + files[0].filename);
            rm(__dirname + '/uploads/' + files[1].filename);

            res.send('Wrong JSON file. \nSequence title or category doesn\'t match.');
        }
    }
};
