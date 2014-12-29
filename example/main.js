require.config({
  baseUrl: './..',
  paths: {
    'jquery': 'libs/jquery',
    'underscore': 'libs/underscore',
    'backbone': 'libs/backbone',
    'viewManager': 'src/backbone-viewmanager',
  }
});
// Load modules and use them
require([
  'jquery',
  'underscore',
  'backbone',
  'viewManager'
  ], function (
    $,
    _,
    Backbone,
    ViewManager
  ){
    'use strict';
    $(function () {
      var Router = Backbone.Router.extend({
        routes: {
          '': 'main'
        },
        main: function () {

          var
            $el = $('body'),
            viewManager
          ;

          /* global window */
          viewManager = new ViewManager({window: window, $: $, $el: $el});

          define('config', [], function () {
            return {
              getViewManager: function () {
                return viewManager;
              }
            };
          });

        }
      });

      // jshint unused:false
      var router = new Router();
      Backbone.history.start();
    });
});