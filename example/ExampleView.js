define(['backbone'], function (Backbone) {

  'use strict';

  var ExampleView = Backbone.View.extend({

    // initialize: function (options) {
    initialize: function () {
      this.listenTo(this.viewManager, 'resize', this.resize);
    },

    resize: function (sizes) {
      /*jshint browser: true*/
      window.console.log(sizes);
    },

    render: function () {

      this.$el.html('<h1>' + Date.now() + '</h1>');

      return this;
    }

  });

  return ExampleView;

});
