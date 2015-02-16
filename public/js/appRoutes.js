angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
		
        .when('/query', {
            templateUrl: 'views/query.html',
            controller: 'QueryController'
        });

    $locationProvider.html5Mode(true);
}]);