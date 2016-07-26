/**
 * Created by cjfang on 7/19/16.
 */

app.controller('NavigationController', function($scope, dataService) {
    // $scope.callMe = function() {
    //     alert("test");
    // };

    $scope.Annotation = [{
        name: "Request",
        link: 'filter'
    }, {
        name: "divider",
        link: "#"
    }, {
        name: "Review",
        link: "review"
    }, {
        name: "divider",
        link: "#"
    }, {
        name: "Tasks",
        link: "annotation"
    }];

    $scope.Documentation = [{
        name: "Annotation ToolBox 2",
        link: dataService.data.fileServerAddr + '/vol1/documentation/atb_v2_user_guide_17.pdf'
    }, {
        name: "Annotation Task",
        link: "#",
        subtree: [{
            name: "Road",
            link: dataService.data.fileServerAddr + '/vol1/documentation/road_annotation_guide_V1.1.pdf'
        },{
            name: "Pedestrian",
            link: dataService.data.fileServerAddr + '/vol1/documentation/Pedestrian_Tracking_Rules_v2.1.1.pdf'
        }]
    }, {
        name: "divider",
        link: "#"
    }, {
        name: "Gold Framework",
        link: dataService.data.fileServerAddr + '/vol1/documentation/gold/html/index.html'
    }];

});

app.directive('tree', function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            tree: '='
        },
        templateUrl: '/app/navbar/template-ul.html'
    };
});

app.directive('leaf', function($compile) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            leaf: '='
        },
        templateUrl: '/app/navbar/template-li.html',
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.leaf.subtree)) {
                element.append('<tree tree=\"leaf.subtree\"></tree>');
                var parent = element.parent();
                var classFound = false;
                while(parent.length > 0 && !classFound) {
                    if(parent.hasClass('navbar-right')) {
                        classFound = true;
                    }
                    parent = parent.parent();
                }

                if(classFound) {
                    element.addClass('dropdown-submenu-right');
                } else {
                    element.addClass('dropdown-submenu');
                }

                $compile(element.contents())(scope);
            }
        }
    };
});
