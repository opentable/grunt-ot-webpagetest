var webpagetest = require('webpagetest');
var hipchat = require('hipchat-client');

module.exports = function(grunt) {
    var checkTestStatus = function(wpt, testId, options){
        wpt.getTestStatus(testId, function(err, data) {

            if (err){
                grunt.fail.fatal(err);
            }

            grunt.verbose.writeln("Status for " + testId + ": " + data.data.statusText);

            if (!data.data.completeTime) {
                setTimeout(checkTestStatus(wpt, testId, options), 50000);
            }
            else {
                return wpt.getTestResults(testId, function(err, data) {
                    console.log("http://www.webpagetest.org/result/" + testId + "/");

                    var message = "WPT Results: <a href="+ data.data.summary +"</a> <br />LoadTime = "
                                    + data.data.median.firstView.loadTime
                                    + ".<br />TTFB = " + data.data.median.firstView.TTFB;
                    notifyHipchat(message, options);

                    if (err > 0) {
                        return process.exit(1);
                    }
                });
            }
        });
    };

    var notifyHipchat = function(message, options) {
        var hipchatClient = new hipchat(options.hipchatapikey);

        var params = {
            room_id: options.roomid,
            from: 'WebPageTest',
            message: message,
            color: 'yellow'
        };

        hipchatClient.api.rooms.message(params, function(err, data){
            if (err) {
                grunt.verbose.writeln('Error: ' + err);
            }
        });
    }

    var makeRequest = function(task, done){

        if (grunt.option('hipchatapikey') === undefined || grunt.option('wptapikey') === undefined){
            grunt.fail.fatal('Please provide both hipchatapikey and wptapikey as command line paramters')
        }

        var options = task.options({
            instanceUrl: 'www.webpagetest.org',
            wptApiKey: grunt.option('wptapikey'),
            testUrl: 'http://www.opentable.com/start/home',
            runs: 1,
            location: null,
            hipchatapikey: grunt.option('hipchatapikey'),
            roomid: 2146139
        });

        var parameters = {
            runs: options.runs,
            location: options.location
        }

        var wpt = new webpagetest(options.instanceUrl, options.wptApiKey);
        var testId;

        wpt.runTest(options.testUrl, parameters, function(err, data) {

            if (data.statusCode === 200) {
				testId = data.data.testId;
                checkTestStatus(wpt, testId, options);
            }
            done();
        });
    }

    grunt.registerTask('ot-webpagetest', function(){
        var done = this.async();
        makeRequest(this, done);
    });
}