define([
    'jquery',
    'underscore',
    'backbone',
    'chai',
    'BackboneViewmanager',
  ],
  function($, _, backbone, chai, BackboneViewmanager) {

  var assert = chai.assert,
    vm = new BackboneViewmanager({
      /* global window */
      window: window,
      $el: $('body')
    });

  define('config', [], function () {
    return {
      getViewManager: function () {
        return vm;
      }
    };
  });

  describe('viewmanager', function() {

    it('should initialize', function() {
      assert.strictEqual(typeof vm, 'object', 'should be type of object');
      assert(vm.$window, 'should have option $window value set');
      assert(vm.$el, 'should have option $el value set');
      assert(vm.$el.get(0), 'should have option $el.get(0) HTMLElement set');
    });

    it('should extend a view', function (done) {

      var BaseView = vm.extendView({
        // initialize: function(options) {
        //   console.log('base initialize()', inspect(options));
        // },
        render: function() {
          this.$el.html(this.$el.html() + 'BaseView');
          return this;
        }
      });

      var ExtendedView = vm.extendView(BaseView, {
        // initialize: function (options) {
        // },
        render: function() {
          this.$el.html(this.$el.html() + 'ExtendedView');
          BaseView.prototype.render.apply(this, arguments);
          return this;
        }
      });

      var view = new ExtendedView({
        $el: vm.$el
      });

      var called = 0;

      view.on('render', function (renderedView) {
        ++called;
        assert(renderedView);
        // console.log('rendered ' + called + 'x times', stacktrace());
        if (2 === called) {
          assert.strictEqual(view.viewManager, vm, 'should have set view manager ref when called super.initialize');
          assert.deepEqual(view.$el.data('vm-view'), view, '$el should have stored a reference to the view');
          assert.strictEqual(view.$el.html(), 'ExtendedViewBaseView', 'should have called super.render in valid order');
          // console.log('innerHTML: "' + window.document.querySelector('body').innerHTML + '"', view.el.innerHTML);
          done();
        }
      });
      vm.show(view);
      // view.render();
    });

    it('should extend an amd view', function (done) {

      require(['test/amdView'], function (AMDView) {
        var amdView = new AMDView();
        assert.equal(amdView.bla, 42);
        done();
      });
    });

    it('should manage a container element', function () {
      var htm = '<div class="container"></div>';
      vm.$el.html(htm);
      assert.equal(vm.$el.html(), htm);
    });

    it('should trigger resize events to views', function (done) {
      var view,
        View = vm.extendView({
          initialize: function(options) {
            assert(options);
            // window.console.log(options);
            this.listenTo(vm, 'resize', this.resize);
          },
          resize: function(sizes) {
            // console.log(sizes);
            assert(sizes);
            done();
          }
        });
      view = new View();
      vm.show(view);
      vm.trigger('windowResizeEnd');
    });
  });
});