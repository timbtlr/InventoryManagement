angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/query', {
            templateUrl: 'views/query.html',
            controller: 'QueryController'
        })
		.otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
}]);