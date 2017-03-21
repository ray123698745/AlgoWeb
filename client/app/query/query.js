'use strict';

app.controller('queryCtrl', ['$scope', '$http', '$state', 'dataService', function ($scope, $http, $state, dataService) {

    $scope.keywordsObj = dataService.keywords;
    $scope.selectedKeywords = [];
    $scope.objects = [{
        class: null,
        occurrence: null
    }];
    $scope.version = 5;
    $scope.annotation = 'Yes';

    $scope.toggleSelection = function (keyword) {

        var index = $scope.selectedKeywords.indexOf(keyword);

        if (index > -1)
            $scope.selectedKeywords.splice(index, 1);
        else
            $scope.selectedKeywords.push(keyword);
    };

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
            "title": $scope.sequence_title,
            "location.country": $scope.country,
            "location.state": $scope.state,
            "location.city": $scope.city,
            "version": {$gte: $scope.version},
            "batchNum.country": $scope.batchCountry,
            "batchNum.num": $scope.batchNum
        };


        if ($scope.from_date != null && $scope.to_date != null)
            queryObj.capture_time = {"$gte": $scope.from_date, "$lte": $scope.to_date};

        if ($scope.from_speed != null && $scope.to_speed != null)
            queryObj.avg_speed = {"$gte": $scope.from_speed, "$lte": $scope.to_speed};


        if ($scope.annotation == "Yes")
            queryObj.no_annotation = false;
        if ($scope.annotation == "No")
            queryObj.no_annotation = true;



        if ($scope.selectedKeywords.length > 0)
            queryObj.keywords = {"$all": $scope.selectedKeywords};

        // if ($scope.version)
        //     queryObj.version = $scope.version;

        if ($scope.task) {

            var or_key = '$or';

            queryObj[or_key] = [
                {'cameras.0.annotation': {
                    $elemMatch: {
                        category: $scope.task,
                        state: 'Accepted'
                    }
                }},
                {'cameras.0.annotation': {
                    $elemMatch: {
                        category: $scope.task,
                        state: 'Finished'
                    }
                }},
                {'cameras.0.annotation': {
                    $elemMatch: {
                        category: $scope.task,
                        state: 'Finished_Basic'
                    }
                }}
            ];

        }
        if ($scope.density){
            var density_key = 'cameras.0.annotation.density';
            queryObj[density_key] = {"$gte": $scope.density};
        }

        if ($scope.ids){
            var ids_key = 'cameras.0.annotation.unique_id';
            queryObj[ids_key] = {"$gte": $scope.ids};
        }

        if ($scope.objects[0].class){
            var and_key = '$and';
            queryObj[and_key] = [];

            for (var i = 0; i < $scope.objects.length; i++){
                if($scope.objects[i].class){

                    var classesKey = 'cameras.0.annotation.classes';
                    var classesObj = {};

                    if(!$scope.objects[i].occurrence)
                        $scope.objects[i].occurrence = 1;

                    classesObj[classesKey] = {
                        $elemMatch: {
                            class: $scope.objects[i].class,
                            occurrence: {"$gte": $scope.objects[i].occurrence}
                        }
                    };

                    queryObj[and_key].push(classesObj);

                }
            }

            // console.log(queryObj);
        }




        dataService.data.queryObj = queryObj;

        // console.log(dataService.data.queryObj);

        $state.go('resultList');

    };

    $scope.addObject = function () {

        $scope.objects.push({
            class: null,
            occurrence: null
        });
    };

    $scope.deleteObject = function () {

        $scope.objects.pop();
    };

    $scope.saveQuery = function() {

    };

    $scope.loadQuery = function() {

    }


    }]);
