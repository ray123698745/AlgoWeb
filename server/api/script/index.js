'use strict';

var express = require('express');
var controller = require('./script.controller.js');

var router = express.Router();

router.get('/findByID/:id', controller.findById);


module.exports = router;
