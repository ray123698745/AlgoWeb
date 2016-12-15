'use strict';

var app = angular.module('AlgoWeb', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'angularUtils.directives.dirPagination', 'angularjs-dropdown-multiselect']);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider',function ($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob|mailto):/);

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/home", // change back to root when home page are done
            templateUrl: "/app/home/home.ejs"
        })
        .state('query', {
            url: "/",
            templateUrl: "/app/query/query.ejs",
            controller: 'queryCtrl'
        })
        .state('resultList', {
            url: "/resultList",
            templateUrl: "/app/resultList/resultList.ejs",
            controller: 'resultListCtrl'
        })
        .state('result', {
            url: "/result/:camera",
            templateUrl: "/app/result/result.ejs",
            controller: 'resultCtrl'
        })
        .state('filter', {
            url: "/filter",
            templateUrl: "/app/filter/filter.ejs",
            controller: 'filterCtrl'
        })
        // .state('annotation', {
        //     url: "/annotation",
        //     templateUrl: "/app/annotation/annotation.ejs",
        //     controller: 'annotationCtrl'
        // })
        .state('annotationTrack', {
            url: "/annotationTrack",
            templateUrl: "/app/annotation/annotationTrack.ejs",
            controller: 'annotationTrackCtrl'
        })
        .state('annotationManage', {
            url: "/annotationManage",
            templateUrl: "/app/annotation/annotationManage.ejs",
            controller: 'annotationManageCtrl'
        })
        .state('review', {
        url: "/review",
        templateUrl: "/app/review/review.ejs",
        controller: 'reviewCtrl'
        })
        .state('archive', {
            url: "/archive",
            templateUrl: "/app/archive/archive.ejs",
            controller: 'archiveCtrl'
        });


    $locationProvider.html5Mode(true);

}]);


app.service('dataService', function () {

    this.data = {
        queryObj: {},
        queryResult: {},
        selectedSeq:{},
        site: "us",    // us or it
        fileServerAddr: "http://10.1.2.209:8080",
        resultListPageNum: 1,
        filterPageNum: 1,
        annotationPageNum: 1
    };

    this.keywords = {
        "Weather": ["Sunny", "Rain", "Cloudy", "Snow", "Hail"],
        "Light_Condition": ["Bright", "Indoor", "Shadow", "Night_with_street_light",  "Night_without_street_light", "Dusk", "Dawn", "Back_lit", "Tunnel"],
        "Road_Type": ["Urban", "Suburban", "Rural", "Highway", "Parking_lot"],
        "Lane_Mark_Type": ["Full_lane_marking", "Center_lane_only", "No_lane_Marking", "Special_lane_Marking"],
        "Special_Condition": ["Accident", "Pot_hole"],
        "Vehicle": ["No_vehicle", "Few_vehicle", "More_vehicle", "Special_vehicle"],
        "Pedestrian": ["No_Pedestrian", "Few_Pedestrian", "More_Pedestrian", "Special_Pedestrian"],
        "Free_Space": ["Construction", "Intersection", "Round_about"]
    }



});

app.service('utilService', ['dataService', function (dataService) {

    this.getRootPathBySite = function (siteArray) {

        for (var i=0; i < siteArray.length; i++) {
            if (siteArray[i].site === dataService.data.site) {
                return siteArray[i].root_path;
            }
        }
    };

    this.getPrefix = function (capTime) {

        var prefix = capTime;
        prefix = prefix.substring(2);
        prefix = prefix.replace(/-/g, "");
        prefix = prefix.replace(/:/g, "-");
        prefix = prefix.slice(0, 6) + "-" + prefix.slice(6);

        // console.log("Prefix: " + prefix);
        return prefix;
    };

    // var self = this;
    //
    // this.someFuncion = function () {
    //     return self.data;
    // }
}]);


app.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
});


// app.factory('dataFactory', function () {
//
//         var shareData = {};
//
//         shareData.set = function(data) {
//             shareData = data;
//         };
//
//         shareData.get = function(){
//             return shareData;
//         };
//
//         return shareData;
// });

