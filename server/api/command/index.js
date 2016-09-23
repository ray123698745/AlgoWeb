/**
 * Created by rayfang on 6/26/16.
 */
'use strict';

var express = require('express');
var controller = require('./command.controller.js');

var router = express.Router();

// console.log('command controller');

router.post('/encode', controller.encode);
router.post('/processSequence', controller.processSequence);



module.exports = router;
