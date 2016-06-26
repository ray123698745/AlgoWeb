'use strict';

var express = require('express');
var controller = require('./sequence.controller.js');
var seed = require('./seed');

var router = express.Router();

router.get('/', controller.index);
router.get('/findByID/:id', controller.findByID);
router.get('/seed', seed);

router.post('/query', controller.result);
router.post('/update', controller.update);
router.put('/insert', controller.insert);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
