/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	const AggregatorGetter = __webpack_require__(2);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (dep) {
	  /**
	   * Class representing the Data Aggregator.
	   */
	  class Aggregator {
	    /**
	     * Create a Aggregator.
	     * @typedef {object} Aggregator.aggregation
	     * @property {string} binSize - The binSize applied to aggregate.
	     * @property {string} aggregationMethod - The method applied to aggregate.
	     */
	    constructor () {
	      /**
	       * @private
	       */
	      this.appliedAggregation = {
	        binSize: null,
	        aggregationMethod: null
	      };
	      this.config = {};
	    }
	
	    /**
	     * An object representing the binSize, aggregationMethod.
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
	        maxNumOfPlot = config.composition.reactiveModel.model['max-plot-point'],
	        multipliersArr,
	        currentTimeLength,
	        timePeriod,
	        time,
	        binSize,
	        multiplier,
	        minBinSize;
	
	      config.currentTimeLength = tsObject.globalReactiveModel.model['x-axis-visible-range-end'] -
	        tsObject.globalReactiveModel.model['x-axis-visible-range-start'];
	
	      avlTimePeriods = config.avlTimePeriods;
	      avlTimeMultiplier = config.avlTimeMultiplier;
	      currentTimeLength = config.currentTimeLength;
	
	      config.minBinSize = minBinSize = currentTimeLength / maxNumOfPlot;
	
	      config.validTimePeriod = [];
	      config.validTimePeriodMultiplier = [];
	      config.avlAggMethods = dataAgg.getAllAggregationMethod();
	
	      for (i = 0, len1 = avlTimePeriods.length; i < len1; i++) {
	        timePeriod = avlTimePeriods[i].name;
	        time = avlTimePeriods[i].interval;
	        multipliersArr = [];
	
	        for (j = 0, len2 = avlTimeMultiplier[i].length; j < len2; j++) {
	          multiplier = avlTimeMultiplier[i][j];
	          binSize = multiplier * time;
	
	          if ((binSize >= minBinSize)) {
	            multipliersArr.push(avlTimeMultiplier[i][j]);
	          }
	        }
	        if (multipliersArr.length > 0) {
	          config.validTimePeriodMultiplier.push(multipliersArr);
	          config.validTimePeriod.push(timePeriod);
	        }
	      }
	    }
	
	    /**
	     * Returns current Aggregation applied to timeseries
	     * @private
	     */
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
	
	    /**
	     * Create toolbar components
	     * @private
	     */
	    createToolbar () {
	      var self = this,
	        group1,
	        group2,
	        group3,
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
	        timeMulSelectMenuOpt,
	        timePeriodMenuDisableConfig,
	        timeMultiplierMenuDisableConfig,
	        aggMethodMenuDisableonfig,
	        dropDownMenuStyle,
	        applyButtonDisableConfig,
	        resetButtonDisableConfig,
	
	        style,
	
	        dependencies = {
	          paper: paper,
	          chart: chart,
	          smartLabel: smartLabel,
	          chartContainer: container
	        },
	        /**
	         * Apply or Reset Aggregation applied through extension in timeseries
	         * @param {number} set - Flag to set or reset. '1' to set, '0' to reset
	         * @private
	         */
	        apply = (set) => {
	          var model = config.composition.reactiveModel,
	            timePeriodVal = timePeriodSelectMenu.value(),
	            timePeriodMultiplierVal = timeMulSelectMenu.value(),
	            aggMethodSelectMenuVal = aggMethodSelectMenu.value(),
	            keys,
	            binSize,
	            timeInterval,
	            aggregation = self.aggregation,
	            canvas = config.composition.impl;
	
	          for (keys of config.avlTimePeriods) {
	            if (keys.name === timePeriodVal) {
	              timeInterval = keys.interval;
	              break;
	            }
	          }
	          binSize = timeInterval * Number(timePeriodMultiplierVal);
	          if (set && isFinite(model.prop('bin-size'))) {
	            model
	              .lock()
	              .prop('bin-size-ext', binSize)
	              .prop('aggregation-fn-ext', config.avlAggMethods[aggMethodSelectMenuVal])
	              .unlock();
	            aggregation.binSize = binSize;
	            aggregation.aggregationMethod = aggMethodSelectMenuVal;
	            applyButton.updateVisual('disabled');
	            resetButton.updateVisual('enabled');
	          } else {
	            canvas.resetAggregation();
	            aggregation.binSize = null;
	            aggregation.aggregationMethod = null;
	            resetButton.updateVisual('disabled');
	          }
	        },
	
	        /**
	         * Sets valid time multiplier on time period change from extension toolbox
	         * @private
	         */
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
	
	          timeMulSelectMenuOpt = [];
	          for (multiplierVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
	            timeMulSelectMenuOpt.push({
	              name: multiplierVal.toString(),
	              value: multiplierVal.toString()
	            });
	          }
	
	          timeMulSelectMenu.updateList(timeMulSelectMenuOpt);
	
	          if (indexOfTimeMul < 0) {
	            timeMulSelectMenu.value(validTimePeriodMultiplier[indexOfTimeUnit][0].toString());
	          } else {
	            timeMulSelectMenu.value(prevTimePeroidMulVal);
	          }
	        },
	
	        /**
	         * Sets state of applyButton(active/inactive) on change in value in toolbox
	         * @private
	         */
	        onChange = (type) => {
	          var currentAgg = self.getCurrentAggreation();
	
	          if (currentAgg.timePeriodMultiplier.toString() !== timeMulSelectMenu.value() ||
	            currentAgg.timePeriod !== timePeriodSelectMenu.value() ||
	            currentAgg.aggregationMethod.value !== aggMethodSelectMenu.value()) {
	            applyButton.updateVisual('enabled');
	          } else {
	            applyButton.updateVisual('disabled');
	          }
	        };
	
	      group1 = new ComponentGroup(dependencies);
	      group2 = new ComponentGroup(dependencies);
	      group3 = new ComponentGroup(dependencies);
	
	      toolbar = new HorizontalToolbar(dependencies);
	
	      config.usrConfig = {
	        enabled: true,
	        posWrtCanvas: 'top',
	        alignment: 'left',
	        orientation: 'horizontal',
	        styles: {
	          timeMultiplierInputField: {
	            active: {
	              'fill': '#fff',
	              'labelFill': '#696969',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverStroke': '#696969',
	              'hoverStrokeWidth': 1,
	              'radius': 1,
	              'width': 45,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#fff',
	              'stroke-width': 1,
	              'stroke': 'rgb(192, 192, 192)',
	              'labelFill': '#000'
	            }
	          },
	          timePeriodInputField: {
	            active: {
	              'fill': '#fff',
	              'labelFill': '#696969',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverStroke': '#696969',
	              'hoverStrokeWidth': 1,
	              'radius': 1,
	              'width': 75,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#fff',
	              'stroke-width': 1,
	              'stroke': 'rgb(192, 192, 192)',
	              'labelFill': '#000'
	            }
	          },
	          aggregationMethodInputField: {
	            active: {
	              'fill': '#fff',
	              'labelFill': '#696969',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverStroke': '#696969',
	              'hoverStrokeWidth': 1,
	              'radius': 1,
	              'width': 100,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#fff',
	              'stroke-width': 1,
	              'stroke': 'rgb(192, 192, 192)',
	              'labelFill': '#000'
	            }
	          },
	          dropDown: {
	            active: {
	              'fill': '#898b8b',
	              'labelFill': '#fff'
	            },
	            normal: {
	              'fill': '#fff',
	              'labelFill': '#000',
	              'hoverFill': '#e6e8e8',
	              'hoverLabelFill': '#000'
	            }
	          },
	          applyButton: {
	            active: {
	              'fill': '#555',
	              'labelFill': '#f3f3f3',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverFill': '#555',
	              'hoverStrokeWidth': 1,
	              'hoverStroke': '',
	              'radius': 1,
	              'width': 30,
	              'height': 20
	            },
	            inactive: {
	              'fill': '#bebebe',
	              'stroke-width': 1,
	              'stroke': 'rgb(192, 192, 192)',
	              'labelFill': '#f3f3f3'
	            }
	          },
	          resetButton: {
	            active: {
	              'fill': '#898b8b',
	              'labelFill': '#f3f3f3',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverFill': '#898b8b',
	              'hoverStrokeWidth': 1,
	              'hoverStroke': '',
	              'radius': 1,
	              'width': 30,
	              'height': 20
	            },
	            inactive: {
	              'fill': '#bebebe',
	              'stroke-width': 1,
	              'stroke': 'rgb(192, 192, 192)',
	              'labelFill': '#f3f3f3'
	            }
	          },
	          base: {
	            font: {
	              'fontSize': 11
	              // 'fontWeight': 'bold',
	              // 'fontFamily': 'sans-serif',
	              // 'fontStyle': 'italic'
	            }
	          }
	        }
	      };
	
	      style = config.usrConfig.styles || {};
	
	      style = {
	        timeMultiplierInputField: {
	          active: (style.timeMultiplierInputField && style.timeMultiplierInputField.active) || {},
	          inactive: (style.timeMultiplierInputField && style.timeMultiplierInputField.inactive) || {}
	        },
	        timePeriodInputField: {
	          active: (style.timePeriodInputField && style.timePeriodInputField.active) || {},
	          inactive: (style.timePeriodInputField && style.timePeriodInputField.inactive) || {}
	        },
	        aggregationMethodInputField: {
	          active: (style.aggregationMethodInputField && style.aggregationMethodInputField.active) || {},
	          inactive: (style.aggregationMethodInputField && style.aggregationMethodInputField.inactive) || {}
	        },
	        dropDown: {
	          active: (style.dropDown && style.dropDown.active) || {},
	          normal: (style.dropDown && style.dropDown.normal) || {}
	        },
	        applyButton: {
	          active: (style.applyButton && style.applyButton.active) || {},
	          inactive: (style.applyButton && style.applyButton.inactive) || {}
	        },
	        resetButton: {
	          active: (style.resetButton && style.resetButton.active) || {},
	          inactive: (style.resetButton && style.resetButton.inactive) || {}
	        },
	        base: {
	          font: (style.base && style.base.font) || {}
	        }
	      };
	
	      group1.setConfig({
	        fill: '#fff',
	        borderThickness: 0
	      });
	      group2.setConfig({
	        fill: '#fff',
	        borderThickness: 0
	      });
	      group3.setConfig({
	        fill: '#fff',
	        borderThickness: 0
	      });
	
	      toolbar.setConfig({
	        fill: '#fff',
	        borderThickness: 0
	      });
	
	      timePeriodMenuDisableConfig = {
	        disabled: {
	          config: {
	            disabled: style.timeMultiplierInputField.inactive
	          }
	        }
	      };
	
	      timeMultiplierMenuDisableConfig = {
	        disabled: {
	          config: {
	            disabled: style.timePeriodInputField.inactive
	          }
	        }
	      };
	
	      aggMethodMenuDisableonfig = {
	        disabled: {
	          config: {
	            disabled: style.aggregationMethodInputField.inactive
	          }
	        }
	      };
	
	      applyButtonDisableConfig = {
	        disabled: {
	          config: {
	            disabled: style.applyButton.inactive
	          }
	        }
	      };
	
	      resetButtonDisableConfig = {
	        disabled: {
	          config: {
	            disabled: style.resetButton.inactive
	          }
	        }
	      };
	
	      dropDownMenuStyle = {
	        selected: {
	          container: {
	            style: {
	              fill: style.dropDown.active.fill
	            }
	          },
	          text: {
	            style: {
	              fill: style.dropDown.active.labelFill
	            }
	          }
	        },
	        normal: {
	          container: {
	            style: {
	              fill: style.dropDown.normal.fill
	            }
	          },
	          text: {
	            style: {
	              fill: style.dropDown.normal.labelFill
	            }
	          }
	        },
	        hover: {
	          container: {
	            style: {
	              fill: style.dropDown.normal.hoverFill
	            }
	          },
	          text: {
	            style: {
	              fill: style.dropDown.normal.hoverLabelFill
	            }
	          }
	        }
	      };
	
	      label = new toolbox.Label('Aggregate Data:', dependencies, {
	        text: {
	          style: {
	            'font-size': '14',
	            'fill': '#696969'
	          }
	        }
	      });
	
	      toolboxCompConfig.timePeriodSelectMenu = timePeriodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [],
	      Object.assign(style.timePeriodInputField.active, {
	        btnTextStyle: style.base.font,
	        dropDownMenu: dropDownMenuStyle
	      }));
	      timePeriodSelectMenu.setStateConfig(timePeriodMenuDisableConfig);
	
	      toolboxCompConfig.timeMulSelectMenu = timeMulSelectMenu = new toolbox.SelectSymbol({}, dependencies, [],
	      Object.assign(style.timeMultiplierInputField.active, {
	        btnTextStyle: style.base.font,
	        dropDownMenu: dropDownMenuStyle
	      }));
	      timeMulSelectMenu.setStateConfig(timeMultiplierMenuDisableConfig);
	
	      toolboxCompConfig.aggMethodSelectMenu = aggMethodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [],
	      Object.assign(style.aggregationMethodInputField.active, {
	        btnTextStyle: style.base.font,
	        dropDownMenu: dropDownMenuStyle
	      }));
	      aggMethodSelectMenu.setStateConfig(aggMethodMenuDisableonfig);
	
	      toolboxCompConfig.applyButton = applyButton = new toolbox.Symbol('APPLY', true, dependencies,
	        Object.assign(style.applyButton.active, {
	          btnTextStyle: style.base.font
	        }))
	        .attachEventHandlers({
	          click: function () {
	            apply(1);
	          }
	        });
	      applyButton.setStateConfig(applyButtonDisableConfig);
	
	      toolboxCompConfig.resetButton = resetButton = new toolbox.Symbol('RESET', true, dependencies,
	        Object.assign(style.resetButton.active, {
	          btnTextStyle: style.base.font
	        }))
	        .attachEventHandlers({
	          click: function () {
	            apply(0);
	          }
	        });
	      resetButton.setStateConfig(resetButtonDisableConfig);
	
	      group1.addSymbol(label);
	      group2.addSymbol(timeMulSelectMenu);
	      group2.addSymbol(timePeriodSelectMenu);
	      group2.addSymbol(aggMethodSelectMenu);
	      group3.addSymbol(applyButton);
	      group3.addSymbol(resetButton);
	
	      SymbolStore.register('textBoxIcon', function (x, y, rad, w, h, padX, padY) {
	        var x1 = x - w / 2 + padX / 2,
	          x2 = x + w / 2 - padX / 2,
	          y1 = y - h / 2 + padY / 2,
	          y2 = y + h / 2 - padY / 2;
	
	        return ['M', x1, y1, 'L', x2, y1, 'L', x2, y2, 'L', x1, y2, 'Z'];
	      });
	
	      timePeriodSelectMenu.attachEventHandlers({
	        textOnChange: function () {
	          timePeriodOnChange();
	          onChange();
	        }
	      });
	
	      timeMulSelectMenu.attachEventHandlers({
	        textOnChange: function () {
	          onChange();
	        }
	      });
	
	      aggMethodSelectMenu.attachEventHandlers({
	        textOnChange: function () {
	          onChange();
	        }
	      });
	
	      toolbar.addComponent(group1);
	      toolbar.addComponent(group2);
	      toolbar.addComponent(group3);
	
	      return toolbar;
	    }
	
	    getLogicalSpace (availableWidth, availableHeight) {
	      var logicalSpace,
	        width = 0,
	        height = 0,
	        i,
	        ln;
	
	      for (i = 0, ln = this.toolbars.length; i < ln; i++) {
	        logicalSpace = this.toolbars[i].getLogicalSpace(availableWidth, availableHeight);
	        width = Math.max(logicalSpace.width, width);
	        height += logicalSpace.height;
	        this.toolbars[i].width = logicalSpace.width;
	        this.toolbars[i].height = logicalSpace.height;
	      }
	      height += this.padding;
	      return {
	        width: width,
	        height: height
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
	        measurement = self.measurement,
	        toolbars = self.toolbars,
	        ln,
	        i,
	        toolbar,
	        model = config.composition.reactiveModel,
	        dataAgg = config.dataAgg,
	
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
	
	        /**
	         * Compute and populate toolboxes with valid values on change in range of visual window
	         * @private
	         */
	        rangeOnChange = () => {
	          var aggregation = self.aggregation,
	            currentAggregationObj,
	            timePeriod,
	            timePeriodMultiplier,
	            aggregationMethod;
	
	          self.getValidAggregation();
	          currentAggregationObj = self.getCurrentAggreation();
	          timePeriod = currentAggregationObj.timePeriod;
	          timePeriodMultiplier = currentAggregationObj.timePeriodMultiplier;
	          aggregationMethod = currentAggregationObj.aggregationMethod;
	
	          timePeriodSelectMenuOpt = [];
	          timeMulSelectMenuOpt = [];
	          aggMethodSelectMenuOpt = [];
	
	          validTimePeriod = config.validTimePeriod;
	          validTimePeriodMultiplier = config.validTimePeriodMultiplier;
	          avlAggMethods = config.avlAggMethods;
	
	          applyButton.updateVisual('disabled');
	
	          if (aggregation.binSize !== model.prop('bin-size') &&
	            aggregationMethod.value === config.defaultAggMethod) {
	            aggregation.binSize = null;
	            aggregation.aggregationMethod = null;
	            resetButton.updateVisual('disabled');
	          } else {
	            resetButton.updateVisual('enabled');
	          }
	
	          if (!config.canAggregate) {
	            timePeriodSelectMenu.updateVisual('disabled');
	            timeMulSelectMenu.updateVisual('disabled');
	            aggMethodSelectMenu.updateVisual('disabled');
	            resetButton.updateVisual('disabled');
	          } else {
	            timePeriodSelectMenu.updateVisual('enabled');
	            timeMulSelectMenu.updateVisual('enabled');
	            aggMethodSelectMenu.updateVisual('enabled');
	          }
	
	          for (timePeriodVal of validTimePeriod) {
	            timePeriodSelectMenuOpt.push({
	              name: timePeriodVal,
	              value: timePeriodVal
	            });
	          }
	
	          timePeriodSelectMenu.updateList(timePeriodSelectMenuOpt);
	          timePeriodSelectMenu.value(timePeriod);
	
	          indexOfTimeUnit = validTimePeriod.indexOf(timePeriod);
	
	          if (indexOfTimeUnit >= 0) {
	            for (multiplierVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
	              timeMulSelectMenuOpt.push({
	                name: multiplierVal.toString(),
	                value: multiplierVal.toString()
	              });
	            }
	          }
	
	          timeMulSelectMenu.updateList(timeMulSelectMenuOpt);
	          timeMulSelectMenu.value(timePeriodMultiplier.toString());
	
	          for (aggVal in avlAggMethods) {
	            aggMethodSelectMenuOpt.push({
	              name: avlAggMethods[aggVal].formalName,
	              value: avlAggMethods[aggVal].nickName
	            });
	          }
	
	          aggMethodSelectMenu.updateList(aggMethodSelectMenuOpt);
	          aggMethodSelectMenu.value(aggregationMethod.value);
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
	      applyButton.updateVisual('disabled');
	      resetButton.updateVisual('disabled');
	      config.defaultAggMethod = dataAgg.getDefaultAggregationMethod().nickName;
	
	      model.onPropsChange(['bin-size', 'aggregation-fn'], rangeOnChange);
	    }
	
	    dispose () {
	      // dispose extension
	    }
	  }
	  return Aggregator;
	};


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTllODg3ZTM1MDYxZDhjNDZhMGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9mY3RzLWV4dC1hZ2dyZWdhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7O0FBRUE7QUFDQSw2RUFBNEUsT0FBTztBQUNuRixJQUFHO0FBQ0gsRUFBQzs7Ozs7OztBQ3JCRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixPQUFPO0FBQ3hCLG1CQUFrQixPQUFPO0FBQ3pCLG1CQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdEQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQSx3REFBdUQsVUFBVTtBQUNqRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGtHQUFpRztBQUNqRztBQUNBLFVBQVM7QUFDVDtBQUNBLDBGQUF5RjtBQUN6RjtBQUNBLFVBQVM7QUFDVDtBQUNBLHdHQUF1RztBQUN2RztBQUNBLFVBQVM7QUFDVDtBQUNBLGtFQUFpRTtBQUNqRTtBQUNBLFVBQVM7QUFDVDtBQUNBLHdFQUF1RTtBQUN2RTtBQUNBLFVBQVM7QUFDVDtBQUNBLHdFQUF1RTtBQUN2RTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVAsa0dBQWlHO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQSw0RkFBMkY7QUFDM0Y7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOztBQUVBLGdHQUErRjtBQUMvRjtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTRDLFFBQVE7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZ0JBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxnQkFBZTtBQUNmLGNBQWE7QUFDYixZQUFXO0FBQ1gsVUFBUztBQUNULFFBQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJmY3RzLWV4dC1kYXRhYWdncmVnYXRvci1lczYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlOWU4ODdlMzUwNjFkOGM0NmEwZCIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IEFnZ3JlZ2F0b3JHZXR0ZXIgPSByZXF1aXJlKCcuL2ZjdHMtZXh0LWFnZ3JlZ2F0b3InKTtcblxuOyhmdW5jdGlvbiAoZW52LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZW52LmRvY3VtZW50XG4gICAgICAgPyBmYWN0b3J5KGVudikgOiBmdW5jdGlvbiAod2luKSB7XG4gICAgICAgICBpZiAoIXdpbi5kb2N1bWVudCkge1xuICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dpbmRvdyB3aXRoIGRvY3VtZW50IG5vdCBwcmVzZW50Jyk7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gZmFjdG9yeSh3aW4sIHRydWUpO1xuICAgICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZW52LkFnZ3JlZ2F0b3IgPSBmYWN0b3J5KGVudiwgdHJ1ZSk7XG4gIH1cbn0pKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdGhpcywgZnVuY3Rpb24gKF93aW5kb3csIHdpbmRvd0V4aXN0cykge1xuICB2YXIgRkMgPSBfd2luZG93LkZ1c2lvbkNoYXJ0cztcblxuICBGQy5yZWdpc3RlcignZXh0ZW5zaW9uJywgWydwcml2YXRlJywgJ2RhdGEtYWdncmVnYXRvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBGQy5yZWdpc3RlckNvbXBvbmVudCgnZXh0ZW5zaW9ucycsICdkYXRhLWFnZ3JlZ2F0b3InLCBBZ2dyZWdhdG9yR2V0dGVyKHtGQzogRkN9KSk7XG4gIH1dKTtcbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkZXApIHtcbiAgLyoqXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgRGF0YSBBZ2dyZWdhdG9yLlxuICAgKi9cbiAgY2xhc3MgQWdncmVnYXRvciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgQWdncmVnYXRvci5cbiAgICAgKiBAdHlwZWRlZiB7b2JqZWN0fSBBZ2dyZWdhdG9yLmFnZ3JlZ2F0aW9uXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGJpblNpemUgLSBUaGUgYmluU2l6ZSBhcHBsaWVkIHRvIGFnZ3JlZ2F0ZS5cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gYWdncmVnYXRpb25NZXRob2QgLSBUaGUgbWV0aG9kIGFwcGxpZWQgdG8gYWdncmVnYXRlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgdGhpcy5hcHBsaWVkQWdncmVnYXRpb24gPSB7XG4gICAgICAgIGJpblNpemU6IG51bGwsXG4gICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBiaW5TaXplLCBhZ2dyZWdhdGlvbk1ldGhvZC5cbiAgICAgKiBAdHlwZSB7QWdncmVnYXRvci5hZ2dyZWdhdGlvbn1cbiAgICAgKi9cbiAgICBnZXQgYWdncmVnYXRpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbGllZEFnZ3JlZ2F0aW9uO1xuICAgIH1cblxuICAgIHNldCBhZ2dyZWdhdGlvbiAob2JqKSB7XG4gICAgICB0aGlzLmFwcGxpZWRBZ2dyZWdhdGlvbi50aW1lUGVyaW9kID0gb2JqLnRpbWVQZXJpb2Q7XG4gICAgICB0aGlzLmFwcGxpZWRBZ2dyZWdhdGlvbi50aW1lUGVyaW9kTXVsdGlwbGllciA9IG9iai50aW1lUGVyaW9kTXVsdGlwbGllcjtcbiAgICAgIHRoaXMuYXBwbGllZEFnZ3JlZ2F0aW9uLmFnZ3JlZ2F0aW9uTWV0aG9kID0gb2JqLmFnZ3JlZ2F0aW9uTWV0aG9kO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgYXZhaWxhYmxlIGFnZ3JlZ2F0aW9uIG9wdGlvbnMgaW4gY29uZmlndXJhdGlvbiBvZiBleHRlbnNpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEF2YWlsYWJsZWxBZ2dyZWFnYXRpb24gKCkge1xuICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnLFxuICAgICAgICBkYXRhQWdnID0gY29uZmlnLmRhdGFBZ2csXG4gICAgICAgIGF2bFRpbWVQZXJpb2RzID0gY29uZmlnLmF2bFRpbWVQZXJpb2RzID0gZGF0YUFnZy5nZXRBZ2dyZWdhdGlvblRpbWVSdWxlcygpLFxuICAgICAgICBpLFxuICAgICAgICBsZW47XG5cbiAgICAgIGNvbmZpZy5hdmxUaW1lTXVsdGlwbGllciA9IFtdO1xuICAgICAgbGVuID0gYXZsVGltZVBlcmlvZHMubGVuZ3RoO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uZmlnLmF2bFRpbWVNdWx0aXBsaWVyLnB1c2goYXZsVGltZVBlcmlvZHNbaV0ucG9zc2libGVGYWN0b3JzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHZhbGlkIGFnZ3JlZ2F0aW9uIHRpbWUgcGVyaW9kcyBhbmQgY29ycmVzcG9uZGluZyBtdWx0aXBsaWVyc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0VmFsaWRBZ2dyZWdhdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICB0c09iamVjdCA9IHNlbGYudHNPYmplY3QsXG4gICAgICAgIGRhdGFBZ2cgPSBjb25maWcuZGF0YUFnZyxcbiAgICAgICAgaSxcbiAgICAgICAgaixcbiAgICAgICAgbGVuMSxcbiAgICAgICAgbGVuMixcbiAgICAgICAgYXZsVGltZVBlcmlvZHMsXG4gICAgICAgIGF2bFRpbWVNdWx0aXBsaWVyLFxuICAgICAgICBtYXhOdW1PZlBsb3QgPSBjb25maWcuY29tcG9zaXRpb24ucmVhY3RpdmVNb2RlbC5tb2RlbFsnbWF4LXBsb3QtcG9pbnQnXSxcbiAgICAgICAgbXVsdGlwbGllcnNBcnIsXG4gICAgICAgIGN1cnJlbnRUaW1lTGVuZ3RoLFxuICAgICAgICB0aW1lUGVyaW9kLFxuICAgICAgICB0aW1lLFxuICAgICAgICBiaW5TaXplLFxuICAgICAgICBtdWx0aXBsaWVyLFxuICAgICAgICBtaW5CaW5TaXplO1xuXG4gICAgICBjb25maWcuY3VycmVudFRpbWVMZW5ndGggPSB0c09iamVjdC5nbG9iYWxSZWFjdGl2ZU1vZGVsLm1vZGVsWyd4LWF4aXMtdmlzaWJsZS1yYW5nZS1lbmQnXSAtXG4gICAgICAgIHRzT2JqZWN0Lmdsb2JhbFJlYWN0aXZlTW9kZWwubW9kZWxbJ3gtYXhpcy12aXNpYmxlLXJhbmdlLXN0YXJ0J107XG5cbiAgICAgIGF2bFRpbWVQZXJpb2RzID0gY29uZmlnLmF2bFRpbWVQZXJpb2RzO1xuICAgICAgYXZsVGltZU11bHRpcGxpZXIgPSBjb25maWcuYXZsVGltZU11bHRpcGxpZXI7XG4gICAgICBjdXJyZW50VGltZUxlbmd0aCA9IGNvbmZpZy5jdXJyZW50VGltZUxlbmd0aDtcblxuICAgICAgY29uZmlnLm1pbkJpblNpemUgPSBtaW5CaW5TaXplID0gY3VycmVudFRpbWVMZW5ndGggLyBtYXhOdW1PZlBsb3Q7XG5cbiAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2QgPSBbXTtcbiAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyID0gW107XG4gICAgICBjb25maWcuYXZsQWdnTWV0aG9kcyA9IGRhdGFBZ2cuZ2V0QWxsQWdncmVnYXRpb25NZXRob2QoKTtcblxuICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGF2bFRpbWVQZXJpb2RzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICB0aW1lUGVyaW9kID0gYXZsVGltZVBlcmlvZHNbaV0ubmFtZTtcbiAgICAgICAgdGltZSA9IGF2bFRpbWVQZXJpb2RzW2ldLmludGVydmFsO1xuICAgICAgICBtdWx0aXBsaWVyc0FyciA9IFtdO1xuXG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjIgPSBhdmxUaW1lTXVsdGlwbGllcltpXS5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcbiAgICAgICAgICBtdWx0aXBsaWVyID0gYXZsVGltZU11bHRpcGxpZXJbaV1bal07XG4gICAgICAgICAgYmluU2l6ZSA9IG11bHRpcGxpZXIgKiB0aW1lO1xuXG4gICAgICAgICAgaWYgKChiaW5TaXplID49IG1pbkJpblNpemUpKSB7XG4gICAgICAgICAgICBtdWx0aXBsaWVyc0Fyci5wdXNoKGF2bFRpbWVNdWx0aXBsaWVyW2ldW2pdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG11bHRpcGxpZXJzQXJyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllci5wdXNoKG11bHRpcGxpZXJzQXJyKTtcbiAgICAgICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kLnB1c2godGltZVBlcmlvZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgQWdncmVnYXRpb24gYXBwbGllZCB0byB0aW1lc2VyaWVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRDdXJyZW50QWdncmVhdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICBkYXRhQWdnID0gY29uZmlnLmRhdGFBZ2csXG4gICAgICAgIGNvbXBvc2l0aW9uID0gY29uZmlnLmNvbXBvc2l0aW9uLFxuICAgICAgICBtb2RlbCA9IGNvbXBvc2l0aW9uLnJlYWN0aXZlTW9kZWwsXG4gICAgICAgIGN1cnJlbnRBZ2dNZXRob2QsXG4gICAgICAgIHN1aXRhYmxlSW50ZXJ2YWwsXG4gICAgICAgIGJpblNpemU7XG5cbiAgICAgIGJpblNpemUgPSBtb2RlbC5wcm9wKCdiaW4tc2l6ZScpIC0gMTtcblxuICAgICAgaWYgKGlzRmluaXRlKGJpblNpemUpKSB7XG4gICAgICAgIGNvbmZpZy5jYW5BZ2dyZWdhdGUgPSB0cnVlO1xuICAgICAgICBzdWl0YWJsZUludGVydmFsID0gZGF0YUFnZy50aW1lUnVsZXMuZ2V0U3VpdGFibGVJbnRlcnZhbChiaW5TaXplKTtcbiAgICAgICAgY3VycmVudEFnZ01ldGhvZCA9IG1vZGVsLnByb3AoJ2FnZ3JlZ2F0aW9uLWZuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWcuY2FuQWdncmVnYXRlID0gZmFsc2U7XG4gICAgICAgIHN1aXRhYmxlSW50ZXJ2YWwgPSB7XG4gICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgc3RlcDogJydcbiAgICAgICAgfTtcbiAgICAgICAgY29uZmlnLnZhbGlkVGltZVBlcmlvZCA9IFtzdWl0YWJsZUludGVydmFsLm5hbWVdO1xuICAgICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciA9IFtbc3VpdGFibGVJbnRlcnZhbC5zdGVwXV07XG4gICAgICAgIGNvbmZpZy5hdmxBZ2dNZXRob2RzID0ge1xuICAgICAgICAgICdpbnZhbGlkJzoge1xuICAgICAgICAgICAgZm9ybWFsTmFtZTogJycsXG4gICAgICAgICAgICBuaWNrTmFtZTogJydcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGN1cnJlbnRBZ2dNZXRob2QgPSBjb25maWcuYXZsQWdnTWV0aG9kc1snaW52YWxpZCddO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aW1lUGVyaW9kOiBzdWl0YWJsZUludGVydmFsLm5hbWUsXG4gICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyOiBzdWl0YWJsZUludGVydmFsLnN0ZXAsXG4gICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kOiB7XG4gICAgICAgICAgdmFsdWU6IGN1cnJlbnRBZ2dNZXRob2Qubmlja05hbWUsXG4gICAgICAgICAgdGV4dDogY3VycmVudEFnZ01ldGhvZC5mb3JtYWxOYW1lXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgaW5pdCAocmVxdWlyZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBjb25maWcgPSBzZWxmLmNvbmZpZyxcbiAgICAgICAgdG9vbGJveENvbXBvbmVudCA9IGNvbmZpZy50b29sYm94Q29tcG9uZW50ID0ge30sXG4gICAgICAgIGFwaSxcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIGNvbXBvc2l0aW9uLFxuICAgICAgICBzYXZlVG8gPSAndHNPYmplY3QnLFxuICAgICAgICByZXF1aXJlZFBhcmFtcyA9IFtcbiAgICAgICAgICAnZ3JhcGhpY3MnLFxuICAgICAgICAgICdnbG9iYWxSZWFjdGl2ZU1vZGVsJyxcbiAgICAgICAgICAnY2hhcnQnLFxuICAgICAgICAgICdzcGFjZU1hbmFnZXJJbnN0YW5jZScsXG4gICAgICAgICAgJ2NoYXJ0SW5zdGFuY2UnLFxuICAgICAgICAgICdzbWFydExhYmVsJyxcbiAgICAgICAgICBmdW5jdGlvbiBhY3F1aXJlICgpIHtcbiAgICAgICAgICAgIGxldCBpID0gMCxcbiAgICAgICAgICAgICAgaWkgPSByZXF1aXJlZFBhcmFtcy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICBwYXJhbSA9ICcnO1xuICAgICAgICAgICAgc2VsZltzYXZlVG9dID0gc2VsZltzYXZlVG9dIHx8IHt9O1xuICAgICAgICAgICAgc2VsZi5yZXF1aXJlZFBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgICAgcGFyYW0gPSByZXF1aXJlZFBhcmFtc1tpXTtcbiAgICAgICAgICAgICAgc2VsZltzYXZlVG9dW3BhcmFtXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICByZXF1aXJlKHJlcXVpcmVkUGFyYW1zKTtcblxuICAgICAgYXBpID0gc2VsZi50c09iamVjdC5jaGFydEluc3RhbmNlLmFwaUluc3RhbmNlO1xuICAgICAgc3RvcmUgPSBhcGkuZ2V0Q29tcG9uZW50U3RvcmUoKTtcbiAgICAgIGNvbmZpZy5jb21wb3NpdGlvbiA9IGNvbXBvc2l0aW9uID0gc3RvcmUuZ2V0Q2FudmFzQnlJbmRleCgwKS5jb21wb3NpdGlvbjtcbiAgICAgIGNvbmZpZy5kYXRhQWdnID0gY29tcG9zaXRpb24uaW1wbC5nZXREYXRhQWdncmVnYXRvcigpO1xuXG4gICAgICB0b29sYm94Q29tcG9uZW50LnRvb2xib3ggPSBkZXAuRkMuZ2V0Q29tcG9uZW50KCdhcGknLCAndG9vbGJveCcpO1xuICAgICAgdG9vbGJveENvbXBvbmVudC5jb25maWcgPSB7fTtcblxuICAgICAgc2VsZi50b29sYmFycyA9IFtdO1xuXG4gICAgICBzZWxmLm1lYXN1cmVtZW50ID0ge307XG5cbiAgICAgIHNlbGYudG9vbGJhcnMucHVzaChzZWxmLmNyZWF0ZVRvb2xiYXIoKSk7XG5cbiAgICAgIHdpbmRvdy5BZ2dyZWdhdG9yID0gc2VsZjtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB0b29sYmFyIGNvbXBvbmVudHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNyZWF0ZVRvb2xiYXIgKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBncm91cDEsXG4gICAgICAgIGdyb3VwMixcbiAgICAgICAgZ3JvdXAzLFxuICAgICAgICB0b29sYmFyLFxuICAgICAgICB0aW1lTXVsU2VsZWN0TWVudSxcbiAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUsXG4gICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnUsXG4gICAgICAgIHJlc2V0QnV0dG9uLFxuICAgICAgICBhcHBseUJ1dHRvbixcbiAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXG4gICAgICAgIHRzT2JqZWN0ID0gc2VsZi50c09iamVjdCxcbiAgICAgICAgbGFiZWwsXG5cbiAgICAgICAgdG9vbGJveENvbXBvbmVudCA9IGNvbmZpZy50b29sYm94Q29tcG9uZW50LFxuICAgICAgICB0b29sYm94ID0gdG9vbGJveENvbXBvbmVudC50b29sYm94LFxuICAgICAgICB0b29sYm94Q29tcENvbmZpZyA9IHRvb2xib3hDb21wb25lbnQuY29uZmlnLFxuICAgICAgICBIb3Jpem9udGFsVG9vbGJhciA9IHRvb2xib3guSG9yaXpvbnRhbFRvb2xiYXIsXG4gICAgICAgIENvbXBvbmVudEdyb3VwID0gdG9vbGJveC5Db21wb25lbnRHcm91cCxcbiAgICAgICAgU3ltYm9sU3RvcmUgPSB0b29sYm94LlN5bWJvbFN0b3JlLFxuXG4gICAgICAgIGdyYXBoaWNzID0gdHNPYmplY3QuZ3JhcGhpY3MsXG4gICAgICAgIHBhcGVyID0gZ3JhcGhpY3MucGFwZXIsXG4gICAgICAgIGNvbnRhaW5lciA9IGdyYXBoaWNzLmNvbnRhaW5lcixcbiAgICAgICAgY2hhcnQgPSB0c09iamVjdC5jaGFydCxcbiAgICAgICAgc21hcnRMYWJlbCA9IHRzT2JqZWN0LnNtYXJ0TGFiZWwsXG5cbiAgICAgICAgbXVsdGlwbGllclZhbCxcbiAgICAgICAgdGltZU11bFNlbGVjdE1lbnVPcHQsXG4gICAgICAgIHRpbWVQZXJpb2RNZW51RGlzYWJsZUNvbmZpZyxcbiAgICAgICAgdGltZU11bHRpcGxpZXJNZW51RGlzYWJsZUNvbmZpZyxcbiAgICAgICAgYWdnTWV0aG9kTWVudURpc2FibGVvbmZpZyxcbiAgICAgICAgZHJvcERvd25NZW51U3R5bGUsXG4gICAgICAgIGFwcGx5QnV0dG9uRGlzYWJsZUNvbmZpZyxcbiAgICAgICAgcmVzZXRCdXR0b25EaXNhYmxlQ29uZmlnLFxuXG4gICAgICAgIHN0eWxlLFxuXG4gICAgICAgIGRlcGVuZGVuY2llcyA9IHtcbiAgICAgICAgICBwYXBlcjogcGFwZXIsXG4gICAgICAgICAgY2hhcnQ6IGNoYXJ0LFxuICAgICAgICAgIHNtYXJ0TGFiZWw6IHNtYXJ0TGFiZWwsXG4gICAgICAgICAgY2hhcnRDb250YWluZXI6IGNvbnRhaW5lclxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQXBwbHkgb3IgUmVzZXQgQWdncmVnYXRpb24gYXBwbGllZCB0aHJvdWdoIGV4dGVuc2lvbiBpbiB0aW1lc2VyaWVzXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZXQgLSBGbGFnIHRvIHNldCBvciByZXNldC4gJzEnIHRvIHNldCwgJzAnIHRvIHJlc2V0XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBhcHBseSA9IChzZXQpID0+IHtcbiAgICAgICAgICB2YXIgbW9kZWwgPSBjb25maWcuY29tcG9zaXRpb24ucmVhY3RpdmVNb2RlbCxcbiAgICAgICAgICAgIHRpbWVQZXJpb2RWYWwgPSB0aW1lUGVyaW9kU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXJWYWwgPSB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudVZhbCA9IGFnZ01ldGhvZFNlbGVjdE1lbnUudmFsdWUoKSxcbiAgICAgICAgICAgIGtleXMsXG4gICAgICAgICAgICBiaW5TaXplLFxuICAgICAgICAgICAgdGltZUludGVydmFsLFxuICAgICAgICAgICAgYWdncmVnYXRpb24gPSBzZWxmLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgY2FudmFzID0gY29uZmlnLmNvbXBvc2l0aW9uLmltcGw7XG5cbiAgICAgICAgICBmb3IgKGtleXMgb2YgY29uZmlnLmF2bFRpbWVQZXJpb2RzKSB7XG4gICAgICAgICAgICBpZiAoa2V5cy5uYW1lID09PSB0aW1lUGVyaW9kVmFsKSB7XG4gICAgICAgICAgICAgIHRpbWVJbnRlcnZhbCA9IGtleXMuaW50ZXJ2YWw7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBiaW5TaXplID0gdGltZUludGVydmFsICogTnVtYmVyKHRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsKTtcbiAgICAgICAgICBpZiAoc2V0ICYmIGlzRmluaXRlKG1vZGVsLnByb3AoJ2Jpbi1zaXplJykpKSB7XG4gICAgICAgICAgICBtb2RlbFxuICAgICAgICAgICAgICAubG9jaygpXG4gICAgICAgICAgICAgIC5wcm9wKCdiaW4tc2l6ZS1leHQnLCBiaW5TaXplKVxuICAgICAgICAgICAgICAucHJvcCgnYWdncmVnYXRpb24tZm4tZXh0JywgY29uZmlnLmF2bEFnZ01ldGhvZHNbYWdnTWV0aG9kU2VsZWN0TWVudVZhbF0pXG4gICAgICAgICAgICAgIC51bmxvY2soKTtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmJpblNpemUgPSBiaW5TaXplO1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYWdncmVnYXRpb25NZXRob2QgPSBhZ2dNZXRob2RTZWxlY3RNZW51VmFsO1xuICAgICAgICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdlbmFibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcy5yZXNldEFnZ3JlZ2F0aW9uKCk7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbi5iaW5TaXplID0gbnVsbDtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmFnZ3JlZ2F0aW9uTWV0aG9kID0gbnVsbDtcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdmFsaWQgdGltZSBtdWx0aXBsaWVyIG9uIHRpbWUgcGVyaW9kIGNoYW5nZSBmcm9tIGV4dGVuc2lvbiB0b29sYm94XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lUGVyaW9kT25DaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgdmFyIHRpbWVQZXJpb2RWYWwgPSB0aW1lUGVyaW9kU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXJWYWwgPSB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgcHJldlRpbWVQZXJvaWRNdWxWYWwgPSB0aW1lUGVyaW9kTXVsdGlwbGllclZhbCxcbiAgICAgICAgICAgIHZhbGlkVGltZVBlcmlvZCA9IGNvbmZpZy52YWxpZFRpbWVQZXJpb2QsXG4gICAgICAgICAgICB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyID0gY29uZmlnLnZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXIsXG4gICAgICAgICAgICBpbmRleE9mVGltZVVuaXQsXG4gICAgICAgICAgICBpbmRleE9mVGltZU11bDtcblxuICAgICAgICAgIGluZGV4T2ZUaW1lVW5pdCA9IHZhbGlkVGltZVBlcmlvZC5pbmRleE9mKHRpbWVQZXJpb2RWYWwpO1xuICAgICAgICAgIGluZGV4T2ZUaW1lTXVsID0gdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcltpbmRleE9mVGltZVVuaXRdLmluZGV4T2YoTnVtYmVyKHRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsKSk7XG5cbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdCA9IFtdO1xuICAgICAgICAgIGZvciAobXVsdGlwbGllclZhbCBvZiB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyW2luZGV4T2ZUaW1lVW5pdF0pIHtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0LnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgIHZhbHVlOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnVwZGF0ZUxpc3QodGltZU11bFNlbGVjdE1lbnVPcHQpO1xuXG4gICAgICAgICAgaWYgKGluZGV4T2ZUaW1lTXVsIDwgMCkge1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudmFsdWUodmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcltpbmRleE9mVGltZVVuaXRdWzBdLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZShwcmV2VGltZVBlcm9pZE11bFZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHN0YXRlIG9mIGFwcGx5QnV0dG9uKGFjdGl2ZS9pbmFjdGl2ZSkgb24gY2hhbmdlIGluIHZhbHVlIGluIHRvb2xib3hcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlID0gKHR5cGUpID0+IHtcbiAgICAgICAgICB2YXIgY3VycmVudEFnZyA9IHNlbGYuZ2V0Q3VycmVudEFnZ3JlYXRpb24oKTtcblxuICAgICAgICAgIGlmIChjdXJyZW50QWdnLnRpbWVQZXJpb2RNdWx0aXBsaWVyLnRvU3RyaW5nKCkgIT09IHRpbWVNdWxTZWxlY3RNZW51LnZhbHVlKCkgfHxcbiAgICAgICAgICAgIGN1cnJlbnRBZ2cudGltZVBlcmlvZCAhPT0gdGltZVBlcmlvZFNlbGVjdE1lbnUudmFsdWUoKSB8fFxuICAgICAgICAgICAgY3VycmVudEFnZy5hZ2dyZWdhdGlvbk1ldGhvZC52YWx1ZSAhPT0gYWdnTWV0aG9kU2VsZWN0TWVudS52YWx1ZSgpKSB7XG4gICAgICAgICAgICBhcHBseUJ1dHRvbi51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgZ3JvdXAxID0gbmV3IENvbXBvbmVudEdyb3VwKGRlcGVuZGVuY2llcyk7XG4gICAgICBncm91cDIgPSBuZXcgQ29tcG9uZW50R3JvdXAoZGVwZW5kZW5jaWVzKTtcbiAgICAgIGdyb3VwMyA9IG5ldyBDb21wb25lbnRHcm91cChkZXBlbmRlbmNpZXMpO1xuXG4gICAgICB0b29sYmFyID0gbmV3IEhvcml6b250YWxUb29sYmFyKGRlcGVuZGVuY2llcyk7XG5cbiAgICAgIGNvbmZpZy51c3JDb25maWcgPSB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHBvc1dydENhbnZhczogJ3RvcCcsXG4gICAgICAgIGFsaWdubWVudDogJ2xlZnQnLFxuICAgICAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnLFxuICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICB0aW1lTXVsdGlwbGllcklucHV0RmllbGQ6IHtcbiAgICAgICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjYzhjZWNkJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJyM2OTY5NjknLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiA0NSxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJ3JnYigxOTIsIDE5MiwgMTkyKScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpbWVQZXJpb2RJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzY5Njk2OScsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZSc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAncmFkaXVzJzogMSxcbiAgICAgICAgICAgICAgJ3dpZHRoJzogNzUsXG4gICAgICAgICAgICAgICdoZWlnaHQnOiAyMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICdyZ2IoMTkyLCAxOTIsIDE5MiknLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQ6IHtcbiAgICAgICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjYzhjZWNkJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJyM2OTY5NjknLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiAxMDAsXG4gICAgICAgICAgICAgICdoZWlnaHQnOiAyMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICdyZ2IoMTkyLCAxOTIsIDE5MiknLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkcm9wRG93bjoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyM4OThiOGInLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyNmZmYnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnLFxuICAgICAgICAgICAgICAnaG92ZXJGaWxsJzogJyNlNmU4ZTgnLFxuICAgICAgICAgICAgICAnaG92ZXJMYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFwcGx5QnV0dG9uOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnIzU1NScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMycsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlckZpbGwnOiAnIzU1NScsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJycsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiAzMCxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2JlYmViZScsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJ3JnYigxOTIsIDE5MiwgMTkyKScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0QnV0dG9uOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnIzg5OGI4YicsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMycsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlckZpbGwnOiAnIzg5OGI4YicsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJycsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiAzMCxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2JlYmViZScsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJ3JnYigxOTIsIDE5MiwgMTkyKScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGJhc2U6IHtcbiAgICAgICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgICAgJ2ZvbnRTaXplJzogMTFcbiAgICAgICAgICAgICAgLy8gJ2ZvbnRXZWlnaHQnOiAnYm9sZCcsXG4gICAgICAgICAgICAgIC8vICdmb250RmFtaWx5JzogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICAvLyAnZm9udFN0eWxlJzogJ2l0YWxpYydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHN0eWxlID0gY29uZmlnLnVzckNvbmZpZy5zdHlsZXMgfHwge307XG5cbiAgICAgIHN0eWxlID0ge1xuICAgICAgICB0aW1lTXVsdGlwbGllcklucHV0RmllbGQ6IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS50aW1lTXVsdGlwbGllcklucHV0RmllbGQgJiYgc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgaW5hY3RpdmU6IChzdHlsZS50aW1lTXVsdGlwbGllcklucHV0RmllbGQgJiYgc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkLmluYWN0aXZlKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICB0aW1lUGVyaW9kSW5wdXRGaWVsZDoge1xuICAgICAgICAgIGFjdGl2ZTogKHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkICYmIHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgaW5hY3RpdmU6IChzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZCAmJiBzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZC5pbmFjdGl2ZSkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkICYmIHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZC5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIGluYWN0aXZlOiAoc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkICYmIHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZC5pbmFjdGl2ZSkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgZHJvcERvd246IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS5kcm9wRG93biAmJiBzdHlsZS5kcm9wRG93bi5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIG5vcm1hbDogKHN0eWxlLmRyb3BEb3duICYmIHN0eWxlLmRyb3BEb3duLm5vcm1hbCkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgYXBwbHlCdXR0b246IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS5hcHBseUJ1dHRvbiAmJiBzdHlsZS5hcHBseUJ1dHRvbi5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIGluYWN0aXZlOiAoc3R5bGUuYXBwbHlCdXR0b24gJiYgc3R5bGUuYXBwbHlCdXR0b24uaW5hY3RpdmUpIHx8IHt9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0QnV0dG9uOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUucmVzZXRCdXR0b24gJiYgc3R5bGUucmVzZXRCdXR0b24uYWN0aXZlKSB8fCB7fSxcbiAgICAgICAgICBpbmFjdGl2ZTogKHN0eWxlLnJlc2V0QnV0dG9uICYmIHN0eWxlLnJlc2V0QnV0dG9uLmluYWN0aXZlKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICBiYXNlOiB7XG4gICAgICAgICAgZm9udDogKHN0eWxlLmJhc2UgJiYgc3R5bGUuYmFzZS5mb250KSB8fCB7fVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBncm91cDEuc2V0Q29uZmlnKHtcbiAgICAgICAgZmlsbDogJyNmZmYnLFxuICAgICAgICBib3JkZXJUaGlja25lc3M6IDBcbiAgICAgIH0pO1xuICAgICAgZ3JvdXAyLnNldENvbmZpZyh7XG4gICAgICAgIGZpbGw6ICcjZmZmJyxcbiAgICAgICAgYm9yZGVyVGhpY2tuZXNzOiAwXG4gICAgICB9KTtcbiAgICAgIGdyb3VwMy5zZXRDb25maWcoe1xuICAgICAgICBmaWxsOiAnI2ZmZicsXG4gICAgICAgIGJvcmRlclRoaWNrbmVzczogMFxuICAgICAgfSk7XG5cbiAgICAgIHRvb2xiYXIuc2V0Q29uZmlnKHtcbiAgICAgICAgZmlsbDogJyNmZmYnLFxuICAgICAgICBib3JkZXJUaGlja25lc3M6IDBcbiAgICAgIH0pO1xuXG4gICAgICB0aW1lUGVyaW9kTWVudURpc2FibGVDb25maWcgPSB7XG4gICAgICAgIGRpc2FibGVkOiB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aW1lTXVsdGlwbGllck1lbnVEaXNhYmxlQ29uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBhZ2dNZXRob2RNZW51RGlzYWJsZW9uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZC5pbmFjdGl2ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgYXBwbHlCdXR0b25EaXNhYmxlQ29uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLmFwcGx5QnV0dG9uLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXNldEJ1dHRvbkRpc2FibGVDb25maWcgPSB7XG4gICAgICAgIGRpc2FibGVkOiB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc3R5bGUucmVzZXRCdXR0b24uaW5hY3RpdmVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGRyb3BEb3duTWVudVN0eWxlID0ge1xuICAgICAgICBzZWxlY3RlZDoge1xuICAgICAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgZmlsbDogc3R5bGUuZHJvcERvd24uYWN0aXZlLmZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLmFjdGl2ZS5sYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG5vcm1hbDoge1xuICAgICAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgZmlsbDogc3R5bGUuZHJvcERvd24ubm9ybWFsLmZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5sYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgY29udGFpbmVyOiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuaG92ZXJGaWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuaG92ZXJMYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxhYmVsID0gbmV3IHRvb2xib3guTGFiZWwoJ0FnZ3JlZ2F0ZSBEYXRhOicsIGRlcGVuZGVuY2llcywge1xuICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICdmb250LXNpemUnOiAnMTQnLFxuICAgICAgICAgICAgJ2ZpbGwnOiAnIzY5Njk2OSdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0b29sYm94Q29tcENvbmZpZy50aW1lUGVyaW9kU2VsZWN0TWVudSA9IHRpbWVQZXJpb2RTZWxlY3RNZW51ID0gbmV3IHRvb2xib3guU2VsZWN0U3ltYm9sKHt9LCBkZXBlbmRlbmNpZXMsIFtdLFxuICAgICAgT2JqZWN0LmFzc2lnbihzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZC5hY3RpdmUsIHtcbiAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnQsXG4gICAgICAgIGRyb3BEb3duTWVudTogZHJvcERvd25NZW51U3R5bGVcbiAgICAgIH0pKTtcbiAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnNldFN0YXRlQ29uZmlnKHRpbWVQZXJpb2RNZW51RGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLnRpbWVNdWxTZWxlY3RNZW51ID0gdGltZU11bFNlbGVjdE1lbnUgPSBuZXcgdG9vbGJveC5TZWxlY3RTeW1ib2woe30sIGRlcGVuZGVuY2llcywgW10sXG4gICAgICBPYmplY3QuYXNzaWduKHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZC5hY3RpdmUsIHtcbiAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnQsXG4gICAgICAgIGRyb3BEb3duTWVudTogZHJvcERvd25NZW51U3R5bGVcbiAgICAgIH0pKTtcbiAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnNldFN0YXRlQ29uZmlnKHRpbWVNdWx0aXBsaWVyTWVudURpc2FibGVDb25maWcpO1xuXG4gICAgICB0b29sYm94Q29tcENvbmZpZy5hZ2dNZXRob2RTZWxlY3RNZW51ID0gYWdnTWV0aG9kU2VsZWN0TWVudSA9IG5ldyB0b29sYm94LlNlbGVjdFN5bWJvbCh7fSwgZGVwZW5kZW5jaWVzLCBbXSxcbiAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkLmFjdGl2ZSwge1xuICAgICAgICBidG5UZXh0U3R5bGU6IHN0eWxlLmJhc2UuZm9udCxcbiAgICAgICAgZHJvcERvd25NZW51OiBkcm9wRG93bk1lbnVTdHlsZVxuICAgICAgfSkpO1xuICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS5zZXRTdGF0ZUNvbmZpZyhhZ2dNZXRob2RNZW51RGlzYWJsZW9uZmlnKTtcblxuICAgICAgdG9vbGJveENvbXBDb25maWcuYXBwbHlCdXR0b24gPSBhcHBseUJ1dHRvbiA9IG5ldyB0b29sYm94LlN5bWJvbCgnQVBQTFknLCB0cnVlLCBkZXBlbmRlbmNpZXMsXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUuYXBwbHlCdXR0b24uYWN0aXZlLCB7XG4gICAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnRcbiAgICAgICAgfSkpXG4gICAgICAgIC5hdHRhY2hFdmVudEhhbmRsZXJzKHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXBwbHkoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGFwcGx5QnV0dG9uLnNldFN0YXRlQ29uZmlnKGFwcGx5QnV0dG9uRGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLnJlc2V0QnV0dG9uID0gcmVzZXRCdXR0b24gPSBuZXcgdG9vbGJveC5TeW1ib2woJ1JFU0VUJywgdHJ1ZSwgZGVwZW5kZW5jaWVzLFxuICAgICAgICBPYmplY3QuYXNzaWduKHN0eWxlLnJlc2V0QnV0dG9uLmFjdGl2ZSwge1xuICAgICAgICAgIGJ0blRleHRTdHlsZTogc3R5bGUuYmFzZS5mb250XG4gICAgICAgIH0pKVxuICAgICAgICAuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFwcGx5KDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICByZXNldEJ1dHRvbi5zZXRTdGF0ZUNvbmZpZyhyZXNldEJ1dHRvbkRpc2FibGVDb25maWcpO1xuXG4gICAgICBncm91cDEuYWRkU3ltYm9sKGxhYmVsKTtcbiAgICAgIGdyb3VwMi5hZGRTeW1ib2wodGltZU11bFNlbGVjdE1lbnUpO1xuICAgICAgZ3JvdXAyLmFkZFN5bWJvbCh0aW1lUGVyaW9kU2VsZWN0TWVudSk7XG4gICAgICBncm91cDIuYWRkU3ltYm9sKGFnZ01ldGhvZFNlbGVjdE1lbnUpO1xuICAgICAgZ3JvdXAzLmFkZFN5bWJvbChhcHBseUJ1dHRvbik7XG4gICAgICBncm91cDMuYWRkU3ltYm9sKHJlc2V0QnV0dG9uKTtcblxuICAgICAgU3ltYm9sU3RvcmUucmVnaXN0ZXIoJ3RleHRCb3hJY29uJywgZnVuY3Rpb24gKHgsIHksIHJhZCwgdywgaCwgcGFkWCwgcGFkWSkge1xuICAgICAgICB2YXIgeDEgPSB4IC0gdyAvIDIgKyBwYWRYIC8gMixcbiAgICAgICAgICB4MiA9IHggKyB3IC8gMiAtIHBhZFggLyAyLFxuICAgICAgICAgIHkxID0geSAtIGggLyAyICsgcGFkWSAvIDIsXG4gICAgICAgICAgeTIgPSB5ICsgaCAvIDIgLSBwYWRZIC8gMjtcblxuICAgICAgICByZXR1cm4gWydNJywgeDEsIHkxLCAnTCcsIHgyLCB5MSwgJ0wnLCB4MiwgeTIsICdMJywgeDEsIHkyLCAnWiddO1xuICAgICAgfSk7XG5cbiAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LmF0dGFjaEV2ZW50SGFuZGxlcnMoe1xuICAgICAgICB0ZXh0T25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aW1lUGVyaW9kT25DaGFuZ2UoKTtcbiAgICAgICAgICBvbkNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGltZU11bFNlbGVjdE1lbnUuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgIHRleHRPbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG9uQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LmF0dGFjaEV2ZW50SGFuZGxlcnMoe1xuICAgICAgICB0ZXh0T25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBvbkNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdG9vbGJhci5hZGRDb21wb25lbnQoZ3JvdXAxKTtcbiAgICAgIHRvb2xiYXIuYWRkQ29tcG9uZW50KGdyb3VwMik7XG4gICAgICB0b29sYmFyLmFkZENvbXBvbmVudChncm91cDMpO1xuXG4gICAgICByZXR1cm4gdG9vbGJhcjtcbiAgICB9XG5cbiAgICBnZXRMb2dpY2FsU3BhY2UgKGF2YWlsYWJsZVdpZHRoLCBhdmFpbGFibGVIZWlnaHQpIHtcbiAgICAgIHZhciBsb2dpY2FsU3BhY2UsXG4gICAgICAgIHdpZHRoID0gMCxcbiAgICAgICAgaGVpZ2h0ID0gMCxcbiAgICAgICAgaSxcbiAgICAgICAgbG47XG5cbiAgICAgIGZvciAoaSA9IDAsIGxuID0gdGhpcy50b29sYmFycy5sZW5ndGg7IGkgPCBsbjsgaSsrKSB7XG4gICAgICAgIGxvZ2ljYWxTcGFjZSA9IHRoaXMudG9vbGJhcnNbaV0uZ2V0TG9naWNhbFNwYWNlKGF2YWlsYWJsZVdpZHRoLCBhdmFpbGFibGVIZWlnaHQpO1xuICAgICAgICB3aWR0aCA9IE1hdGgubWF4KGxvZ2ljYWxTcGFjZS53aWR0aCwgd2lkdGgpO1xuICAgICAgICBoZWlnaHQgKz0gbG9naWNhbFNwYWNlLmhlaWdodDtcbiAgICAgICAgdGhpcy50b29sYmFyc1tpXS53aWR0aCA9IGxvZ2ljYWxTcGFjZS53aWR0aDtcbiAgICAgICAgdGhpcy50b29sYmFyc1tpXS5oZWlnaHQgPSBsb2dpY2FsU3BhY2UuaGVpZ2h0O1xuICAgICAgfVxuICAgICAgaGVpZ2h0ICs9IHRoaXMucGFkZGluZztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcGxhY2VJbkNhbnZhcyAoY29udGFpbmVySW5zdGFuY2UpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgdHNPYmplY3QgPSBzZWxmLnRzT2JqZWN0O1xuXG4gICAgICBzZWxmLnBhZGRpbmcgPSA1O1xuICAgICAgdHNPYmplY3Quc3BhY2VNYW5hZ2VySW5zdGFuY2UuYWRkKFt7XG4gICAgICAgIG5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJ0RhdGFBZ2dyZWdhdG9yJztcbiAgICAgICAgfSxcbiAgICAgICAgcmVmOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgcmV0dXJuIG9ialsnMCddO1xuICAgICAgICB9LFxuICAgICAgICBzZWxmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgIH0sXG4gICAgICAgIHByaW9yaXR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgIH0sXG4gICAgICAgIGxheW91dDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgIHJldHVybiBvYmouaW5saW5lO1xuICAgICAgICB9LFxuICAgICAgICBvcmllbnRhdGlvbjogW3tcbiAgICAgICAgICB0eXBlOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLmhvcml6b250YWw7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3NpdGlvbjogW3tcbiAgICAgICAgICAgIHR5cGU6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9iai50b3A7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWxpZ25tZW50OiBbe1xuICAgICAgICAgICAgICB0eXBlOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5sZWZ0O1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBkaW1lbnNpb25zOiBbZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmdldFBhcmVudENvbXBvbmVudEdyb3VwKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0TG9naWNhbFNwYWNlKHBhcmVudC5nZXRXaWR0aCgpLCBwYXJlbnQuZ2V0SGVpZ2h0KCkpO1xuICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfV1cbiAgICAgICAgICB9XVxuICAgICAgICB9XVxuICAgICAgfV0pO1xuICAgIH1cblxuICAgIHNldERyYXdpbmdDb25maWd1cmF0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBncm91cCkge1xuICAgICAgdmFyIG1lcyA9IHRoaXMubWVhc3VyZW1lbnQ7XG4gICAgICBtZXMueCA9IHg7XG4gICAgICBtZXMueSA9IHk7XG4gICAgICBtZXMud2lkdGggPSB3aWR0aDtcbiAgICAgIG1lcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgIHRoaXMucGFyZW50R3JvdXAgPSBncm91cDtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhdyAoeCwgeSwgd2lkdGgsIGhlaWdodCwgZ3JvdXApIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXG4gICAgICAgIHRvb2xib3hDb21wQ29uZmlnID0gY29uZmlnLnRvb2xib3hDb21wb25lbnQuY29uZmlnLFxuICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudSA9IHRvb2xib3hDb21wQ29uZmlnLnRpbWVQZXJpb2RTZWxlY3RNZW51LFxuICAgICAgICB0aW1lTXVsU2VsZWN0TWVudSA9IHRvb2xib3hDb21wQ29uZmlnLnRpbWVNdWxTZWxlY3RNZW51LFxuICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51ID0gdG9vbGJveENvbXBDb25maWcuYWdnTWV0aG9kU2VsZWN0TWVudSxcbiAgICAgICAgYXBwbHlCdXR0b24gPSB0b29sYm94Q29tcENvbmZpZy5hcHBseUJ1dHRvbixcbiAgICAgICAgcmVzZXRCdXR0b24gPSB0b29sYm94Q29tcENvbmZpZy5yZXNldEJ1dHRvbixcbiAgICAgICAgbWVhc3VyZW1lbnQgPSBzZWxmLm1lYXN1cmVtZW50LFxuICAgICAgICB0b29sYmFycyA9IHNlbGYudG9vbGJhcnMsXG4gICAgICAgIGxuLFxuICAgICAgICBpLFxuICAgICAgICB0b29sYmFyLFxuICAgICAgICBtb2RlbCA9IGNvbmZpZy5jb21wb3NpdGlvbi5yZWFjdGl2ZU1vZGVsLFxuICAgICAgICBkYXRhQWdnID0gY29uZmlnLmRhdGFBZ2csXG5cbiAgICAgICAgdGltZVBlcmlvZFZhbCxcbiAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnVPcHQsXG4gICAgICAgIHZhbGlkVGltZVBlcmlvZCxcbiAgICAgICAgaW5kZXhPZlRpbWVVbml0LFxuXG4gICAgICAgIG11bHRpcGxpZXJWYWwsXG4gICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0LFxuICAgICAgICB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyLFxuXG4gICAgICAgIGFnZ1ZhbCxcbiAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudU9wdCxcbiAgICAgICAgYXZsQWdnTWV0aG9kcyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29tcHV0ZSBhbmQgcG9wdWxhdGUgdG9vbGJveGVzIHdpdGggdmFsaWQgdmFsdWVzIG9uIGNoYW5nZSBpbiByYW5nZSBvZiB2aXN1YWwgd2luZG93XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICByYW5nZU9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgIHZhciBhZ2dyZWdhdGlvbiA9IHNlbGYuYWdncmVnYXRpb24sXG4gICAgICAgICAgICBjdXJyZW50QWdncmVnYXRpb25PYmosXG4gICAgICAgICAgICB0aW1lUGVyaW9kLFxuICAgICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXIsXG4gICAgICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZDtcblxuICAgICAgICAgIHNlbGYuZ2V0VmFsaWRBZ2dyZWdhdGlvbigpO1xuICAgICAgICAgIGN1cnJlbnRBZ2dyZWdhdGlvbk9iaiA9IHNlbGYuZ2V0Q3VycmVudEFnZ3JlYXRpb24oKTtcbiAgICAgICAgICB0aW1lUGVyaW9kID0gY3VycmVudEFnZ3JlZ2F0aW9uT2JqLnRpbWVQZXJpb2Q7XG4gICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXIgPSBjdXJyZW50QWdncmVnYXRpb25PYmoudGltZVBlcmlvZE11bHRpcGxpZXI7XG4gICAgICAgICAgYWdncmVnYXRpb25NZXRob2QgPSBjdXJyZW50QWdncmVnYXRpb25PYmouYWdncmVnYXRpb25NZXRob2Q7XG5cbiAgICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudU9wdCA9IFtdO1xuICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0ID0gW107XG4gICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudU9wdCA9IFtdO1xuXG4gICAgICAgICAgdmFsaWRUaW1lUGVyaW9kID0gY29uZmlnLnZhbGlkVGltZVBlcmlvZDtcbiAgICAgICAgICB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyID0gY29uZmlnLnZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXI7XG4gICAgICAgICAgYXZsQWdnTWV0aG9kcyA9IGNvbmZpZy5hdmxBZ2dNZXRob2RzO1xuXG4gICAgICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgaWYgKGFnZ3JlZ2F0aW9uLmJpblNpemUgIT09IG1vZGVsLnByb3AoJ2Jpbi1zaXplJykgJiZcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kLnZhbHVlID09PSBjb25maWcuZGVmYXVsdEFnZ01ldGhvZCkge1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYmluU2l6ZSA9IG51bGw7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbi5hZ2dyZWdhdGlvbk1ldGhvZCA9IG51bGw7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghY29uZmlnLmNhbkFnZ3JlZ2F0ZSkge1xuICAgICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdlbmFibGVkJyk7XG4gICAgICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAodGltZVBlcmlvZFZhbCBvZiB2YWxpZFRpbWVQZXJpb2QpIHtcbiAgICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51T3B0LnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiB0aW1lUGVyaW9kVmFsLFxuICAgICAgICAgICAgICB2YWx1ZTogdGltZVBlcmlvZFZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUudXBkYXRlTGlzdCh0aW1lUGVyaW9kU2VsZWN0TWVudU9wdCk7XG4gICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUudmFsdWUodGltZVBlcmlvZCk7XG5cbiAgICAgICAgICBpbmRleE9mVGltZVVuaXQgPSB2YWxpZFRpbWVQZXJpb2QuaW5kZXhPZih0aW1lUGVyaW9kKTtcblxuICAgICAgICAgIGlmIChpbmRleE9mVGltZVVuaXQgPj0gMCkge1xuICAgICAgICAgICAgZm9yIChtdWx0aXBsaWVyVmFsIG9mIHZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXJbaW5kZXhPZlRpbWVVbml0XSkge1xuICAgICAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdmFsdWU6IG11bHRpcGxpZXJWYWwudG9TdHJpbmcoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS51cGRhdGVMaXN0KHRpbWVNdWxTZWxlY3RNZW51T3B0KTtcbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSh0aW1lUGVyaW9kTXVsdGlwbGllci50b1N0cmluZygpKTtcblxuICAgICAgICAgIGZvciAoYWdnVmFsIGluIGF2bEFnZ01ldGhvZHMpIHtcbiAgICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF2bEFnZ01ldGhvZHNbYWdnVmFsXS5mb3JtYWxOYW1lLFxuICAgICAgICAgICAgICB2YWx1ZTogYXZsQWdnTWV0aG9kc1thZ2dWYWxdLm5pY2tOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LnVwZGF0ZUxpc3QoYWdnTWV0aG9kU2VsZWN0TWVudU9wdCk7XG4gICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS52YWx1ZShhZ2dyZWdhdGlvbk1ldGhvZC52YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgIHNlbGYuZ2V0QXZhaWxhYmxlbEFnZ3JlYWdhdGlvbigpO1xuXG4gICAgICB4ID0geCA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQueCA6IHg7XG4gICAgICB5ID0geSA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQueSA6IHk7XG4gICAgICB3aWR0aCA9IHdpZHRoID09PSB1bmRlZmluZWQgPyBtZWFzdXJlbWVudC53aWR0aCA6IHdpZHRoO1xuICAgICAgaGVpZ2h0ID0gaGVpZ2h0ID09PSB1bmRlZmluZWQgPyBtZWFzdXJlbWVudC5oZWlnaHQgOiBoZWlnaHQ7XG4gICAgICBncm91cCA9IGdyb3VwID09PSB1bmRlZmluZWQgPyBzZWxmLnBhcmVudEdyb3VwIDogZ3JvdXA7XG4gICAgICBpZiAod2lkdGggJiYgaGVpZ2h0KSB7XG4gICAgICAgIGZvciAoaSA9IDAsIGxuID0gdG9vbGJhcnMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICAgIHRvb2xiYXIgPSB0b29sYmFyc1tpXTtcbiAgICAgICAgICB0b29sYmFyLmRyYXcoeCwgeSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJhbmdlT25DaGFuZ2UoKTtcbiAgICAgIGFwcGx5QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgIHJlc2V0QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgIGNvbmZpZy5kZWZhdWx0QWdnTWV0aG9kID0gZGF0YUFnZy5nZXREZWZhdWx0QWdncmVnYXRpb25NZXRob2QoKS5uaWNrTmFtZTtcblxuICAgICAgbW9kZWwub25Qcm9wc0NoYW5nZShbJ2Jpbi1zaXplJywgJ2FnZ3JlZ2F0aW9uLWZuJ10sIHJhbmdlT25DaGFuZ2UpO1xuICAgIH1cblxuICAgIGRpc3Bvc2UgKCkge1xuICAgICAgLy8gZGlzcG9zZSBleHRlbnNpb25cbiAgICB9XG4gIH1cbiAgcmV0dXJuIEFnZ3JlZ2F0b3I7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZmN0cy1leHQtYWdncmVnYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9