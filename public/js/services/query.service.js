/*
Name:  
	Query Service
	
Description:
	Provides a service for the Query functionality of the Inventory Management application.
	The service requests actions from server APIs to query for information from the mongoDB.
	
Author:
	Tim "KetsuN" Butler
*/


angular.module('QueryService', []).factory('queryServiceFactory', ['$http', function($http) {
    return {
        // call to get all inventory parts
        get : function() {
            return $http.get('/api/inventory');
        }
    }       
}]);