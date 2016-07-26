'use strict';

app.controller('queryCtrl', ['$scope', '$http', '$state', 'dataService', function ($scope, $http, $state, dataService) {

    $scope.keywordsObj = dataService.keywords;
    $scope.selectedKeywords = [];


    $scope.toggleSelection = function (keyword) {

        var index = $scope.selectedKeywords.indexOf(keyword);

        if (index > -1)
            $scope.selectedKeywords.splice(index, 1);
        else
            $scope.selectedKeywords.push(keyword);
    }

    $scope.fromDateOptions = {
        formatYear: 'yy',
        maxDate: new Date($scope.to_date)
        // minDate: new Date(),
        // startingDay: 1
    };

    $scope.openFromDate = function() {
        $scope.fromDatePopup.opened = true;
    };
    $scope.fromDatePopup = {
        opened: false
    };

    $scope.toDateOptions = {
        formatYear: 'yy'
        // maxDate: new Date(2020, 5, 22),
        // minDate: new Date(),
        // startingDay: 1
    };

    $scope.openToDate = function() {
        $scope.toDatePopup.opened = true;
    };
    $scope.toDatePopup = {
        opened: false
    };


    $scope.sendPost = function() {

        // Setup query object

        var queryObj = {
            "_id": $scope.sequence_id,
            "location.country": $scope.country,
            "location.state": $scope.state,
            "location.city": $scope.city
        };


        if ($scope.from_date != null && $scope.to_date != null)
            queryObj.capture_time = {"$gte": $scope.from_date, "$lte": $scope.to_date};

        if ($scope.from_speed != null && $scope.to_speed != null)
            queryObj.avg_speed = {"$gte": $scope.from_speed, "$lte": $scope.to_speed};


        // if ($scope.yuv == "Yes")
        //     queryObj.yuv = { $exists: true, $ne: [] };
        // if ($scope.yuv == "No")
        //     queryObj.yuv = { $exists: false }; // should unset the array after remove the last element


        // console.log($scope.selectedKeywords);

        if ($scope.selectedKeywords.length > 0)
            queryObj.keywords = {"$all": $scope.selectedKeywords};

        dataService.data.queryObj = queryObj;

        // console.log(dataService.data.queryObj);

        $state.go('resultList');

    }


    $scope.saveQuery = function() {

    }

    $scope.loadQuery = function() {

    }


    }]);
