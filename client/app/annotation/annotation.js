/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('annotationCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {


    $scope.editing = false;

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
    };

    $scope.showPriority = function (priority) {

        if (priority == 1) return 'Low';
        if (priority == 2) return 'Medium';
        if (priority == 3) return 'High';
    };


    $scope.download = function (result) {

        return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/annotation/"+ result.title +".tar.gz";


    };

    $scope.upload = function (result) {

        // return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/L/"+ result.title +"_h264_L.mp4";

    };


    $scope.edit = function (result, request, index) {

        if (!$scope.editing){
            if (!request.isEdit){
                request.isEdit = true;
                result.isEdit = true;
                $scope.editing = true;
                $scope.editingRequest = request;
                $scope.editingRequest.index = index;

            }
        }
    };

    $scope.cancel = function (result) {

        $scope.editingRequest.isEdit = false;
        result.isEdit = false;
        $scope.editing = false;
        $scope.editingRequest = null;
    };


    $scope.submitEdit = function (result) {


        var set_obj = {};

        var state_key = 'cameras.0.annotation.' + $scope.editingRequest.index + '.state';
        set_obj[state_key] = $scope.editingRequest.state;

        var query = {
            condition: {_id: result._id},
            update: {$set: set_obj},
            options: {multi: false}
        };

        // console.log(query);


        $http.post("/api/sequence/update", JSON.stringify(query))
            .success(function(databaseResult) {
                // alert(databaseResult);
                $scope.cancel(result);

            })
            .error(function (data, status, header, config) {
                alert("edit request failed!\nStatus: " + status + "\nData: " + data);

                console.log("submit request failed!");
            });
    };



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
