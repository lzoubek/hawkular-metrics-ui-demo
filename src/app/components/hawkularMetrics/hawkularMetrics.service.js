(function() {
  'use strict';

  angular
    .module('hawkularMetricsUi')
    .factory('hawkularMetrics', githubContributor);

  /** @ngInject */
  function githubContributor($log, $http) {

    var service = {
      getGauges: getGauges,
      getContributors: getContributors
    };

    return service;

    function getGauges(url, tenantId, tags) {
      return $http.get(url+'/metrics/?type=gauge&tags='+tags, {headers:{'Hawkular-Tenant':tenantId}})
        .then(function(response) {
          console.log(response.data);
          return response.data;
        }, function(error) {
          $log.error('XHR Failed for getGaugeData.\n' + angular.toJson(error.data, true));
        });
    }

    function getContributors(limit) {
      if (!limit) {
        limit = 30;
      }

      return $http.get(apiHost + '/contributors?per_page=' + limit)
        .then(getContributorsComplete)
        .catch(getContributorsFailed);

      function getContributorsComplete(response) {
        return response.data;
      }

      function getContributorsFailed(error) {
        $log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
      }
    }
  }
})();
