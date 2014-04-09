console.log('loaded: js/main.js');

require.config({
  paths: {
    'jquery':     'lib/jquery',
    'underscore': 'lib/underscore-amd',
    'backbone':   'lib/backbone-amd',
    'text':       'lib/req-plugin-text',
    'tap':        'lib/jq-plugin-tap',
    'scrollable': 'lib/jq-plugin-scrollable',
    'bootstrap':  'lib/bootstrap',
    'mustache':   'lib/mustache'
  },

  shim: {
    'tap': ['jquery'],
    'scrollable': ['tap'],
    'bootstrap': ['jquery']
  }

});

require(['app'], function (App) {
  var app = new App();

  window.app = app;
});