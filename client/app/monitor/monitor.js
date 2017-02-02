/**
 * Created by cjfang on 1/30/17.
 */
'use strict';

app.controller('monitorCtrl', ['$scope', '$http', '$state', 'dataService', function ($scope, $http, $state, dataService) {

    var keywordsObj = dataService.keywords;
    $scope.keywordsWithCount = {};

    $scope.open = true;
    $scope.toggleCollapse = function () {

        $scope.open = !$scope.open;

        console.log($scope.open);
    };

    $http.get("/api/sequence/allSeqCount")
        .success(function (databaseResult) {

            $scope.max = databaseResult.count;


        })
        .error(function (data, status, header, config) {
            $scope.result = "failed!";
        });


    for (var key in keywordsObj) {

        if (!keywordsObj.hasOwnProperty(key)) continue;

        $scope.keywordsWithCount[key] = [];


        for (var i = 0; i < keywordsObj[key].length; i++){

            var param = {
                keyword: keywordsObj[key][i],
                key: key
            };

            $http.post("/api/sequence/keywordCount/", JSON.stringify(param))
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






}]);
