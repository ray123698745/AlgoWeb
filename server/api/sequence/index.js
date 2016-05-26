'use strict';

var express = require('express');
var controller = require('./sequence.controller.js');
var seed = require('./seed');

var router = express.Router();

router.get('/', controller.index);
// router.get('/:sequenceID', controller.sequenceID);
router.get('/seed', seed);

router.post('/', controller.result);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
