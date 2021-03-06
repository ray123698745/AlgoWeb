'use strict';

var express = require('express');
var controller = require('./annotation.controller.js');
var router = express.Router();


router.post('/insertBatch', controller.insertBatch);
router.post('/removeBatch', controller.removeBatch);
router.get('/getAllBatch', controller.getAllBatch);



module.exports = router;
