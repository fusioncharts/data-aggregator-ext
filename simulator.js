var page = require("webpage").create(),
    args = require('system').args,
    fc = "./lib/fusioncharts.js",
    fcTs = "./lib/fusioncharts.timeseries.js",
    ext = "./dist/fcts-ext-dataaggregator-es5.js",
    //pass in the name of the file that contains your tests
    testFile = "./test/test.js",
    pageAddress = 'about:blank';

if (typeof testFile === 'undefined' || typeof fc === 'undefined' || typeof fcTs === 'undefined') {
    console.error("Test Files or src files are not specified");
    phantom.exit();
}

page.open(pageAddress, function(status) {
    if (status !== 'success') {
        console.error("Failed to open", page.frameUrl);
        phantom.exit();
    }

    // var expectedContent = '<html><head><title>unittest-for-fusioncharts-selective-update</title>'+
    // '</head><body><div></div></body></html>';
    // page.setContent(expectedContent,pageAddress);

    //Inject mocha and chai
    page.injectJs("./node_modules/mocha/mocha.js");
    page.injectJs("./node_modules/chai/chai.js");

    //Inject test reporter
    page.injectJs("reporter.js");

    //Inject Fusioncharts modules
    page.injectJs(fc);
    page.injectJs(fcTs);

    //Inject Extension modules
    page.injectJs(ext);

    //inject your tests
    page.injectJs(testFile);

    page.evaluate(function() {
        if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
        else { mocha.run(); }
    });
});

page.onCallback = function(data) {
    data.message && console.log(data.message);
    data.exit && phantom.exit(+data.error);
};

page.onConsoleMessage = function(msg) {
    console.log(msg);
};
