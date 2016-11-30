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
	          label: {
	            'font-size': '13',
	            'fill': '#696969'
	          },
	          timeMultiplierInputField: {
	            active: {
	              'fill': '#fff',
	              'labelFill': '#696969',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverStroke': '#1e1f1f',
	              'hoverStrokeWidth': 1,
	              'radius': 1,
	              'width': 45,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#fff',
	              'stroke-width': 1,
	              'stroke': '#ced5d4',
	              'labelFill': '#000'
	            }
	          },
	          timePeriodInputField: {
	            active: {
	              'fill': '#fff',
	              'labelFill': '#696969',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverStroke': '#1e1f1f',
	              'hoverStrokeWidth': 1,
	              'radius': 1,
	              'width': 75,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#fff',
	              'stroke-width': 1,
	              'stroke': '#ced5d4',
	              'labelFill': '#000'
	            }
	          },
	          aggregationMethodInputField: {
	            active: {
	              'fill': '#fff',
	              'labelFill': '#696969',
	              'stroke': '#c8cecd',
	              'strokeWidth': 1,
	              'hoverStroke': '#1e1f1f',
	              'hoverStrokeWidth': 1,
	              'radius': 1,
	              'width': 100,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#fff',
	              'stroke-width': 1,
	              'stroke': '#ced5d4',
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
	              'stroke': '#898b8b',
	              'radius': 2,
	              'labelFill': '#000',
	              'hoverFill': '#e6e8e8',
	              'hoverLabelFill': '#000'
	            }
	          },
	          applyButton: {
	            active: {
	              'fill': '#555',
	              'labelFill': '#f3f3f3',
	              'stroke': '#ced5d4',
	              'strokeWidth': 1,
	              'hoverFill': '#555',
	              'hoverStrokeWidth': 1,
	              'hoverStroke': '',
	              'radius': 1,
	              'width': 54,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#bebebe',
	              'stroke-width': 1,
	              'stroke': '#ced5d4',
	              'labelFill': '#f3f3f3'
	            }
	          },
	          resetButton: {
	            active: {
	              'fill': '#898b8b',
	              'labelFill': '#f3f3f3',
	              'stroke': '#ced5d4',
	              'strokeWidth': 1,
	              'hoverFill': '#898b8b',
	              'hoverStrokeWidth': 1,
	              'hoverStroke': '',
	              'radius': 1,
	              'width': 54,
	              'height': 22
	            },
	            inactive: {
	              'fill': '#bebebe',
	              'stroke-width': 1,
	              'stroke': '#ced5d4',
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
	        label: style.label || {},
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
	              fill: style.dropDown.normal.fill,
	              stroke: style.dropDown.normal.stroke,
	              radius: style.dropDown.normal.radius
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
	          style: style.label
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
	          return 'data-aggregator';
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
	          toolbar.draw(x, y, group);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWFmMTE1OGEwNjhmNTA0OTk3YWQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9mY3RzLWV4dC1hZ2dyZWdhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7O0FBRUE7QUFDQSw2RUFBNEUsT0FBTztBQUNuRixJQUFHO0FBQ0gsRUFBQzs7Ozs7OztBQ3JCRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixPQUFPO0FBQ3hCLG1CQUFrQixPQUFPO0FBQ3pCLG1CQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdEQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQSx3REFBdUQsVUFBVTtBQUNqRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGlDQUFnQztBQUNoQztBQUNBLGtHQUFpRztBQUNqRztBQUNBLFVBQVM7QUFDVDtBQUNBLDBGQUF5RjtBQUN6RjtBQUNBLFVBQVM7QUFDVDtBQUNBLHdHQUF1RztBQUN2RztBQUNBLFVBQVM7QUFDVDtBQUNBLGtFQUFpRTtBQUNqRTtBQUNBLFVBQVM7QUFDVDtBQUNBLHdFQUF1RTtBQUN2RTtBQUNBLFVBQVM7QUFDVDtBQUNBLHdFQUF1RTtBQUN2RTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQLGtHQUFpRztBQUNqRztBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7O0FBRUEsNEZBQTJGO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQSxnR0FBK0Y7QUFDL0Y7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGdCQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsZ0JBQWU7QUFDZixjQUFhO0FBQ2IsWUFBVztBQUNYLFVBQVM7QUFDVCxRQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZmN0cy1leHQtZGF0YWFnZ3JlZ2F0b3ItZXM2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNWFmMTE1OGEwNjhmNTA0OTk3YWQiLCIndXNlIHN0cmljdCc7XG5jb25zdCBBZ2dyZWdhdG9yR2V0dGVyID0gcmVxdWlyZSgnLi9mY3RzLWV4dC1hZ2dyZWdhdG9yJyk7XG5cbjsoZnVuY3Rpb24gKGVudiwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGVudi5kb2N1bWVudFxuICAgICAgID8gZmFjdG9yeShlbnYpIDogZnVuY3Rpb24gKHdpbikge1xuICAgICAgICAgaWYgKCF3aW4uZG9jdW1lbnQpIHtcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaW5kb3cgd2l0aCBkb2N1bWVudCBub3QgcHJlc2VudCcpO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIGZhY3Rvcnkod2luLCB0cnVlKTtcbiAgICAgICB9O1xuICB9IGVsc2Uge1xuICAgIGVudi5BZ2dyZWdhdG9yID0gZmFjdG9yeShlbnYsIHRydWUpO1xuICB9XG59KSh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uIChfd2luZG93LCB3aW5kb3dFeGlzdHMpIHtcbiAgdmFyIEZDID0gX3dpbmRvdy5GdXNpb25DaGFydHM7XG5cbiAgRkMucmVnaXN0ZXIoJ2V4dGVuc2lvbicsIFsncHJpdmF0ZScsICdkYXRhLWFnZ3JlZ2F0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgRkMucmVnaXN0ZXJDb21wb25lbnQoJ2V4dGVuc2lvbnMnLCAnZGF0YS1hZ2dyZWdhdG9yJywgQWdncmVnYXRvckdldHRlcih7RkM6IEZDfSkpO1xuICB9XSk7XG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZGVwKSB7XG4gIC8qKlxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIERhdGEgQWdncmVnYXRvci5cbiAgICovXG4gIGNsYXNzIEFnZ3JlZ2F0b3Ige1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIEFnZ3JlZ2F0b3IuXG4gICAgICogQHR5cGVkZWYge29iamVjdH0gQWdncmVnYXRvci5hZ2dyZWdhdGlvblxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiaW5TaXplIC0gVGhlIGJpblNpemUgYXBwbGllZCB0byBhZ2dyZWdhdGUuXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGFnZ3JlZ2F0aW9uTWV0aG9kIC0gVGhlIG1ldGhvZCBhcHBsaWVkIHRvIGFnZ3JlZ2F0ZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAvKipcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMuYXBwbGllZEFnZ3JlZ2F0aW9uID0ge1xuICAgICAgICBiaW5TaXplOiBudWxsLFxuICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZDogbnVsbFxuICAgICAgfTtcbiAgICAgIHRoaXMuY29uZmlnID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgYmluU2l6ZSwgYWdncmVnYXRpb25NZXRob2QuXG4gICAgICogQHR5cGUge0FnZ3JlZ2F0b3IuYWdncmVnYXRpb259XG4gICAgICovXG4gICAgZ2V0IGFnZ3JlZ2F0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwcGxpZWRBZ2dyZWdhdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgYWdncmVnYXRpb24gKG9iaikge1xuICAgICAgdGhpcy5hcHBsaWVkQWdncmVnYXRpb24udGltZVBlcmlvZCA9IG9iai50aW1lUGVyaW9kO1xuICAgICAgdGhpcy5hcHBsaWVkQWdncmVnYXRpb24udGltZVBlcmlvZE11bHRpcGxpZXIgPSBvYmoudGltZVBlcmlvZE11bHRpcGxpZXI7XG4gICAgICB0aGlzLmFwcGxpZWRBZ2dyZWdhdGlvbi5hZ2dyZWdhdGlvbk1ldGhvZCA9IG9iai5hZ2dyZWdhdGlvbk1ldGhvZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGF2YWlsYWJsZSBhZ2dyZWdhdGlvbiBvcHRpb25zIGluIGNvbmZpZ3VyYXRpb24gb2YgZXh0ZW5zaW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRBdmFpbGFibGVsQWdncmVhZ2F0aW9uICgpIHtcbiAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgZGF0YUFnZyA9IGNvbmZpZy5kYXRhQWdnLFxuICAgICAgICBhdmxUaW1lUGVyaW9kcyA9IGNvbmZpZy5hdmxUaW1lUGVyaW9kcyA9IGRhdGFBZ2cuZ2V0QWdncmVnYXRpb25UaW1lUnVsZXMoKSxcbiAgICAgICAgaSxcbiAgICAgICAgbGVuO1xuXG4gICAgICBjb25maWcuYXZsVGltZU11bHRpcGxpZXIgPSBbXTtcbiAgICAgIGxlbiA9IGF2bFRpbWVQZXJpb2RzLmxlbmd0aDtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbmZpZy5hdmxUaW1lTXVsdGlwbGllci5wdXNoKGF2bFRpbWVQZXJpb2RzW2ldLnBvc3NpYmxlRmFjdG9ycyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB2YWxpZCBhZ2dyZWdhdGlvbiB0aW1lIHBlcmlvZHMgYW5kIGNvcnJlc3BvbmRpbmcgbXVsdGlwbGllcnNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldFZhbGlkQWdncmVnYXRpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBjb25maWcgPSBzZWxmLmNvbmZpZyxcbiAgICAgICAgdHNPYmplY3QgPSBzZWxmLnRzT2JqZWN0LFxuICAgICAgICBkYXRhQWdnID0gY29uZmlnLmRhdGFBZ2csXG4gICAgICAgIGksXG4gICAgICAgIGosXG4gICAgICAgIGxlbjEsXG4gICAgICAgIGxlbjIsXG4gICAgICAgIGF2bFRpbWVQZXJpb2RzLFxuICAgICAgICBhdmxUaW1lTXVsdGlwbGllcixcbiAgICAgICAgbWF4TnVtT2ZQbG90ID0gY29uZmlnLmNvbXBvc2l0aW9uLnJlYWN0aXZlTW9kZWwubW9kZWxbJ21heC1wbG90LXBvaW50J10sXG4gICAgICAgIG11bHRpcGxpZXJzQXJyLFxuICAgICAgICBjdXJyZW50VGltZUxlbmd0aCxcbiAgICAgICAgdGltZVBlcmlvZCxcbiAgICAgICAgdGltZSxcbiAgICAgICAgYmluU2l6ZSxcbiAgICAgICAgbXVsdGlwbGllcixcbiAgICAgICAgbWluQmluU2l6ZTtcblxuICAgICAgY29uZmlnLmN1cnJlbnRUaW1lTGVuZ3RoID0gdHNPYmplY3QuZ2xvYmFsUmVhY3RpdmVNb2RlbC5tb2RlbFsneC1heGlzLXZpc2libGUtcmFuZ2UtZW5kJ10gLVxuICAgICAgICB0c09iamVjdC5nbG9iYWxSZWFjdGl2ZU1vZGVsLm1vZGVsWyd4LWF4aXMtdmlzaWJsZS1yYW5nZS1zdGFydCddO1xuXG4gICAgICBhdmxUaW1lUGVyaW9kcyA9IGNvbmZpZy5hdmxUaW1lUGVyaW9kcztcbiAgICAgIGF2bFRpbWVNdWx0aXBsaWVyID0gY29uZmlnLmF2bFRpbWVNdWx0aXBsaWVyO1xuICAgICAgY3VycmVudFRpbWVMZW5ndGggPSBjb25maWcuY3VycmVudFRpbWVMZW5ndGg7XG5cbiAgICAgIGNvbmZpZy5taW5CaW5TaXplID0gbWluQmluU2l6ZSA9IGN1cnJlbnRUaW1lTGVuZ3RoIC8gbWF4TnVtT2ZQbG90O1xuXG4gICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kID0gW107XG4gICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciA9IFtdO1xuICAgICAgY29uZmlnLmF2bEFnZ01ldGhvZHMgPSBkYXRhQWdnLmdldEFsbEFnZ3JlZ2F0aW9uTWV0aG9kKCk7XG5cbiAgICAgIGZvciAoaSA9IDAsIGxlbjEgPSBhdmxUaW1lUGVyaW9kcy5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgICAgdGltZVBlcmlvZCA9IGF2bFRpbWVQZXJpb2RzW2ldLm5hbWU7XG4gICAgICAgIHRpbWUgPSBhdmxUaW1lUGVyaW9kc1tpXS5pbnRlcnZhbDtcbiAgICAgICAgbXVsdGlwbGllcnNBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGogPSAwLCBsZW4yID0gYXZsVGltZU11bHRpcGxpZXJbaV0ubGVuZ3RoOyBqIDwgbGVuMjsgaisrKSB7XG4gICAgICAgICAgbXVsdGlwbGllciA9IGF2bFRpbWVNdWx0aXBsaWVyW2ldW2pdO1xuICAgICAgICAgIGJpblNpemUgPSBtdWx0aXBsaWVyICogdGltZTtcblxuICAgICAgICAgIGlmICgoYmluU2l6ZSA+PSBtaW5CaW5TaXplKSkge1xuICAgICAgICAgICAgbXVsdGlwbGllcnNBcnIucHVzaChhdmxUaW1lTXVsdGlwbGllcltpXVtqXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtdWx0aXBsaWVyc0Fyci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uZmlnLnZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXIucHVzaChtdWx0aXBsaWVyc0Fycik7XG4gICAgICAgICAgY29uZmlnLnZhbGlkVGltZVBlcmlvZC5wdXNoKHRpbWVQZXJpb2QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBjdXJyZW50IEFnZ3JlZ2F0aW9uIGFwcGxpZWQgdG8gdGltZXNlcmllc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0Q3VycmVudEFnZ3JlYXRpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBjb25maWcgPSBzZWxmLmNvbmZpZyxcbiAgICAgICAgZGF0YUFnZyA9IGNvbmZpZy5kYXRhQWdnLFxuICAgICAgICBjb21wb3NpdGlvbiA9IGNvbmZpZy5jb21wb3NpdGlvbixcbiAgICAgICAgbW9kZWwgPSBjb21wb3NpdGlvbi5yZWFjdGl2ZU1vZGVsLFxuICAgICAgICBjdXJyZW50QWdnTWV0aG9kLFxuICAgICAgICBzdWl0YWJsZUludGVydmFsLFxuICAgICAgICBiaW5TaXplO1xuXG4gICAgICBiaW5TaXplID0gbW9kZWwucHJvcCgnYmluLXNpemUnKSAtIDE7XG5cbiAgICAgIGlmIChpc0Zpbml0ZShiaW5TaXplKSkge1xuICAgICAgICBjb25maWcuY2FuQWdncmVnYXRlID0gdHJ1ZTtcbiAgICAgICAgc3VpdGFibGVJbnRlcnZhbCA9IGRhdGFBZ2cudGltZVJ1bGVzLmdldFN1aXRhYmxlSW50ZXJ2YWwoYmluU2l6ZSk7XG4gICAgICAgIGN1cnJlbnRBZ2dNZXRob2QgPSBtb2RlbC5wcm9wKCdhZ2dyZWdhdGlvbi1mbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlnLmNhbkFnZ3JlZ2F0ZSA9IGZhbHNlO1xuICAgICAgICBzdWl0YWJsZUludGVydmFsID0ge1xuICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgIHN0ZXA6ICcnXG4gICAgICAgIH07XG4gICAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2QgPSBbc3VpdGFibGVJbnRlcnZhbC5uYW1lXTtcbiAgICAgICAgY29uZmlnLnZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXIgPSBbW3N1aXRhYmxlSW50ZXJ2YWwuc3RlcF1dO1xuICAgICAgICBjb25maWcuYXZsQWdnTWV0aG9kcyA9IHtcbiAgICAgICAgICAnaW52YWxpZCc6IHtcbiAgICAgICAgICAgIGZvcm1hbE5hbWU6ICcnLFxuICAgICAgICAgICAgbmlja05hbWU6ICcnXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjdXJyZW50QWdnTWV0aG9kID0gY29uZmlnLmF2bEFnZ01ldGhvZHNbJ2ludmFsaWQnXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGltZVBlcmlvZDogc3VpdGFibGVJbnRlcnZhbC5uYW1lLFxuICAgICAgICB0aW1lUGVyaW9kTXVsdGlwbGllcjogc3VpdGFibGVJbnRlcnZhbC5zdGVwLFxuICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZDoge1xuICAgICAgICAgIHZhbHVlOiBjdXJyZW50QWdnTWV0aG9kLm5pY2tOYW1lLFxuICAgICAgICAgIHRleHQ6IGN1cnJlbnRBZ2dNZXRob2QuZm9ybWFsTmFtZVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGluaXQgKHJlcXVpcmUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXG4gICAgICAgIHRvb2xib3hDb21wb25lbnQgPSBjb25maWcudG9vbGJveENvbXBvbmVudCA9IHt9LFxuICAgICAgICBhcGksXG4gICAgICAgIHN0b3JlLFxuICAgICAgICBjb21wb3NpdGlvbixcbiAgICAgICAgc2F2ZVRvID0gJ3RzT2JqZWN0JyxcbiAgICAgICAgcmVxdWlyZWRQYXJhbXMgPSBbXG4gICAgICAgICAgJ2dyYXBoaWNzJyxcbiAgICAgICAgICAnZ2xvYmFsUmVhY3RpdmVNb2RlbCcsXG4gICAgICAgICAgJ2NoYXJ0JyxcbiAgICAgICAgICAnc3BhY2VNYW5hZ2VySW5zdGFuY2UnLFxuICAgICAgICAgICdjaGFydEluc3RhbmNlJyxcbiAgICAgICAgICAnc21hcnRMYWJlbCcsXG4gICAgICAgICAgZnVuY3Rpb24gYWNxdWlyZSAoKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDAsXG4gICAgICAgICAgICAgIGlpID0gcmVxdWlyZWRQYXJhbXMubGVuZ3RoIC0gMSxcbiAgICAgICAgICAgICAgcGFyYW0gPSAnJztcbiAgICAgICAgICAgIHNlbGZbc2F2ZVRvXSA9IHNlbGZbc2F2ZVRvXSB8fCB7fTtcbiAgICAgICAgICAgIHNlbGYucmVxdWlyZWRQYXJhbXMgPSB7fTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgICAgICAgIHBhcmFtID0gcmVxdWlyZWRQYXJhbXNbaV07XG4gICAgICAgICAgICAgIHNlbGZbc2F2ZVRvXVtwYXJhbV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgcmVxdWlyZShyZXF1aXJlZFBhcmFtcyk7XG5cbiAgICAgIGFwaSA9IHNlbGYudHNPYmplY3QuY2hhcnRJbnN0YW5jZS5hcGlJbnN0YW5jZTtcbiAgICAgIHN0b3JlID0gYXBpLmdldENvbXBvbmVudFN0b3JlKCk7XG4gICAgICBjb25maWcuY29tcG9zaXRpb24gPSBjb21wb3NpdGlvbiA9IHN0b3JlLmdldENhbnZhc0J5SW5kZXgoMCkuY29tcG9zaXRpb247XG4gICAgICBjb25maWcuZGF0YUFnZyA9IGNvbXBvc2l0aW9uLmltcGwuZ2V0RGF0YUFnZ3JlZ2F0b3IoKTtcblxuICAgICAgdG9vbGJveENvbXBvbmVudC50b29sYm94ID0gZGVwLkZDLmdldENvbXBvbmVudCgnYXBpJywgJ3Rvb2xib3gnKTtcbiAgICAgIHRvb2xib3hDb21wb25lbnQuY29uZmlnID0ge307XG5cbiAgICAgIHNlbGYudG9vbGJhcnMgPSBbXTtcblxuICAgICAgc2VsZi5tZWFzdXJlbWVudCA9IHt9O1xuXG4gICAgICBzZWxmLnRvb2xiYXJzLnB1c2goc2VsZi5jcmVhdGVUb29sYmFyKCkpO1xuXG4gICAgICB3aW5kb3cuQWdncmVnYXRvciA9IHNlbGY7XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdG9vbGJhciBjb21wb25lbnRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjcmVhdGVUb29sYmFyICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZ3JvdXAxLFxuICAgICAgICBncm91cDIsXG4gICAgICAgIGdyb3VwMyxcbiAgICAgICAgdG9vbGJhcixcbiAgICAgICAgdGltZU11bFNlbGVjdE1lbnUsXG4gICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LFxuICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LFxuICAgICAgICByZXNldEJ1dHRvbixcbiAgICAgICAgYXBwbHlCdXR0b24sXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICB0c09iamVjdCA9IHNlbGYudHNPYmplY3QsXG4gICAgICAgIGxhYmVsLFxuXG4gICAgICAgIHRvb2xib3hDb21wb25lbnQgPSBjb25maWcudG9vbGJveENvbXBvbmVudCxcbiAgICAgICAgdG9vbGJveCA9IHRvb2xib3hDb21wb25lbnQudG9vbGJveCxcbiAgICAgICAgdG9vbGJveENvbXBDb25maWcgPSB0b29sYm94Q29tcG9uZW50LmNvbmZpZyxcbiAgICAgICAgSG9yaXpvbnRhbFRvb2xiYXIgPSB0b29sYm94Lkhvcml6b250YWxUb29sYmFyLFxuICAgICAgICBDb21wb25lbnRHcm91cCA9IHRvb2xib3guQ29tcG9uZW50R3JvdXAsXG4gICAgICAgIFN5bWJvbFN0b3JlID0gdG9vbGJveC5TeW1ib2xTdG9yZSxcblxuICAgICAgICBncmFwaGljcyA9IHRzT2JqZWN0LmdyYXBoaWNzLFxuICAgICAgICBwYXBlciA9IGdyYXBoaWNzLnBhcGVyLFxuICAgICAgICBjb250YWluZXIgPSBncmFwaGljcy5jb250YWluZXIsXG4gICAgICAgIGNoYXJ0ID0gdHNPYmplY3QuY2hhcnQsXG4gICAgICAgIHNtYXJ0TGFiZWwgPSB0c09iamVjdC5zbWFydExhYmVsLFxuXG4gICAgICAgIG11bHRpcGxpZXJWYWwsXG4gICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0LFxuICAgICAgICB0aW1lUGVyaW9kTWVudURpc2FibGVDb25maWcsXG4gICAgICAgIHRpbWVNdWx0aXBsaWVyTWVudURpc2FibGVDb25maWcsXG4gICAgICAgIGFnZ01ldGhvZE1lbnVEaXNhYmxlb25maWcsXG4gICAgICAgIGRyb3BEb3duTWVudVN0eWxlLFxuICAgICAgICBhcHBseUJ1dHRvbkRpc2FibGVDb25maWcsXG4gICAgICAgIHJlc2V0QnV0dG9uRGlzYWJsZUNvbmZpZyxcblxuICAgICAgICBzdHlsZSxcblxuICAgICAgICBkZXBlbmRlbmNpZXMgPSB7XG4gICAgICAgICAgcGFwZXI6IHBhcGVyLFxuICAgICAgICAgIGNoYXJ0OiBjaGFydCxcbiAgICAgICAgICBzbWFydExhYmVsOiBzbWFydExhYmVsLFxuICAgICAgICAgIGNoYXJ0Q29udGFpbmVyOiBjb250YWluZXJcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGx5IG9yIFJlc2V0IEFnZ3JlZ2F0aW9uIGFwcGxpZWQgdGhyb3VnaCBleHRlbnNpb24gaW4gdGltZXNlcmllc1xuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2V0IC0gRmxhZyB0byBzZXQgb3IgcmVzZXQuICcxJyB0byBzZXQsICcwJyB0byByZXNldFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgYXBwbHkgPSAoc2V0KSA9PiB7XG4gICAgICAgICAgdmFyIG1vZGVsID0gY29uZmlnLmNvbXBvc2l0aW9uLnJlYWN0aXZlTW9kZWwsXG4gICAgICAgICAgICB0aW1lUGVyaW9kVmFsID0gdGltZVBlcmlvZFNlbGVjdE1lbnUudmFsdWUoKSxcbiAgICAgICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsID0gdGltZU11bFNlbGVjdE1lbnUudmFsdWUoKSxcbiAgICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnVWYWwgPSBhZ2dNZXRob2RTZWxlY3RNZW51LnZhbHVlKCksXG4gICAgICAgICAgICBrZXlzLFxuICAgICAgICAgICAgYmluU2l6ZSxcbiAgICAgICAgICAgIHRpbWVJbnRlcnZhbCxcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uID0gc2VsZi5hZ2dyZWdhdGlvbixcbiAgICAgICAgICAgIGNhbnZhcyA9IGNvbmZpZy5jb21wb3NpdGlvbi5pbXBsO1xuXG4gICAgICAgICAgZm9yIChrZXlzIG9mIGNvbmZpZy5hdmxUaW1lUGVyaW9kcykge1xuICAgICAgICAgICAgaWYgKGtleXMubmFtZSA9PT0gdGltZVBlcmlvZFZhbCkge1xuICAgICAgICAgICAgICB0aW1lSW50ZXJ2YWwgPSBrZXlzLmludGVydmFsO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYmluU2l6ZSA9IHRpbWVJbnRlcnZhbCAqIE51bWJlcih0aW1lUGVyaW9kTXVsdGlwbGllclZhbCk7XG4gICAgICAgICAgaWYgKHNldCAmJiBpc0Zpbml0ZShtb2RlbC5wcm9wKCdiaW4tc2l6ZScpKSkge1xuICAgICAgICAgICAgbW9kZWxcbiAgICAgICAgICAgICAgLmxvY2soKVxuICAgICAgICAgICAgICAucHJvcCgnYmluLXNpemUtZXh0JywgYmluU2l6ZSlcbiAgICAgICAgICAgICAgLnByb3AoJ2FnZ3JlZ2F0aW9uLWZuLWV4dCcsIGNvbmZpZy5hdmxBZ2dNZXRob2RzW2FnZ01ldGhvZFNlbGVjdE1lbnVWYWxdKVxuICAgICAgICAgICAgICAudW5sb2NrKCk7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbi5iaW5TaXplID0gYmluU2l6ZTtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmFnZ3JlZ2F0aW9uTWV0aG9kID0gYWdnTWV0aG9kU2VsZWN0TWVudVZhbDtcbiAgICAgICAgICAgIGFwcGx5QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMucmVzZXRBZ2dyZWdhdGlvbigpO1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYmluU2l6ZSA9IG51bGw7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbi5hZ2dyZWdhdGlvbk1ldGhvZCA9IG51bGw7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHZhbGlkIHRpbWUgbXVsdGlwbGllciBvbiB0aW1lIHBlcmlvZCBjaGFuZ2UgZnJvbSBleHRlbnNpb24gdG9vbGJveFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGltZVBlcmlvZE9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgIHZhciB0aW1lUGVyaW9kVmFsID0gdGltZVBlcmlvZFNlbGVjdE1lbnUudmFsdWUoKSxcbiAgICAgICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsID0gdGltZU11bFNlbGVjdE1lbnUudmFsdWUoKSxcbiAgICAgICAgICAgIHByZXZUaW1lUGVyb2lkTXVsVmFsID0gdGltZVBlcmlvZE11bHRpcGxpZXJWYWwsXG4gICAgICAgICAgICB2YWxpZFRpbWVQZXJpb2QgPSBjb25maWcudmFsaWRUaW1lUGVyaW9kLFxuICAgICAgICAgICAgdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciA9IGNvbmZpZy52YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyLFxuICAgICAgICAgICAgaW5kZXhPZlRpbWVVbml0LFxuICAgICAgICAgICAgaW5kZXhPZlRpbWVNdWw7XG5cbiAgICAgICAgICBpbmRleE9mVGltZVVuaXQgPSB2YWxpZFRpbWVQZXJpb2QuaW5kZXhPZih0aW1lUGVyaW9kVmFsKTtcbiAgICAgICAgICBpbmRleE9mVGltZU11bCA9IHZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXJbaW5kZXhPZlRpbWVVbml0XS5pbmRleE9mKE51bWJlcih0aW1lUGVyaW9kTXVsdGlwbGllclZhbCkpO1xuXG4gICAgICAgICAgdGltZU11bFNlbGVjdE1lbnVPcHQgPSBbXTtcbiAgICAgICAgICBmb3IgKG11bHRpcGxpZXJWYWwgb2YgdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcltpbmRleE9mVGltZVVuaXRdKSB7XG4gICAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdC5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogbXVsdGlwbGllclZhbC50b1N0cmluZygpLFxuICAgICAgICAgICAgICB2YWx1ZTogbXVsdGlwbGllclZhbC50b1N0cmluZygpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS51cGRhdGVMaXN0KHRpbWVNdWxTZWxlY3RNZW51T3B0KTtcblxuICAgICAgICAgIGlmIChpbmRleE9mVGltZU11bCA8IDApIHtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnZhbHVlKHZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXJbaW5kZXhPZlRpbWVVbml0XVswXS50b1N0cmluZygpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudmFsdWUocHJldlRpbWVQZXJvaWRNdWxWYWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyBzdGF0ZSBvZiBhcHBseUJ1dHRvbihhY3RpdmUvaW5hY3RpdmUpIG9uIGNoYW5nZSBpbiB2YWx1ZSBpbiB0b29sYm94XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZSA9ICh0eXBlKSA9PiB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRBZ2cgPSBzZWxmLmdldEN1cnJlbnRBZ2dyZWF0aW9uKCk7XG5cbiAgICAgICAgICBpZiAoY3VycmVudEFnZy50aW1lUGVyaW9kTXVsdGlwbGllci50b1N0cmluZygpICE9PSB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSgpIHx8XG4gICAgICAgICAgICBjdXJyZW50QWdnLnRpbWVQZXJpb2QgIT09IHRpbWVQZXJpb2RTZWxlY3RNZW51LnZhbHVlKCkgfHxcbiAgICAgICAgICAgIGN1cnJlbnRBZ2cuYWdncmVnYXRpb25NZXRob2QudmFsdWUgIT09IGFnZ01ldGhvZFNlbGVjdE1lbnUudmFsdWUoKSkge1xuICAgICAgICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdlbmFibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFwcGx5QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIGdyb3VwMSA9IG5ldyBDb21wb25lbnRHcm91cChkZXBlbmRlbmNpZXMpO1xuICAgICAgZ3JvdXAyID0gbmV3IENvbXBvbmVudEdyb3VwKGRlcGVuZGVuY2llcyk7XG4gICAgICBncm91cDMgPSBuZXcgQ29tcG9uZW50R3JvdXAoZGVwZW5kZW5jaWVzKTtcblxuICAgICAgdG9vbGJhciA9IG5ldyBIb3Jpem9udGFsVG9vbGJhcihkZXBlbmRlbmNpZXMpO1xuXG4gICAgICBjb25maWcudXNyQ29uZmlnID0ge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBwb3NXcnRDYW52YXM6ICd0b3AnLFxuICAgICAgICBhbGlnbm1lbnQ6ICdsZWZ0JyxcbiAgICAgICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyxcbiAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICdmb250LXNpemUnOiAnMTMnLFxuICAgICAgICAgICAgJ2ZpbGwnOiAnIzY5Njk2OSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZDoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyM2OTY5NjknLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjOGNlY2QnLFxuICAgICAgICAgICAgICAnc3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2UnOiAnIzFlMWYxZicsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3JhZGl1cyc6IDEsXG4gICAgICAgICAgICAgICd3aWR0aCc6IDQ1LFxuICAgICAgICAgICAgICAnaGVpZ2h0JzogMjJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2NlZDVkNCcsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpbWVQZXJpb2RJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzY5Njk2OScsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZSc6ICcjMWUxZjFmJyxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAncmFkaXVzJzogMSxcbiAgICAgICAgICAgICAgJ3dpZHRoJzogNzUsXG4gICAgICAgICAgICAgICdoZWlnaHQnOiAyMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjY2VkNWQ0JyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjMDAwJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzY5Njk2OScsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZSc6ICcjMWUxZjFmJyxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAncmFkaXVzJzogMSxcbiAgICAgICAgICAgICAgJ3dpZHRoJzogMTAwLFxuICAgICAgICAgICAgICAnaGVpZ2h0JzogMjJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2NlZDVkNCcsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRyb3BEb3duOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnIzg5OGI4YicsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2ZmZidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBub3JtYWw6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnIzg5OGI4YicsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAyLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnLFxuICAgICAgICAgICAgICAnaG92ZXJGaWxsJzogJyNlNmU4ZTgnLFxuICAgICAgICAgICAgICAnaG92ZXJMYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFwcGx5QnV0dG9uOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnIzU1NScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMycsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2NlZDVkNCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlckZpbGwnOiAnIzU1NScsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJycsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiA1NCxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2JlYmViZScsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjZWQ1ZDQnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyNmM2YzZjMnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldEJ1dHRvbjoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyM4OThiOGInLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyNmM2YzZjMnLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjZWQ1ZDQnLFxuICAgICAgICAgICAgICAnc3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnaG92ZXJGaWxsJzogJyM4OThiOGInLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZSc6ICcnLFxuICAgICAgICAgICAgICAncmFkaXVzJzogMSxcbiAgICAgICAgICAgICAgJ3dpZHRoJzogNTQsXG4gICAgICAgICAgICAgICdoZWlnaHQnOiAyMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNiZWJlYmUnLFxuICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjY2VkNWQ0JyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjZjNmM2YzJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmFzZToge1xuICAgICAgICAgICAgZm9udDoge1xuICAgICAgICAgICAgICAnZm9udFNpemUnOiAxMVxuICAgICAgICAgICAgICAvLyAnZm9udFdlaWdodCc6ICdib2xkJyxcbiAgICAgICAgICAgICAgLy8gJ2ZvbnRGYW1pbHknOiAnc2Fucy1zZXJpZicsXG4gICAgICAgICAgICAgIC8vICdmb250U3R5bGUnOiAnaXRhbGljJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc3R5bGUgPSBjb25maWcudXNyQ29uZmlnLnN0eWxlcyB8fCB7fTtcblxuICAgICAgc3R5bGUgPSB7XG4gICAgICAgIGxhYmVsOiBzdHlsZS5sYWJlbCB8fCB7fSxcbiAgICAgICAgdGltZU11bHRpcGxpZXJJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkICYmIHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZC5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIGluYWN0aXZlOiAoc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkICYmIHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZC5pbmFjdGl2ZSkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgdGltZVBlcmlvZElucHV0RmllbGQ6IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZCAmJiBzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZC5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIGluYWN0aXZlOiAoc3R5bGUudGltZVBlcmlvZElucHV0RmllbGQgJiYgc3R5bGUudGltZVBlcmlvZElucHV0RmllbGQuaW5hY3RpdmUpIHx8IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZDoge1xuICAgICAgICAgIGFjdGl2ZTogKHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZCAmJiBzdHlsZS5hZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQuYWN0aXZlKSB8fCB7fSxcbiAgICAgICAgICBpbmFjdGl2ZTogKHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZCAmJiBzdHlsZS5hZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQuaW5hY3RpdmUpIHx8IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGRyb3BEb3duOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUuZHJvcERvd24gJiYgc3R5bGUuZHJvcERvd24uYWN0aXZlKSB8fCB7fSxcbiAgICAgICAgICBub3JtYWw6IChzdHlsZS5kcm9wRG93biAmJiBzdHlsZS5kcm9wRG93bi5ub3JtYWwpIHx8IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGFwcGx5QnV0dG9uOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUuYXBwbHlCdXR0b24gJiYgc3R5bGUuYXBwbHlCdXR0b24uYWN0aXZlKSB8fCB7fSxcbiAgICAgICAgICBpbmFjdGl2ZTogKHN0eWxlLmFwcGx5QnV0dG9uICYmIHN0eWxlLmFwcGx5QnV0dG9uLmluYWN0aXZlKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICByZXNldEJ1dHRvbjoge1xuICAgICAgICAgIGFjdGl2ZTogKHN0eWxlLnJlc2V0QnV0dG9uICYmIHN0eWxlLnJlc2V0QnV0dG9uLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgaW5hY3RpdmU6IChzdHlsZS5yZXNldEJ1dHRvbiAmJiBzdHlsZS5yZXNldEJ1dHRvbi5pbmFjdGl2ZSkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgYmFzZToge1xuICAgICAgICAgIGZvbnQ6IChzdHlsZS5iYXNlICYmIHN0eWxlLmJhc2UuZm9udCkgfHwge31cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZ3JvdXAxLnNldENvbmZpZyh7XG4gICAgICAgIGZpbGw6ICcjZmZmJyxcbiAgICAgICAgYm9yZGVyVGhpY2tuZXNzOiAwXG4gICAgICB9KTtcbiAgICAgIGdyb3VwMi5zZXRDb25maWcoe1xuICAgICAgICBmaWxsOiAnI2ZmZicsXG4gICAgICAgIGJvcmRlclRoaWNrbmVzczogMFxuICAgICAgfSk7XG4gICAgICBncm91cDMuc2V0Q29uZmlnKHtcbiAgICAgICAgZmlsbDogJyNmZmYnLFxuICAgICAgICBib3JkZXJUaGlja25lc3M6IDBcbiAgICAgIH0pO1xuXG4gICAgICB0b29sYmFyLnNldENvbmZpZyh7XG4gICAgICAgIGZpbGw6ICcjZmZmJyxcbiAgICAgICAgYm9yZGVyVGhpY2tuZXNzOiAwXG4gICAgICB9KTtcblxuICAgICAgdGltZVBlcmlvZE1lbnVEaXNhYmxlQ29uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZC5pbmFjdGl2ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGltZU11bHRpcGxpZXJNZW51RGlzYWJsZUNvbmZpZyA9IHtcbiAgICAgICAgZGlzYWJsZWQ6IHtcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZC5pbmFjdGl2ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgYWdnTWV0aG9kTWVudURpc2FibGVvbmZpZyA9IHtcbiAgICAgICAgZGlzYWJsZWQ6IHtcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBzdHlsZS5hZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQuaW5hY3RpdmVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGFwcGx5QnV0dG9uRGlzYWJsZUNvbmZpZyA9IHtcbiAgICAgICAgZGlzYWJsZWQ6IHtcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBzdHlsZS5hcHBseUJ1dHRvbi5pbmFjdGl2ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmVzZXRCdXR0b25EaXNhYmxlQ29uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLnJlc2V0QnV0dG9uLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBkcm9wRG93bk1lbnVTdHlsZSA9IHtcbiAgICAgICAgc2VsZWN0ZWQ6IHtcbiAgICAgICAgICBjb250YWluZXI6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLmFjdGl2ZS5maWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5hY3RpdmUubGFiZWxGaWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBub3JtYWw6IHtcbiAgICAgICAgICBjb250YWluZXI6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5maWxsLFxuICAgICAgICAgICAgICBzdHJva2U6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5zdHJva2UsXG4gICAgICAgICAgICAgIHJhZGl1czogc3R5bGUuZHJvcERvd24ubm9ybWFsLnJhZGl1c1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgZmlsbDogc3R5bGUuZHJvcERvd24ubm9ybWFsLmxhYmVsRmlsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICBjb250YWluZXI6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5ob3ZlckZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5ob3ZlckxhYmVsRmlsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgbGFiZWwgPSBuZXcgdG9vbGJveC5MYWJlbCgnQWdncmVnYXRlIERhdGE6JywgZGVwZW5kZW5jaWVzLCB7XG4gICAgICAgIHRleHQ6IHtcbiAgICAgICAgICBzdHlsZTogc3R5bGUubGFiZWxcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLnRpbWVQZXJpb2RTZWxlY3RNZW51ID0gdGltZVBlcmlvZFNlbGVjdE1lbnUgPSBuZXcgdG9vbGJveC5TZWxlY3RTeW1ib2woe30sIGRlcGVuZGVuY2llcywgW10sXG4gICAgICBPYmplY3QuYXNzaWduKHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkLmFjdGl2ZSwge1xuICAgICAgICBidG5UZXh0U3R5bGU6IHN0eWxlLmJhc2UuZm9udCxcbiAgICAgICAgZHJvcERvd25NZW51OiBkcm9wRG93bk1lbnVTdHlsZVxuICAgICAgfSkpO1xuICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUuc2V0U3RhdGVDb25maWcodGltZVBlcmlvZE1lbnVEaXNhYmxlQ29uZmlnKTtcblxuICAgICAgdG9vbGJveENvbXBDb25maWcudGltZU11bFNlbGVjdE1lbnUgPSB0aW1lTXVsU2VsZWN0TWVudSA9IG5ldyB0b29sYm94LlNlbGVjdFN5bWJvbCh7fSwgZGVwZW5kZW5jaWVzLCBbXSxcbiAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkLmFjdGl2ZSwge1xuICAgICAgICBidG5UZXh0U3R5bGU6IHN0eWxlLmJhc2UuZm9udCxcbiAgICAgICAgZHJvcERvd25NZW51OiBkcm9wRG93bk1lbnVTdHlsZVxuICAgICAgfSkpO1xuICAgICAgdGltZU11bFNlbGVjdE1lbnUuc2V0U3RhdGVDb25maWcodGltZU11bHRpcGxpZXJNZW51RGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLmFnZ01ldGhvZFNlbGVjdE1lbnUgPSBhZ2dNZXRob2RTZWxlY3RNZW51ID0gbmV3IHRvb2xib3guU2VsZWN0U3ltYm9sKHt9LCBkZXBlbmRlbmNpZXMsIFtdLFxuICAgICAgT2JqZWN0LmFzc2lnbihzdHlsZS5hZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQuYWN0aXZlLCB7XG4gICAgICAgIGJ0blRleHRTdHlsZTogc3R5bGUuYmFzZS5mb250LFxuICAgICAgICBkcm9wRG93bk1lbnU6IGRyb3BEb3duTWVudVN0eWxlXG4gICAgICB9KSk7XG4gICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LnNldFN0YXRlQ29uZmlnKGFnZ01ldGhvZE1lbnVEaXNhYmxlb25maWcpO1xuXG4gICAgICB0b29sYm94Q29tcENvbmZpZy5hcHBseUJ1dHRvbiA9IGFwcGx5QnV0dG9uID0gbmV3IHRvb2xib3guU3ltYm9sKCdBUFBMWScsIHRydWUsIGRlcGVuZGVuY2llcyxcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzdHlsZS5hcHBseUJ1dHRvbi5hY3RpdmUsIHtcbiAgICAgICAgICBidG5UZXh0U3R5bGU6IHN0eWxlLmJhc2UuZm9udFxuICAgICAgICB9KSlcbiAgICAgICAgLmF0dGFjaEV2ZW50SGFuZGxlcnMoe1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhcHBseSgxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgYXBwbHlCdXR0b24uc2V0U3RhdGVDb25maWcoYXBwbHlCdXR0b25EaXNhYmxlQ29uZmlnKTtcblxuICAgICAgdG9vbGJveENvbXBDb25maWcucmVzZXRCdXR0b24gPSByZXNldEJ1dHRvbiA9IG5ldyB0b29sYm94LlN5bWJvbCgnUkVTRVQnLCB0cnVlLCBkZXBlbmRlbmNpZXMsXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUucmVzZXRCdXR0b24uYWN0aXZlLCB7XG4gICAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnRcbiAgICAgICAgfSkpXG4gICAgICAgIC5hdHRhY2hFdmVudEhhbmRsZXJzKHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXBwbHkoMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIHJlc2V0QnV0dG9uLnNldFN0YXRlQ29uZmlnKHJlc2V0QnV0dG9uRGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIGdyb3VwMS5hZGRTeW1ib2wobGFiZWwpO1xuICAgICAgZ3JvdXAyLmFkZFN5bWJvbCh0aW1lTXVsU2VsZWN0TWVudSk7XG4gICAgICBncm91cDIuYWRkU3ltYm9sKHRpbWVQZXJpb2RTZWxlY3RNZW51KTtcbiAgICAgIGdyb3VwMi5hZGRTeW1ib2woYWdnTWV0aG9kU2VsZWN0TWVudSk7XG4gICAgICBncm91cDMuYWRkU3ltYm9sKGFwcGx5QnV0dG9uKTtcbiAgICAgIGdyb3VwMy5hZGRTeW1ib2wocmVzZXRCdXR0b24pO1xuXG4gICAgICBTeW1ib2xTdG9yZS5yZWdpc3RlcigndGV4dEJveEljb24nLCBmdW5jdGlvbiAoeCwgeSwgcmFkLCB3LCBoLCBwYWRYLCBwYWRZKSB7XG4gICAgICAgIHZhciB4MSA9IHggLSB3IC8gMiArIHBhZFggLyAyLFxuICAgICAgICAgIHgyID0geCArIHcgLyAyIC0gcGFkWCAvIDIsXG4gICAgICAgICAgeTEgPSB5IC0gaCAvIDIgKyBwYWRZIC8gMixcbiAgICAgICAgICB5MiA9IHkgKyBoIC8gMiAtIHBhZFkgLyAyO1xuXG4gICAgICAgIHJldHVybiBbJ00nLCB4MSwgeTEsICdMJywgeDIsIHkxLCAnTCcsIHgyLCB5MiwgJ0wnLCB4MSwgeTIsICdaJ107XG4gICAgICB9KTtcblxuICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgIHRleHRPbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRpbWVQZXJpb2RPbkNoYW5nZSgpO1xuICAgICAgICAgIG9uQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aW1lTXVsU2VsZWN0TWVudS5hdHRhY2hFdmVudEhhbmRsZXJzKHtcbiAgICAgICAgdGV4dE9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgb25DaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnUuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgIHRleHRPbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG9uQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0b29sYmFyLmFkZENvbXBvbmVudChncm91cDEpO1xuICAgICAgdG9vbGJhci5hZGRDb21wb25lbnQoZ3JvdXAyKTtcbiAgICAgIHRvb2xiYXIuYWRkQ29tcG9uZW50KGdyb3VwMyk7XG5cbiAgICAgIHJldHVybiB0b29sYmFyO1xuICAgIH1cblxuICAgIGdldExvZ2ljYWxTcGFjZSAoYXZhaWxhYmxlV2lkdGgsIGF2YWlsYWJsZUhlaWdodCkge1xuICAgICAgdmFyIGxvZ2ljYWxTcGFjZSxcbiAgICAgICAgd2lkdGggPSAwLFxuICAgICAgICBoZWlnaHQgPSAwLFxuICAgICAgICBpLFxuICAgICAgICBsbjtcblxuICAgICAgZm9yIChpID0gMCwgbG4gPSB0aGlzLnRvb2xiYXJzLmxlbmd0aDsgaSA8IGxuOyBpKyspIHtcbiAgICAgICAgbG9naWNhbFNwYWNlID0gdGhpcy50b29sYmFyc1tpXS5nZXRMb2dpY2FsU3BhY2UoYXZhaWxhYmxlV2lkdGgsIGF2YWlsYWJsZUhlaWdodCk7XG4gICAgICAgIHdpZHRoID0gTWF0aC5tYXgobG9naWNhbFNwYWNlLndpZHRoLCB3aWR0aCk7XG4gICAgICAgIGhlaWdodCArPSBsb2dpY2FsU3BhY2UuaGVpZ2h0O1xuICAgICAgICB0aGlzLnRvb2xiYXJzW2ldLndpZHRoID0gbG9naWNhbFNwYWNlLndpZHRoO1xuICAgICAgICB0aGlzLnRvb2xiYXJzW2ldLmhlaWdodCA9IGxvZ2ljYWxTcGFjZS5oZWlnaHQ7XG4gICAgICB9XG4gICAgICBoZWlnaHQgKz0gdGhpcy5wYWRkaW5nO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBwbGFjZUluQ2FudmFzIChjb250YWluZXJJbnN0YW5jZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICB0c09iamVjdCA9IHNlbGYudHNPYmplY3Q7XG5cbiAgICAgIHNlbGYucGFkZGluZyA9IDU7XG4gICAgICB0c09iamVjdC5zcGFjZU1hbmFnZXJJbnN0YW5jZS5hZGQoW3tcbiAgICAgICAgbmFtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAnZGF0YS1hZ2dyZWdhdG9yJztcbiAgICAgICAgfSxcbiAgICAgICAgcmVmOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgcmV0dXJuIG9ialsnMCddO1xuICAgICAgICB9LFxuICAgICAgICBzZWxmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgIH0sXG4gICAgICAgIHByaW9yaXR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgIH0sXG4gICAgICAgIGxheW91dDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgIHJldHVybiBvYmouaW5saW5lO1xuICAgICAgICB9LFxuICAgICAgICBvcmllbnRhdGlvbjogW3tcbiAgICAgICAgICB0eXBlOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLmhvcml6b250YWw7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3NpdGlvbjogW3tcbiAgICAgICAgICAgIHR5cGU6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9iai50b3A7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWxpZ25tZW50OiBbe1xuICAgICAgICAgICAgICB0eXBlOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5sZWZ0O1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBkaW1lbnNpb25zOiBbZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmdldFBhcmVudENvbXBvbmVudEdyb3VwKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0TG9naWNhbFNwYWNlKHBhcmVudC5nZXRXaWR0aCgpLCBwYXJlbnQuZ2V0SGVpZ2h0KCkpO1xuICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfV1cbiAgICAgICAgICB9XVxuICAgICAgICB9XVxuICAgICAgfV0pO1xuICAgIH1cblxuICAgIHNldERyYXdpbmdDb25maWd1cmF0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBncm91cCkge1xuICAgICAgdmFyIG1lcyA9IHRoaXMubWVhc3VyZW1lbnQ7XG4gICAgICBtZXMueCA9IHg7XG4gICAgICBtZXMueSA9IHk7XG4gICAgICBtZXMud2lkdGggPSB3aWR0aDtcbiAgICAgIG1lcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgIHRoaXMucGFyZW50R3JvdXAgPSBncm91cDtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhdyAoeCwgeSwgd2lkdGgsIGhlaWdodCwgZ3JvdXApIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXG4gICAgICAgIHRvb2xib3hDb21wQ29uZmlnID0gY29uZmlnLnRvb2xib3hDb21wb25lbnQuY29uZmlnLFxuICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudSA9IHRvb2xib3hDb21wQ29uZmlnLnRpbWVQZXJpb2RTZWxlY3RNZW51LFxuICAgICAgICB0aW1lTXVsU2VsZWN0TWVudSA9IHRvb2xib3hDb21wQ29uZmlnLnRpbWVNdWxTZWxlY3RNZW51LFxuICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51ID0gdG9vbGJveENvbXBDb25maWcuYWdnTWV0aG9kU2VsZWN0TWVudSxcbiAgICAgICAgYXBwbHlCdXR0b24gPSB0b29sYm94Q29tcENvbmZpZy5hcHBseUJ1dHRvbixcbiAgICAgICAgcmVzZXRCdXR0b24gPSB0b29sYm94Q29tcENvbmZpZy5yZXNldEJ1dHRvbixcbiAgICAgICAgbWVhc3VyZW1lbnQgPSBzZWxmLm1lYXN1cmVtZW50LFxuICAgICAgICB0b29sYmFycyA9IHNlbGYudG9vbGJhcnMsXG4gICAgICAgIGxuLFxuICAgICAgICBpLFxuICAgICAgICB0b29sYmFyLFxuICAgICAgICBtb2RlbCA9IGNvbmZpZy5jb21wb3NpdGlvbi5yZWFjdGl2ZU1vZGVsLFxuICAgICAgICBkYXRhQWdnID0gY29uZmlnLmRhdGFBZ2csXG5cbiAgICAgICAgdGltZVBlcmlvZFZhbCxcbiAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnVPcHQsXG4gICAgICAgIHZhbGlkVGltZVBlcmlvZCxcbiAgICAgICAgaW5kZXhPZlRpbWVVbml0LFxuXG4gICAgICAgIG11bHRpcGxpZXJWYWwsXG4gICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0LFxuICAgICAgICB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyLFxuXG4gICAgICAgIGFnZ1ZhbCxcbiAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudU9wdCxcbiAgICAgICAgYXZsQWdnTWV0aG9kcyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29tcHV0ZSBhbmQgcG9wdWxhdGUgdG9vbGJveGVzIHdpdGggdmFsaWQgdmFsdWVzIG9uIGNoYW5nZSBpbiByYW5nZSBvZiB2aXN1YWwgd2luZG93XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICByYW5nZU9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgIHZhciBhZ2dyZWdhdGlvbiA9IHNlbGYuYWdncmVnYXRpb24sXG4gICAgICAgICAgICBjdXJyZW50QWdncmVnYXRpb25PYmosXG4gICAgICAgICAgICB0aW1lUGVyaW9kLFxuICAgICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXIsXG4gICAgICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZDtcblxuICAgICAgICAgIHNlbGYuZ2V0VmFsaWRBZ2dyZWdhdGlvbigpO1xuICAgICAgICAgIGN1cnJlbnRBZ2dyZWdhdGlvbk9iaiA9IHNlbGYuZ2V0Q3VycmVudEFnZ3JlYXRpb24oKTtcbiAgICAgICAgICB0aW1lUGVyaW9kID0gY3VycmVudEFnZ3JlZ2F0aW9uT2JqLnRpbWVQZXJpb2Q7XG4gICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXIgPSBjdXJyZW50QWdncmVnYXRpb25PYmoudGltZVBlcmlvZE11bHRpcGxpZXI7XG4gICAgICAgICAgYWdncmVnYXRpb25NZXRob2QgPSBjdXJyZW50QWdncmVnYXRpb25PYmouYWdncmVnYXRpb25NZXRob2Q7XG5cbiAgICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudU9wdCA9IFtdO1xuICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0ID0gW107XG4gICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudU9wdCA9IFtdO1xuXG4gICAgICAgICAgdmFsaWRUaW1lUGVyaW9kID0gY29uZmlnLnZhbGlkVGltZVBlcmlvZDtcbiAgICAgICAgICB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyID0gY29uZmlnLnZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXI7XG4gICAgICAgICAgYXZsQWdnTWV0aG9kcyA9IGNvbmZpZy5hdmxBZ2dNZXRob2RzO1xuXG4gICAgICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgaWYgKGFnZ3JlZ2F0aW9uLmJpblNpemUgIT09IG1vZGVsLnByb3AoJ2Jpbi1zaXplJykgJiZcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kLnZhbHVlID09PSBjb25maWcuZGVmYXVsdEFnZ01ldGhvZCkge1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYmluU2l6ZSA9IG51bGw7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbi5hZ2dyZWdhdGlvbk1ldGhvZCA9IG51bGw7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghY29uZmlnLmNhbkFnZ3JlZ2F0ZSkge1xuICAgICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdlbmFibGVkJyk7XG4gICAgICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAodGltZVBlcmlvZFZhbCBvZiB2YWxpZFRpbWVQZXJpb2QpIHtcbiAgICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51T3B0LnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiB0aW1lUGVyaW9kVmFsLFxuICAgICAgICAgICAgICB2YWx1ZTogdGltZVBlcmlvZFZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUudXBkYXRlTGlzdCh0aW1lUGVyaW9kU2VsZWN0TWVudU9wdCk7XG4gICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUudmFsdWUodGltZVBlcmlvZCk7XG5cbiAgICAgICAgICBpbmRleE9mVGltZVVuaXQgPSB2YWxpZFRpbWVQZXJpb2QuaW5kZXhPZih0aW1lUGVyaW9kKTtcblxuICAgICAgICAgIGlmIChpbmRleE9mVGltZVVuaXQgPj0gMCkge1xuICAgICAgICAgICAgZm9yIChtdWx0aXBsaWVyVmFsIG9mIHZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXJbaW5kZXhPZlRpbWVVbml0XSkge1xuICAgICAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdmFsdWU6IG11bHRpcGxpZXJWYWwudG9TdHJpbmcoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS51cGRhdGVMaXN0KHRpbWVNdWxTZWxlY3RNZW51T3B0KTtcbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSh0aW1lUGVyaW9kTXVsdGlwbGllci50b1N0cmluZygpKTtcblxuICAgICAgICAgIGZvciAoYWdnVmFsIGluIGF2bEFnZ01ldGhvZHMpIHtcbiAgICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF2bEFnZ01ldGhvZHNbYWdnVmFsXS5mb3JtYWxOYW1lLFxuICAgICAgICAgICAgICB2YWx1ZTogYXZsQWdnTWV0aG9kc1thZ2dWYWxdLm5pY2tOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LnVwZGF0ZUxpc3QoYWdnTWV0aG9kU2VsZWN0TWVudU9wdCk7XG4gICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS52YWx1ZShhZ2dyZWdhdGlvbk1ldGhvZC52YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgIHNlbGYuZ2V0QXZhaWxhYmxlbEFnZ3JlYWdhdGlvbigpO1xuXG4gICAgICB4ID0geCA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQueCA6IHg7XG4gICAgICB5ID0geSA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQueSA6IHk7XG4gICAgICB3aWR0aCA9IHdpZHRoID09PSB1bmRlZmluZWQgPyBtZWFzdXJlbWVudC53aWR0aCA6IHdpZHRoO1xuICAgICAgaGVpZ2h0ID0gaGVpZ2h0ID09PSB1bmRlZmluZWQgPyBtZWFzdXJlbWVudC5oZWlnaHQgOiBoZWlnaHQ7XG4gICAgICBncm91cCA9IGdyb3VwID09PSB1bmRlZmluZWQgPyBzZWxmLnBhcmVudEdyb3VwIDogZ3JvdXA7XG4gICAgICBpZiAod2lkdGggJiYgaGVpZ2h0KSB7XG4gICAgICAgIGZvciAoaSA9IDAsIGxuID0gdG9vbGJhcnMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICAgIHRvb2xiYXIgPSB0b29sYmFyc1tpXTtcbiAgICAgICAgICB0b29sYmFyLmRyYXcoeCwgeSwgZ3JvdXApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByYW5nZU9uQ2hhbmdlKCk7XG4gICAgICBhcHBseUJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICBjb25maWcuZGVmYXVsdEFnZ01ldGhvZCA9IGRhdGFBZ2cuZ2V0RGVmYXVsdEFnZ3JlZ2F0aW9uTWV0aG9kKCkubmlja05hbWU7XG5cbiAgICAgIG1vZGVsLm9uUHJvcHNDaGFuZ2UoWydiaW4tc2l6ZScsICdhZ2dyZWdhdGlvbi1mbiddLCByYW5nZU9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBkaXNwb3NlICgpIHtcbiAgICAgIC8vIGRpc3Bvc2UgZXh0ZW5zaW9uXG4gICAgfVxuICB9XG4gIHJldHVybiBBZ2dyZWdhdG9yO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2ZjdHMtZXh0LWFnZ3JlZ2F0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==