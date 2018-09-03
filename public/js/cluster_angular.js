var cluster = angular.module('cluster', ["checklist-model"]);

function mainController($scope, $http) {
    $scope.clusterData=[];
    $scope.centroids = [];
    $http.get("/getdefinitions")
        .then(function (response) {
            let definitions = response.data;
            $scope.nbaAttributes = [
                {id:'rimFga', value: 'rimFga' + ': ' + definitions.rimFga},
                {id:'rimFgp', value:'rimFgp' + ': ' + definitions.rimFgp },
                {id:'closeFga', value:'closeFga' + ': ' + definitions.closeFga },
                {id:'closeFgp', value:'closeFgp' + ': ' + definitions.closeFgp },
                {id:'midrangeFga', value:'midrangeFga' + ': ' + definitions.midrangeFga },
                {id:'midrangeFgp', value:'midrangeFgp' + ': ' + definitions.midrangeFgp },
                {id:'threeFga', value:'threeFga' + ': ' + definitions.threeFga },
                {id:'threeFgp', value:'threeFgp' + ': ' + definitions.threeFgp },
                {id:'ast', value:'ast' + ': ' + definitions.ast },
                {id:'tov', value:'tov' + ': ' + definitions.tov },
                {id:'usg', value:'usg' + ': ' + definitions.usg },
                {id:'driveFga', value:'driveFga' + ': ' + definitions.driveFga },
                {id:'catchShootFga', value:'catchShootFga' + ': ' + definitions.catchShootFga },
                {id:'pullupFga', value:'pullupFga' + ': ' + definitions.pullupFga }
            ]
            
        });
    $scope.selectedList = [];
    $scope.submit = function submit() {
        $http.post("/cluster", {
            param1: $scope.selectedList[0],
            param2: $scope.selectedList[1],
            param3: $scope.selectedList[2]
        }).then(function (response) {
            $scope.centroids = response.data.centroids;
            $scope.clusters = response.data.clusters;
        });
    };
    $scope.max3 = function(key) {
        return ($scope.selectedList.includes(key) || $scope.selectedList.length<3);
        return true;
    }
}