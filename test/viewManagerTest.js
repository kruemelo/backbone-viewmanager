/*global assert */
/* //global console */
describe('BackboneViewmanager', function () {

  var $, _, Backbone,
    BackboneViewmanager, vm;

  before(function (done) {

    // console.log('before..');

    require.config({
        paths: {
            jquery: 'libs/jquery',
            underscore: 'libs/underscore',
            backbone: 'libs/backbone'
        }
    });

    require(['jquery', 'underscore', 'backbone', '../src/backbone-viewmanager'],
      function (jquery, underscore, backbone, bbvm) {
        $ = jquery;
        _ = underscore;
        Backbone = backbone;
        BackboneViewmanager = bbvm;

        define('config', [], function () {
          return {
            getViewManager: function () {
              return vm;
            }
          };
        });

        done();
    });

  });

  it('should initialize', function () {
    vm = new BackboneViewmanager({
        /*global window */
        window: window,
        $el: $('body')
      });
    assert.strictEqual(typeof vm, 'object', 'should be type of object');
    assert(vm.$window, 'should have option $window value set');
    assert.strictEqual(vm.$window.get(0), window, 'window ref should be strict equal to window');
    assert(vm.$el, 'should have option $el value set');
    assert(vm.$el.get(0), 'should have option $el.get(0) HTMLElement set');
  });

  it('should extend a view', function (done) {

    var initializedBase,
      initializedExtended,
      BaseView = vm.extendView({
        initialize: function () {
          initializedBase = true;
        },
        render: function () {
          this.$el.html(this.$el.html() + 'BaseView');
          return this;
        }
      }
    );

    var ExtendedView = vm.extendView(BaseView, {
      initialize: function () {
        initializedExtended = true;
        BaseView.prototype.initialize.apply(this, arguments);
      },
      render: function () {
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
        assert(initializedBase, 'should have initialized base');
        assert(initializedExtended, 'should have initialized extended');
        assert.strictEqual(view.viewManager, vm, 'should have set view manager ref when extended');
        assert.deepEqual(view.$el.data('vm-view'), view, '$el should have stored a reference to the view');
        assert.strictEqual(view.$el.html(), 'ExtendedViewBaseView', 'should have called BaseView.render in valid order');
        // console.log('innerHTML: "' + window.document.querySelector('body').innerHTML + '"', view.el.innerHTML);
        done();
      }
    });
    vm.show(view);
    // view.render();
  });

  it('should extend an amd view', function (done) {

    require(['amdView'], function (AMDView) {
      var amdView = new AMDView();
      assert.equal(amdView.bla, 42);
      done();
    });
  });

  // it('should manage a container element', function () {
  //   var htm = '<div class="container"></div>';
  //   vm.$el.html(htm);
  //   assert.equal(vm.$el.html(), htm);
  // });

  it('should trigger resize events to views', function (done) {
    var view,
      View = vm.extendView({
        // initialize: function (options) {
        initialize: function () {
          this.listenTo(vm, 'resize', this.resize);
        },
        resize: function (sizes) {
          // console.log(sizes);
          assert(sizes);
          done();
        }
      });
    view = new View();
    vm.show(view);
    vm.trigger('windowResizeEnd');
  });

  it('should show a wait view', function (done) {
    var View = vm.extendView(),
      view = new View(),
      $vmWaitView;

    // start wait view
    view.waitView();

    $vmWaitView = view.$('.vm-waitView');

    assert($vmWaitView.length, 'should contain a wait element');
    assert(view.$el.hasClass('vm-waiting'), 'view should have class "vm-waiting"');
    assert(parseInt($vmWaitView.css('z-index'), 10) > 0, 'wait-view element should have z-index > 0');

    // resume view
    view.resumeView();
    $vmWaitView = view.$('.vm-waitView');

    assert(!$vmWaitView.length, 'should not contain a wait element');
    assert(!view.$el.hasClass('vm-waiting'));

    done();
  });

});
