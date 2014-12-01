
var path = require('path');
var assert = require('assert');
var util = require('util');
var requirejs = require('requirejs');
var inspect = require('util').inspect;
var vm;
var jsdom = require("jsdom");

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

var window = jsdom.jsdom().parentWindow;

var $ = require('jquery')(window);
window.$ = $;

var Backbone = requirejs('backbone');
Backbone.$ = $;

var ViewManager = requirejs('viewmanager');

describe("viewmanager", function () {

  it("should initialize", function () {

    vm = new ViewManager({
      window: window,
      $: $,
      $el: $('body', $(window))
    });

    assert.strictEqual(typeof vm, 'object', 'should be type of object');
    assert(vm.$window, 'should have option $window value set');
    assert(vm.$el, 'should have option $el value set');

  });

  it('should extend a view', function (done) {

    var baseView = Backbone.View.extend({
      initialize: function (options) {
        // console.log('base initialize()', inspect(options));
      },
      render: function () {
        this.$el.html(this.$el.html() + 'baseView');
        return this;
      }
    });

    var extendedView = vm.extendView(baseView, {
      // initialize: function (options) {
      // },
      render: function () {
        this.$el.html(this.$el.html() + 'extendedView');
        baseView.prototype.render.apply(this, arguments);
        return this;
      }
    });

    var view = new extendedView({$el: vm.$el});

    view.on('render', function (ev) {
      assert.strictEqual(view.viewManager, vm, 'should have set view manager ref when called super.initialize');
      assert.deepEqual(view.$el.data('vm-view'), view, '$el should have stored a reference to the view')
      assert.strictEqual(view.$el.html(), 'extendedViewbaseView', 'should have called super.render in valid order');
      // console.log('innerHTML: "' + window.document.querySelector('body').innerHTML + '"', view.el.innerHTML);
      done();
    });

    vm.show(view)
    // view.render();

  });

});