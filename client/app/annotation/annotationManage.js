/**
 * Created by cjfang on 9/27/16.
 */
'use strict';

app.controller('annotationManageCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll) {

    $scope.editing = false;
    var canceling = false;
    var curEditingResult = {};
    var currentTab = "moving_object";
    var tempResults = [];

    $scope.tab = {
        moving_object: true,
        free_space: false,
        free_space_with_curb: false,
        download: false
    };

    $scope.showResults = [];

    $scope.selectedState = {id: "all_state", label: "All State"};
    $scope.selectedOrder = {id: "date", label: "Date"};
    $scope.selectedMonth = {id: "05", label: "05"};
    $scope.selectedYear = {id: "2017", label: "2017"};


    $scope.stateData = [ {id: "all_state", label: "All State"}, {id: "Pending", label: "Pending"}, {id: "Annotating", label: "Annotating"}, {id: "Reviewing", label: "Reviewing"}, {id: "Finished_Basic", label: "Finished_Basic"}, {id: "Finished", label: "Finished"}, {id: "Modifying", label: "Modifying"}];
    $scope.orderData = [ {id: "date", label: "Date"}, {id: "priority", label: "Priority"}];
    $scope.yearData = [ {id: "2016", label: "2016"}, {id: "2017", label: "2017"}, {id: "2018", label: "2018"}];
    $scope.monthData = [ {id: "01", label: "01"}, {id: "02", label: "02"}, {id: "03", label: "03"}, {id: "04", label: "04"}, {id: "05", label: "05"}, {id: "06", label: "06"}, {id: "07", label: "07"}, {id: "08", label: "08"}, {id: "09", label: "09"}, {id: "10", label: "10"}, {id: "11", label: "11"}, {id: "12", label: "12"}];

    $scope.multiSelectSettings = {
        smartButtonMaxItems: 1,
        selectionLimit: 1,
        showCheckAll: false,
        showUncheckAll: false

    };

    $scope.event = {
        onItemSelect: function (item) {
            $scope.showState();
        },
        onItemDeselect: function (item) {
            // $scope.selectedResults();
        }
    };

    $scope.changeDateEvent = {
        onItemSelect: function (item) {
            // console.log(item);
            $scope.changeDate();
        },
        onItemDeselect: function (item) {
            // $scope.selectedResults();
        }
    };


    var query = {
        year: $scope.selectedYear.id,
        month: $scope.selectedMonth.id
    };

    $http.post("/api/sequence/getUnfinishedByDate", JSON.stringify(query))
        .success(function(databaseResult) {
            $scope.results = databaseResult;
            console.log("$scope.results.length: " + $scope.results.length);

            for (var i = 0; i < $scope.results.length; i++){
                for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                    if ($scope.results[i].cameras[0].annotation[j].category == currentTab){
                        $scope.showResults.push($scope.results[i].cameras[0].annotation[j]);
                        $scope.showResults[$scope.showResults.length-1].title = $scope.results[i].title;
                        $scope.showResults[$scope.showResults.length-1]._id = $scope.results[i]._id;
                        $scope.showResults[$scope.showResults.length-1].index = j;
                        $scope.showResults[$scope.showResults.length-1].file_location = $scope.results[i].file_location;
                        tempResults.push($scope.showResults[$scope.showResults.length-1]);

                        break;
                    }
                }
            }
        })
        .error(function (data, status, header, config) {

            console.log("submit request failed!");
        });


    // $http.get("/api/sequence/getUnfinished")
    //     .success(function(databaseResult) {
    //         $scope.results = databaseResult;
    //
    //         for (var i = 0; i < $scope.results.length; i++){
    //             for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){
    //
    //                 if ($scope.results[i].cameras[0].annotation[j].category == currentTab){
    //                     $scope.showResults.push($scope.results[i].cameras[0].annotation[j]);
    //                     $scope.showResults[$scope.showResults.length-1].title = $scope.results[i].title;
    //                     $scope.showResults[$scope.showResults.length-1]._id = $scope.results[i]._id;
    //                     $scope.showResults[$scope.showResults.length-1].index = j;
    //                     $scope.showResults[$scope.showResults.length-1].file_location = $scope.results[i].file_location;
    //                     tempResults.push($scope.showResults[$scope.showResults.length-1]);
    //
    //                     break;
    //                 }
    //             }
    //         }
    //
    //     })
    //     .error(function (data, status, header, config) {
    //         $scope.results = "failed!";
    //     });

    $scope.showLimitedResults = [];
    $scope.currentItems = 0;

    // $scope.loadMore = function () {
    //     console.log('run!');
    //
    //     for (var i = $scope.currentItems; i < $scope.currentItems+30; i++){
    //         $scope.showLimitedResults.push($scope.showResults[i]);
    //     }
    //
    //     $scope.currentItems += 30;
    // };

    $scope.switchTab = function (tab) {

        $scope.tab.moving_object = false;
        $scope.tab.free_space = false;
        $scope.tab.free_space_with_curb = false;
        $scope.tab.download = false;
        $scope.tab[tab] = true;
        currentTab = tab;
        tempResults = [];
        $scope.showResults = [];
        $scope.selectedState.id = 'all_state';

        // $scope.editing = false;        $scope.cancel(curEditingResult);

        // canceling = false;
        curEditingResult.isEdit = false;
        $scope.editing = false;

        for (var i = 0; i < $scope.results.length; i++){
            for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                if ($scope.results[i].cameras[0].annotation[j].category == tab){
                    $scope.showResults.push($scope.results[i].cameras[0].annotation[j]);
                    $scope.showResults[$scope.showResults.length-1].title = $scope.results[i].title;
                    $scope.showResults[$scope.showResults.length-1]._id = $scope.results[i]._id;
                    $scope.showResults[$scope.showResults.length-1].index = j;
                    $scope.showResults[$scope.showResults.length-1].file_location = $scope.results[i].file_location;
                    tempResults.push($scope.showResults[$scope.showResults.length-1]);

                    break;
                }
            }
        }

// console.log($scope.showResultsGroup());
    };

    $scope.switchToDownload = function () {

        $scope.tab.moving_object = false;
        $scope.tab.free_space = false;
        $scope.tab.free_space_with_curb = false;
        $scope.tab.download = true;

        $http.get("/api/annotation/getAllBatch")
            .success(function(databaseResult) {
                $scope.batch = databaseResult;
            })
            .error(function (data, status, header, config) {
                $scope.batch = "failed!";
            });

    };

    $scope.showState = function () {

        $scope.showResults = [];

        if ($scope.selectedState.id == 'all_state'){
            $scope.showResults = tempResults;
        } else {
            for (var i = 0; i < tempResults.length; i++){

                if (tempResults[i].state == $scope.selectedState.id){
                    $scope.showResults.push(tempResults[i]);
                }

            }
        }


    };

    $scope.changeDate = function () {

        $scope.showResults = [];

        var query = {
            year: $scope.selectedYear.id,
            month: $scope.selectedMonth.id
        };

        $http.post("/api/sequence/getUnfinishedByDate", JSON.stringify(query))
            .success(function(databaseResult) {
                $scope.results = databaseResult;
                console.log("$scope.results.length: " + $scope.results.length);

                for (var i = 0; i < $scope.results.length; i++){
                    for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                        if ($scope.results[i].cameras[0].annotation[j].category == currentTab){
                            $scope.showResults.push($scope.results[i].cameras[0].annotation[j]);
                            $scope.showResults[$scope.showResults.length-1].title = $scope.results[i].title;
                            $scope.showResults[$scope.showResults.length-1]._id = $scope.results[i]._id;
                            $scope.showResults[$scope.showResults.length-1].index = j;
                            $scope.showResults[$scope.showResults.length-1].file_location = $scope.results[i].file_location;
                            tempResults.push($scope.showResults[$scope.showResults.length-1]);

                            break;
                        }
                    }
                }
            })
            .error(function (data, status, header, config) {

                console.log("submit request failed!");
            });


    };

    var firstSearch = true;
    var resultBeforeSearch = [];

    $scope.search = function () {

        if (firstSearch){
            resultBeforeSearch = $scope.showResults;
            firstSearch = false;
        }
        if ($scope.searchTitle.length > 0){

            $scope.showResults = [];

            for (var i = 0; i < tempResults.length; i++){
                if (tempResults[i].title == $scope.searchTitle){
                    $scope.showResults.push(tempResults[i]);
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


    $scope.editState = function (result) {

        if (!$scope.editing && !canceling && (result.state == 'Pending' || result.state == 'Annotating' || result.state == 'Reviewing')){
            if (!result.isEdit){
                result.isEdit = true;
                $scope.editing = true;
                curEditingResult = result;
            }
        }

        if(canceling)canceling = false;

    };

    $scope.cancel = function (result) {

        result.isEdit = false;
        $scope.editing = false;
        canceling = true;
    };


    $scope.submitEdit = function (result) {

        var set_obj = {};
        var state_key = 'cameras.0.annotation.' + result.index + '.state';
        set_obj[state_key] = result.state;

        var query = {
            condition: {_id: result._id},
            update: {$set: set_obj},
            options: {multi: false}
        };

        $http.post("/api/sequence/update", JSON.stringify(query))
            .success(function(databaseResult) {
                $scope.cancel(result);
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

    $scope.download = function (result, file, version) {

        // if (file == 'package')
        //     return dataService.data.fileServerAddr  + utilService.getRootPathBySite(result.file_location) + "/Front_Stereo/annotation/"+ result.title +".tar.gz";
        if (file == 'JSON')
            return dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/Front_Stereo/annotation/"+ result.category + "_v" + version + '/' + result.title + "_" + result.category + ".json";
    };


    $scope.showDownloadBtn = function (uploadTime) {

        if(uploadTime){
            uploadTime = uploadTime.substring(0, 19);
            uploadTime = uploadTime.replace('T', '-');
        }

        return uploadTime;
    };


    $scope.batchUpdate = function (ele) {

        var file = ele.files;

        // var result = angular.element(ele).scope().result;
        // var index = result.index;

        if (file.length == 1){

            console.log(file[0]);

            var fd = new FormData();
            fd.append("batchFile", file[0]);


            $http.post("/api/upload/batchUpdate", fd,
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
                            tempResults = [];
                            $scope.showResults = [];
                            $scope.selectedState.id = 'all_state';

                            for (var i = 0; i < $scope.results.length; i++){
                                for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                                    if ($scope.results[i].cameras[0].annotation[j].category == currentTab){
                                        $scope.showResults.push($scope.results[i].cameras[0].annotation[j]);
                                        $scope.showResults[$scope.showResults.length-1].title = $scope.results[i].title;
                                        $scope.showResults[$scope.showResults.length-1]._id = $scope.results[i]._id;
                                        $scope.showResults[$scope.showResults.length-1].index = j;
                                        $scope.showResults[$scope.showResults.length-1].file_location = $scope.results[i].file_location;
                                        tempResults.push($scope.showResults[$scope.showResults.length-1]);

                                        break;
                                    }
                                }
                            }
                        })
                        .error(function (data, status, header, config) {
                            $scope.results = "failed!";
                        });

                })
                .error(function (data, status, header, config) {
                    alert("Batch update failed!\nStatus: " + status + "\nData: " + data);

                    console.log("Batch update failed!");
                });
        } else {
            alert("Please upload at least one file!");
        }



    };



    $scope.upload = function (ele) {

        var files = ele.files;

        var result = angular.element(ele).scope().result;
        var index = result.index;


        if (typeof result.fully_annotated == 'undefined') {
            result.fully_annotated = false;
        }

        if (files.length == 2){

            var fd = new FormData();
            fd.append("annotation", files[0]);
            fd.append("annotation", files[1]);

            fd.append("path", utilService.getRootPathBySite(result.file_location));
            fd.append("id", result._id);
            fd.append("title", result.title);
            fd.append("index", index);
            fd.append("category", result.category);
            fd.append("fps", result.fps);
            fd.append("version_number", result.version[result.version.length-1].version_number);
            fd.append("comments", result.version[result.version.length-1].comments);
            fd.append("fully_annotated", result.fully_annotated);




            $http.post("/api/upload/uploadAnnotation", fd,
                {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(data) {
                    alert(data);
                    console.log(data);

                    var query = {
                        year: $scope.selectedYear.id,
                        month: $scope.selectedMonth.id
                    };

                    $http.post("/api/sequence/getUnfinishedByDate", JSON.stringify(query))
                        .success(function(databaseResult) {
                            $scope.results = databaseResult;
                            console.log("$scope.results.length: " + $scope.results.length);

                            for (var i = 0; i < $scope.results.length; i++){
                                for ( var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){

                                    if ($scope.results[i].cameras[0].annotation[j].category == currentTab){
                                        $scope.showResults.push($scope.results[i].cameras[0].annotation[j]);
                                        $scope.showResults[$scope.showResults.length-1].title = $scope.results[i].title;
                                        $scope.showResults[$scope.showResults.length-1]._id = $scope.results[i]._id;
                                        $scope.showResults[$scope.showResults.length-1].index = j;
                                        $scope.showResults[$scope.showResults.length-1].file_location = $scope.results[i].file_location;
                                        tempResults.push($scope.showResults[$scope.showResults.length-1]);

                                        break;
                                    }
                                }
                            }
                        })
                        .error(function (data, status, header, config) {

                            console.log("submit request failed!");
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


    $scope.batchUpload = function (ele) {

        var file = ele.files;

        var item = angular.element(ele).scope().item;
        var index = item.index;

        if (file.length == 1){

            console.log("item.batchName:" + item.batchName);

            console.log(file[0]);

            var fd = new FormData();
            fd.append("batch", file[0]);
            fd.append("batchName", item.batchName);



            $http.post("/api/upload/batchUpload", fd,
                {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(data) {
                    alert(data);
                    console.log(data);



                })
                .error(function (data, status, header, config) {
                    alert("Batch update failed!\nStatus: " + status + "\nData: " + data);

                    console.log("Batch update failed!");
                });
        } else {
            alert("Please upload at least one file!");
        }

    };


    $scope.order = function (result) {

        var order = 10;

        if ($scope.selectedOrder.id == 'priority')
            order -= result.priority;

        return order;
    };


    $scope.batchCreatedData = function (item) {

        var formattedDate = new Date(item);

        return formattedDate.toLocaleString();
    };


    $scope.downloadBatch = function (item) {

        return dataService.data.fileServerAddr + "/vol1/annotation/tasks_batch/" + item.batchName + ".tar.gz";
    };

    $scope.deleteBatch = function (item) {

        var param = {
            id: item._id,
            batchName: item.batchName
        };

        if (confirm("Delete this batch of annotation package?") == true) {
            $http.post("/api/annotation/removeBatch", JSON.stringify(param))
                .success(function(result) {
                    $http.get("/api/annotation/getAllBatch")
                        .success(function(databaseResult) {
                            $scope.batch = databaseResult;
                        })
                        .error(function (data, status, header, config) {
                            $scope.batch = "failed!";
                        });

                    alert(result);
                })
                .error(function (data, status, header, config) {
                    alert("Delete batch failed!\nStatus: " + status + "\nData: " + data);
                    console.log("Delete batch failed!");
                });
        }



    };

    $scope.gotoTrackPage = function () {
        $state.go('annotationTrack');
    };

}]);


