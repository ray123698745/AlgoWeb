/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('filterCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {


    $scope.selected = [];

    $http.get("/api/sequence/getAllUnfiltered")
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


    $scope.arrayObjectIndexOf = function (myArray, searchTerm, property) {
        for(var i = 0; i < myArray.length; i++) {
            if (myArray[i][property] === searchTerm){
                // console.log("arrayObjectIndexOf: " + i);
                return i;
            }
        }
        return -1;
    };


    $scope.toggleSelection = function (result_id) {

        var index = $scope.arrayObjectIndexOf($scope.selected, result_id, 'id');

        if (index > -1)
            $scope.selected.splice(index, 1);
        else
            $scope.selected.push({id: result_id});
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


    $scope.submit = function () {

        if (confirm($scope.selected.length + " sequence selected") == true) {
            var queries = [];

            for (var i = 0; i < $scope.selected.length; i++){

                var query = {
                    condition: {_id: $scope.selected[i].id},
                    update: {$push: {
                        "cameras.0.annotation": {
                            "category": $scope.selected[i].category,
                            "fps": $scope.selected[i].fps,
                            "priority": $scope.selected[i].priority,
                            "state" : 'Pending'
                        }
                    }},
                    options: {multi: false}
                };

                queries.push(query);

                if ($scope.selected[i].category == "Road"){
                     query = {
                        condition: {_id: $scope.selected[i].id},
                        update: {$push: {
                            "cameras.0.annotation": {
                                "category": "Lane",
                                "fps": $scope.selected[i].fps,
                                "priority": 0, //???
                                "state" : 'Pending'
                            }
                        }},
                        options: {multi: false}
                    };

                    queries.push(query);
                }


            }

            //update database
            $http.post("/api/sequence/updateUnfiltered", JSON.stringify(queries))
                .success(function(databaseResult) {
                    // alert(databaseResult);
                    // console.log(databaseResult);
                    $state.go('review');


                })
                .error(function (data, status, header, config) {
                    alert("submit request failed!\nStatus: " + status + "\nData: " + data);

                    console.log("submit request failed!");
                });


        }

    }

}]);




app.controller('filterPreviewCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


    $scope.previewSrc = function () {

        // console.log(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/h264.mp4");

        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/R/"+ result.title + "_h264_L.mp4");
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
