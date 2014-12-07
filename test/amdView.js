
define(['module', 'config'], function (module, config) {

  'use strict';

  // return module.config().getViewManager().extendView({
  //   bla: 42
  // });

  return config.getViewManager().extendView({
    bla: 42
  });

});
