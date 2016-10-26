const Aggregator = require('./fcts-ext-aggregator');
const FusionCharts = require('../lib/fusioncharts');

var fc = new FusionCharts();

fc.register('extension', ['data-aggregator', function (id) {
  var global = this;
  var extAPI = global.extAPI;
  console.log(id);

  // var otherAPI = fc.getExtComponent(id, 'api', 'legacyextapi');
  // var toolBoxApi = fc.getComponent('api', 'toolbox');

  extAPI(new Aggregator());
}]);
