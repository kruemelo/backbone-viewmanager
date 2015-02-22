define(['viewManager'], function (BackboneViewManager) {

  'use strict';

  var ExampleView = BackboneViewManager.extendView({

    render: function () {

      this.$el.html('<h1>' + Date.now() + '</h1>');

      return this;
    }

  });

  return ExampleView;

});
