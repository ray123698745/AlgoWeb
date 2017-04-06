'use strict';

var express = require('express');
var controller = require('./sequence.controller.js');
var seed = require('./seed');

var router = express.Router();

router.get('/', controller.index);
router.get('/findByID/:id', controller.findByID);
router.get('/seed', seed);
router.get('/getAllUnfiltered', controller.getAllUnfiltered);
// router.get('/getRequested', controller.getRequested);
router.get('/getUnfinished', controller.getUnfinished);
router.get('/getAccepted', controller.getAccepted);
router.get('/removeUnfiltered', controller.removeUnfiltered);
router.get('/genTitle', controller.genTitle);
router.get('/allSeqCount', controller.allSeqCount);
router.get('/getAllGPS', controller.getAllGPS);





router.post('/query', controller.result);
router.post('/update', controller.update);
router.post('/batchUpdate', controller.batchUpdate);
router.post('/insert', controller.insert);
router.post('/insertUnfiltered', controller.insertUnfiltered);
router.post('/deleteSequence', controller.deleteSequence);
router.post('/addAnnotationRequest', controller.addAnnotationRequest);
router.post('/keywordCount', controller.keywordCount);
router.post('/seqCount', controller.seqCount);
router.post('/getGPS', controller.getGPS);


// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
