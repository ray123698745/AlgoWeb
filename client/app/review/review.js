/**
 * Created by cjfang on 7/20/16.
 */
'use strict';

app.controller('reviewCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    // $scope.isEdit = false;

    $scope.editing = false;


    $http.get("/api/sequence/getRequested")
        .success(function(databaseResult) {
            $scope.results = databaseResult;

            // console.log($scope.results);

        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });


    // $scope.order = function (result) {
    //
    //     var totalPriority = 0;
    //
    //     result.cameras[0].annotate_request.forEach(function (request) {
    //
    //         totalPriority += request.priority;
    //     });
    //     // console.log(totalPriority);
    //
    //     return totalPriority;
    //
    // };


    // $scope.statistic = function () {
    //
    //     $scope.results.forEach(function (result) {
    //         result.cameras[0].annotate_request.forEach(function (request) {
    //
    //             if (request.priority == 1)
    //                 $scope.
    //
    //         });
    //     });
    //
    // };


    $scope.showPriority = function (priority) {

        if (priority == 1) return 'Low';
        if (priority == 2) return 'Median';
        if (priority == 3) return 'High';
    };


    $scope.thumbSrc = function (result) {
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/thumb.jpg");
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

        console.log("_id:" + result._id);
        console.log("index:" + $scope.editingRequest.index);
        console.log("category:" + $scope.editingRequest.category);
        console.log("fps:" + $scope.editingRequest.fps);
        console.log("priority:" + $scope.editingRequest.priority);

        // var queries = [];
        //
        // var query = {
        //     condition: {_id: result._id, category: $scope.editingRequest.category},
        //     update: {$set: {
        //         "cameras.0.annotation": {
        //             "category": $scope.editingRequest.category,
        //             "fps": $scope.editingRequest.fps,
        //             "priority": $scope.editingRequest.priority
        //         }
        //     }},
        //     options: {multi: false}
        // };
        //
        // queries.push(query);
        //
        // $http.post("/api/sequence/updateUnfiltered", JSON.stringify(queries))
        //     .success(function(databaseResult) {
        //         alert(databaseResult);
        //         // console.log(databaseResult);
        //
        //     })
        //     .error(function (data, status, header, config) {
        //         alert("submit request failed!\nStatus: " + status + "\nData: " + data);
        //
        //         console.log("submit request failed!");
        //     });
    };


    $scope.preview = function (result) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'filterPreviewCtrl',
            size: 'lg',
            resolve: {
                result: function () {
                    return result;
                }
            }
        });
    };


    $scope.linkToTop = function () {
        $anchorScroll('top');
    };


    $scope.submitReview = function () {

        var queries = [];

        for (var i = 0; i < $scope.results.length; i++){

            // var query = {
            //     condition: {_id: $scope.selected[i].id},
            //     update: {$push: {
            //         "cameras.0.annotate_request": {
            //             "category": $scope.selected[i].category,
            //             "fps": $scope.selected[i].fps,
            //             "priority": $scope.selected[i].priority
            //         }
            //     }},
            //     options: {multi: false}
            // };

            queries.push($scope.results[i]);

        }



        //update database
        $http.post("/api/sequence/insert", JSON.stringify(queries))
            .success(function(databaseResult) {
                alert(databaseResult);
                // console.log(databaseResult);

            })
            .error(function (data, status, header, config) {
                alert("Insert sequence failed!\nStatus: " + status + "\nData: " + data);

                console.log("submit request failed!");
            });

        $state.go('annotation');
    }

}]);




app.controller('filterPreviewCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


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
