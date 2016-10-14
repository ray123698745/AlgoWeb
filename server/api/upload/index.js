/**
 * Created by rayfang on 6/26/16.
 */
'use strict';

var express = require('express');
var controller = require('./upload.controller.js');
var multer  = require('multer');
var upload = multer({ dest: __dirname + '/uploads/' }).array('annotation', 2);
var router = express.Router();


router.post('/uploadAnnotation', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log("error: " + err);
        } else {
            controller.uploadAnnotation(req, res);
        }
    })
});

router.post('/uploadReview', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log("error: " + err);
        } else {
            controller.uploadReview(req, res);
        }
    })
});

module.exports = router;
