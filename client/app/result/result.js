'use strict';

app.controller('resultCtrl', ['$scope', '$http', '$state', '$stateParams', '$sce', 'dataService', 'utilService', function ($scope, $http, $state, $stateParams, $sce, dataService, utilService) {

    // pass only the selected queryResult object
    $scope.result = dataService.data.selectedSeq;
    $scope.keywordsObj = dataService.keywords;
    $scope.cameraIdx = $stateParams.camera;
    $scope.isStereo = $scope.result.cameras[$scope.cameraIdx].is_stereo;
    $scope.isMap = false;
    $scope.isTag = true;
    $scope.selectedKeywords = [];


    if ($scope.isStereo){
        $scope.isLeft = true;
        $scope.isRight = false;
    }

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
        console.log($scope.selectedKeywords);
    }

    $scope.filePath = function () {

        return utilService.getRootPathBySite($scope.result.file_location) + "/" + $scope.result.cameras[$scope.cameraIdx].name;
    }

    $scope.download = function (file) {
        if (file === 'sensor'){
            $sce.trustAsResourceUrl(dataService.data.fileServerAddr + "/" + $scope.result._id + "/sensor.txt");
        }
    }

        
}]);