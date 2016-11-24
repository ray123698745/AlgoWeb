/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('filterCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {


    $scope.selected = [];
    $scope.currentPage = dataService.data.filterPageNum;

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


    $scope.showRequested = function (result) {

        var text = "";

        result.cameras[0].annotation.forEach(function (task) {

            text += task.category + ", FPS: " + task.fps + "\n";
        });

        return text;
    };


    $scope.preview = function (result) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'filterPreview.html',
            controller: 'filterPreviewCtrl',
            size: 'lg',
            resolve: {
                result: function () {
                    return result;
                }
            }
        });

        // modalInstance.result.then(function (result) {
        //     $scope.selected[$scope.arrayObjectIndexOf($scope.selected, result._id, 'id')].keywords = result.keywords;
        // }, function () {
        //     console.log('Modal dismissed at: ' + new Date());
        // });
    };

    $scope.filter = function (result) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'filterPreview.html',
            controller: 'filterPreviewCtrl',
            size: 'lg',
            resolve: {
                result: function () {
                    return result;
                }
            }
        });

        // modalInstance.result.then(function (result) {
        //     $scope.selected[$scope.arrayObjectIndexOf($scope.selected, result._id, 'id')].keywords = result.keywords;
        // }, function () {
        //     console.log('Modal dismissed at: ' + new Date());
        // });
    };

    $scope.showAllKeywords = function (keywords) {

        if (keywords.length > 3) {

            var keyString = keywords[0];


            for (var i = 1; i < keywords.length; i++) {
                keyString = keyString + ", " + keywords[i];
            }

            return keyString;
        }
    };

    $scope.show3Keywords = function (keywords) {

        if (keywords.length > 0) {
            if (keywords.length == 1) return keywords[0];
            if (keywords.length == 2) return keywords[0] + ", " + keywords[1];
            if (keywords.length == 3) return keywords[0] + ", " + keywords[1] + ", " + keywords[2];
            if (keywords.length > 3) return keywords[0] + ", " + keywords[1] + ", " + keywords[2] + "...";
        }
    };

    $scope.changePage = function (page) {
        $anchorScroll('top');
        // console.log("page: " + page);

        dataService.data.filterPageNum = page;
    };


    $scope.deleteSequence = function (selectedSeq) {

        var param = {
            id: selectedSeq._id,
            path: utilService.getRootPathBySite(selectedSeq.file_location)
        };

        if (confirm("Delete this sequence?\nThis action cannot be recoverd.") == true) {
            $http.post("/api/sequence/deleteSequence", JSON.stringify(param))
                .success(function (respond) {
                    alert(respond);

                    $http.get("/api/sequence/getAllUnfiltered")
                        .success(function(databaseResult) {
                            $scope.results = databaseResult;
                        })
                        .error(function (data, status, header, config) {
                            $scope.results = "failed!";
                        });
                })
                .error(function (data, status, header, config) {
                    alert("delete sequence failed!\nStatus: " + status + "\nData: " + data);

                    console.log("delete sequence failed!");
                });
        }


    };

    $scope.submit = function () {

        if (confirm($scope.selected.length + " sequence selected") == true) {
            var params = [];

            for (var i = 0; i < $scope.selected.length; i++){

                var param = {
                    "id": $scope.selected[i].id,
                    "category": $scope.selected[i].category,
                    "fps": $scope.selected[i].fps,
                    "priority": $scope.selected[i].priority
                };

                params.push(param);
            }

            //update database
            $http.post("/api/sequence/addAnnotationRequest", JSON.stringify(params))
                .success(function(databaseResult) {
                    $state.go('review');
                })
                .error(function (data, status, header, config) {
                    alert("submit request failed!\nStatus: " + status + "\nData: " + data);

                    console.log("submit request failed!");
                });



        }

    }

}]);




app.controller('filterPreviewCtrl', function ($http, $scope, $uibModalInstance, $sce, result, dataService, utilService) {

    $scope.result = result;
    $scope.keywordsObj = dataService.keywords;


    $scope.previewSrc = function () {

        // console.log(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/h264.mp4");

        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/R/"+ result.title + "_h264_R.mp4");
    };



    $scope.toggleSelection = function (keyword) {

        var index = $scope.result.keywords.indexOf(keyword);

        if (index > -1)
            $scope.result.keywords.splice(index, 1);
        else
            $scope.result.keywords.push(keyword);
    };

    $scope.submitTag = function () {

        if (confirm("Keywords:\n" + $scope.result.keywords) == true) {

            var queries = [{
                condition: {_id: $scope.result._id},
                update: {$set: {"keywords": $scope.result.keywords}},
                options: {multi: false}
            }];


            //update database
            $http.post("/api/sequence/updateUnfiltered", JSON.stringify(queries))
                .success(function(databaseResult) {
                    // alert(databaseResult.nModified + " record updated!");
                    $uibModalInstance.close();

                })
                .error(function (data, status, header, config) {
                    console.log("submitTag Failed!");
                });

        }

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    // $uibModalInstance.dismiss(result);

    // $scope.ok = function () {
    //     $uibModalInstance.close();
    // };
    //
    // $scope.cancel = function () {
    //     $uibModalInstance.dismiss('cancel');
    // };
});
