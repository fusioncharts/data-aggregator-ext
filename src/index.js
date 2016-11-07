'use strict';
const Aggregator = require('./fcts-ext-aggregator');

;(function (env, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = env.document
       ? factory(env) : function (win) {
         if (!win.document) {
           throw new Error('Window with document not present');
         }
         return factory(win, true);
       };
  } else {
    env.Aggregator = factory(env, true);
  }
})(typeof window !== 'undefined' ? window : this, function (_window, windowExists) {
  var FC = _window.FusionCharts;

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
