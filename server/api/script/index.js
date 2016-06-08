'use strict';

var express = require('express');
var controller = require('./script.controller.js');

var router = express.Router();

// router.get('/', controller.index);
router.get('/findByID/:id', controller.findById);

// router.post('/query', controller.result);
// router.put('/insert', controller.insert);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
