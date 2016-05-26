
angular.module('AlgoWeb')
    .controller('queryCtrl', function ($scope, $http) {

        $scope.sendPost = function() {

            var query = {
                location: $scope.location,
                weather: $scope.weather,
                theme: $scope.theme,
                object: $scope.object
                // annotated: $scope.annotated,
                // from: $scope.from,
                // to: $scope.to
            };


            $http.post("/api/sequence", JSON.stringify(query)).success(function(data) {
                $scope.result = data;
                $scope.path = data[0].sequencePath;

            }).error(function (data, status, header, config) {
                $scope.result = "failed!";

            });
        }
    })