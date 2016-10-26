(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:false };modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.loaded=true;return module.exports;}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.p="";return __webpack_require__(0);})([function(module,exports,__webpack_require__){const Aggregator=__webpack_require__(1);const FusionCharts=__webpack_require__(2);var fc=new FusionCharts();fc.register('extension',['data-aggregator',function(id){var global=this;var extAPI=global.extAPI;console.log(id);extAPI(new Aggregator())}]);},function(module,exports){(function(global){class Aggregator{constructor(){this.appliedAggregation={timePeriod:null,timePeriodMultiplier:0,aggregationMethod:null}}get aggregation(){return this.appliedAggregation}set aggregation(obj){this.appliedAggregation.timePeriod=obj.timePeriod;this.appliedAggregation.timePeriodMultiplier=obj.timePeriodMultiplier;this.appliedAggregation.aggregationMethod=obj.aggregationMethod}setAggregation(obj){this.aggregation=obj;return true}reset(){}init(require){require('X-Axis','Y-Axis',function(x,y){global.x=x;global.y=y})}placeInCanvas(){var isSet=this.setAggregation({timePeriod:'month',timePeriodMultiplier:3,aggregationMethod:'sum'});console.log(this.aggregation,isSet)}draw(){}dispose(){}}module.exports=Aggregator;}.call(exports,(function(){return this}())));},function(module,exports){var FusionCharts=function(){};FusionCharts.prototype.register=function(ext,arr){var extName=arr[0];var fn=arr[1];console.log('Currently active extension: '+extName);fn.bind(this,565)()};FusionCharts.prototype.getComponent=function(componentType,componentName){var toolBox={x:24,y:56,width:100,height:20,index:4};if(componentType==='api'&&componentName==='toolbox'){return toolBox}return null};FusionCharts.prototype.extAPI=function(obj){obj.init(function(){var argsToApply=[];var cb=arguments[arguments.length-1];for(var i=0;i<arguments.length-1;i+=1){if(arguments[i]==='X-Axis'){argsToApply.push(156772)}else if(arguments[i]==='Y-Axis'){argsToApply.push(156765)}}cb.apply(this,argsToApply)});obj.placeInCanvas();obj.draw();obj.dispose()};module.exports=FusionCharts;}]);