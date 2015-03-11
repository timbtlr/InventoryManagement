/*
Name:  
	Generic Database Service
	
Description:
	The service requests HTTP actions from server APIs to query for information from the mongoDB.
	
Author:
	Tim "KetsuN" Butler
*/
angular.module('DatabaseService', []).factory('databaseServiceFactory', ['$http', function($http) {
    return {
        get : function() {
            return $http.get('/api/inventory');
        },
		
        getOne : function(partNumber) {
            return $http.get('/api/inventory/' + partNumber);
        },
		
        getByArray : function(idArray) {
            return $http.get('/api/inventory/fromArray/' + idArray);
        },
		
        addNewPart : function(part) {
            return $http.put('/api/inventory/subtract/:part', part);
        },
		
        subtractFromPart : function(part) {
            return $http.put('/api/inventory/subtract/:part', part);
        },
		
        addToPart : function(idArray) {
            return $http.get('/api/inventory/fromArray/' + idArray);
        },
		
		remove : function(partNumber) {
			return $http.delete('/api/inventory/' + partNumber)
        },
		
		edit : function(newPart) {
            return $http.put('/api/inventory/:partNumber', newPart);
        }
    }       
}]);


