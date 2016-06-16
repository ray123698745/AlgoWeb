'use strict';

app.controller('resultCtrl', ['$scope', '$http', '$state', 'dataService', 'utilService', function ($scope, $http, $state, dataService, utilService) {

    // pass only the selected queryResult object
    $scope.result = dataService.data.selectedSeq;

    $scope.showFilePath = function (siteArray) {
        return utilService.getRootPathBySite(siteArray);
    }
        
}]);