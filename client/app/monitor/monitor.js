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

app.controller('mapController', function($scope, $http, $interval, NgMap) {

    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKazcMqdk5t0mJcyv7lroFEKtLthpFaLg";

    var vm = this;
    vm.dynMarkers = [];
    NgMap.getMap().then(function(map) {

        $http.get("/api/sequence/getAllGPS")
            .success(function (databaseResult) {

                for (var i = 0; i < databaseResult.gps.length; i++) {
                    var latLng = new google.maps.LatLng(databaseResult.gps[i].gps.x, databaseResult.gps[i].gps.y);
                    vm.dynMarkers.push(new google.maps.Marker({position:latLng}));
                }
                vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, {});


            })
            .error(function (data, status, header, config) {
                $scope.result = "failed!";
            });



    });
});
