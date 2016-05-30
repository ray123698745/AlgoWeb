'use strict';

angular.module('AlgoWeb')
    .controller('resultCtrl', function ($scope, $http, $location, dataFactory) {
        
        $scope.result = dataFactory.get();
        
    });