'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var location = new Schema({country: String, state: String, city: String},{_id : false });
var gps = new Schema({x: Number, y: Number},{_id : false });
var file_location = new Schema({site: String, root_path: String},{_id : false });
var yuv = new Schema({version: Number, desc: String, resolution: String},{_id : false });
// var objects = new Schema({class: String, occurrence: Number},{_id : false });
var version = new Schema({version_number: Number, upload_time: String, comments: String},{_id : false });
var class_object = new Schema({class: String, occurrence: Number},{_id : false });

var annotation = new Schema({category: String, fps: Number, priority: Number, state: String, version: [version], total_objects: Number, unique_id: Number, density: Number, classes: [class_object]},{_id : false });
var cameras = new Schema({name: String, is_stereo: Boolean, yuv: [yuv], annotation: [annotation]},{_id : false });

// var database_version = new Schema({version: Number, id: ObjectId},{_id : false });

var sequenceSchema = new Schema({
    title: String,
    location: location,
    keywords: [String],
    gps: gps,
    avg_speed: Number,
    capture_time: String,
    frame_number: Number,
    usage: String,
    file_location: [file_location],
    cameras:[cameras],
    no_annotation: Boolean,
    version: Number
}, {versionKey: false});



var databaseVersionSchema = new Schema({
    version_number: Number,
    create_time: String,
    description: String
});


// Add methods
// sequenceSchema.method.calSomething = function () {
//
// }

var Sequence = mongoose.model('Sequence', sequenceSchema);
var unfilteredSequence = mongoose.model('unfilteredSequence', sequenceSchema);
var databaseVersion = mongoose.model('databaseVersion', databaseVersionSchema);


// var unfilteredSequence = mongoose.model('unfilteredSequence', unfilteredSequenceSchema);

module.exports = {
    sequence: Sequence,
    unfilteredsequence: unfilteredSequence,
    databaseVersion: databaseVersion
};











// v2

// var sequenceSchema = new Schema({
//     // sequence_id: {type: ObjectId, required: true}, // will generate _id by default
//     location: {country: String, state: String, city: String},
//     weather: String,
//     theme: String,
//     light_condition: String,
//     road_type: [String],
//     land_marking_type: [String],
//     special_condition: [String],
//     gps: {x: Number, y: Number},
//     avg_speed: Number,
//     timestamp: { type: Date, default: Date.now },
//     uploader: String,
//     usage: String,
//     sequence_root_path: String,
//     yuv_version:  { type: Number, default: 0 },
//     annotated: Boolean,
//     Objects: [{obj_class: String, occurrence: Number}]
// });

// v1
// var sequenceSchema = new Schema({
//     sequenceID: Number,
//     location: String,
//     weather: String,
//     theme: String,
//     annotated: Boolean,
//     sequence_root_path: String,
//     date: { type: Date, default: Date.now },
//     frames: [{
//         frameNum: Number,
//         filename: String,
//         object: [{
//             objID: Number,
//             occluded: Boolean
//         }]
//     }]
// });
