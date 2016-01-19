# grunt-ot-webpagetest

> Grunt task for running against the WebPageTest API and firing the results into Hipchat and Logstash/StatsD

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ot-webpagetest --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ot-webpagetest');
```

## The 'ot-webpagetest' Task

ot-webpagetest requires the following parameters to be set in your Gruntfile.js config:

```javascript
ot-webpagetest: {
  default: {
    options: {
      testUrl: 'http://google.com',
      wptApiKey: 'API_KEY_HERE',
      hipchatApiKey: 'API_KEY_HERE',
      roomId: 12345,
      logstashHost: 'localhost',
      logstashPort: 6379,
      statsdHost: 'localhost',
      statsdPort: 8125,
      statsdPrefix: 'PREFIX_HERE',
      runs: 1
    }
  }
}
```

With these configuration properties set, you can add `ot-webpagetest` to your default tasks list. That'll look something like this:

    grunt.registerTask('default', ['jshint', 'ot-webpagetest']);
