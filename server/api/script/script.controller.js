'use strict';

var Sequence = require('../sequence/sequence.model.js');
var log = require('log4js').getLogger('script');


module.exports = {

    index: function(req, res) {


    },

    findById: function(req, res) {

        Sequence.find({ _id: req.params.id }, function(err, sequence) {
            if (err) throw err;

            log.debug('findById', sequence);

            res.send(sequence);
        });
    }


}
