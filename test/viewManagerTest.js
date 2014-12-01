
var path = require('path');
var assert = require('assert');
var util = require('util');
var requirejs = require('requirejs');
var jsdom = require("jsdom").jsdom();

requirejs.config({
  baseUrl: "./",
  paths: {
    // 'jquery': '../node_modules/jquery/dist/jquery',
    // 'underscore': '../node_modules/underscore/underscore',
    // 'backbone': '../node_modules/backbone/backbone',
    'viewmanager': path.join(__dirname, '../backbone-viewmanager')
  },
  // backbone: {
  //   deps: ['underscore', 'jquery'],
  //   exports: 'backbone'
  // }
});


var window = jsdom.parentWindow;
var $ = require('jquery')(window);
var Backbone = requirejs('backbone');
var ViewManager = requirejs('viewmanager');
var vm;

describe("viewmanager", function () {

  it("should initialize", function () {

    vm = new ViewManager({
      $el: $('<body></body>'),
      $window: $(window)
    });

    assert.strictEqual(typeof vm, 'object', 'should be type of object');
    assert(vm.$window, 'should have option $window value set');
    assert(vm.$el, 'should have option $el value set');

  });

});