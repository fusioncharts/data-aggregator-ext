/* global Mocha */
/* global mocha */
/* global window */
/* global log */

/*
 * An custom Reporter implementation of the Mocha.
 * The default reporter wont work because this runs in phantom headless browser implemtation, hence mocha would think
 * that the env is browser the report would be sent to the browser preferred output media. This module overrides the
 * default destination of the stream and send it to standard output console.
 */

(function() {

    var colors = Mocha.reporters.Base.colors,
        Reporter;

    function color(type, str) {
        return '\u001b[' + colors[type] + 'm' + str + '\u001b[0m';
    }


    /* jshint ignore:start */
    function log() {
        var args = Array.apply(null, arguments);

        if (false) {
            window.callPhantom({ message: args.join(' ') });
        } else {
            console.log( args.join(' ') );
        }
    }
    /* jshint ignore:end */

    Reporter = function(runner){
        var out = [],
            stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 };

        Mocha.reporters.Base.call(this, runner);

        runner.on('start', function() {
            stats.start = new Date();
            out.push([ 'Testing',  'FC', '\n']);
        });

        runner.on('suite', function(suite) {
            stats.suites++;
            out.push([suite.title, '\n']);
        });

        runner.on('test', function() {
            stats.tests++;
        });

        runner.on('pass', function(test) {
            stats.passes++;
            if ('fast' == test.speed) {
                out.push([ color('checkmark', '  ✓ '), color('pass', test.title), '\n' ]);
            } else {
                out.push([
                    color('checkmark', '  ✓ '),
                    test.title,
                    color(test.speed, test.duration + 'ms'),
                    '\n'
                ]);
            }

        });

        runner.on('fail', function(test, err) {
            stats.failures++;
            out.push([ color('fail', '  × '), color('fail', color('fail', test.title)), ':\n    ', err ,'\n']);
        });

        runner.on('end', function() {

            out.push(['ending']);

            stats.end = new Date();
            stats.duration = new Date() - stats.start;

            out.push([stats.tests, 'tests ran in', stats.duration, 'ms']);
            out.push([ color('checkmark', stats.passes), 'passed and', color('fail', stats.failures), 'failed']);

            while (out.length) {
                log.apply(null, out.shift());
            }

            if (window.callPhantom) {
                window.callPhantom({ exit: true, error:  !!stats.failures });
            }

        });

    };

    mocha.setup({
        ui: 'bdd',
        ignoreLeaks: true,
        reporter: Reporter
    });

}());
