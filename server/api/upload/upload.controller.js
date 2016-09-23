/**
 * Created by rayfang on 6/26/16.
 */
'use strict';

var Sequence = require('../sequence/sequence.model.js').sequence;
var log = require('log4js').getLogger('upload');
var fs = require('fs');
require('shelljs/global');


module.exports = {

    uploadAnnotation: function(req, res) {


        var files = req.files;
        var path = req.body.path;
        var id = req.body.id;
        var index = req.body.index;
        var title = req.body.title;
        var category = req.body.category;
        var fps = req.body.fps;
        var version_number = req.body.version_number;
        var uploadTime = new Date().toISOString();
        var fileName = title + '_' + category + '.json';
        var statFileName = title + '_' + category + '_stat.json';
        var destPath = '/supercam' + path + '/Front_Stereo/annotation/' + category + '_v' + version_number + '/';
        var comments = req.body.comments;
        log.debug("path: " + path);
        log.debug("id: " + id);
        log.debug("title: " + title);
        log.debug("comments: " + comments);
        log.debug("files: " + files[0].path);

        comments = comments.replace(/"/g, '\\\"');
        comments = comments.replace(/(?:\r\n|\r|\n)/g, '\\n');






        if ((files[0].originalname == fileName && files[1].originalname == statFileName) || (files[1].originalname == fileName && files[0].originalname == statFileName)){

            mkdir(destPath);

            for (var i = 0; i < files.length; i++){

                // var endPos = 0;
                // var fileNameAppendVersion = "";

                if (files[i].originalname.search("_stat") == -1){

                    var jsonFile = fs.readFileSync(__dirname + '/uploads/' + files[i].filename, 'utf-8');

                    if (jsonFile.search('\"metadata\"') != -1){
                        jsonFile = '{' + jsonFile.substring(jsonFile.search('},')+2);
                    }

                    var metadataPos = jsonFile.search('{')+1; //Todo: Should move to file head or bottom
                    // log.debug('metadataPos: ', metadataPos);

                    var metadata = '\n \"metadata\":\n {\n  \"annotation-version\":\"' + version_number + '\",\n  ' + '\"upload_time\":\"' + uploadTime + '\",\n  ' + '\"comments\":\"' + comments + '\",\n  ' + '\"fps\":\"' + fps + '\"\n },';

                    var addMetadata = jsonFile.substring(0, metadataPos) + metadata + jsonFile.substring(metadataPos);


                    fs.writeFileSync(destPath + files[i].originalname, addMetadata, 'utf-8');


                    rm(__dirname + '/uploads/' + files[i].filename);

                } else {

                    var statFile = fs.readFileSync(__dirname + '/uploads/' + files[i].filename, 'utf-8');


                    mv(__dirname + '/uploads/' + files[i].filename, destPath + files[i].originalname);

                }
            }


            var set_obj = {};

            var versionIndex = version_number -1;
            log.debug('versionIndex: ', versionIndex);

            var state_key = 'cameras.0.annotation.' + index + '.state';
            var time_key = 'cameras.0.annotation.' + index + '.version.' + versionIndex + '.upload_time';

            set_obj[state_key] = 'Finished';
            set_obj[time_key] = uploadTime;


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
