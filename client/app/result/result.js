'use strict';

app.controller('resultCtrl', ['$scope', '$http', '$state', '$stateParams', '$sce', 'dataService', 'utilService', function ($scope, $http, $state, $stateParams, $sce, dataService, utilService) {

    // pass only the selected queryResult object
    $scope.result = dataService.data.selectedSeq;
    $scope.keywordsObj = dataService.keywords;
    $scope.cameraIdx = $stateParams.camera;
    $scope.isStereo = $scope.result.cameras[$scope.cameraIdx].is_stereo;
    $scope.isMap = false;
    $scope.isTag = true;
    $scope.selectedKeywords = $scope.result.keywords;
    $scope.isLeft = true;
    $scope.isRight = false;





    $scope.switchCamera = function (camera) {
        $state.go('result', {camera: camera});
    }
    
    $scope.switchLR = function (isLeft) {
        if(isLeft){
            $scope.isLeft = true;
            $scope.isRight = false;
        } else {
            $scope.isLeft = false;
            $scope.isRight = true;
        }
    }

    $scope.switchMap = function (isMap) {
        if(isMap){
            $scope.isMap = true;
            $scope.isTag = false;
        } else {
            $scope.isMap = false;
            $scope.isTag = true;
        }
    }

    $scope.previewSrc = function () {
        
        if ($scope.isStereo){
            if ($scope.isLeft)
                return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + "/" + $scope.result._id + "/" + $scope.result.cameras[$scope.cameraIdx].name + "/L/video_h264.mp4");
            else
                return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + "/" + $scope.result._id + "/" + $scope.result.cameras[$scope.cameraIdx].name + "/R/video_h264.mp4");
        } else {
            return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + "/" + $scope.result._id + "/" + $scope.result.cameras[$scope.cameraIdx].name + "/video_h264.mp4");
        }
    }

    $scope.toggleSelection = function (keyword) {

        var index = $scope.selectedKeywords.indexOf(keyword);

        if (index > -1)
            $scope.selectedKeywords.splice(index, 1);
        else
            $scope.selectedKeywords.push(keyword);
    }

    $scope.submitTag = function () {

        if (confirm("Keywords:\n" + $scope.selectedKeywords) == true) {

            var query = {
                condition: {_id: $scope.result._id},
                update: {$set: {"keywords": $scope.selectedKeywords}},
                options: {multi: false}
            }

            //update database
            $http.post("/api/sequence/update", JSON.stringify(query))
                .success(function(databaseResult) {
                    alert(databaseResult.nModified + " record updated!");
                })
                .error(function (data, status, header, config) {
                    console.log("submitTag Failed!");
                });

        }
    }

    $scope.encode = function () {

        var encodeParam = {
            path: $scope.filePath(),
            ituner: "tuner1",
            isStereo: $scope.isStereo
        }

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
    }

    $scope.download = function (file) {
        if (file === 'sensor'){
            $sce.trustAsResourceUrl(dataService.data.fileServerAddr + "/" + $scope.result._id + "/sensor.txt");
        }
    }

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
    }

        
}]);