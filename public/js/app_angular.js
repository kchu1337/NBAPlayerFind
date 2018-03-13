var playerSearch = angular.module('playerSearch', []);

function mainController($scope, $http) {

    //replace with percentiles later
    $scope.rim = {options:[
        {label: "Very Low", value: 30},
        {label: "Low", value: 40},
        {label: "Medium", value: 50},
        {label: "High", value: 60},
        {label: "Very High", value: 70}
    ]}
    $scope.rimSelected = {label: "Very Low", value: 30};


    $scope.close = {options:[
            {label: "Very Low", value: 20},
            {label: "Low", value: 30},
            {label: "Medium", value: 40},
            {label: "High", value: 50},
            {label: "Very High", value: 60}
        ]}
    $scope.closeSelected = {label: "Very Low", value: 20};

    $scope.midrange = {options:[
            {label: "Very Low", value: 20},
            {label: "Low", value: 28},
            {label: "Medium", value: 36},
            {label: "High", value: 44},
            {label: "Very High", value: 52}
        ]}
    $scope.midrangeSelected = {label: "Very Low", value: 20};

    $scope.three = {options:[
            {label: "Very Low", value: 20},
            {label: "Low", value: 26},
            {label: "Medium", value: 32},
            {label: "High", value: 38},
            {label: "Very High", value: 44}
        ]}
    $scope.threeSelected = {label: "Very Low", value: 20};






        $scope.submit = function () {
            //Get all parameters from DOM
            var rimFga = document.getElementById("rimFga").value;
            var rimFgp = $scope.rimSelected.value;
            var closeFga = document.getElementById("closeFga").value;
            var closeFgp = $scope.closeSelected.value;
            var midrangeFga = document.getElementById("midrangeFga").value;
            var midrangeFgp = $scope.midrangeSelected.value;
            var threeFga = document.getElementById("threeFga").value;
            var threeFgp = document.getElementById("threeFgp").value;
            var ast = document.getElementById("ast").value;
            var tov = document.getElementById("tov").value;
            var usg = document.getElementById("usg").value;

            //Find percentages if sum != 100
            var fgaTotal = Number(rimFga)+Number(closeFga)+Number(midrangeFga)+Number(threeFga);
            rimFga = rimFga/fgaTotal*100;
            closeFga = closeFga/fgaTotal*100;
            midrangeFga = midrangeFga/fgaTotal*100;
            threeFga = threeFga/fgaTotal*100;

            //Create url
            var query = "http://localhost:8080/sample?"
            query+="rimFga="+rimFga;
            query+="&rimFgp="+rimFgp;
            query+="&closeFga="+closeFga;
            query+="&closeFgp="+closeFgp;
            query+="&midrangeFga="+midrangeFga;
            query+="&midrangeFgp="+midrangeFgp;
            query+="&threeFga="+threeFga;
            query+="&threeFgp="+threeFgp;
            query+="&ast="+ast;
            query+="&tov="+tov;
            query+="&usg="+usg;
            console.log(query);

            //Get JSON
            $.ajax({url: query, crossDomain: true, dataType: 'json', type: 'GET'})
                .done(function (json) {
                    $scope.players = json;
                    $scope.$apply();
                })
                .fail(function () {
                    alert("Error");
                });
        }

};