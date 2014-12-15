// mocha test/viewManagerTest.js -R spec
var path = require('path');
var assert = require('assert');
var util = require('util');
var requirejs = require('requirejs');
var inspect = require('util').inspect;
var vm;
var jsdom = require('jsdom');
var stacktrace = require('stacktrace-js');

requirejs.config({
  baseUrl: "./",
  paths: {
    // 'jquery': '../node_modules/jquery/dist/jquery',
    // 'underscore': '../node_modules/underscore/underscore',
    // 'backbone': '../node_modules/backbone/backbone',
    'viewmanager': path.join(__dirname, '../backbone-viewmanager'),
    'amdView': path.join(__dirname, './amdView'),
  }
  // backbone: {
  //   deps: ['underscore', 'jquery'],
  //   exports: 'backbone'
  // }
});

var window = jsdom.jsdom().parentWindow;

// console.log(window.document.documentElement.outerHTML);
console.log('window size: ', window.innerWidth, window.innerHeight);

var $ = require('jquery')(window);
window.$ = window.jQuery = $;

var Backbone = requirejs('backbone');
Backbone.$ = $;

var ViewManager = requirejs('viewmanager');

vm = new ViewManager({
  window: window,
  $: $,
  $el: $('body', $(window))
});

requirejs.define('config', function () {
  return {
    window: window,
    $: $,
    $el: $('body', $(window)),
    getViewManager: function () {
      return vm;
    }
  };
});

// requirejs.config({
//   config: {
//     'amdView': {
//       getViewManager: function () {
//         return vm;
//       },
//       // viewManager: vm
//     }
//   }
// });

describe("viewmanager", function () {

  it("should initialize", function () {
    assert.strictEqual(typeof vm, 'object', 'should be type of object');
    assert(vm.$window, 'should have option $window value set');
    assert(vm.$el, 'should have option $el value set');
    assert(vm.$el.get(0), 'should have option $el.get(0) HTMLElement set');
  });

  it('should extend a view', function (done) {

    var BaseView = vm.extendView({
      initialize: function (options) {
        // console.log('base initialize()', inspect(options));
      },
      render: function () {
        this.$el.html(this.$el.html() + 'BaseView');
        return this;
      }
    });

    var ExtendedView = vm.extendView(BaseView, {
      // initialize: function (options) {
      // },
      render: function () {
        this.$el.html(this.$el.html() + 'ExtendedView');
        BaseView.prototype.render.apply(this, arguments);
        return this;
      }
    });

    var view = new ExtendedView({$el: vm.$el});
    var called = 0;

    view.on('render', function (renderedView) {
        ++called;
      // console.log('rendered ' + called + 'x times', stacktrace());
      if (2 === called) {
        assert.strictEqual(view.viewManager, vm, 'should have set view manager ref when called super.initialize');
        assert.deepEqual(view.$el.data('vm-view'), view, '$el should have stored a reference to the view')
        assert.strictEqual(view.$el.html(), 'ExtendedViewBaseView', 'should have called super.render in valid order');
        // console.log('innerHTML: "' + window.document.querySelector('body').innerHTML + '"', view.el.innerHTML);
        done();
      }
    });

    vm.show(view)
    // view.render();

  });


  it('should extend an amd view', function (done) {
    var AMDView = requirejs('amdView');
    var amdView = new AMDView();
    assert.equal(amdView.bla, 42);
    done();
  });


  it('should manage a container element', function () {
    vm.$el.get(0).innerHTML = '<div class="container"></div>'; // .html('<div class="container"></div>');
    console.log(vm.$el.html());
  });


  it('should trigger resize events to views', function (done) {
    var view,
      View = vm.extendView({
        initialize: function (options) {
          this.listenTo(vm, 'resize', this.resize);
        },
        resize: function (sizes) {
          // console.log(sizes);
          done();
        }
      });

    view = new View();

    vm.show(view);
    vm.trigger('windowResizeEnd');
  });

});