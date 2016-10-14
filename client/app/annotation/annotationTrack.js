/**
 * Created by cjfang on 9/27/16.
 */

app.controller('annotationTrackCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {


    // $scope.editing = false;
    // var canceling = false;

    $scope.currentPage = dataService.data.annotationPageNum;

    $scope.selectedTask = {id: "all_task", label: "All task"};
    $scope.selectedState = {id: "all_state", label: "All State"};
    $scope.selectedOrder = {id: "date", label: "Date"};

// $scope.selected = [ {id: "moving_object", label: "Moving object"}, {id: "free_space", label: "Free space"}, {id: "free_space_with_curb", label: "Free space with curb"}];

    $scope.showResults = [];
    $scope.noResult = false;
    $scope.categoryData = [ {id: "all_task", label: "All task"}, {id: "moving_object", label: "Moving object"}, {id: "free_space", label: "Free space"}, {id: "free_space_with_curb", label: "Free space with curb"}];
    $scope.stateData = [ {id: "all_state", label: "All State"}, {id: "Pending", label: "Pending"}, {id: "Annotating", label: "Annotating"}, {id: "Reviewing", label: "Reviewing"}, {id: "Finished", label: "Finished"}, {id: "Modifying", label: "Modifying"}];
    $scope.orderData = [ {id: "date", label: "Date"}, {id: "priority", label: "Priority"}];

    $scope.multiSelectSettings = {
        smartButtonMaxItems: 1,
        selectionLimit: 1,
        showCheckAll: false,
        showUncheckAll: false

    };

    $scope.event = {
        onItemSelect: function (item) {
            $scope.selectedResults();
        },
        onItemDeselect: function (item) {
            $scope.selectedResults();
        }
    };


    $http.get("/api/sequence/getUnfinished")
        .success(function(databaseResult) {
            $scope.results = databaseResult;
            $scope.showResults = $scope.results;
        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });


    var firstSearch = true;
    var resultBeforeSearch = [];

    $scope.search = function () {


        if (firstSearch){
            resultBeforeSearch = $scope.showResults;
            firstSearch = false;
        }
        if ($scope.searchTitle.length > 0){

            $scope.showResults = [];

            for (var i = 0; i < $scope.results.length; i++){
                if ($scope.results[i].title == $scope.searchTitle){
                    $scope.showResults.push($scope.results[i]);
                    break;
                }
            }
        } else {

            firstSearch = true;
            $scope.showResults = resultBeforeSearch;
            resultBeforeSearch = [];
        }

        $scope.noResult = $scope.showResults.length == 0;

    };

    $scope.selectedResults = function () {

        $scope.showResults = [];

        if ($scope.selectedTask.id == 'all_task' && $scope.selectedState.id == 'all_state'){
            $scope.showResults = $scope.results;

        } else if ($scope.selectedTask.id == 'all_task' && $scope.selectedState.id != 'all_state') {
            for (var i = 0; i < $scope.results.length; i++){
                for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                    if ($scope.results[i].cameras[0].annotation[j].state == $scope.selectedState.id){
                        $scope.showResults.push($scope.results[i]);
                        break;
                    }
                }
            }

        }else if ($scope.selectedTask.id != 'all_task' && $scope.selectedState.id == 'all_state') {
            for (var i = 0; i < $scope.results.length; i++){
                for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                    if ($scope.results[i].cameras[0].annotation[j].category == $scope.selectedTask.id){
                        $scope.showResults.push($scope.results[i]);
                    }
                }
            }

        } else {
            for (var i = 0; i < $scope.results.length; i++){
                for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                    if ($scope.results[i].cameras[0].annotation[j].category == $scope.selectedTask.id
                        && $scope.results[i].cameras[0].annotation[j].state == $scope.selectedState.id){
                        $scope.showResults.push($scope.results[i]);
                    }
                }
            }
        }

        $scope.noResult = $scope.showResults.length == 0;

    };

    $scope.showRequest = function (tasks) {
        var request = [];

        if ($scope.selectedTask.id == 'all_task' && $scope.selectedState.id == 'all_state'){
            for (var i = 0; i < tasks.length; i++){
                    request.push(tasks[i]);
                    request[request.length-1].index = i;
            }
        } else if($scope.selectedTask.id == 'all_task' && $scope.selectedState.id != 'all_state') {
            for (var i = 0; i < tasks.length; i++){

                if (tasks[i].state == $scope.selectedState.id){
                    request.push(tasks[i]);
                    request[request.length-1].index = i;
                }
            }
        } else {
            for (var i = 0; i < tasks.length; i++){

                if (tasks[i].category == $scope.selectedTask.id){
                    request.push(tasks[i]);
                    request[request.length-1].index = i;
                    break;
                }
            }
        }

        return request;
    };

    // $scope.showResultsTaskCount = function () {
    //
    //
    // };

    $scope.thumbSrc = function (result) {
        return $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/thumb.jpg");
    };


    $scope.download = function (result, file, category, version) {

        if (file == 'package')
            return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/annotation/"+ result.title +".tar.gz";
        if (file == 'JSON')
            return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + '/' + result.cameras[0].name + "/annotation/"+ category + "_v" + version + '/' + result.title + "_" + category + ".json";
    };

    $scope.preview = function (result) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myPreviewContent.html',
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


    $scope.showDownloadBtn = function (uploadTime) {

        if(uploadTime){
            uploadTime = uploadTime.substring(0, 19);
            uploadTime = uploadTime.replace('T', '-');
        }

        return uploadTime;
    };



    // $scope.upload = function (ele) {
    //
    //     var files = ele.files;
    //
    //     var result = angular.element(ele).scope().result;
    //     var index = angular.element(ele).scope().$index;
    //
    //     if (files.length == 2){
    //
    //         var fd = new FormData();
    //         fd.append("annotation", files[0]);
    //         fd.append("annotation", files[1]);
    //
    //         fd.append("path", utilService.getRootPathBySite(result.file_location));
    //         fd.append("id", result._id);
    //         fd.append("title", result.title);
    //         fd.append("index", index);
    //         fd.append("category", result.cameras[0].annotation[index].category);
    //         fd.append("fps", result.cameras[0].annotation[index].fps);
    //         fd.append("version_number", result.cameras[0].annotation[index].version[result.cameras[0].annotation[index].version.length-1].version_number);
    //         fd.append("comments", result.cameras[0].annotation[index].version[result.cameras[0].annotation[index].version.length-1].comments);
    //
    //
    //
    //         $http.post("/api/upload/uploadAnnotation", fd,
    //             {
    //                 withCredentials: true,
    //                 headers: {'Content-Type': undefined },
    //                 transformRequest: angular.identity
    //             })
    //             .success(function(data) {
    //                 alert(data);
    //                 console.log(data);
    //
    //                 $http.get("/api/sequence/getUnfinished")
    //                     .success(function(databaseResult) {
    //                         $scope.results = databaseResult;
    //                     })
    //                     .error(function (data, status, header, config) {
    //                         $scope.results = "failed!";
    //                     });
    //
    //             })
    //             .error(function (data, status, header, config) {
    //                 alert("Upload annotation failed!\nStatus: " + status + "\nData: " + data);
    //
    //                 console.log("Upload annotation failed!");
    //             });
    //
    //
    //     } else {
    //         alert("Please upload both annotation and state file");
    //     }
    // };


    // $scope.edit = function (request, index) {
    //
    //     if (!$scope.editing && !canceling && (request.state == 'Pending' || request.state == 'Annotating' || request.state == 'Reviewing')){
    //         if (!request.isEdit){
    //             request.isEdit = true;
    //             $scope.editing = true;
    //         }
    //     }
    //
    //     if(canceling)canceling = false;
    //
    // };
    //
    // $scope.cancel = function (request) {
    //
    //     request.isEdit = false;
    //     $scope.editing = false;
    //     canceling = true;
    // };
    //
    //
    // $scope.submitEdit = function (result, request, index) {
    //
    //     var set_obj = {};
    //     var state_key = 'cameras.0.annotation.' + index + '.state';
    //     set_obj[state_key] = request.state;
    //
    //     var query = {
    //         condition: {_id: result._id},
    //         update: {$set: set_obj},
    //         options: {multi: false}
    //     };
    //
    //     $http.post("/api/sequence/update", JSON.stringify(query))
    //         .success(function(databaseResult) {
    //             $scope.cancel(request);
    //             if(canceling)canceling = false;
    //         })
    //         .error(function (data, status, header, config) {
    //             alert("edit request failed!\nStatus: " + status + "\nData: " + data);
    //
    //             console.log("submit request failed!");
    //         });
    // };
    //
    //
    // $scope.disableEdit = function () {
    //     canceling = true;
    // };


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
                            $scope.selectedTask = {id: "all_task", label: "All task"};
                            $scope.selectedState = {id: "all_state", label: "All State"};
                            $scope.selectedOrder = {id: "date", label: "Date"};
                            $scope.selectedResults();
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
                    $scope.selectedTask = {id: "all_task", label: "All task"};
                    $scope.selectedState = {id: "all_state", label: "All State"};
                    $scope.selectedOrder = {id: "date", label: "Date"};
                    $scope.selectedResults();

                })
                .error(function (data, status, header, config) {
                    $scope.results = "failed!";
                });
        }, function () {
        });

    };


    $scope.changePage = function (page) {
        $anchorScroll('top');
        // console.log("page: " + page);

        dataService.data.annotationPageNum = page;
    };

    $scope.order = function (result) {

        var order = 10;

        if ($scope.selectedOrder.id == 'priority'){

            if ($scope.selectedTask.id == 'all_task'){
                result.cameras[0].annotation.forEach(function (request) {

                    order -= request.priority;
                });
            } else {
                result.cameras[0].annotation.forEach(function (request) {
                    if (request.category == $scope.selectedTask.id)
                        order -= request.priority;
                });
            }
        }

        return order;
    };

    $scope.gotoManagePage = function () {
        $state.go('annotationManage');
    }

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
        

        if ($scope.files && $scope.files.length == 1){

            console.log("version_number", result.cameras[0].annotation[index].version[result.cameras[0].annotation[index].version.length-1].version_number);
            console.log("originalname: " + $scope.files);


            var fd = new FormData();
            fd.append("annotation", $scope.files[0]);
            // fd.append("annotation", files[1]);

            fd.append("path", utilService.getRootPathBySite(result.file_location));
            // fd.append("id", result._id);
            fd.append("title", result.title);
            // fd.append("index", index);
            fd.append("category", result.cameras[0].annotation[index].category);
            // fd.append("fps", result.fps);
            fd.append("version_number", result.cameras[0].annotation[index].version[result.cameras[0].annotation[index].version.length-1].version_number);
            // fd.append("comments", result.version[result.version.length-1].comments);



            $http.post("/api/upload/uploadReview", fd,
                {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(data) {
                    // alert(data);
                    console.log(data);
                    $http.post("/api/sequence/update", JSON.stringify(query))
                        .success(function(databaseResult) {
                            $uibModalInstance.close();
                        })
                        .error(function (data, status, header, config) {
                            alert("Modify request failed!\nStatus: " + status + "\nData: " + data);

                            console.log("submit request failed!");
                        });

                })
                .error(function (data, status, header, config) {
                    alert("Upload annotation failed!\nStatus: " + status + "\nData: " + data);

                    console.log("Upload annotation failed!");
                });
        } else {
            
            $http.post("/api/sequence/update", JSON.stringify(query))
                .success(function(databaseResult) {
                    $uibModalInstance.close();
                })
                .error(function (data, status, header, config) {
                    alert("Modify request failed!\nStatus: " + status + "\nData: " + data);

                    console.log("submit request failed!");
                });
        }


        
        
        

    };

    $scope.upload = function (ele) {

        $scope.files = ele.files;

        // var result = angular.element(ele).scope().result;
        // var index = result.index;



    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


app.controller('annotatePreviewCtrl', function ($scope, $uibModalInstance, $sce, result, dataService, utilService) {


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
