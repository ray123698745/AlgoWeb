'use strict';

angular.module('AlgoWeb', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

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
            .state('result', {
                url: "/result",
                templateUrl: "/app/result/result.ejs",
                controller: 'resultCtrl'
            });

        $locationProvider.html5Mode(true);

    }).factory('dataFactory', function () {

        var shareData = {};

        shareData.set = function(data) {
            shareData = data;
        };

        shareData.get = function(){
            return shareData;
        };

        return shareData;

    });

