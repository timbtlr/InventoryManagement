angular.module('AddService', []).factory('addServiceFactory', ['$http', function($http) {
    return {
		// call to get all inventory parts
        get : function () {
            return $http.get('/api/inventory');
        },
		
        // call to post an inventory item
        post : function (newPart) {
            return $http.post('/api/inventory', newPart);
        }
    }       
}]);