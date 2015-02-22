
define(['../src/backbone-viewmanager'], function (BackboneViewManager) {

  'use strict';

  var AMDView = BackboneViewManager.extendView({
    bla: 42
  });

  return AMDView;

});
