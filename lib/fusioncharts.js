'use strict';
var FusionCharts = function () {
  var i, l = extList.length, self = this;
  if (self.test) {

    self.requireFn = function () {
      var callBack = arguments[arguments.length - 1],
      callBackArgument = [];

      for (var i = 0; i < arguments.length - 1; i++) {
        if (arguments[i] === 'X-Axis') {
          callBackArgument.push({
            getCurrentVisibleRange: function () {
              return {
                startDate: 0,
                endDate: 1000,
              };
            },
            min: 0,
            max: 2000
          });
        } else if (arguments[i] === 'chart') {
          callBackArgument.push(self);
        }
        else {
          callBackArgument.push(self[arguments[i]]);
        }
      }
      callBack.apply(self, callBackArgument);
    }
    self.extensions = [];
    for (i = 0; i < l; i += 1) {
      var tempExt = new extList[i]();
      tempExt.init(self.requireFn);
      self.extensions.push(tempExt);
    }
  }
};

FusionCharts.prototype = {
  test: true,
  getAvailableTimePeriod: function () {
    return [{
      'x': '100'
    },
    {
      'y': '200'
    },
    {
      'z': '1000'
    }];
  },
  getAvailableAggregationMethod: function () {
    return ['sum', 'average', 'custom'];
  },
  config: {
    minNumOfPlot: 5,
    minPlotWidth: 10,
    canvasWidth: 1000
  }
};

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
var extList = [];

FusionCharts.extAPI = function (obj) {
  var tempConstractor = function () {};
  tempConstractor.prototype = obj;

  extList.push(tempConstractor);
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = FusionCharts;
} else {
  window.FusionCharts = FusionCharts;
}
