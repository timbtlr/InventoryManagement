/*
Name:
	appRoutes
	
Description:
	Defines the views that will be displayed based on the navigation of the Inventory Management application.  
	Different HTML files are loaded into the angular dynamic content section of index.html based on navigation.  
	Along with the view file, the controller controlling each view is defined.  The controllers determine the dynamic
	data that is displayed on each view whenever the view is loaded.
	
	The following views are possible at this time:
		- Home: The main descriptive view of the application.  Describes purpose.
		- Query: Allows the user to query for inventory items.
		- Add: Allows the user to input new items into the inventory list.
		
	Any incorrect view navigation is redirected to the Home view.

Author:
	Tim "KetsuN" Butler
*/

angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    	//  Home view
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        
        //  Query view
        .when('/query', {
            templateUrl: 'views/query.html',
            controller: 'QueryController'
        })
        
        //  Add view
        .when('/add', {
            templateUrl: 'views/add.html',
            controller: 'AddController'
        })
        
        //  Redirect incorrect navigation to the default (Home) view
		.otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
}]);
