'use strict';

var app = angular.module('AlgoWeb', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/home", // change back to root when home page are done
            templateUrl: "/app/home/home.ejs"
        })
        .state('query', {
            url: "/query",
            templateUrl: "/app/query/query.ejs",
            controller: 'queryCtrl'
        })
        .state('resultList', {
            url: "/",
            templateUrl: "/app/resultList/resultList.ejs",
            controller: 'resultListCtrl'
        })
        .state('result', {
            url: "/result/:camera",
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
        site: "us",    // us or it
        fileServerAddr: "http://10.1.3.32:8080"
    };

    this.keywords = {
        "Weather": ["Sunny", "Rain", "Cloudy", "Snow", "Hail"],
        "Light_Condition": ["Bright", "Indoor", "Shadow", "Night_with_street_light",  "Night_without_street_light", "Dusk", "Dawn", "Backlight", "Tunnel"],
        "Road_Type": ["Urban", "Suburban", "Rural", "Highway", "Parking_lot"],
        "Lane_Mark_Type": ["Full_lane_marking", "Center_lane_only", "No_lane_Marking", "Special_lane_Marking"],
        "Special_Condition": ["Construction", "Accident", "Pot_hole"]
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

    this.getPrefix = function (capTime) {

        var prefix = capTime;
        prefix = prefix.substring(2);
        prefix = prefix.replace(/-/g, "");
        prefix = prefix.replace(/:/g, "-");
        prefix = prefix.slice(0, 6) + "-" + prefix.slice(6);

        // console.log("Prefix: " + prefix);
        return prefix;
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

