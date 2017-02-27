/**
 * Created by rayfang on 6/10/16.
 */
'use strict';

app.controller('resultListCtrl', ['$scope', '$http', '$state', '$sce', '$uibModal', 'dataService', 'utilService', '$anchorScroll', '$window', function ($scope, $http, $state, $sce, $uibModal, dataService, utilService, $anchorScroll, $window) {

    $scope.sortBy = "Date";
    $scope.currentPage = dataService.data.resultListPageNum;

    // $scope.url = {
    //     moving_object: "",
    //     free_space: "",
    //     yuv_R: "",
    //     yuv_L: ""
    // };

    $scope.jsonUrl = "";

    var query = dataService.data.queryObj;
    $scope.results = [];

    $http.post("/api/sequence/query", JSON.stringify(query))
    // $http.get("/api/sequence/getAllUnfiltered")

        .success(function (databaseResult) {

            // var new_added = ['16-11-14-082050-tw', '16-11-14-075645-tw', '16-11-14-074717-tw', '16-11-23-104901-tw', '16-11-23-194630-tw', '16-11-23-213654-tw','16-11-24-160400-tw', '16-10-22-144618-tw', '16-10-23-194509-tw', '16-11-04-163158-tw', '16-11-21-144403-tw', '16-11-14-135323-tw', '16-11-13-212634-tw', '16-09-16-163729-us', '16-11-23-214143-tw', '16-11-23-194409-tw', '16-11-21-155049-tw', '16-11-21-152240-tw', '16-11-21-144706-tw', '16-11-21-144609-tw', '16-11-21-144313-tw', '16-11-14-140644-tw', '16-11-04-074711-tw', '16-10-23-195542-tw', '16-10-23-183903-tw', '16-10-22-111856-tw', '16-10-22-111639-tw', '16-10-22-103658-tw', '16-10-22-102012-tw'];
            // for (var i = 0; i < databaseResult.length; i++){
            //     for (var j = 0; j < new_added.length; j++){
            //         if (databaseResult[i].title == new_added[j]){
            //             $scope.results.push(databaseResult[i]);
            //             dataService.data.queryResult.push(databaseResult[i]);
            //         }
            //     }
            // }

            $scope.results = databaseResult;
            dataService.data.queryResult = databaseResult;


            // $scope.url.moving_object = ($window.URL || $window.webkitURL).createObjectURL(new Blob([fileContent('moving_object')], {type: 'text/plain'}));
            // $scope.url.free_space = ($window.URL || $window.webkitURL).createObjectURL(new Blob([fileContent('free_space')], {type: 'text/plain'}));
            // $scope.url.yuv_R = ($window.URL || $window.webkitURL).createObjectURL(new Blob([fileContent('yuv_R')], {type: 'text/plain'}));
            // $scope.url.yuv_L = ($window.URL || $window.webkitURL).createObjectURL(new Blob([fileContent('yuv_L')], {type: 'text/plain'}));

            $scope.jsonUrl = ($window.URL || $window.webkitURL).createObjectURL(new Blob([createContent()], {type: 'text/plain'}));


            // $scope.url = {
            //     moving_object: ($window.URL || $window.webkitURL).createObjectURL(new Blob([fileContent('moving_object')], {type: 'text/plain'})),
            //     free_space: ($window.URL || $window.webkitURL).createObjectURL(new Blob([fileContent('free_space')], {type: 'text/plain'})),
            //     yuv: ($window.URL || $window.webkitURL).createObjectURL(new Blob([fileContent('yuv')], {type: 'text/plain'}))
            // };
        })
        .error(function (data, status, header, config) {
            $scope.results = "failed!";
        });




    var createContent = function () {

        var content = { sequence:[] };

        if ($scope.results){

            for (var i = 0; i < $scope.results.length; i++){

                if (!$scope.results[i].no_annotation){

                    var seq = {};
                    // console.log("title: " + $scope.results[i].title + ', count: ' + i);

                    for (var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){
                        if ($scope.results[i].cameras[0].annotation[j].state == 'Finished' || $scope.results[i].cameras[0].annotation[j].state == 'Finished_Basic' || $scope.results[i].cameras[0].annotation[j].state == 'Accepted'){
                            var lastAnnotationVersion = $scope.results[i].cameras[0].annotation[j].version.length;
                            var category = $scope.results[i].cameras[0].annotation[j].category;
                            seq.annotation = {};
                            seq.annotation[category] = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/annotation/' + category + '_v' + lastAnnotationVersion + '/' + $scope.results[i].title + '_' + category + '.json';
                        }
                    }


                    var lastYuvVersion = $scope.results[i].cameras[0].yuv.length;
                    seq.yuv_L = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/L/yuv/' + $scope.results[i].title + '_yuv_v' + lastYuvVersion + '_L.tar';
                    seq.yuv_R = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/R/yuv/' + $scope.results[i].title + '_yuv_v' + lastYuvVersion + '_R.tar';

                    seq.h265_L = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/L/yuv/' + $scope.results[i].title + '_h265_v' + lastYuvVersion + '_L.mp4';
                    seq.h265_R = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/R/yuv/' + $scope.results[i].title + '_h265_v' + lastYuvVersion + '_R.mp4';

                    // seq.h264_L = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/L/' + $scope.results[i].title + '_h264_L.mp4';
                    // seq.h264_R = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/R/' + $scope.results[i].title + '_h264_R.mp4';

                    seq.calibration_L = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/L/cali_data/Left.ini';
                    seq.calibration_R = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/R/cali_data/Right.ini';

                    seq.LUT_L = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/L/cali_data/RECT_Left.blt';
                    seq.LUT_R = dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/R/cali_data/RECT_Right.blt';

                    content.sequence.push(seq);


                }
            }
        }


        // console.log("content: " + JSON.stringify(content, null, 1));

        return JSON.stringify(content, null, 1);

    };



    // var fileContent = function (type) {
    //
    //     var content = "";
    //
    //     if ($scope.results){
    //         if (type == 'yuv_L' || type == 'yuv_R'){
    //             var lastVersion = 1;
    //
    //             for (var i = 0; i < $scope.results.length; i++){
    //
    //                 if ($scope.results[i].cameras[0].yuv.length > 0){
    //
    //                     lastVersion = $scope.results[i].cameras[0].yuv.length;
    //                     if (type == 'yuv_L')
    //                         content += dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/annotation/L/yuv/' + $scope.results[i].title + '_yuv_v' + lastVersion + '_L.tar\n';
    //                     else
    //                         content += dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/annotation/R/yuv/' + $scope.results[i].title + '_yuv_v' + lastVersion + '_R.tar\n';
    //
    //                     // console.log("content: " + content);
    //                 }
    //             }
    //
    //
    //
    //         } else {
    //
    //             var lastVersion = 1;
    //
    //             for (var i = 0; i < $scope.results.length; i++){
    //
    //                 if (!$scope.results[i].no_annotation){
    //
    //                     // console.log("title: " + $scope.results[i].title + ', count: ' + i);
    //
    //                     for (var j = 0; j < $scope.results[i].cameras[0].annotation.length; j++){
    //                         if ($scope.results[i].cameras[0].annotation[j].category == type && ($scope.results[i].cameras[0].annotation[j].state == 'Finished' || $scope.results[i].cameras[0].annotation[j].state == 'Finished_Basic' || $scope.results[i].cameras[0].annotation[j].state == 'Accepted')){
    //                             lastVersion = $scope.results[i].cameras[0].annotation[j].version[($scope.results[i].cameras[0].annotation[j].version.length)-1].version_number;
    //                             content += dataService.data.fileServerAddr + utilService.getRootPathBySite($scope.results[i].file_location) + '/Front_Stereo/annotation/' + type + '_v' + lastVersion + '/' + $scope.results[i].title + '_' + type + '.json\n';
    //                             break;
    //                         }
    //                     }
    //
    //
    //                 }
    //             }
    //
    //         }
    //
    //         // console.log("content: " + content);
    //     }
    //
    //     return content;
    // };

    $scope.download = function (file, result) {

        if (file === 'annotation') {
            return dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/Front_Stereo/annotation/moving_object_v1/" + result.title + "_moving_object.json";
        }

        if (file === 'h265') {
            return dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/Front_Stereo/R/yuv/" + result.title + "_h265_v1_R.mp4";
        }
    };

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
