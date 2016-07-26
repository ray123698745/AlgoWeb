'use strict';

app.controller('resultCtrl', ['$scope', '$http', '$state', '$stateParams', '$sce', 'dataService', 'utilService', function ($scope, $http, $state, $stateParams, $sce, dataService, utilService) {

    $scope.result = dataService.data.selectedSeq;
    $scope.keywordsObj = dataService.keywords;
    $scope.cameraIdx = $stateParams.camera;
    $scope.isStereo = $scope.result.cameras[$scope.cameraIdx].is_stereo;
    $scope.isMap = false;
    $scope.isTag = true;
    $scope.isAnnotate = false;
    $scope.selectedKeywords = $scope.result.keywords;
    $scope.isLeft = true;
    $scope.isRight = false;
    $scope.timeCrops = [{
        annotate_from: new Date('2012-04-23T00:00:00'),
        annotate_to: new Date('2012-04-23T00:00:00'),
        annotate_fps: null,
        annotate_note: null,
        annotate_category: null
    }];
    $scope.parent = {
        annotate_from: new Date('2012-04-23T00:00:00'),
        annotate_to: new Date('2012-04-23T00:00:00')
    };
    $scope.annotate_fps = 30;
    $scope.annotate_note = "";




    $scope.switchCamera = function (camera) {
        $state.go('result', {camera: camera});
    };

    $scope.switchLR = function () {
        $scope.isLeft = !$scope.isLeft;
        $scope.isRight = !$scope.isRight;
    };

    $scope.switchFuncView = function (view) {
        if(view === 'map'){
            $scope.isMap = true;
            $scope.isTag = false;
            $scope.isAnnotate = false;
        } else if (view === 'mark') {
            $scope.isMap = false;
            $scope.isTag = true;
            $scope.isAnnotate = false;
        } else {
            $scope.isMap = false;
            $scope.isTag = false;
            $scope.isAnnotate = true;
        }
    };

    $scope.previewSrc = function () {

        if ($scope.isStereo){
            if ($scope.isLeft)
                return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + $scope.filePath() + "/L/"+ $scope.result.title +"_h264_L.mp4");
            else
                return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + $scope.filePath() + "/R/"+ $scope.result.title +"_h264_R.mp4");
        } else {
            return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + $scope.filePath() + "/"+ $scope.result.title +"_h264.mp4");
        }
    };

    $scope.toggleSelection = function (keyword) {

        var index = $scope.selectedKeywords.indexOf(keyword);

        if (index > -1)
            $scope.selectedKeywords.splice(index, 1);
        else
            $scope.selectedKeywords.push(keyword);
    };

    $scope.submitTag = function () {

        if (confirm("Keywords:\n" + $scope.selectedKeywords) == true) {

            var query = {
                condition: {_id: $scope.result._id},
                update: {$set: {"keywords": $scope.selectedKeywords}},
                options: {multi: false}
            };

            //update database
            $http.post("/api/sequence/update", JSON.stringify(query))
                .success(function(databaseResult) {
                    alert(databaseResult.nModified + " record updated!");
                })
                .error(function (data, status, header, config) {
                    console.log("submitTag Failed!");
                });

        }
    };

    $scope.addTimeCrop = function () {

        $scope.timeCrops.push({
            annotate_from: new Date('2012-04-23T00:00:00'),
            annotate_to: new Date('2012-04-23T00:00:00'),
            annotate_fps: null,
            annotate_note: null,
            annotate_category: null
        });

    };

    $scope.deleteTimeCrop = function () {

        $scope.timeCrops.pop();
    };


    $scope.submitAnnotate = function () {


        // console.log($scope.parent.annotate_from.toString().substring(19, 24));
        // console.log($scope.parent.annotate_to.toString().substring(19, 24));
        // console.log($scope.parent.annotate_fps);
        // console.log($scope.parent.annotate_note);

        console.log($scope.timeCrops);


        //update database
        // $http.post("/api/sequence/update", JSON.stringify(query))
        //     .success(function(databaseResult) {
        //         alert(databaseResult.nModified + " record updated!");
        //     })
        //     .error(function (data, status, header, config) {
        //         console.log("submitTag Failed!");
        //     });


    };

    $scope.encode = function () {

        var encodeParam = {
            path: $scope.filePath(),
            ituner: "ituner/",
            isStereo: $scope.isStereo,
            frameNum: $scope.result.frame_number
        };

        $http.post("/api/command/encode/", JSON.stringify(encodeParam))
            .success(function(data) {
                alert("path: " + data.path);
            })
            .error(function (data, status, header, config) {
                console.log("Encode Failed!");
            });

    }

    $scope.filePath = function () {

        return utilService.getRootPathBySite($scope.result.file_location) + "/" + $scope.result.cameras[$scope.cameraIdx].name;
    };

    $scope.download = function (file) {

        if (file === 'h264'){
            if ($scope.isStereo){
                if ($scope.isLeft)
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/L/"+ $scope.result.title +"_h264_L.mp4";
                else
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/R/"+ $scope.result.title +"_h264_R.mp4";
            } else {
                return dataService.data.fileServerAddr  + $scope.filePath() + "/"+ $scope.result.title +"_h264.mp4";
            }

        }

        if (file === 'car_sensor'){
            return dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.result.file_location) + "/" + $scope.result.title + "_Sensor.tar";
        }

        if (file === 'camera_sensor'){
            if ($scope.isStereo){
                if ($scope.isLeft)
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/L/" + $scope.result.title + "_meta_L.txt";
                else
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/R/" + $scope.result.title + "_meta_R.txt";
            } else {
                return dataService.data.fileServerAddr  + $scope.filePath() + "/" + $scope.result.title + "_meta.txt";
            }

        }

        if (file === 'yuv'){

            if ($scope.isStereo){
                if ($scope.isLeft)
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/L/yuv/" + $scope.result.title + "_v1_L.tar";
                else
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/R/yuv/" + $scope.result.title + "_v1_R.tar";
            } else {
                return dataService.data.fileServerAddr  + $scope.filePath() + "/yuv/" + $scope.result.title + "_v1.tar";
            }
        }
    };

    $scope.sortKeywords = function (allKeywords) {

        var sortedKey = "";

        $scope.selectedKeywords.forEach(function (keyword) {
            allKeywords.forEach(function (allWord) {

                if (keyword === allWord){
                    sortedKey = sortedKey + ", " + keyword;
                }
            })
        });

        return sortedKey.substring(1);
    };

    $scope.back = function () {
        $state.go('resultList');
    }


}]);
