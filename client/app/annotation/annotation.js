/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('annotationCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    $scope.editing = false;
    $scope.currentPage = dataService.data.annotationPageNum;

    // $scope.selected = [];
    $scope.selected = [ {id: "moving_object", label: "Moving object"}, {id: "free_space", label: "Free space"}, {id: "free_space_with_curb", label: "Free space with curb"}];

    // $scope.showResults = [];

    $scope.categoryData = [ {id: "moving_object", label: "Moving object"}, {id: "free_space", label: "Free space"}, {id: "free_space_with_curb", label: "Free space with curb"}];
    $scope.multiSelectSettings = {
        // smartButtonMaxItems: 3,
        showCheckAll: false,
        showUncheckAll: false

    };

    $scope.event = {
        onItemSelect: function (item) {
            // console.log("onItemSelect!");
            $scope.selectedResults();
        },
        onItemDeselect: function (item) {
            // console.log("onItemDeselect!");
            $scope.selectedResults();
        }
    };




    var canceling = false;

    $http.get("/api/sequence/getUnfinished")
        .success(function(databaseResult) {
            $scope.results = databaseResult;
            $scope.showResults = $scope.results;
        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });


    function inArray(arr, obj) {
        console.log("arr:" + arr);
        console.log("obj:" + obj);


        return (arr.indexOf(obj) != -1);
    }

    $scope.showed = [];

    $scope.selectedResults = function () {
        console.log("selectedResults!");
        console.log("showed:" + $scope.showed);

        if ($scope.results){
            $scope.showResults = [];

            for (var i = 0; i < $scope.results.length; i++){

                if (!inArray($scope.showed, i)){
                    for (var j = 0; j < $scope.selected.length; j++){
                        for ( var k = 0; k < $scope.results[i].cameras[0].annotation.length; k++){

                            if ($scope.results[i].cameras[0].annotation[k].category == $scope.selected[j].id){
                                $scope.showResults.push($scope.results[i]);
                                $scope.showed.push(i);
                            }
                        }
                    }
                }
            }

            // $scope.results.forEach(function (result) {
            //     $scope.selected.forEach(function (selectedCategory) {
            //         for ( var i = 0; i < result.cameras[0].annotation.length; i++){
            //
            //             if (result.cameras[0].annotation[i].category == selectedCategory.id){
            //                 $scope.showResults.push(result);
            //             }
            //         }
            //     });
            //
            //
            //
            // });
        }

    };



    $scope.thumbSrc = function (result) {
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/thumb.jpg");
    };

    // $scope.showPriority = function (priority) {
    //
    //     if (priority == 1) return 'Low';
    //     if (priority == 2) return 'Medium';
    //     if (priority == 3) return 'High';
    // };


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
            fd.append("fps", result.cameras[0].annotation[index].fps);
            fd.append("version_number", result.cameras[0].annotation[index].version[result.cameras[0].annotation[index].version.length-1].version_number);
            fd.append("comments", result.cameras[0].annotation[index].version[result.cameras[0].annotation[index].version.length-1].comments);



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
            controller: 'annotateModifyCtrl',
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
            $http.get("/api/sequence/getUnfinished")
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


    $scope.changePage = function (page) {
        $anchorScroll('top');
        // console.log("page: " + page);

        dataService.data.annotationPageNum = page;
    };

    $scope.order = function (result) {

        var totalPriority = 0;

        result.cameras[0].annotation.forEach(function (request) {

            totalPriority += request.priority;
        });

        return totalPriority;
    };

}]);



app.controller('annotateModifyCtrl', function ($scope, $http, $uibModalInstance, $sce, result, index, dataService, utilService) {

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
