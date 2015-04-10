/*global assert */
/* //global console */
describe('BackboneViewmanager', function () {

  var $, _, Backbone,
    BackboneViewmanager,
    vm,
    ViewClass,
    $rootEl;

  before(function (done) {

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

        $rootEl = $('#mocha');

        ViewClass = BackboneViewmanager.extendView({
          initialize: function (options) {
            this.model = new Backbone.Model({
              name: options.name,
              clicked: false
            });
            this.listenTo(this.model, 'change', this.render);
          },
          events: {
            'click .btn': function () {
              this.model.set('clicked', this.model.get('name'));
            }
          },
          render: function () {
            this.$el.html('<div class="btn">' + this.model.get('name') + '</div>');
            return this;
          }
        });

        done();
    });

  });

  beforeEach(function () {
    $rootEl.empty();
  });

  it('should initialize', function () {
    vm = new BackboneViewmanager({
        /*global window */
        window: window,
        $el: $rootEl
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
      BaseView = BackboneViewmanager.extendView({
        initialize: function () {
          initializedBase = true;
        },
        render: function () {
          this.$el.html(this.$el.html() + 'BaseView');
          return this;
        }
      });

    var ExtendedView = BackboneViewmanager.extendView(BaseView, {
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
        assert.deepEqual(view.$el.data('vm-view'), view, '$el should have stored a reference to the view');
        assert.strictEqual(view.$el.html(), 'ExtendedViewBaseView', 'should have called BaseView.render in valid order');
        // console.log('innerHTML: "' + window.document.querySelector('body').innerHTML + '"', view.el.innerHTML);
        done();
      }
    });
    vm.show(view);
    // view.render();
  });

  it('should render different view instances', function (done) {

    var view1 = new ViewClass({name: 'view1'}),
      view2 = new ViewClass({name: 'view2'});

    view1.render();

    view1.on('render', function () {
      // console.log('rendered: ' + this.$el.html(), 'model: ' + JSON.stringify(this.model.attributes));
      assert.strictEqual(this.model.get('name'), 'view1');
      assert.strictEqual(this.model.get('clicked'), 'view1');
      assert.strictEqual(this.$el.html(), '<div class="btn">view1</div>');
      view2.render();
    });

    view2.on('render', function () {
      // console.log('rendered: ' + this.$el.html(), 'model: ' + JSON.stringify(this.model.attributes));
      assert.strictEqual(this.model.get('name'), 'view2');
      assert.strictEqual(this.model.get('clicked'), false);
      assert.strictEqual(this.$el.html(), '<div class="btn">view2</div>');
      done();
    });

    view1.$('.btn').trigger('click');

  });

  it('should use correct render event handler', function (done) {

    var view3 = new ViewClass({name: 'view3'});

    view3.on('render', function () {
      // console.log('rendered: ' + this.$el.html(), 'model: ' + JSON.stringify(this.model.attributes));
      assert.strictEqual(this.model.get('name'), 'view3');
      assert.strictEqual(this.model.get('clicked'), false);
      assert.strictEqual(this.$el.html(), '<div class="btn">view3</div>');

      done();
    });

    view3.render();
  });

  it('should extend an amd view', function (done) {

    require(['amdView'], function (AMDView) {
      var amdView = new AMDView();
      assert.equal(amdView.bla, 42);
      done();
    });
  });

  it('should trigger resize events to views', function (done) {
    var view,
      View = BackboneViewmanager.extendView({
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
    var View = BackboneViewmanager.extendView(),
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
