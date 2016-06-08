'use strict';
var Sequence = require('./sequence.model.js');


module.exports = function(req, res) {
    console.log("seed page");
        // seed database

        var sample = [
            {

            }


        ];
        
        // Sequence.create(sample, function(err, results) {
        //     res.send(results);
        // });
}








// var sample = [
//     {
//         sequenceID: 1,
//         location: "Saratoga",
//         weather: "Sunny",
//         theme: "Urban",
//         annotated: true,
//         sequencePath: "C:/sample/path/sequence1",
//         frames: [{
//             frameNum: 1,
//             filename: "im_000001.jpg",
//             object: [{
//                 objID: 1,
//                 occluded: true
//             },
//                 {
//                     objID: 2,
//                     occluded: false
//                 }]
//         },
//             {
//                 frameNum: 2,
//                 filename: "im_000002.jpg",
//                 object: [{
//                     objID: 1,
//                     occluded: true
//                 },
//                     {
//                         objID: 2,
//                         occluded: false
//                     }]
//             }]
//     },
//     {
//         sequenceID: 2,
//         location: "Santa Clara",
//         weather: "Rainy",
//         theme: "Country",
//         annotated: true,
//         sequencePath: "C:/sample/path/sequence2",
//         frames: [{
//             frameNum: 1,
//             filename: "im_000001.jpg",
//             object: [{
//                 objID: 1,
//                 occluded: true
//             },
//                 {
//                     objID: 2,
//                     occluded: false
//                 }]
//         },
//             {
//                 frameNum: 2,
//                 filename: "im_000002.jpg",
//                 object: [{
//                     objID: 1,
//                     occluded: true
//                 },
//                     {
//                         objID: 2,
//                         occluded: false
//                     }]
//             }]
//     }
// ];