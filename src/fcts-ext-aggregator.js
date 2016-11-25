'use strict';

module.exports = function (dep) {
  /**
   * Class representing the Data Aggregator.
   */
  class Aggregator {
    /**
     * Create a Aggregator.
     * @typedef {object} Aggregator.aggregation
     * @property {string} timePeriod - The time interval of aggregation.
     * @property {number} timePeriodMultiplier - The multiplier of time interval.
     * @property {string} aggregationMethod - The method applied to aggregate.
     */
    constructor () {
      /**
       * @private
       */
      this.appliedAggregation = {
        timePeriod: null,
        timePeriodMultiplier: null,
        aggregationMethod: null
      };
      this.config = {};
    }

    /**
     * An object representing the timePeriod, timePeriodMultiplier, aggregationMethod.
     * @type {Aggregator.aggregation}
     */
    get aggregation () {
      return this.appliedAggregation;
    }

    set aggregation (obj) {
      this.appliedAggregation.timePeriod = obj.timePeriod;
      this.appliedAggregation.timePeriodMultiplier = obj.timePeriodMultiplier;
      this.appliedAggregation.aggregationMethod = obj.aggregationMethod;
    }

    /**
     * Sets available aggregation options in configuration of extension
     * @private
     */
    getAvailablelAggreagation () {
      var config = this.config,
        dataAgg = config.dataAgg,
        avlTimePeriods = config.avlTimePeriods = dataAgg.getAggregationTimeRules(),
        i,
        len;

      config.avlTimeMultiplier = [];
      len = avlTimePeriods.length;

      for (i = 0; i < len; i++) {
        config.avlTimeMultiplier.push(avlTimePeriods[i].possibleFactors);
      }
    }

    /**
     * Calculates valid aggregation time periods and corresponding multipliers
     * @private
     */
    getValidAggregation () {
      var self = this,
        config = self.config,
        tsObject = self.tsObject,
        dataAgg = config.dataAgg,
        i,
        j,
        len1,
        len2,
        avlTimePeriods,
        avlTimeMultiplier,
        // minNumOfPlot = 5,
        maxNumOfPlot = config.composition.reactiveModel.model['max-plot-point'],
        multipliersArr,
        currentTimeLength,
        timePeriod,
        time,
        expectedTime,
        multiplier,
        minBinSize;
        // maxBinSize;

      config.currentTimeLength = tsObject.globalReactiveModel.model['x-axis-visible-range-end'] -
        tsObject.globalReactiveModel.model['x-axis-visible-range-start'];

      avlTimePeriods = config.avlTimePeriods;
      avlTimeMultiplier = config.avlTimeMultiplier;
      currentTimeLength = config.currentTimeLength;

      config.minBinSize = minBinSize = currentTimeLength / maxNumOfPlot;
      // config.maxBinSize = maxBinSize = currentTimeLength / minNumOfPlot;

      config.validTimePeriod = [];
      config.validTimePeriodMultiplier = [];
      config.avlAggMethods = dataAgg.getAllAggregationMethod();

      for (i = 0, len1 = avlTimePeriods.length; i < len1; i++) {
        timePeriod = avlTimePeriods[i].name;
        time = avlTimePeriods[i].interval;
        multipliersArr = [];

        for (j = 0, len2 = avlTimeMultiplier[i].length; j < len2; j++) {
          multiplier = avlTimeMultiplier[i][j];
          expectedTime = multiplier * time;

          // if ((expectedTime >= minBinSize) && (expectedTime <= maxBinSize)) {
          if ((expectedTime >= minBinSize)) {
            multipliersArr.push(avlTimeMultiplier[i][j]);
          }
        }
        if (multipliersArr.length > 0) {
          config.validTimePeriodMultiplier.push(multipliersArr);
          config.validTimePeriod.push(timePeriod);
        }
      }
      // console.log('Time Period: ', config.validTimePeriod);
      // console.log('Number Of Multipliers: ', config.validTimePeriodMultiplier);
      // console.log('Methods: ', config.avlAggMethods);
    }

    getCurrentAggreation () {
      var self = this,
        config = self.config,
        dataAgg = config.dataAgg,
        composition = config.composition,
        model = composition.reactiveModel,
        currentAggMethod,
        suitableInterval,
        binSize;

      binSize = model.prop('bin-size') - 1;

      if (isFinite(binSize)) {
        config.canAggregate = true;
        suitableInterval = dataAgg.timeRules.getSuitableInterval(binSize);
        currentAggMethod = model.prop('aggregation-fn');
      } else {
        config.canAggregate = false;
        suitableInterval = {
          name: '',
          step: ''
        };
        config.validTimePeriod = [suitableInterval.name];
        config.validTimePeriodMultiplier = [[suitableInterval.step]];
        config.avlAggMethods = {
          'invalid': {
            formalName: '',
            nickName: ''
          }
        };
        currentAggMethod = config.avlAggMethods['invalid'];
      }

      return {
        timePeriod: suitableInterval.name,
        timePeriodMultiplier: suitableInterval.step,
        aggregationMethod: {
          value: currentAggMethod.nickName,
          text: currentAggMethod.formalName
        }
      };
    }

    /**
     * Set Aggregation on time series
     * @param  {object} obj
     * @property {string} timePeriod - The time interval of aggregation.
     * @property {number} timePeriodMultiplier - The multiplier of time interval.
     * @property {string} aggregationMethod - The method applied to aggregate.
     */
    setAggregation (obj) {
      var avlAggMethods,
        validTimePeriod,
        timePeriodIndex,
        validTimePeriodMultiplier,
        config = this.config;

      avlAggMethods = config.avlAggMethods;
      validTimePeriod = config.validTimePeriod;
      validTimePeriodMultiplier = config.validTimePeriodMultiplier;

      // if (avlAggMethods.includes(obj.aggregationMethod) && validTimePeriod.includes(obj.timePeriod)) {
      //   timePeriodIndex = validTimePeriod.indexOf(obj.timePeriod);
      //   if (validTimePeriodMultiplier[timePeriodIndex].includes(Number(obj.timePeriodMultiplier))) {
      //     this.aggregation = obj;
      //     console.log(this.aggregation);
      //     return true;
      //   } else {
      //     console.log(this.aggregation);
      //     return false;
      //   }
      // } else {
      //   console.log(this.aggregation);
      //   return false;
      // }
    }

    /**
     * Reset Applied Aggregation
     */
    resetAggregation () {

    }

    init (require) {
      var self = this,
        config = self.config,
        toolboxComponent = config.toolboxComponent = {},
        api,
        store,
        composition,
        saveTo = 'tsObject',
        requiredParams = [
          'graphics',
          'globalReactiveModel',
          'chart',
          'spaceManagerInstance',
          'chartInstance',
          'smartLabel',
          function acquire () {
            let i = 0,
              ii = requiredParams.length - 1,
              param = '';
            self[saveTo] = self[saveTo] || {};
            self.requiredParams = {};
            for (i = 0; i < ii; ++i) {
              param = requiredParams[i];
              self[saveTo][param] = arguments[i];
            }
            // onInit(self[saveTo]);
          }
        ];
      require(requiredParams);

      api = self.tsObject.chartInstance.apiInstance;
      store = api.getComponentStore();
      config.composition = composition = store.getCanvasByIndex(0).composition;
      config.dataAgg = composition.impl.getDataAggregator();

      toolboxComponent.toolbox = dep.FC.getComponent('api', 'toolbox');
      toolboxComponent.config = {};

      self.toolbars = [];

      self.measurement = {};

      self.toolbars.push(self.createToolbar());

      window.Aggregator = self;
      return self;
    }

    createToolbar () {
      var self = this,
        group,
        toolbar,
        timeMulSelectMenu,
        timePeriodSelectMenu,
        aggMethodSelectMenu,
        resetButton,
        applyButton,
        config = self.config,
        tsObject = self.tsObject,
        label,

        toolboxComponent = config.toolboxComponent,
        toolbox = toolboxComponent.toolbox,
        toolboxCompConfig = toolboxComponent.config,
        HorizontalToolbar = toolbox.HorizontalToolbar,
        ComponentGroup = toolbox.ComponentGroup,
        SymbolStore = toolbox.SymbolStore,

        graphics = tsObject.graphics,
        paper = graphics.paper,
        container = graphics.container,
        chart = tsObject.chart,
        smartLabel = tsObject.smartLabel,

        multiplierVal,
        timeMulSelectMenuOpt = '',

        dependencies = {
          paper: paper,
          chart: chart,
          smartLabel: smartLabel,
          chartContainer: container
        },
        apply = (set) => {
          var model = config.composition.reactiveModel,
            timePeriodVal = timePeriodSelectMenu.value(),
            timePeriodMultiplierVal = timeMulSelectMenu.value(),
            aggMethodSelectMenuVal = aggMethodSelectMenu.value(),
            keys,
            timeInterval,
            canvas = config.composition.impl;

          for (keys of config.avlTimePeriods) {
            if (keys.name === timePeriodVal) {
              timeInterval = keys.interval;
              break;
            }
          }

          if (set && isFinite(model.prop('bin-size'))) {
            model
              .lock()
              .prop('bin-size-ext', (timeInterval * Number(timePeriodMultiplierVal)))
              .prop('aggregation-fn-ext', config.avlAggMethods[aggMethodSelectMenuVal])
              .unlock();
          } else {
            canvas.resetAggregation();
          }
          // applyButton.updateVisual('disabled');
          // applyButton.updateVisual('enabled');
        },

        timePeriodOnChange = () => {
          var timePeriodVal = timePeriodSelectMenu.value(),
            timePeriodMultiplierVal = timeMulSelectMenu.value(),
            prevTimePeroidMulVal = timePeriodMultiplierVal,
            validTimePeriod = config.validTimePeriod,
            validTimePeriodMultiplier = config.validTimePeriodMultiplier,
            indexOfTimeUnit,
            indexOfTimeMul;

          indexOfTimeUnit = validTimePeriod.indexOf(timePeriodVal);
          indexOfTimeMul = validTimePeriodMultiplier[indexOfTimeUnit].indexOf(Number(timePeriodMultiplierVal));

          // console.log(indexOfTimeUnit, indexOfTimeMul);
          timeMulSelectMenuOpt = '';
          for (multiplierVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
            timeMulSelectMenuOpt += '<option value="' + multiplierVal + '">' + multiplierVal + '</option>';
          }

          timeMulSelectMenu.updateList(timeMulSelectMenuOpt);

          if (indexOfTimeMul < 0) {
            timeMulSelectMenu.value(validTimePeriodMultiplier[indexOfTimeUnit][0].toString());
          } else {
            timeMulSelectMenu.value(prevTimePeroidMulVal);
          }
        };

      group = new ComponentGroup(dependencies);
      toolbar = new HorizontalToolbar(dependencies);

      group.setConfig({
        fill: '#fff',
        borderThickness: 0
      });

      toolbar.setConfig({
        fill: '#fff',
        borderThickness: 0
      });

      label = new toolbox.Label('Aggregate Data:', dependencies, {
        text: {
          style: {
            'font-size': '14',
            'fill': '#696969'
          }
        }
      });

      toolboxCompConfig.timePeriodSelectMenu = timePeriodSelectMenu = new toolbox.SelectSymbol({
        width: 90,
        height: 22
      }, dependencies, {
        innerHTML: '<option value="time">Time Period</option>'
      }, {
        strokeWidth: 1,
        stroke: 'rgba(102,102,102,0.5)',
        symbolStrokeWidth: 0,
        btnTextStyle: {
          fontSize: 11
        },
        hoverFill: '#1e1f1f'
      });

      toolboxCompConfig.timeMulSelectMenu = timeMulSelectMenu = new toolbox.SelectSymbol({
        width: 50,
        height: 22
      }, dependencies, {
        innerHTML: '<option value="number">Multiplier</option>'
      }, {
        strokeWidth: 1,
        stroke: 'rgba(102,102,102,0.5)',
        symbolStrokeWidth: 0,
        btnTextStyle: {
          fontSize: 11
        },
        hoverFill: '#1e1f1f'
      });

      toolboxCompConfig.aggMethodSelectMenu = aggMethodSelectMenu = new toolbox.SelectSymbol({
        width: 90,
        height: 22
      }, dependencies, {
        innerHTML: '<option value="Formula">Method</option>'
      }, {
        strokeWidth: 1,
        stroke: 'rgba(102,102,102,0.5)',
        symbolStrokeWidth: 0,
        btnTextStyle: {
          fontSize: 11
        },
        hoverFill: '#1e1f1f'
      });

      toolboxCompConfig.applyButton = applyButton = new toolbox.Symbol('APPLY', true, dependencies, {
        fill: '#555',
        labelFill: '#fff',
        hoverFill: '#555',
        width: 30,
        height: 20,
        btnTextStyle: {
          fontSize: 11
        }
      }).attachEventHandlers({
        click: function () {
          apply(1);
        }
      });
      toolboxCompConfig.resetButton = resetButton = new toolbox.Symbol('RESET', true, dependencies, {
        fill: '#898b8b',
        labelFill: '#fff',
        hoverFill: '#898b8b',
        width: 30,
        height: 20,
        btnTextStyle: {
          fontSize: 11
        }
      }).attachEventHandlers({
        click: function () {
          apply(0);
        }
      });

      group.addSymbol(label);
      group.addSymbol(timeMulSelectMenu);
      group.addSymbol(timePeriodSelectMenu);
      group.addSymbol(aggMethodSelectMenu);
      group.addSymbol(applyButton);
      group.addSymbol(resetButton);

      SymbolStore.register('textBoxIcon', function (x, y, rad, w, h, padX, padY) {
        var x1 = x - w / 2 + padX / 2,
          x2 = x + w / 2 - padX / 2,
          y1 = y - h / 2 + padY / 2,
          y2 = y + h / 2 - padY / 2;

        return ['M', x1, y1, 'L', x2, y1, 'L', x2, y2, 'L', x1, y2, 'Z'];
      });

      timeMulSelectMenu.attachEventHandlers({
        click: {
          fn: timeMulSelectMenu.edit
        },
        textOnBlur: function () {
          timeMulSelectMenu.blur();
        }
      });
      timePeriodSelectMenu.attachEventHandlers({
        click: {
          fn: timePeriodSelectMenu.edit
        },
        textOnBlur: function () {
          timePeriodSelectMenu.blur();
        },
        textOnChange: function () {
          timePeriodSelectMenu.blur();
          timePeriodOnChange();
        }
      });
      aggMethodSelectMenu.attachEventHandlers({
        click: {
          fn: aggMethodSelectMenu.edit
        },
        textOnBlur: function () {
          aggMethodSelectMenu.blur();
        }
      });

      toolbar.addComponent(group);

      return toolbar;
    }

    getLogicalSpace (availableWidth, availableHeight) {
      var logicalSpace,
        width = 0,
        height = 0,
        i,
        ln;

      for (i = 0, ln = this.toolbars.length; i < ln; i++) {
        logicalSpace = this.toolbars[i].getLogicalSpace();
        width = Math.max(logicalSpace.width, width);
        height += logicalSpace.height;
        this.toolbars[i].width = logicalSpace.width;
        this.toolbars[i].height = logicalSpace.height;
      }
      height += this.padding;
      return {
        width: width > availableWidth ? 0 : width,
        height: height > availableHeight ? 0 : height
      };
    }

    placeInCanvas (containerInstance) {
      var self = this,
        tsObject = self.tsObject;

      self.padding = 5;
      tsObject.spaceManagerInstance.add([{
        name: function () {
          return 'DataAggregator';
        },
        ref: function (obj) {
          return obj['0'];
        },
        self: function () {
          return self;
        },
        priority: function () {
          return 2;
        },
        layout: function (obj) {
          return obj.inline;
        },
        orientation: [{
          type: function (obj) {
            return obj.horizontal;
          },
          position: [{
            type: function (obj) {
              return obj.top;
            },
            alignment: [{
              type: function (obj) {
                return obj.left;
              },
              dimensions: [function () {
                var parent = this.getParentComponentGroup();
                return self.getLogicalSpace(parent.getWidth(), parent.getHeight());
              }]
            }]
          }]
        }]
      }]);
    }

    setDrawingConfiguration (x, y, width, height, group) {
      var mes = this.measurement;
      mes.x = x;
      mes.y = y;
      mes.width = width;
      mes.height = height;

      this.parentGroup = group;

      return this;
    }

    draw (x, y, width, height, group) {
      var self = this,
        config = self.config,
        toolboxCompConfig = config.toolboxComponent.config,
        timePeriodSelectMenu = toolboxCompConfig.timePeriodSelectMenu,
        timeMulSelectMenu = toolboxCompConfig.timeMulSelectMenu,
        aggMethodSelectMenu = toolboxCompConfig.aggMethodSelectMenu,
        applyButton = toolboxCompConfig.applyButton,
        resetButton = toolboxCompConfig.resetButton,
        currentAggregationObj,
        measurement = self.measurement,
        toolbars = self.toolbars,
        ln,
        i,
        toolbar,
        model = config.composition.reactiveModel,

        timePeriodVal,
        timePeriodSelectMenuOpt,
        validTimePeriod,
        indexOfTimeUnit,

        multiplierVal,
        timeMulSelectMenuOpt,
        validTimePeriodMultiplier,

        aggVal,
        aggMethodSelectMenuOpt,
        avlAggMethods,
        rangeOnChange = () => {
          self.getValidAggregation();
          currentAggregationObj = self.getCurrentAggreation();

          timePeriodSelectMenuOpt = '';
          timeMulSelectMenuOpt = '';
          aggMethodSelectMenuOpt = '';

          validTimePeriod = config.validTimePeriod;
          validTimePeriodMultiplier = config.validTimePeriodMultiplier;
          avlAggMethods = config.avlAggMethods;

          if (!config.canAggregate) {
            timePeriodSelectMenu.updateVisual('disabled');
            timeMulSelectMenu.updateVisual('disabled');
            aggMethodSelectMenu.updateVisual('disabled');
            applyButton.updateVisual('disabled');
            resetButton.updateVisual('disabled');
          } else {
            timePeriodSelectMenu.updateVisual('enabled');
            timeMulSelectMenu.updateVisual('enabled');
            aggMethodSelectMenu.updateVisual('enabled');
            applyButton.updateVisual('enabled');
            resetButton.updateVisual('enabled');
          }

          for (timePeriodVal of validTimePeriod) {
            timePeriodSelectMenuOpt += '<option value="' + timePeriodVal + '">' +
            timePeriodVal + '</option>';
          }

          timePeriodSelectMenu.updateList(timePeriodSelectMenuOpt);
          timePeriodSelectMenu.value(currentAggregationObj.timePeriod);

          indexOfTimeUnit = validTimePeriod.indexOf(currentAggregationObj.timePeriod);

          if (indexOfTimeUnit >= 0) {
            for (multiplierVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
              timeMulSelectMenuOpt += '<option value="' + multiplierVal + '">' +
              multiplierVal + '</option>';
            }
          }

          timeMulSelectMenu.updateList(timeMulSelectMenuOpt);
          timeMulSelectMenu.value(currentAggregationObj.timePeriodMultiplier.toString());

          for (aggVal in avlAggMethods) {
            aggMethodSelectMenuOpt += '<option value="' +
              avlAggMethods[aggVal].nickName + '">' + avlAggMethods[aggVal].formalName + '</option>';
          }

          aggMethodSelectMenu.updateList(aggMethodSelectMenuOpt);
          aggMethodSelectMenu.value(currentAggregationObj.aggregationMethod.value);
        };

      self.getAvailablelAggreagation();

      x = x === undefined ? measurement.x : x;
      y = y === undefined ? measurement.y : y;
      width = width === undefined ? measurement.width : width;
      height = height === undefined ? measurement.height : height;
      group = group === undefined ? self.parentGroup : group;
      if (width && height) {
        for (i = 0, ln = toolbars.length; i < ln; i++) {
          toolbar = toolbars[i];
          toolbar.draw(x, y);
        }
      }
      rangeOnChange();

      model.onPropsChange(['bin-size', 'aggregation-fn'], rangeOnChange);
    }

    dispose () {
      // dispose extension
    }
  }
  return Aggregator;
};
