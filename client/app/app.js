'use strict';

var app = angular.module('AlgoWeb', ['ui.router', 'ngAnimate', 'ui.bootstrap']);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "/app/home/home.ejs"
        })
        .state('query', {
            url: "/query",
            templateUrl: "/app/query/query.ejs",
            controller: 'queryCtrl'
        })
        .state('resultList', {
            url: "/resultList",
            templateUrl: "/app/resultList/resultList.ejs",
            controller: 'resultListCtrl'
        })
        .state('result', {
            url: "/result",
            templateUrl: "/app/result/result.ejs",
            controller: 'resultCtrl'
        });

    $locationProvider.html5Mode(true);

}]);


app.service('dataService', function () {

    this.data = {
        queryObj: {},
        queryResult: {},
        selectedSeq:{},
        site: "U.S.",    // U.S. or Parma
    };

    this.keywords = {
        "Weather": ["Sunny", "Rain", "Cloudy", "Snow", "Hail"],
        "Special_Condition": ["Construction", "Accident", "Pot_hole"],
        "Light_Condition": ["Bright", "Indoor", "Shadow", "Night_with_street_light",  "Night_without_street_light", "Dusk", "Dawn", "Backlight", "Tunnel"],
        "Road_Type": ["Urban", "Suburban", "Rural", "Highway", "Parking_lot"],
        "Lane_Mark_Type": ["Full_lane_marking", "Center_lane_only", "No_lane_Marking", "Special_lane_Marking"]
    }



});

app.service('utilService', ['dataService', function (dataService) {

    this.getRootPathBySite = function (siteArray) {

        for (var i=0; i < siteArray.length; i++) {
            if (siteArray[i].site === dataService.data.site) {
                return siteArray[i].root_path;
            }
        }
    }

    // var self = this;
    //
    // this.someFuncion = function () {
    //     return self.data;
    // }
}]);




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

