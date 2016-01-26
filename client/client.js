var app = angular.module('bankApp', []);

app.controller('mainController', ['$scope', '$http', function($scope, $http) {
    console.log('angular hooked up');

}]);

app.controller('successController', ['$scope', '$http', function($scope, $http) {
    $scope.formShowing = false;

    $http.get('/getUser').then(function(response) {
        $scope.user = response.data;
        console.log(response);
    });

    $scope.showForm = function() {
        $scope.formShowing = true;
    };
}]);

