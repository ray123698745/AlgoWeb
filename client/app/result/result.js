'use strict';

app.controller('resultCtrl', ['$scope', '$http', '$state', '$stateParams', '$sce', '$uibModal', 'dataService', 'utilService', function ($scope, $http, $state, $stateParams, $sce, $uibModal, dataService, utilService) {

    $scope.result = dataService.data.selectedSeq;
    $scope.keywordsObj = dataService.keywords;
    $scope.cameraIdx = $stateParams.camera;
    $scope.isStereo = $scope.result.cameras[$scope.cameraIdx].is_stereo;
    $scope.isMap = false;
    $scope.isTag = true;
    $scope.isAnnotate = false;
    $scope.selectedKeywords = $scope.result.keywords;
    $scope.isLeft = false;
    $scope.isRight = true;


    $scope.switchCamera = function (camera) {
        $state.go('result', {camera: camera});
    };


    $scope.switchLR = function (side) {
        if (side == 'left' && $scope.isRight){
            $scope.isLeft = !$scope.isLeft;
            $scope.isRight = !$scope.isRight;
        }
        if (side == 'right' && $scope.isLeft){
            $scope.isLeft = !$scope.isLeft;
            $scope.isRight = !$scope.isRight;
        }
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


    $scope.encode = function (ituner) {

        // showProgressBar();

        if (confirm("Encode with ituner: " + ituner + " ?") == true){
            var encodeParam = {
                seqObj: $scope.result,
                ituner: ituner
            };

            $http.post("/api/command/encode/", JSON.stringify(encodeParam))
                .success(function(data) {

                    showProgressBar();
                })
                .error(function (data, status, header, config) {
                    console.log("Send encode request Failed!");
                });
        }

    };

    function showProgressBar() {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'progressBarContent.html',
            controller: 'ProgressBarCtrl',
            size: 'lg',
            resolve: {
                result: function () {
                    return $scope.result;
                }
            }
        });

        modalInstance.result.then(function () {
            // $scope.selected = selectedItem;
        }, function () {
            // $log.info('Modal dismissed at: ' + new Date());
        });

    }


    $scope.filePath = function () {

        return utilService.getRootPathBySite($scope.result.file_location) + "/" + $scope.result.cameras[$scope.cameraIdx].name;
    };


    $scope.download = function (file, channel, version, category) {

        if (file === 'h264'){
            if ($scope.isStereo){
                if (channel == 'left')
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
                if (channel == 'left')
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/L/" + $scope.result.title + "_meta_L.txt";
                else
                    return dataService.data.fileServerAddr  + $scope.filePath() + "/R/" + $scope.result.title + "_meta_R.txt";
            } else {
                return dataService.data.fileServerAddr  + $scope.filePath() + "/" + $scope.result.title + "_meta.txt";
            }

        }

        if (file === 'yuv'){

            if ($scope.isStereo){
                if (channel == 'left')
                    return dataService.data.fileServerAddr + $scope.filePath() + "/L/yuv/" + $scope.result.title + "_yuv_v" + version + "_L.tar";
                else
                    return dataService.data.fileServerAddr + $scope.filePath() + "/R/yuv/" + $scope.result.title + "_yuv_v" + version + "_R.tar";
            } else {
                return dataService.data.fileServerAddr + $scope.filePath() + "/yuv/" + $scope.result.title + "_yuv_v" + version + ".tar";
            }
        }

        if (file === 'annotation'){

            return dataService.data.fileServerAddr + $scope.filePath() + "/annotation/" + category + "_v" + version + "/" + $scope.result.title + "_" + category + ".json";
        }

    };

    $scope.showDownloadBtn = function (uploadTime) {

        if(uploadTime){
            uploadTime = uploadTime.substring(0, 19);
            uploadTime = uploadTime.replace('T', '-');
        }

        return uploadTime;
    };

    $scope.checkAnnotation = function () {

        for (var i = 0; i < $scope.result.cameras[$scope.cameraIdx].annotation.length; i++){

            if ($scope.result.cameras[$scope.cameraIdx].annotation[i].state == 'Accepted')
                return false;
        }

        return true;
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




app.controller('ProgressBarCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


    $scope.previewSrc = function () {

        // console.log(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/h264.mp4");
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/R/"+ result.title + "_h264_R.mp4");
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
