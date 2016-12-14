/**
 * Created by rayfang on 6/26/16.
 */
'use strict';

var Sequence = require('../sequence/sequence.model.js').sequence;
var log = require('log4js').getLogger('upload');
var fs = require('fs');
var readline = require('readline');
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
        var fully_annotated = req.body.fully_annotated;

        var uploadTime = new Date().toISOString();
        var fileName = title + '_' + category + '.json';
        var statFileName = title + '_' + category + '_stat.json';
        var destPath = '/supercam' + path + '/Front_Stereo/annotation/' + category + '_v' + version_number + '/';
        var comments = req.body.comments;
        var statFile = {};
        log.debug("path: " + path);
        log.debug("id: " + id);
        log.debug("title: " + title);
        log.debug("comments: " + comments);
        log.debug("files: " + files[0].path);
        log.debug("fully_annotated: " + fully_annotated);


        comments = comments.replace(/"/g, '\\\"');
        comments = comments.replace(/(?:\r\n|\r|\n)/g, '\\n');


        if ((files[0].originalname == fileName && files[1].originalname == statFileName) || (files[1].originalname == fileName && files[0].originalname == statFileName)){

            mkdir(destPath);

            for (var i = 0; i < files.length; i++){

                // var endPos = 0;
                // var fileNameAppendVersion = "";

                if (files[i].originalname.search("_stat") == -1){

                    var jsonFile = fs.readFileSync(__dirname + '/uploads/' + files[i].filename, 'utf-8');
                    var jsonResult = "";

                    if (jsonFile.search('\"metadata\"') != -1){
                        // var modifiedPos = jsonFile.search('\"metadata\"');
                        // jsonFile = jsonFile.substring(0, modifiedPos) + jsonFile.substring(jsonFile.search('},')+2);


                        var jsonObj = JSON.parse(jsonFile);

                        jsonObj.metadata["annotation-version"] = version_number;
                        jsonObj.metadata["upload_time"] = uploadTime;

                        // Backward compatible
                        if(!jsonObj.metadata.comments.v1){
                            var tempComment = jsonObj.metadata.comments;
                            jsonObj.metadata.comments = {};
                            var tempKey = 'v1';

                            if(version_number != 1) tempKey = 'v' + (version_number-1);
                            jsonObj.metadata.comments[tempKey] = tempComment
                        }

                        var versionKey = 'v' + version_number;
                        jsonObj.metadata.comments[versionKey] = comments;
                        jsonResult = JSON.stringify(jsonObj, null, 1);

                        log.debug('jsonObj: ', jsonObj.metadata);

                    } else {
                        var metadataPos = jsonFile.search('{')+1;
                        var metadata = '\n \"metadata\":\n {\n  \"annotation-version\":\"' + version_number + '\",\n  ' + '\"upload_time\":\"' + uploadTime + '\",\n  ' + '\"fps\":\"' + fps + '\",\n  ' + '\"comments\": {\n   \"v1\": \"' + comments + '\"\n  }\n },';
                        jsonResult = jsonFile.substring(0, metadataPos) + metadata + jsonFile.substring(metadataPos);
                    }

                    fs.writeFileSync(destPath + files[i].originalname, jsonResult, 'utf-8');
                    rm(__dirname + '/uploads/' + files[i].filename);

                } else {

                    statFile = JSON.parse(fs.readFileSync(__dirname + '/uploads/' + files[i].filename, 'utf-8'));
                    mv(__dirname + '/uploads/' + files[i].filename, destPath + files[i].originalname);
                }
            }


            var set_obj = {};

            var versionIndex = version_number -1;
            log.debug('versionIndex: ', versionIndex);

            var state_key = 'cameras.0.annotation.' + index + '.state';
            var time_key = 'cameras.0.annotation.' + index + '.version.' + versionIndex + '.upload_time';
            var total_objects_key = 'cameras.0.annotation.' + index + '.total_objects';
            var unique_id_key = 'cameras.0.annotation.' + index + '.unique_id';
            var classes_key = 'cameras.0.annotation.' + index + '.classes';
            var density_key = 'cameras.0.annotation.' + index + '.density';


            if (fully_annotated == 'true'){
                set_obj[state_key] = 'Finished';
            } else {
                set_obj[state_key] = 'Finished_Basic';
            }

            set_obj[time_key] = uploadTime;
            set_obj[total_objects_key] = statFile.n_objects;
            set_obj[unique_id_key] = statFile.ids;
            set_obj[density_key] = statFile.n_objects/statFile.frames;
            set_obj[classes_key] = [];

            for (var i = 0; i < statFile.class_count.length; i++){
                set_obj[classes_key][i] = {};
                set_obj[classes_key][i].class = statFile.class_count[i][0];
                set_obj[classes_key][i].occurrence = statFile.class_count[i][1];
            }


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
    },


    uploadReview: function (req, res) {

        var files = req.files;
        var path = req.body.path;
        var title = req.body.title;
        var category = req.body.category;
        var version_number = req.body.version_number;
        var fileName = title + '_' + category + '.json';
        var destPath = '/supercam' + path + '/Front_Stereo/annotation/' + category + '_v' + version_number + '/';
        log.debug("fileName: " + fileName);
        log.debug("files: " + files[0].path);


        if (files[0].originalname == fileName){

            mv(__dirname + '/uploads/' + files[0].filename, destPath + files[0].originalname);
            res.send('Upload success!');

        } else {

            rm(__dirname + '/uploads/' + files[0].filename);
            res.send('Wrong JSON file. \nSequence title or category doesn\'t match.');
        }
    },


    batchUpdate: function (req, res) {

        var file = req.file;
        // log.debug("fileName: " + file.originalname);

        var statePos = file.originalname.search('.txt');
        var state = file.originalname.substring(0, statePos);

        if (state == 'Annotating' || state == 'Reviewing'){

            var rl = readline.createInterface({
                input: fs.createReadStream(__dirname + '/uploads/' + file.filename)
            });

            rl.on('line', function(line){

                var tabPos = line.search('\t');
                var title = line.substring(0, tabPos);
                var task = line.substring(tabPos+1);
                log.debug("title: " + title);
                log.debug("task: " + task);


                var condition_obj = {};
                condition_obj['title'] = title;
                var task_key = 'cameras.0.annotation.category';
                condition_obj[task_key] = task;


                var set_obj = {};
                var state_key = 'cameras.0.annotation.$.state';
                set_obj[state_key] = state;


                var query = {
                    condition: condition_obj,
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
                    }
                });



            }).on('close', function () {

                rm(__dirname + '/uploads/' + file.filename);
                res.send('Update success!');
            });



        } else {

            rm(__dirname + '/uploads/' + file.filename);
            res.send('File name can only be "Annotating.txt" or "Reviewing.txt"');
        }
    }
};
