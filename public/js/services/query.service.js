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
        },
		
		remove : function(partNumberOld) {
			return $http.delete('/api/inventory/:partNumber', {params: {partNumber: partNumberOld}})
        },
		
		edit : function(newPart) {
            return $http.put('/api/inventory/:partNumber', newPart);
			//return $http.put('/api/inventory/:partNumber', {params: {partNumber: partNumberOld}})
        }
    }       
}]);