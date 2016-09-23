'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var batchSchema = new Schema({
    batchName: String,
    batchCreateTime: String
}, {versionKey: false});


var annotationBatch = mongoose.model('annotationBatch', batchSchema);

module.exports = annotationBatch;
