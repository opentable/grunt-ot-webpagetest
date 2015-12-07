module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        'ot-webpagetest': {
            options: {
                testUrl: 'http://google.com',
                wptApiKey: 'API_KEY_HERE',
                hipchatApiKey: 'API_KEY_HERE',
                roomId: 123456,
                kibanaHost: 'localhost',
		kibanaPort: 6379,
                notifyHipchat: true,
                notifyKibana: true
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['test']);
    grunt.loadTasks('tasks');
};
