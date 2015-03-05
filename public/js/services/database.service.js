/*
Name:  
	Query Service
	
Description:
	Provides a service for the Query functionality of the Inventory Management application.
	The service requests actions from server APIs to query for information from the mongoDB.
	
Author:
	Tim "KetsuN" Butler
*/
angular.module('DatabaseService', []).factory('databaseServiceFactory', ['$http', function($http) {
    return {
        // call to get all inventory parts
        get : function() {
            return $http.get('/api/inventory');
        },
		
		// call to get all inventory parts
        getOne : function(partNumber) {
            return $http.get('/api/inventory/:partNumber', {params: {partNumber: partNumber}});
        },
		
		remove : function(partNumberOld) {
			return $http.delete('/api/inventory/:partNumber', {params: {partNumber: partNumberOld}})
        },
		
		edit : function(newPart) {
            return $http.put('/api/inventory/:partNumber', newPart);
        },
		
		// call to post an inventory item
        post : function (newPart) {
            return $http.post('/api/inventory', newPart);
        }
    }       
}]);


