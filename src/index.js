'use strict';
const AggregatorGetter = require('./fcts-ext-aggregator');

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

  FC.register('extension', ['private', 'data-aggregator', function () {
    FC.registerComponent('extensions', 'data-aggregator', AggregatorGetter({FC: FC}));
  }]);
});
