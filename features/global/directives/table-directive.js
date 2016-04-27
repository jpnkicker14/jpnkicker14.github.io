kentonchunApp.directive('kcTable', function () {
  return {
    restrict: 'A',
    replace: true,
    template: "<table class='table table-striped table-responsive'><tr><th ng-repeat='header in headers'>{{header}}</tr><tr ng-repeat='row in rows'><td ng-repeat='column in row track by $index'>{{column}}</td></tr></table>",
    scope:{
      data: "="
    },
    controller: function($scope){
      function renderChart(){
        $scope.headers = _.keys(_.first($scope.data));
        $scope.rows =[];
        _.each($scope.data, function(row){
          var rowData = [];
          _.each($scope.headers, function(key){
            var dataColumn = row[key];
            if(_.isNull(dataColumn)){
              rowData.push('n/a');
            }else{
              rowData.push(dataColumn);
            }
          });
          $scope.rows.push(rowData);
        });

      }
      $scope.$watch('data', function(newValue, oldValue){
        renderChart();
      });
    }
  };
});