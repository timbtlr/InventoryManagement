angular.module('AddService', []).factory('Add', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/add');
        },

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        create : function(nerdData) {
            return $http.post('/api/add', nerdData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/add/' + id);
        }
    }       
}]);