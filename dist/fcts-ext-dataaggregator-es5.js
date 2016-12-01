/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var AggregatorGetter = __webpack_require__(2);

	;(function (env, factory) {
	  if (( false ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	    module.exports = env.document ? factory(env) : function (win) {
	      if (!win.document) {
	        throw new Error('Window with document not present');
	      }
	      return factory(win, true);
	    };
	  } else {
	    env.Aggregator = factory(env, true);
	  }
	})(typeof window !== 'undefined' ? window : undefined, function (_window, windowExists) {
	  var FC = _window.FusionCharts;

	  FC.register('extension', ['private', 'data-aggregator', function () {
	    FC.registerComponent('extensions', 'data-aggregator', AggregatorGetter({ FC: FC }));
	  }]);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function (dep) {
	  /**
	   * Class representing the Data Aggregator.
	   */
	  var Aggregator = function () {
	    /**
	     * Create a Aggregator.
	     * @typedef {object} Aggregator.aggregation
	     * @property {string} binSize - The binSize applied to aggregate.
	     * @property {string} aggregationMethod - The method applied to aggregate.
	     */
	    function Aggregator() {
	      _classCallCheck(this, Aggregator);

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


	    _createClass(Aggregator, [{
	      key: 'getAvailablelAggreagation',


	      /**
	       * Sets available aggregation options in configuration of extension
	       * @private
	       */
	      value: function getAvailablelAggreagation() {
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

	    }, {
	      key: 'getValidAggregation',
	      value: function getValidAggregation() {
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

	        config.currentTimeLength = tsObject.globalReactiveModel.model['x-axis-visible-range-end'] - tsObject.globalReactiveModel.model['x-axis-visible-range-start'];

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

	            if (binSize >= minBinSize) {
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

	    }, {
	      key: 'getCurrentAggreation',
	      value: function getCurrentAggreation() {
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
	    }, {
	      key: 'init',
	      value: function init(require) {
	        var self = this,
	            config = self.config,
	            toolboxComponent = config.toolboxComponent = {},
	            api,
	            store,
	            composition,
	            saveTo = 'tsObject',
	            requiredParams = ['graphics', 'globalReactiveModel', 'chart', 'spaceManagerInstance', 'chartInstance', 'smartLabel', function acquire() {
	          var i = 0,
	              ii = requiredParams.length - 1,
	              param = '';
	          self[saveTo] = self[saveTo] || {};
	          self.requiredParams = {};
	          for (i = 0; i < ii; ++i) {
	            param = requiredParams[i];
	            self[saveTo][param] = arguments[i];
	          }
	        }];
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

	    }, {
	      key: 'createToolbar',
	      value: function createToolbar() {
	        var self = this,
	            labelGroup,
	            selectMenuGroup,
	            buttonGroup,
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
	        apply = function apply(set) {
	          var model = config.composition.reactiveModel,
	              timePeriodVal = timePeriodSelectMenu.value(),
	              timePeriodMultiplierVal = timeMulSelectMenu.value(),
	              aggMethodSelectMenuVal = aggMethodSelectMenu.value(),
	              keys,
	              binSize,
	              timeInterval,
	              aggregation = self.aggregation,
	              canvas = config.composition.impl;

	          var _iteratorNormalCompletion = true;
	          var _didIteratorError = false;
	          var _iteratorError = undefined;

	          try {
	            for (var _iterator = config.avlTimePeriods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	              keys = _step.value;

	              if (keys.name === timePeriodVal) {
	                timeInterval = keys.interval;
	                break;
	              }
	            }
	          } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	              }
	            } finally {
	              if (_didIteratorError) {
	                throw _iteratorError;
	              }
	            }
	          }

	          binSize = timeInterval * Number(timePeriodMultiplierVal);
	          if (set && isFinite(model.prop('bin-size'))) {
	            model.lock().prop('bin-size-ext', binSize).prop('aggregation-fn-ext', config.avlAggMethods[aggMethodSelectMenuVal]).unlock();
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
	        timePeriodOnChange = function timePeriodOnChange() {
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
	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;

	          try {
	            for (var _iterator2 = validTimePeriodMultiplier[indexOfTimeUnit][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              multiplierVal = _step2.value;

	              timeMulSelectMenuOpt.push({
	                name: multiplierVal.toString(),
	                value: multiplierVal.toString()
	              });
	            }
	          } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	              }
	            } finally {
	              if (_didIteratorError2) {
	                throw _iteratorError2;
	              }
	            }
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
	        onChange = function onChange(type) {
	          var currentAgg = self.getCurrentAggreation();

	          if (currentAgg.timePeriodMultiplier.toString() !== timeMulSelectMenu.value() || currentAgg.timePeriod !== timePeriodSelectMenu.value() || currentAgg.aggregationMethod.value !== aggMethodSelectMenu.value()) {
	            applyButton.updateVisual('enabled');
	          } else {
	            applyButton.updateVisual('disabled');
	          }
	        };

	        labelGroup = new ComponentGroup(dependencies, {
	          hPadding: 0
	        });
	        selectMenuGroup = new ComponentGroup(dependencies, {
	          hPadding: 0
	        });
	        buttonGroup = new ComponentGroup(dependencies, {
	          hPadding: 0
	        });

	        toolbar = new HorizontalToolbar(dependencies);

	        config.usrConfig = {
	          enabled: true,
	          posWrtCanvas: 'top',
	          alignment: 'left',
	          orientation: 'horizontal',
	          styles: {
	            label: {
	              'font-size': 13,
	              'fill': '#696969',
	              'height': 22
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
	                'hoverLabelFill': '#696969'
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
	            active: style.timeMultiplierInputField && style.timeMultiplierInputField.active || {},
	            inactive: style.timeMultiplierInputField && style.timeMultiplierInputField.inactive || {}
	          },
	          timePeriodInputField: {
	            active: style.timePeriodInputField && style.timePeriodInputField.active || {},
	            inactive: style.timePeriodInputField && style.timePeriodInputField.inactive || {}
	          },
	          aggregationMethodInputField: {
	            active: style.aggregationMethodInputField && style.aggregationMethodInputField.active || {},
	            inactive: style.aggregationMethodInputField && style.aggregationMethodInputField.inactive || {}
	          },
	          dropDown: {
	            active: style.dropDown && style.dropDown.active || {},
	            normal: style.dropDown && style.dropDown.normal || {}
	          },
	          applyButton: {
	            active: style.applyButton && style.applyButton.active || {},
	            inactive: style.applyButton && style.applyButton.inactive || {}
	          },
	          resetButton: {
	            active: style.resetButton && style.resetButton.active || {},
	            inactive: style.resetButton && style.resetButton.inactive || {}
	          },
	          base: {
	            font: style.base && style.base.font || {}
	          }
	        };

	        labelGroup.setConfig({
	          fill: '#fff',
	          borderThickness: 0
	        });
	        selectMenuGroup.setConfig({
	          fill: '#fff',
	          borderThickness: 0
	        });
	        buttonGroup.setConfig({
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
	          container: {
	            height: style.label.height
	          },
	          text: {
	            style: style.label
	          }
	        });

	        toolboxCompConfig.timePeriodSelectMenu = timePeriodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [], Object.assign(style.timePeriodInputField.active, {
	          btnTextStyle: style.base.font,
	          dropDownMenu: dropDownMenuStyle,
	          margin: {
	            right: 8
	          }
	        }));
	        timePeriodSelectMenu.setStateConfig(timePeriodMenuDisableConfig);

	        toolboxCompConfig.timeMulSelectMenu = timeMulSelectMenu = new toolbox.SelectSymbol({}, dependencies, [], Object.assign(style.timeMultiplierInputField.active, {
	          btnTextStyle: style.base.font,
	          dropDownMenu: dropDownMenuStyle,
	          margin: {
	            right: 3
	          }
	        }));
	        timeMulSelectMenu.setStateConfig(timeMultiplierMenuDisableConfig);

	        toolboxCompConfig.aggMethodSelectMenu = aggMethodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [], Object.assign(style.aggregationMethodInputField.active, {
	          btnTextStyle: style.base.font,
	          margin: {
	            right: 10
	          },
	          dropDownMenu: dropDownMenuStyle
	        }));
	        aggMethodSelectMenu.setStateConfig(aggMethodMenuDisableonfig);

	        toolboxCompConfig.applyButton = applyButton = new toolbox.Symbol('APPLY', true, dependencies, Object.assign(style.applyButton.active, {
	          btnTextStyle: style.base.font,
	          margin: {
	            right: 3
	          }
	        })).attachEventHandlers({
	          click: function click() {
	            apply(1);
	          }
	        });
	        applyButton.setStateConfig(applyButtonDisableConfig);

	        toolboxCompConfig.resetButton = resetButton = new toolbox.Symbol('RESET', true, dependencies, Object.assign(style.resetButton.active, {
	          btnTextStyle: style.base.font,
	          margin: {
	            right: 3
	          }
	        })).attachEventHandlers({
	          click: function click() {
	            apply(0);
	          }
	        });
	        resetButton.setStateConfig(resetButtonDisableConfig);

	        labelGroup.addSymbol(label);
	        selectMenuGroup.addSymbol(timeMulSelectMenu);
	        selectMenuGroup.addSymbol(timePeriodSelectMenu);
	        selectMenuGroup.addSymbol(aggMethodSelectMenu);
	        buttonGroup.addSymbol(applyButton);
	        buttonGroup.addSymbol(resetButton);

	        SymbolStore.register('textBoxIcon', function (x, y, rad, w, h, padX, padY) {
	          var x1 = x - w / 2 + padX / 2,
	              x2 = x + w / 2 - padX / 2,
	              y1 = y - h / 2 + padY / 2,
	              y2 = y + h / 2 - padY / 2;

	          return ['M', x1, y1, 'L', x2, y1, 'L', x2, y2, 'L', x1, y2, 'Z'];
	        });

	        timePeriodSelectMenu.attachEventHandlers({
	          textOnChange: function textOnChange() {
	            timePeriodOnChange();
	            onChange();
	          }
	        });

	        timeMulSelectMenu.attachEventHandlers({
	          textOnChange: function textOnChange() {
	            onChange();
	          }
	        });

	        aggMethodSelectMenu.attachEventHandlers({
	          textOnChange: function textOnChange() {
	            onChange();
	          }
	        });

	        toolbar.addComponent(labelGroup);
	        toolbar.addComponent(selectMenuGroup);
	        toolbar.addComponent(buttonGroup);

	        return toolbar;
	      }
	    }, {
	      key: 'getLogicalSpace',
	      value: function getLogicalSpace(availableWidth, availableHeight) {
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
	    }, {
	      key: 'placeInCanvas',
	      value: function placeInCanvas(containerInstance) {
	        var _self = this,
	            tsObject = _self.tsObject;

	        _self.padding = 5;
	        tsObject.spaceManagerInstance.add([{
	          name: function name() {
	            return 'data-aggregator';
	          },
	          ref: function ref(obj) {
	            return obj['0'];
	          },
	          self: function self() {
	            return _self;
	          },
	          priority: function priority() {
	            return 2;
	          },
	          layout: function layout(obj) {
	            return obj.inline;
	          },
	          orientation: [{
	            type: function type(obj) {
	              return obj.horizontal;
	            },
	            position: [{
	              type: function type(obj) {
	                return obj.bottom;
	              },
	              alignment: [{
	                type: function type(obj) {
	                  return obj.right;
	                },
	                dimensions: [function () {
	                  var parent = this.getParentComponentGroup();
	                  return _self.getLogicalSpace(parent.getWidth(), parent.getHeight());
	                }]
	              }]
	            }]
	          }]
	        }]);
	      }
	    }, {
	      key: 'setDrawingConfiguration',
	      value: function setDrawingConfiguration(x, y, width, height, group) {
	        var mes = this.measurement;
	        mes.x = x;
	        mes.y = y;
	        mes.width = width;
	        mes.height = height;

	        this.parentGroup = group;

	        return this;
	      }
	    }, {
	      key: 'draw',
	      value: function draw(x, y, width, height, group) {
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
	        rangeOnChange = function rangeOnChange() {
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

	          if (aggregation.binSize !== model.prop('bin-size') && aggregationMethod.value === config.defaultAggMethod) {
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

	          var _iteratorNormalCompletion3 = true;
	          var _didIteratorError3 = false;
	          var _iteratorError3 = undefined;

	          try {
	            for (var _iterator3 = validTimePeriod[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	              timePeriodVal = _step3.value;

	              timePeriodSelectMenuOpt.push({
	                name: timePeriodVal,
	                value: timePeriodVal
	              });
	            }
	          } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                _iterator3.return();
	              }
	            } finally {
	              if (_didIteratorError3) {
	                throw _iteratorError3;
	              }
	            }
	          }

	          timePeriodSelectMenu.updateList(timePeriodSelectMenuOpt);
	          timePeriodSelectMenu.value(timePeriod);

	          indexOfTimeUnit = validTimePeriod.indexOf(timePeriod);

	          if (indexOfTimeUnit >= 0) {
	            var _iteratorNormalCompletion4 = true;
	            var _didIteratorError4 = false;
	            var _iteratorError4 = undefined;

	            try {
	              for (var _iterator4 = validTimePeriodMultiplier[indexOfTimeUnit][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                multiplierVal = _step4.value;

	                timeMulSelectMenuOpt.push({
	                  name: multiplierVal.toString(),
	                  value: multiplierVal.toString()
	                });
	              }
	            } catch (err) {
	              _didIteratorError4 = true;
	              _iteratorError4 = err;
	            } finally {
	              try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                  _iterator4.return();
	                }
	              } finally {
	                if (_didIteratorError4) {
	                  throw _iteratorError4;
	                }
	              }
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
	    }, {
	      key: 'dispose',
	      value: function dispose() {
	        // dispose extension
	      }
	    }, {
	      key: 'aggregation',
	      get: function get() {
	        return this.appliedAggregation;
	      },
	      set: function set(obj) {
	        this.appliedAggregation.timePeriod = obj.timePeriod;
	        this.appliedAggregation.timePeriodMultiplier = obj.timePeriodMultiplier;
	        this.appliedAggregation.aggregationMethod = obj.aggregationMethod;
	      }
	    }]);

	    return Aggregator;
	  }();

	  return Aggregator;
	};

/***/ }
/******/ ]);