/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('resultListCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    $scope.sortBy = "Date";
    $scope.currentPage = dataService.data.resultListPageNum;
    // console.log("currentPage: " + $scope.currentPage);

    var query = dataService.data.queryObj;

    $http.post("/api/sequence/query", JSON.stringify(query))
    // $http.get("/api/sequence/getAllUnfiltered")

        .success(function (databaseResult) {
            $scope.results = databaseResult;
            dataService.data.queryResult = databaseResult;

            // console.log($scope.results);

        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });

    $scope.thumbSrc = function (result) {
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/thumb.jpg");
    };


    $scope.showFilePath = function (siteArray) {

        return utilService.getRootPathBySite(siteArray);

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

    $scope.selectSortBy = function (sortBy) {
        $scope.sortBy = sortBy;
    };

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

    $scope.deleteSequence = function (selectedSeq) {

        var param = {
            id: selectedSeq._id,
            path: utilService.getRootPathBySite(selectedSeq.file_location)
        };

        if (confirm("Delete this sequence?\nThis action cannot be recoverd.") == true) {
            $http.post("/api/sequence/deleteSequence", JSON.stringify(param))
                .success(function (respond) {
                    alert(respond);
                    // console.log(databaseResult);
                    // $state.go('annotation');
                })
                .error(function (data, status, header, config) {
                    alert("delete sequence failed!\nStatus: " + status + "\nData: " + data);

                    console.log("delete sequence failed!");
                });
        }


    };

    $scope.changePage = function (page) {
        $anchorScroll('top');
        // console.log("page: " + page);

        dataService.data.resultListPageNum = page;
    };

    $scope.back = function () {
        $state.go('query');
    };

}]);


app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


    $scope.previewSrc = function () {

        // console.log(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location)+ "/" + result.cameras[0].name + "/L/h264.mp4");
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/" + result.cameras[0].name + "/R/" + result.title + "_h264_R.mp4");
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
