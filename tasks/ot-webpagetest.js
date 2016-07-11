var wpt = require('ot-wpt');

module.exports = function(grunt) {

    grunt.registerMultiTask('ot-webpagetest', function() {
        var done = this.async();
        var options = this.options({
            instanceUrl: 'www.webpagetest.org',
            testUrl: 'http://www.google.com',
            apiKey: null,
            wpt: {
                runs: 1,
                location: ''
            }
        });
        wpt(options, function(error) {
            if (error) {
                grunt.log.error(error);
                done(false);
            }
        });
    });
};
