myApp.controller("main", function($scope) {
    $scope.params = []; $scope.toDraw = []; $scope.parameter="";
    $scope.params = testData;
    $scope.addParam = function(pName) {
        var parameter = {
            name: pName,
            drawn: false,
            dependent: false,
            confounder: false,
            mediator: false,
            x:0,
            y:0,
            links: []
        };
        $scope.params.push(parameter);
        $scope.parameter = "";
    };

    $scope.toDraw = testData;
    $scope.draw = function(p) {
        p.drawn = true;
        $scope.toDraw.push(p);
    };
});

var testData = [
    {
        name: "Education",
        drawn: false,
        dependent: false,
        confounder: false,
        mediator: false,
        x:0,
        y:0,
        links: []
    },
    {
        name: "Poverty",
        drawn: false,
        dependent: false,
        confounder: false,
        mediator: false,
        x:0,
        y:0,
        links: []
    },
    {
        name: "Dementia",
        drawn: false,
        dependent: false,
        confounder: false,
        mediator: false,
        x:0,
        y:0,
        links: []
    },
    {
        name: "Income",
        drawn: false,
        dependent: false,
        confounder: false,
        mediator: false,
        x:0,
        y:0,
        links: []
    },
];