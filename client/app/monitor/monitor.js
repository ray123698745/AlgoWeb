/**
 * Created by cjfang on 1/30/17.
 */
'use strict';

app.controller('monitorCtrl', ['$scope', '$http', '$state', 'dataService', 'NgMap', function ($scope, $http, $state, dataService, NgMap) {

    var keywordsObj = dataService.keywords;
    var currentTab = 'all';

    $scope.keywordsWithCount = {};
    $scope.taskCount = {
        moving_object: 0,
        free_space: 0,
        free_space_with_curb: 0
    };


    $scope.tab = {
        all: true,
        moving_object: false,
        free_space: false,
        free_space_with_curb: false
    };

    $scope.switchTab = function (tab) {

        $scope.tab.all = false;
        $scope.tab.moving_object = false;
        $scope.tab.free_space = false;
        $scope.tab.free_space_with_curb = false;
        $scope.tab[tab] = true;
        currentTab = tab;

        keywordSwitch(tab);
    };

    $scope.open = true;
    $scope.toggleCollapse = function () {

        $scope.open = !$scope.open;

        // console.log($scope.open);
    };


    $http.get("/api/sequence/allSeqCount")
        .success(function (databaseResult) {

            $scope.max = databaseResult.count;


        })
        .error(function (data, status, header, config) {
            $scope.result = "failed!";
        });

    var annotationTaskCount = function (task) {

        var query = {};
        var or_key = '$or';

        query[or_key] = [
            {'cameras.0.annotation': {
                $elemMatch: {
                    category: task,
                    state: 'Accepted'
                }
            }},
            {'cameras.0.annotation': {
                $elemMatch: {
                    category: task,
                    state: 'Finished'
                }
            }},
            {'cameras.0.annotation': {
                $elemMatch: {
                    category: task,
                    state: 'Finished_Basic'
                }
            }}
        ];
        $http.post("/api/sequence/seqCount", JSON.stringify(query))
            .success(function (databaseResult) {

                $scope.taskCount[task] = databaseResult.count;
            })
            .error(function (data, status, header, config) {
                $scope.result = "failed!";
            });
    };


    var keywordSwitch = function (currentTab) {

        for (var key in keywordsObj) {

            if (!keywordsObj.hasOwnProperty(key)) continue;

            $scope.keywordsWithCount[key] = [];


            for (var i = 0; i < keywordsObj[key].length; i++){

                var query = {
                    keywords: keywordsObj[key][i]
                };

                if (currentTab != 'all'){
                    var or_key = '$or';

                    query[or_key] = [
                        {'cameras.0.annotation': {
                            $elemMatch: {
                                category: currentTab,
                                state: 'Accepted'
                            }
                        }},
                        {'cameras.0.annotation': {
                            $elemMatch: {
                                category: currentTab,
                                state: 'Finished'
                            }
                        }},
                        {'cameras.0.annotation': {
                            $elemMatch: {
                                category: currentTab,
                                state: 'Finished_Basic'
                            }
                        }}
                    ];
                }

                var param = {
                    query: query,
                    key: key
                };

                $http.post("/api/sequence/keywordCount", JSON.stringify(param))
                    .success(function (databaseResult) {

                        $scope.keywordsWithCount[databaseResult.key].push({
                            word: databaseResult.keyword,
                            count: databaseResult.count
                        });
                    })
                    .error(function (data, status, header, config) {
                        $scope.result = "failed!";
                    });


            }


        }
    };

    keywordSwitch('all');
    annotationTaskCount('moving_object');
    annotationTaskCount('free_space');
    annotationTaskCount('free_space_with_curb');

}]);

app.controller('mapController', function($scope, $http, $sce, $interval, NgMap, dataService, utilService) {

    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKazcMqdk5t0mJcyv7lroFEKtLthpFaLg";
    var icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    var vm = this;
    vm.dynMarkers = [];
    NgMap.getMap().then(function(map) {

        $http.get("/api/sequence/getAllGPS")
            .success(function (databaseResult) {

                var result = databaseResult.result;
                // var infoWindow = new google.maps.InfoWindow();

                var infoBubble = new InfoBubble({
                    map: map,
                    shadowStyle: 1,
                    padding: 15,
                    backgroundColor: 'rgb(57,57,57)',
                    borderRadius: 10,
                    arrowSize: 10,
                    borderWidth: 1,
                    maxWidth: 1000,
                    maxHeight: 1000,
                    minWidth: 400,
                    minHeight: 300,
                    borderColor: '#2c2c2c',
                    disableAutoPan: true,
                    hideCloseButton: true,
                    arrowPosition: 50,
                    arrowStyle: 0
                });

                google.maps.event.addListener(map, 'click', function() {
                    infoBubble.close();
                });

                for (var i = 0; i < result.length; i++) {

                    var latLng = new google.maps.LatLng(result[i].gps.x, result[i].gps.y);
                    var marker = new google.maps.Marker({position:latLng, map: map});


                    (function (marker, result) {
                        google.maps.event.addListener(marker, "click", function (e) {
                            //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                            infoBubble.setContent("<div>" +
                                "<h4>" + result.title + "</h4>" +
                                "<div class='embed-responsive embed-responsive-16by9'>" +
                                "<video src='"+ $sce.trustAsResourceUrl(dataService.data.fileServerAddr + utilService.getRootPathBySite(result.file_location) + "/Front_Stereo/R/"+ result.title +"_h264_R.mp4") +"' type='video/mp4' controls></video>" +
                                "</div>" +
                                "</div>");
                            // var div = document.createElement('DIV');
                            // div.innerHTML = 'Hello';

                            infoBubble.open(map, marker);
                        });
                    })(marker, result[i]);


                    vm.dynMarkers.push(marker);
                }
                vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, {});


            })
            .error(function (data, status, header, config) {
                console.log("query failed!");
            });



    });
});
