'use strict';

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
      'client/lib/CodeMirror/lib/codemirror.js',
      'client/lib/CodeMirror/mode/javascript/javascript.js',
      'client/lib/marked/marked.min.js',
      'client/lib/underscore/underscore-min.js',
      'client/lib/angular/angular.min.js',
      'client/lib/angular-ui-router/release/angular-ui-router.min.js',
      'client/lib/angular-sanitize/angular-sanitize.min.js',
      'client/lib/angular-mocks/angular-mocks.js',
      'client/lib/jquery/dist/jquery.min.js',
      'client/app/**/*.js',
      'node_modules/expect.js/index.js',
      'specs/client/**/*.test.client.js'
    ],
    //reporters: ['nyan','unicorn']
    reporters: ['nyan'],
    singleRun: true,
    autoWatch: false
  });
};
