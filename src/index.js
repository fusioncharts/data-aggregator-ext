'use strict';
const Aggregator = require('./fcts-ext-aggregator');
const FusionCharts = require('../lib/fusioncharts');

FusionCharts.register('extension', ['data-aggregator', function (id) {
  var global = this;
  var extAPI = global.extAPI;
  console.log(id);

  // var otherAPI = FusionCharts.getExtComponent(id, 'api', 'legacyextapi');
  // var toolBoxApi = FusionCharts.getComponent('api', 'toolbox');

  extAPI(new Aggregator());
}]);
