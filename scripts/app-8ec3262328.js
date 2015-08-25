!function(){"use strict";angular.module("hawkularMetricsUi",["ui.router","ui.bootstrap","hawkular.charts"])}(),function(){"use strict";function t(){function t(t){var a=this;a.relativeDate=t(a.creationDate).fromNow()}var a={restrict:"E",templateUrl:"app/components/navbar/navbar.html",scope:{creationDate:"="},controller:t,controllerAs:"vm",bindToController:!0};return t.$inject=["moment"],a}angular.module("hawkularMetricsUi").directive("acmeNavbar",t)}(),function(){"use strict";function t(t,a){function e(e,r,n){return a.get(e+"/metrics/?type=gauge&tags="+n,{headers:{"Hawkular-Tenant":r}}).then(function(t){return console.log(t.data),t.data},function(a){t.error("XHR Failed for getGaugeData.\n"+angular.toJson(a.data,!0))})}function r(e){function r(t){return t.data}function n(a){t.error("XHR Failed for getContributors.\n"+angular.toJson(a.data,!0))}return e||(e=30),a.get(apiHost+"/contributors?per_page="+e).then(r)["catch"](n)}var n={getGauges:e,getContributors:r};return n}angular.module("hawkularMetricsUi").factory("hawkularMetrics",t),t.$inject=["$log","$http"]}(),function(){"use strict";function t(t,a,e){function r(){n.loadGauges()}var n=this;n.addChartId="",n.chartDefaults={type:"hawkularmetric",timeRange:28800,refreshInterval:30},n.charts=[],n.metrics=[],n.chartTypes=["hawkularmetric","hawkularline","rhqbar"],n.timeRanges=[{value:600,label:"10 minutes"},{value:3600,label:"1 hour"},{value:7200,label:"2 hours"},{value:28800,label:"8 hours"},{value:86400,label:"1 day"},{value:604800,label:"7 days"}];try{if(n.userInputs=JSON.parse(localStorage.getItem("hawkular-metrics-inputs")),null===n.userInputs)throw"null";console.log("loaded "+JSON.stringify(n.userInputs))}catch(s){n.userInputs={metricsUrl:"http://localhost:8080/hawkular/metrics",tenantId:"MyTenant3",tagQuery:"app:MyRubyApp"}}n.metricInputs={},n.createChart=function(){var t=angular.extend({id:n.createChartId},n.chartDefaults);n.metrics.push(angular.copy(t)),n.charts.push(t),n.createChartId=""},n.addChart=function(t){t&&n.charts.push(angular.copy(t))},n.removeChart=function(t){n.charts.splice(t,1)},n.loadGauges=function(){n.metricInputs=angular.copy(n.userInputs),void 0!==localStorage&&localStorage.setItem("hawkular-metrics-inputs",JSON.stringify(n.metricInputs)),e.getGauges(n.metricInputs.metricsUrl,n.metricInputs.tenantId,n.metricInputs.tagQuery).then(function(t){n.metrics=a("orderBy")(t,"id"),angular.forEach(n.metrics,function(t){angular.extend(t,n.chartDefaults)}),n.metrics.length>0&&(n.newChart=n.metrics[0])})},r()}angular.module("hawkularMetricsUi").controller("MainController",t),t.$inject=["$timeout","$filter","hawkularMetrics"]}(),function(){"use strict";function t(t){t.debug("runBlock end")}angular.module("hawkularMetricsUi").run(t),t.$inject=["$log"]}(),function(){"use strict";function t(t,a){t.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"main"}),a.otherwise("/")}angular.module("hawkularMetricsUi").config(t),t.$inject=["$stateProvider","$urlRouterProvider"]}(),function(){"use strict";angular.module("hawkularMetricsUi").constant("malarkey",malarkey).constant("toastr",toastr).constant("moment",moment)}(),function(){"use strict";function t(t,a){t.debugEnabled(!0),a.options.timeOut=3e3,a.options.positionClass="toast-top-right",a.options.preventDuplicates=!0,a.options.progressBar=!0}angular.module("hawkularMetricsUi").config(t),t.$inject=["$logProvider","toastr"]}(),angular.module("hawkularMetricsUi").run(["$templateCache",function(t){t.put("app/main/main.html",'<div class="container"><div><acme-navbar creationdate="main.creationDate"></acme-navbar></div><div class="row"><div class="col-xs-6"><div class="form-group"><label for="metricsUrl">Hawkular Metrics API URL</label> <input type="text" class="form-control" id="main.userInputs.metricsUrl" placeholder="http://localhost:8080/hawkular/metrics" ng-model="main.userInputs.metricsUrl"></div></div><div class="col-xs-3"><div class="form-group"><label for="tenantId">Tenant ID</label> <input type="text" class="form-control" id="tenantId" placeholder="Tenant ID" ng-model="main.userInputs.tenantId"></div></div><div class="col-xs-3"><div class="form-group"><label for="tagQuery">Search by Tags</label><div class="input-group"><input type="text" class="form-control" id="tagQuery" placeholder="myTag:myValue" ng-model="main.userInputs.tagQuery"> <span class="input-group-btn"><button class="btn btn-success" ng-click="main.loadGauges()" type="button">Search</button></span></div></div></div></div><div class="row hawkular-metrics-chart" ng-repeat="chart in main.charts track by $index"><div class="col-xs-3"><div class="form-group"><label>Metric</label> <input class="form-control" ng-model="chart.id" ng-model-options="{debounce: 300}"></div><div class="form-group"><label>Chart Type</label><select class="form-control" ng-model="chart.type" ng-options="c for c in main.chartTypes"></select></div><div class="form-group"><label>Time Range</label><select class="form-control" ng-model="chart.timeRange" ng-options="c.value as c.label for c in main.timeRanges"></select></div><div class="form-group"><label>Refresh Interval(s)</label> <input type="number" class="form-control" ng-model="chart.refreshInterval" min="1"></div></div><div class="col-xs-9" style="height: 260px;"><button class="btn btn-default btn-sm btn-remove-chart" ng-click="main.removeChart($index)" title="Remove this chart">&times;</button><hawkular-chart chart-type="{{chart.type}}" chart-title="{{chart.id}}" metric-tenant-id="{{main.metricInputs.tenantId}}" metric-id="{{chart.id}}" metric-url="{{main.metricInputs.metricsUrl}}" time-range-in-seconds="{{chart.timeRange}}" refresh-interval-in-seconds="{{chart.refreshInterval}}" chart-height="250"></hawkular-chart></div></div><div class="row"><div class="col-xs-3"><div class="form-group"><label>Select Chart</label><div class="input-group"><select class="form-control" ng-model="main.newChart" ng-options="c.id for c in main.metrics"></select><span class="input-group-btn"><button class="btn btn-success" ng-click="main.addChart(main.newChart)" type="button">Add</button></span></div></div></div><div class="col-xs-3"><div class="form-group"><label>Add Chart</label><div class="input-group"><input class="form-control" ng-model="main.createChartId" placeholder="Type Metric ID"> <span class="input-group-btn"><button class="btn btn-success" ng-click="main.createChart()" type="button">Add</button></span></div></div></div></div></div>'),t.put("app/components/navbar/navbar.html",'<nav class="navbar navbar-static-top navbar-inverse"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="https://github.com/Swiip/generator-gulp-angular"><span class="glyphicon glyphicon-home"></span> Hawkular Metrics Demo</a></div></div></nav>')}]);