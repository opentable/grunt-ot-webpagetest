var webpagetest = require('webpagetest');
var hipchat = require('hipchat-client');
var format = require('string-format');
var async = require('async');
var logstashRedis = require('logstash-redis');

module.exports = function(grunt) {
    var checkTestStatus = function(wpt, testId, options, done){
        wpt.getTestStatus(testId, function(err, data) {

            if (err){
                return done(err);
            }

            grunt.verbose.writeln("Status for " + testId + ": " + data.data.statusText);

            if (!data.data.completeTime) {
                setTimeout(function(){
                    checkTestStatus(wpt, testId, options, done);
                }, 50000);
            }
            else {
                return wpt.getTestResults(testId, function(err, data) {
                    grunt.verbose.writeln("http://www.webpagetest.org/result/" + testId + "/");

                    if (err > 0) {
                        return done(err);
                    }

                    var message = format('WPT results: <a href="{0}">{0}</a><br />Page under test: {1}<br /> Load Time: {2} <br />TTFB: {3}',data.data.summary, options.testUrl, data.data.median.firstView.loadTime, data.data.median.firstView.TTFB);
                    grunt.verbose.writeln(message);

                    async.series([
                    function(callback) {
                    if (options.notifyHipchat) {
                        notifyHipchat(message, options, callback);
                    }
                    else { 
                        callback();
                    }
                },
                function(callback) {
                    if (options.notifyLogstash) {
                        notifyLogstash(data, options, callback);
                    }
                    else {
                        callback();
                    }
                },
                done
            ]);
                });
            }
        });
    };

    var notifyHipchat = function(message, options, done) {
        var hipchatClient = new hipchat(options.hipchatApiKey);

        var params = {
            room_id: options.roomId,
            from: 'WebPageTest',
            message: message,
            color: 'yellow'
        };

        hipchatClient.api.rooms.message(params, function(err, data){
            if (err) {
                grunt.verbose.writeln('Error: ' + err);
            }
            done();
        });
    };
    
    var notifyLogstash = function(data, options, done) {

        var logger = logstashRedis.createLogger(options.logstashHost, options.logstashPort, 'logstash');
        logger.log({ 
            '@timestamp': new Date().toISOString(), 
            'servicetype': 'wpt-service', 
            'logname': 'result',
            'formatversion' : 'v1', 
            'type': 'wpt-service-result-v1',
            'host': os.hostname(),
            'wpt': data 
	    });
        logger.close(done);

    };

    var makeRequest = function(task, done){

        var options = task.options({
            instanceUrl: 'www.webpagetest.org',
            wptApiKey: null,
            testUrl: 'http://www.google.com',
            runs: 1,
            hipchatApiKey: null,
            roomId: null,
            logstashHost: 'localhost',
            logstashPort: null,
            notifyHipchat: false,
            notifyLogstash: false,
            location: ''
        });

        var parameters = {
            runs: options.runs,
            location: options.location
        };

        if (options.hipchatApiKey === undefined || options.wptApiKey === undefined){
            grunt.fail.fatal('Please provide both hipchatapikey and wptapikey as command line paramters');
        }

        var wpt = new webpagetest(options.instanceUrl, options.wptApiKey);
        var testId;

        wpt.runTest(options.testUrl, parameters, function(err, data) {
            if (data.statusCode === 200) {
                testId = data.data.testId;
                checkTestStatus(wpt, testId, options, done);
            }
        });
    };

    grunt.registerMultiTask('ot-webpagetest', function(){
        var done = this.async();
        makeRequest(this, done);
    });
};
