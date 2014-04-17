console.log('loaded: js/main.js');

require.config({
  paths: {
    'jquery':     'js/lib/jquery',
    'underscore': 'js/lib/underscore-amd',
    'backbone':   'js/lib/backbone-amd',
    'text':       'js/lib/req-plugin-text',
    'tap':        'js/lib/jq-plugin-tap',
    'scrollable': 'js/lib/jq-plugin-scrollable',
    'bootstrap':  'js/lib/bootstrap',
    'mustache':   'js/lib/mustache'
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