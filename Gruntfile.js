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
                testUrl: 'http://www.google.com',
                wptApiKey: 'INSERT API KEY',
                hipchatApiKey: 'INSERT API KEY',
                roomId: 123456,
                notifyHipchat: true
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['test']);
    grunt.loadTasks('tasks');
};