angular.module('AddService', []).factory('addServiceFactory', ['$http', function($http) {
	
    return {
        // call to post an inventory item
        post : function() {
            return $http.post('/api/inventory');
        }
    }       
}]);