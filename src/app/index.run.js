(function() {
  'use strict';

  angular
    .module('hawkularMetricsUi')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
