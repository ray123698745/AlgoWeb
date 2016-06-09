'use strict';

app.controller('queryCtrl', ['$scope', '$http', '$location', 'dataFactory', function ($scope, $http, $location, dataFactory) {

        $scope.sendPost = function() {

            
            // Setup query here
            
            var query = {
                location: $scope.location,
                keywords: {$all: ["Urban", "Sunny", "Tunnel"]}
                // annotated: $scope.annotated,
                // from: $scope.from,
                // to: $scope.to
            };


            $http.post("/api/sequence/query", JSON.stringify(query)).success(function(data) {
                $scope.result = data;
                dataFactory.set(data);
                $location.path("/result");

            }).error(function (data, status, header, config) {
                $scope.result = "failed!";

            });
        }
    }]);