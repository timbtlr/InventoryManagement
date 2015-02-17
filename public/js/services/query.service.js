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
        // call to get all nerds
        get : function() {
            return $http.get('/api/inventory');
        }

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
		/*
        create : function(itemData) {
            return $http.post('/api/inventory', itemData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/inventory/' + id);
        }
		*/
    }       
}]);