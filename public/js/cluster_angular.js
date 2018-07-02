var cluster = angular.module('cluster', ["checklist-model"]);

function mainController($scope, $http) {
  $scope.clusterData=[];
  $scope.centroids = [];
  $scope.nbaAttributes = [
    'rimFga',
    'rimFgp',
    'closeFga',
    'closeFgp',
    'midrangeFga',
    'midrangeFgp',
    'threeFga',
    'threeFgp',
    'ast',
    'tov',
    'usg',
    'drive',
    'catchShoot'
  ]
  $scope.selectedList = [];
  $scope.submit = function submit() {
    $http.post("/clusterize", {
      param1: $scope.selectedList[0],
      param2: $scope.selectedList[1],
      param3: $scope.selectedList[2]
    }).then(function (response) {
      $scope.centroids = response.data.centroids;
      $scope.clusters = response.data.clusters;
    });
  }
  $scope.max3 = function(key) {
    return ($scope.selectedList.includes(key) || $scope.selectedList.length<3);
    return true;
  }
}