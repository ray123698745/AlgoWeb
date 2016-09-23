/**
 * Created by cjfang on 7/20/16.
 */
'use strict';

app.controller('reviewCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    // $scope.isEdit = false;

    $scope.editing = false;


    $http.get("/api/sequence/getAllUnfiltered")
        .success(function(databaseResult) {
            $scope.results = databaseResult;
        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });

    $scope.requestedCount = function () {

        var count = 0;

        if ($scope.results){
            $scope.results.forEach(function (result) {
                if(result.cameras[0].annotation.length > 0){
                    count ++;
                }
            });
        }

        return count;
    };

    $scope.requestedResults = function () {

        var results = [];

        if ($scope.results){
            $scope.results.forEach(function (result) {
                if(result.cameras[0].annotation.length > 0){
                    results.push(result);
                }
            });
        }

        return results;
    };


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


    // $scope.showPriority = function (priority) {
    //
    //     if (priority == 1) return 'Low';
    //     if (priority == 2) return 'Medium';
    //     if (priority == 3) return 'High';
    // };


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


        var queries = [];
        var set_obj = {};

        var category_key = 'cameras.0.annotation.' + $scope.editingRequest.index + '.category';
        var fps_key = 'cameras.0.annotation.' + $scope.editingRequest.index + '.fps';
        var priority_key = 'cameras.0.annotation.' + $scope.editingRequest.index + '.priority';


        set_obj[category_key] = $scope.editingRequest.category;
        set_obj[fps_key] = $scope.editingRequest.fps;
        set_obj[priority_key] = $scope.editingRequest.priority;



        var query = {
            condition: {_id: result._id},
            update: {$set: set_obj},
            options: {multi: false}
        };

        queries.push(query);

        // console.log(query);


        $http.post("/api/sequence/updateUnfiltered", JSON.stringify(queries))
            .success(function(databaseResult) {
                // alert(databaseResult);
                $scope.cancel(result);

            })
            .error(function (data, status, header, config) {
                alert("edit request failed!\nStatus: " + status + "\nData: " + data);

                console.log("submit request failed!");
            });
    };

    $scope.delete = function (result) {

        var queries = [];

        var query = {
            condition: {_id: result._id},
            update: {$pull: { 'cameras.0.annotation': { category: $scope.editingRequest.category } }},
            options: {multi: false}
        };

        queries.push(query);

        // console.log(query);


        $http.post("/api/sequence/updateUnfiltered", JSON.stringify(queries))
            .success(function(databaseResult) {
                // alert(databaseResult);

                $http.get("/api/sequence/getAllUnfiltered")
                    .success(function(databaseResult) {
                        $scope.results = databaseResult;
                    })
                    .error(function (data, status, header, config) {
                        $scope.results = "failed!";
                    });


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
            controller: 'reviewPreviewCtrl',
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

        if (confirm("Submit this batch of sequence?") == true) {

            var queries = [];

            for (var i = 0; i < $scope.results.length; i++){

                if ($scope.results[i].cameras[0].annotation.length > 0){
                    $scope.results[i].no_annotation = false;
                    queries.push($scope.results[i]);
                } else {
                    $scope.results[i].no_annotation = true;

                    // Todo: testing
                    // $http.post("/api/sequence/insert", JSON.stringify($scope.results[i]))
                    //     .success(function(respond) {
                    //         // alert(respond);
                    //         console.log(respond);
                    //         // $state.go('annotation');
                    //
                    //
                    //     })
                    //     .error(function (data, status, header, config) {
                    //         alert("Insert sequence failed!\nStatus: " + status + "\nData: " + data);
                    //
                    //         console.log("submit request failed!");
                    //     });
                }
            }

            $http.post("/api/command/processSequence", JSON.stringify(queries))
                .success(function(respond) {
                    alert(respond);
                    // console.log(databaseResult);
                    // $state.go('annotation');
                })
                .error(function (data, status, header, config) {
                    alert("Insert sequence failed!\nStatus: " + status + "\nData: " + data);

                    console.log("submit request failed!");
                });

            // Todo: testing
            // $http.get("/api/sequence/removeUnfiltered")
            //     .success(function(respond) {
            //         console.log(respond);
            //     })
            //     .error(function (data, status, header, config) {
            //         console.log(data);
            //     });

        }
    }

}]);




app.controller('reviewPreviewCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


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
