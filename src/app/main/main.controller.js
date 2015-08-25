(function() {
  'use strict';

  angular
    .module('hawkularMetricsUi')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $filter, hawkularMetrics) {
    var vm = this;

    vm.addChartId = '';

    vm.chartDefaults = {type:'hawkularmetric',timeRange:28800, refreshInterval:30};
    vm.charts = [];
    vm.metrics = [];
    vm.chartTypes = ['hawkularmetric','hawkularline','rhqbar']
    vm.timeRanges = [
      {value: 600, label: '10 minutes'},
      {value: 3600, label: '1 hour'},
      {value: 7200, label: '2 hours'},
      {value: 28800, label: '8 hours'},
      {value: 3600 *24, label: '1 day'},
      {value: 3600 * 24 * 7, label: '7 days'},
    ]

    try {
      vm.userInputs = JSON.parse(localStorage.getItem('hawkular-metrics-inputs'))
      if (vm.userInputs === null) {
        throw "null";
      }
      console.log('loaded '+JSON.stringify(vm.userInputs));
    } catch (e) {

      vm.userInputs = {
        metricsUrl: 'http://localhost:8080/hawkular/metrics',
        tenantId: 'MyTenant3',
        tagQuery: 'app:MyRubyApp'
      };
    }

    vm.metricInputs = {};

    vm.createChart = function() {
      var chart = angular.extend({id:vm.createChartId}, vm.chartDefaults);
      vm.metrics.push(angular.copy(chart))
      vm.charts.push(chart);
      vm.createChartId = '';
    }

    vm.addChart = function(metric) {
      if (metric) {
        vm.charts.push(angular.copy(metric));
      }
    }
    vm.removeChart = function(index) {
      vm.charts.splice(index, 1);
    }

    vm.loadGauges = function() {
      vm.metricInputs = angular.copy(vm.userInputs);
      if (localStorage !== undefined) {
        // use LocalStorage to remember userInputs
        localStorage.setItem('hawkular-metrics-inputs', JSON.stringify(vm.metricInputs))
      }
      hawkularMetrics.getGauges(vm.metricInputs.metricsUrl, vm.metricInputs.tenantId,vm.metricInputs.tagQuery)
        .then(function(data) {
          vm.metrics = $filter('orderBy')(data, 'id');

          // set charting defaults
          angular.forEach(vm.metrics, function(m) {
            angular.extend(m, vm.chartDefaults)
          })
          // set first item to "Add" combo selection
          if (vm.metrics.length > 0) {
            vm.newChart = vm.metrics[0];
          }
        })
    }



    activate();

    function activate() {
      vm.loadGauges();
    }

  }
})();
