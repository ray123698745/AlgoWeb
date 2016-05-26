'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sequenceSchema = new Schema({
    sequenceID: Number,
    location: String,
    weather: String,
    theme: String,
    annotated: Boolean,
    sequencePath: String,
    date: { type: Date, default: Date.now },
    frames: [{
        frameNum: Number,
        filename: String,
        object: [{
            objID: Number,
            occluded: Boolean
        }]
    }]
});

var Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = Sequence;
