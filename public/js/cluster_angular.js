var cluster = angular.module('cluster', []);

function mainController($scope, $http) {
    $scope.submit = function submit() {
        console.log("submit")
        $http.post("/clusterize", {param1: "rimFga", param2: "threeFga"}).then(function (response) {
            alert(response);
        });
    }
}