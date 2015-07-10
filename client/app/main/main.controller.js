'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http,Modal) {
    $scope.awesomeThings = [];


$scope.sendQuery = function(queryString){
$scope.loading = true;
    $http.get('/api/things/query/'+$scope.queryString).success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      $scope.loading = false;
    });

}

    
    $scope.viewArticle = Modal.confirm.delete(function(text){

      
    });
    
    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
