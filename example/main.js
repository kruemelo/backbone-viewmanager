require.config({
  baseUrl: './',
  paths: {
    'jquery': 'libs/jquery',
    'underscore': 'libs/underscore',
    'backbone': 'libs/backbone',
    'viewManager': '../src/backbone-viewmanager',
  }
});
// Load modules and use them
require([
  'jquery',
  'underscore',
  'backbone',
  'viewManager',
  'ExampleView'
  ], function (
    $,
    _,
    Backbone,
    ViewManager,
    ExampleView
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
            viewManager,
            exampleView,
            ExampleView2,
            exampleView2;

          /* global window */
          viewManager = new ViewManager({window: window, $: $, $el: $el});

          exampleView = new ExampleView();

          ExampleView2 = ViewManager.extendView({
            clicked: 0,
            // initialize: function (options) {
            initialize: function () {
              this.listenTo(viewManager, 'resize', this.resize);
            },
            resize: function (sizes) {
              /*jshint browser: true*/
              window.console.log(sizes);
            },
            events: {
              'click button': function () {
                ++this.clicked;
                this.render();
              }
            },
            render: function () {
              this.$el.html('<button>click me (' + this.clicked + ')</button>');
              return this;
            }
          });

          exampleView2 = new ExampleView2({
            el: '.example-view-2-container'
          });

          exampleView2.on('vm-render', function () {
            exampleView.render();
          });

          viewManager.on('resize', function () {
            exampleView.render();
          });

          viewManager
            .show(exampleView)
            .show(exampleView2)
            .toFront(exampleView);
        }
      });

      // jshint unused:false
      var router = new Router();
      Backbone.history.start();
    });
});