angular.module('AddService', []).factory('addServiceFactory', ['$http', function($http) {
    return {
		// call to post an inventory item
        addNewPart : function (newPart) {
            return $http.post('/api/add/addNewPart/', newPart);
        }
    }       
}]);