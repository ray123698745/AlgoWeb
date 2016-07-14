/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('resultListCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    $scope.sortBy = "Date";
    var query = dataService.data.queryObj;

    $http.post("/api/sequence/query", JSON.stringify(query))
        .success(function(databaseResult) {
            $scope.results = databaseResult;
            dataService.data.queryResult = databaseResult;

            // console.log($scope.results);

        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });

    $scope.thumbSrc = function (result) {
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/thumb.jpg");
    }


    $scope.showFilePath = function (siteArray) {

        return utilService.getRootPathBySite(siteArray);

    }

    $scope.showAllKeywords = function (keywords) {

        if (keywords.length > 3){

            var keyString = keywords[0];


            for (var i = 1; i < keywords.length; i++){
                keyString = keyString + ", " + keywords[i];
            }

            return keyString;
        }
    }

    $scope.show3Keywords = function (keywords) {

        if (keywords.length > 0){
            if (keywords.length == 1) return keywords[0];
            if (keywords.length == 2) return keywords[0] + ", " + keywords[1];
            if (keywords.length == 3) return keywords[0] + ", " + keywords[1] + ", " + keywords[2];
            if (keywords.length > 3) return keywords[0] + ", " + keywords[1] + ", " + keywords[2] + "...";
        }
    }

    $scope.selectSortBy = function (sortBy) {
        $scope.sortBy = sortBy;
    }

    $scope.preview = function (result) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                result: function () {
                    return result;
                }
            }
        });

        modalInstance.result.then(function () {
            // $scope.selected = selectedItem;
        }, function () {
            // $log.info('Modal dismissed at: ' + new Date());
        });

    };

    $scope.detail = function (selectedSeq, camera) {
        dataService.data.selectedSeq = selectedSeq;
        $state.go('result', {camera: camera});
    };

    $scope.linkToTop = function () {
        $anchorScroll('top');
    }

    $scope.back = function () {
        $state.go('query');
    }

}]);




app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


    $scope.previewSrc = function () {

        // console.log(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/h264.mp4");
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/"+ utilService.getPrefix(result.capture_time) +"_h264_L.mp4");
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
