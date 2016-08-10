/**
 * Created by rayfang on 6/26/16.
 */
'use strict';

var express = require('express');
var controller = require('./upload.controller.js');
var multer  = require('multer');
var upload = multer({ dest: '../server/api/upload/uploads/' });

var router = express.Router();


router.post('/uploadAnnotation', upload.array('annotation', 2), controller.uploadAnnotation);

module.exports = router;
