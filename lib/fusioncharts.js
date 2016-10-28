'use strict';
var FusionCharts = function () {};

FusionCharts.register = function (ext, arr) {
  var extName = arr[0];
  var fn = arr[1];
  console.log('Currently active extension: ' + extName);
  fn.bind(this, 565)();
};

FusionCharts.getComponent = function (componentType, componentName) {
  var toolBox = {
    x: 24,
    y: 56,
    width: 100,
    height: 20,
    index: 4
  };

  if (componentType === 'api' && componentName === 'toolbox') {
    return toolBox;
  }

  return null;
};

FusionCharts.extAPI = function (obj) {
  obj.init(function () {
    var argsToApply = [];
    var cb = arguments[arguments.length - 1];

    var getAvailableAggregationMethod = function () {
      return ['sum', 'average', 'custom'];
    };

    var getAvailableTimePeriod = function () {
      return [{
        'x': '100'
      },
      {
        'y': '200'
      },
      {
        'z': '1000'
      }];
    };

    var getCurrentVisibleRange = function () {
      return {
        startDate: 0,
        endDate: 1000,
      };
    };

    for (var i = 0; i < arguments.length - 1; i++) {
      if (arguments[i] === 'X-Axis') {
        argsToApply.push({
          getCurrentVisibleRange: getCurrentVisibleRange,
          min: 0,
          max: 2000
        });
      } else if (arguments[i] === 'chart') {
        argsToApply.push({
          getAvailableAggregationMethod: getAvailableAggregationMethod,
          getAvailableTimePeriod: getAvailableTimePeriod,
          config: {
            minNumOfPlot: 5,
            minPlotWidth: 3,
            canvasWidth: 1000
          }
        });
      }
    }
    cb.apply(this, argsToApply);
  });

  obj.placeInCanvas();

  obj.draw();

  obj.dispose();
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = FusionCharts;
} else {
  window.FusionCharts = FusionCharts;
}
