/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('archiveCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    $scope.editing = false;
    var canceling = false;

    $http.get("/api/sequence/getAccepted")
        .success(function(databaseResult) {
            $scope.results = databaseResult;
        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });


    $scope.thumbSrc = function (result) {
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/thumb.jpg");
    };



    $scope.download = function (result, file, category, version) {

        if (file == 'package')
            return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/annotation/"+ result.title +".tar.gz";
        if (file == 'JSON')
            return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/annotation/"+ category + "_v" + version + '/' + result.title + "_" + category + ".json";
    };


    $scope.showDownloadBtn = function (uploadTime) {

        if(uploadTime){
            uploadTime = uploadTime.substring(0, 19);
            uploadTime = uploadTime.replace('T', '-');
        }

        return uploadTime;
    };

    $scope.upload = function (ele) {

        var files = ele.files;

        var result = angular.element(ele).scope().result;
        var index = angular.element(ele).scope().$index;

        if (files.length == 2){

            var fd = new FormData();
            fd.append("annotation", files[0]);
            fd.append("annotation", files[1]);

            fd.append("path", utilService.getRootPathBySite(result.file_location));
            fd.append("id", result._id);
            fd.append("title", result.title);
            fd.append("index", index);
            fd.append("category", result.cameras[0].annotation[index].category);


            $http.post("/api/upload/uploadAnnotation", fd,
                {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(data) {
                    alert(data);
                    console.log(data);

                    $http.get("/api/sequence/getUnfinished")
                        .success(function(databaseResult) {
                            $scope.results = databaseResult;
                        })
                        .error(function (data, status, header, config) {
                            $scope.results = "failed!";
                        });

                })
                .error(function (data, status, header, config) {
                    alert("Upload annotation failed!\nStatus: " + status + "\nData: " + data);

                    console.log("Upload annotation failed!");
                });


        } else {
            alert("Please upload both annotation and state file");
        }
    };


    $scope.edit = function (request, index) {

        if (!$scope.editing && !canceling && (request.state == 'Pending' || request.state == 'Annotating' || request.state == 'Reviewing')){
            if (!request.isEdit){
                request.isEdit = true;
                $scope.editing = true;
            }
        }

        if(canceling)canceling = false;

    };

    $scope.cancel = function (request) {

        request.isEdit = false;
        $scope.editing = false;
        canceling = true;
    };


    $scope.submitEdit = function (result, request, index) {

        var set_obj = {};
        var state_key = 'cameras.0.annotation.' + index + '.state';
        set_obj[state_key] = request.state;

        var query = {
            condition: {_id: result._id},
            update: {$set: set_obj},
            options: {multi: false}
        };

        $http.post("/api/sequence/update", JSON.stringify(query))
            .success(function(databaseResult) {
                $scope.cancel(request);
                if(canceling)canceling = false;
            })
            .error(function (data, status, header, config) {
                alert("edit request failed!\nStatus: " + status + "\nData: " + data);

                console.log("submit request failed!");
            });
    };


    $scope.disableEdit = function () {
        canceling = true;
    };


    $scope.accept = function (result, index) {

        if (confirm("Accept this annotation task?\n" +
                "Task will be removed from the list.\n" +
                "Please use the query function to find the annotation result.") == true) {

            var set_obj = {};

            var state_key = 'cameras.0.annotation.' + index + '.state';
            set_obj[state_key] = 'Accepted';

            var query = {
                condition: {_id: result._id},
                update: {$set: set_obj},
                options: {multi: false}
            };

            $http.post("/api/sequence/update", JSON.stringify(query))
                .success(function(databaseResult) {
                    $http.get("/api/sequence/getUnfinished")
                        .success(function(databaseResult) {
                            $scope.results = databaseResult;
                        })
                        .error(function (data, status, header, config) {
                            $scope.results = "failed!";
                        });

                })
                .error(function (data, status, header, config) {
                    alert("edit request failed!\nStatus: " + status + "\nData: " + data);

                    console.log("submit request failed!");
                });

        }
    };


    $scope.modify = function (result, index) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'archiveModifyCtrl',
            size: 'md',
            resolve: {
                result: function () {
                    return result;
                },
                index: function () {
                    return index;
                }
            }
        });

        modalInstance.result.then(function () {
            $http.get("/api/sequence/getAccepted")
                .success(function(databaseResult) {
                    $scope.results = databaseResult;
                })
                .error(function (data, status, header, config) {
                    $scope.results = "failed!";
                });
        }, function () {
        });

    };


    $scope.showComments = function (result, index) {
        $anchorScroll('top');
    };


    $scope.linkToTop = function () {
        $anchorScroll('top');
    };

    $scope.order = function (result) {

        var totalPriority = 0;

        result.cameras[0].annotation.forEach(function (request) {

            totalPriority += request.priority;
        });

        return totalPriority;
    };

}]);



app.controller('archiveModifyCtrl', function ($scope, $http, $uibModalInstance, $sce, result, index, dataService, utilService) {

    $scope.submitComments = function () {

        var set_obj = {};
        var version_obj = {};
        var version_key = 'cameras.0.annotation.' + index + '.version';
        var state_key = 'cameras.0.annotation.' + index + '.state';
        var verNum = result.cameras[0].annotation[index].version.length + 1;

        version_obj[version_key] = {version_number: verNum, comments: $scope.comments};
        set_obj[state_key] = 'Modifying';

        var query = {
            condition: {_id: result._id},
            update: {$set: set_obj, $push: version_obj},
            options: {multi: false}
        };

        $http.post("/api/sequence/update", JSON.stringify(query))
            .success(function(databaseResult) {
                $uibModalInstance.close();
            })
            .error(function (data, status, header, config) {
                alert("Modify request failed!\nStatus: " + status + "\nData: " + data);

                console.log("submit request failed!");
            });

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
