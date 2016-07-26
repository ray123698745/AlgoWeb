/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('annotationCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    $scope.sortBy = "Date";
    var query = dataService.data.queryObj;

    $http.get("/api/sequence/getUnfinished")  //getRequested from sequence collection
        .success(function(databaseResult) {
            $scope.results = databaseResult;

            // console.log($scope.results);

        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });


    $scope.thumbSrc = function (result) {
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/thumb.jpg");
    }



    $scope.download = function (result, side) {


        if (side == 'left')
            return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/L/"+ result.title +"_h264_L.mp4";
        else
            return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/R/"+ result.title +"_h264_R.mp4";

    }



    $scope.preview = function (result) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'annotatePreviewCtrl',
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


    $scope.linkToTop = function () {
        $anchorScroll('top');
    };

    $scope.order = function (result) {



        var totalPriority = 0;

        result.cameras[0].annotation.forEach(function (request) {

            totalPriority += request.priority;
        });
        // console.log(totalPriority);

        return totalPriority;

    };

    // $scope.back = function () {
    //     $state.go('query');
    // }

}]);




app.controller('annotatePreviewCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


    $scope.previewSrc = function () {

        // console.log(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/h264.mp4");

        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/"+ result.title + "_h264_L.mp4");
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});