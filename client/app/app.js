
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
            });

        $locationProvider.html5Mode(true);

    })

