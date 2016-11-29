/* global document */
/* global chai */
/* global describe */
/* global it */
function getRandomDates (len) {
  var day = 1, months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    year = 2015, month = 0, arr = [];

  for (var i = 0; i < len; i++) {
    if (month === 11 && day === 31) {
      year++;
      month = 0;
    }
    if (day > 30 || (month === 1 && day === 28)) {
      day = 1;
      month++;
    }
    if (month > 11) {
      month = 0;
    }
    var dateStr = day + '-' + months[month] + '-' + year;
    arr.push(dateStr);
    day++;
  }
  return arr;
}

function getRandomSeries (len) {
  var arr = [];

  for (var i = 0; i < len; i++) {
    arr.push(Math.floor(Math.random() * 10));
  }
  return arr;
}

var tsChart,
  data = {
    'chart': {
      'axes': [
        {
          'x': {

          },
          'y': {

          }
        }
      ],
      'datasets': [
        {
          'category': {
            'dateformat': '%e-%b-%Y',
            'data': getRandomDates(10000)
          },
          'dataset': [
            {
              'uid': 'ds-1',
              'series': [
                {
                  'plot': {
                    'type': 'line'
                  },
                  'name': 'Series 1',
                  'data': getRandomSeries(10000)
                },
                {
                  'plot': {
                    'type': 'line'
                  },
                  'name': 'Series 1',
                  'data': getRandomSeries(10000)
                }
              ]
            }
          ]
        }
      ],
      'canvas': [
        {
          'axes': function (store) {
            return store.getAxesByIndex(0);
          },
          'dataset': function (store) {
            return store.getDatasetsByIndex(0);
          }
        }
      ],
      'caption': [
        {
          'title': {
            'text': 'Basic Elements'
          },
          'subtitle': {
            'text': 'Sub-caption'
          }
        }
      ]
    }
  };

tsChart = new FusionCharts({
  type: 'timeseries',
  plottype: 'line',
  renderAt: document.body,
  width: '600',
  height: '450',
  dataFormat: 'json',
  dataSource: data
}).render();

var expect = chai.expect;

describe('chart type caption', function () {
  it('chart type should be timeseries or this test will fail', function () {
    var type = tsChart.chartType(),
      isMatch = (type.toLowerCase() === 'timeseries');
    expect(isMatch).to.equal(true);
  });

  // it('chart type should be timeseries or this test will fail', function (done) {
  //   var type = tsChart.chartType(),
  //     isMatch = (type.toLowerCase() === 'timeseries');

  //   setTimeout(function () {
  //     console.log(window.Aggregator);
  //     expect(isMatch).to.equal(true);
  //     done();
  //   }, 100);
  // });
});
