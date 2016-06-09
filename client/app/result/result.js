'use strict';

app.controller('resultCtrl', ['$scope', '$http', '$location', 'dataFactory', function ($scope, $http, $location, dataFactory) {

    $scope.result = dataFactory.get();
        
}]);