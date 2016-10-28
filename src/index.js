'use strict';
const Aggregator = require('./fcts-ext-aggregator');

;(function (factory) {
  factory(FusionCharts);
})(function (FC) {
  FC.register('extension', ['data-aggregator', function (id) {
    var global = this;
    var extAPI = global.extAPI;
    console.log(id);

    // var otherAPI = FusionCharts.getExtComponent(id, 'api', 'legacyextapi');
    // var toolBoxApi = FusionCharts.getComponent('api', 'toolbox');

    window.Aggregator = new Aggregator();

    extAPI(window.Aggregator);
  }]);
});
