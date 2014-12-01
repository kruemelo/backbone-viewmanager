define([
  'jquery',
  'underscore',
  'backbone'
  ], function (
    $,
    _,
    Backbone
  ){

  'use strict';


  var ViewManager = function (options) {

    var self = this,
      fnCheckWindowResizeEnd = function () {

        var now = new Date().getTime(),
          timedOut = self.timeWindowResized && now >= self.timeWindowResized + 199;

        if (timedOut) {
          self.timeWindowResized = 0;
          self.trigger('windowResizeEnd');
          return;
        }

        self.timeWindowResized = now;
        _.delay(fnCheckWindowResizeEnd, 200);

      };

    _.extend(this, Backbone.Events);

    if (options.$) {
      $ = options.$;
    }

    this.$ = $;
    this.$el = options.$el || options.el && this.$options.el;
    this.window = options.window;
    this.$window = this.$(this.window);

    this.timeWindowResized = 0;

    this.$window.resize(function () {
      if (self.timeWindowResized === 0) {
        fnCheckWindowResizeEnd();
      }
    });

    this.on('windowResizeEnd', function () {

      self.resizeModalLayer();
      self.resizeViews();
      self.updateViewsPosition();

      self.trigger('resize', self.getSizes());
    });

  };


  ViewManager.prototype.extendView = function (baseView, extendedViewObj) {

    var vmRef = this, extendedView,
      tmpFnInit, tmpFnRender;

    if (undefined === extendedViewObj) {
      extendedViewObj = baseView;
      baseView = Backbone.View;
    }

    extendedView = baseView.extend(extendedViewObj);

    tmpFnInit = extendedView.prototype.initialize;
    extendedView.prototype.initialize = function () {
      this.viewManager = vmRef;
      tmpFnInit.apply(this, arguments);
      this.listenTo(vmRef, 'resize', this.resize);
    };

    tmpFnRender = extendedView.prototype.render;

    extendedView.prototype.render = function () {
      if (this.$el) {
        this.$el.data('vm-view', this);
      }
      tmpFnRender.apply(this, arguments);
      this.trigger('render', this);
    };

    return extendedView;
  };


  ViewManager.prototype.getMainBarView = function () {
    var $mainBarViewEl = this.$el.find('.vm-view-parent>.mainBarView');
    return $mainBarViewEl.length ? $mainBarViewEl.parent().data('view') : null;
  };


  ViewManager.prototype.setMainBarTitleText = function (text) {
    // this.trigger('setMainBarTitleText', text);
    var mainBarView = this.getMainBarView();
    if (mainBarView) {
      mainBarView.setMainBarTitleText(text);
    }
    return this;
  };


  ViewManager.prototype.getMainBarTitleText = function () {
    var mainBarView = this.getMainBarView();
    return mainBarView ? mainBarView.getMainBarTitleText() : undefined;
  };


  ViewManager.prototype.getSizes = function () {
      var $body = $('body'),
        mainBarView = this.getMainBarView(),
        $mainBar = mainBarView ? mainBarView.$('>.mainBarView') : null,   //this.getMainBarView(),
        sizes = {
          windowWidth: this.$window.innerWidth(),
          windowHeight: this.$window.innerHeight(),
          bodyWidth: $body.innerWidth(),
          bodyHeight: $body.innerHeight(),
          mainBarWidth: $mainBar ? $mainBar.outerWidth() : 0,
          mainBarHeight: $mainBar ? $mainBar.outerHeight() : 0
        };

      sizes.fullscreenWidth = sizes.windowWidth;
      sizes.fullscreenHeight = sizes.windowHeight;

      sizes.availableWidth = sizes.fullscreenWidth;
      sizes.availableHeight = sizes.fullscreenHeight - sizes.mainBarHeight;

      return sizes;
  };


  ViewManager.prototype.resizeModalLayer = function () {

    var $modalLayer = this.getModalLayer();

    $modalLayer.css({
      width: this.$window.innerWidth(),
      height: this.$window.innerHeight()
    });

    return this;
  };


  ViewManager.prototype.resizeViews = function () {

    var self = this;

    this.$el.find('.vm-view-parent.vm-fullscreen').each(function (index, viewEl) {
      self.resizeView($(viewEl));
    });

    this.$el.find('.vm-view-parent.vm-fill').each(function (index, viewEl) {
      self.resizeView($(viewEl));
    });

    return this;
  };


  ViewManager.prototype.updateViewsPosition = function () {

    var self = this;

    this.$el.find('.vm-view-parent.vm-centered').each(function (index, viewEl) {
      self.positionView($(viewEl));
    });

    return this;
  };


  ViewManager.prototype.getMaxZIndex = function (forViewEl) {

    var views = this.$el.find('.vm-view-parent'),
      zIndex,
      maxZIndex = 0,
      $viewEl;

    views.each(function (index, viewEl) {
      $viewEl = $(viewEl);
      zIndex = parseInt($viewEl.css('z-index'), 10) || 0;
      if (zIndex > maxZIndex && viewEl !== forViewEl) {
        maxZIndex = zIndex;
      }
    });

    return maxZIndex;
  };


  ViewManager.prototype.getTopModalViewEl = function (forViewEl) {

    var views = this.$el.find('.vm-view-parent.vm-modal'),
      zIndex,
      maxZIndex = 0,
      $viewEl,
      topModalViewEl;

    views.each(function (index, viewEl) {
      $viewEl = $(viewEl);
      zIndex = parseInt($viewEl.css('z-index'), 10) || 0;
      if (zIndex > maxZIndex && viewEl !== forViewEl) {
        maxZIndex = zIndex;
        topModalViewEl = viewEl;
      }
    });

    return topModalViewEl;
  };


  ViewManager.prototype.toFront = function (view) {

    var maxZIndex = this.getMaxZIndex(view.el),
      options = view.$el.data('vm-options') || {};

    view.$el.css('z-index', maxZIndex + 2);
    if (true === options.modal) {
      this.showModal(view.$el);
    }
    return this;
  };


  ViewManager.prototype.getModalLayer = function () {

    var $modalLayer = $(this.$el.find('.vm-modal-layer')[0]);

    if (0 === $modalLayer.length) {
      $modalLayer = $(document.createElement('div'))
        .addClass('vm-modal-layer')
        .css({
          position: 'fixed',
          display: 'none',
          top: 0,
          left: 0,
          'z-index': 0
        })
        .appendTo(this.$el);
    }

    return $modalLayer;
  };


  ViewManager.prototype.showModal = function ($viewEl) {

    var viewElZIndex = parseInt($viewEl.css('z-index'), 10) || 0,
      $modalLayer = this.getModalLayer();

    if (0 === viewElZIndex) {
      $modalLayer.hide();
    }
    else {
      $modalLayer.css({
        'z-index': viewElZIndex - 1,
        display: 'block'
      });
      this.resizeModalLayer();
      $modalLayer.show();
    }

    return this;
  };


  ViewManager.prototype.hideModal = function ($viewEl) {

    var $modalLayer = $(this.$el.find('.vm-modal-layer')[0]),
      topModalViewEl = this.getTopModalViewEl($viewEl.get(0));

    if (topModalViewEl) {
      this.showModal($(topModalViewEl));
    }
    else if ($modalLayer.length){
      $modalLayer.css('z-index', 0);
      $modalLayer.hide();
    }

    return this;
  };


  ViewManager.prototype.show = function (view, options) {

    var self = this,
      attached = view.$el.parent().length !== 0,
      $viewEl = attached ? view.$el : $('<div></div>');

    options = options || {};

    view.off(null, null, this);

    $viewEl
      .data('vm-options', options)
      .addClass('vm-view-parent')
    ;

    if (options.fill) {
      $viewEl
        .addClass('vm-fill');
      view.on('render', function () {
        self.resizeView($viewEl);
      }, this);
    }

    if (options.fullscreen) {
      $viewEl
        .addClass('vm-fullscreen');
      view.on('render', function () {
        self.resizeView($viewEl);
      }, this);
    }

    if (options.center) {

      $viewEl
        .addClass('vm-centered')
        .css({
          position: options.position ? options.position : 'fixed'
        });

      view.on('render', function () {
        self.positionView($viewEl);
      }, this);

    }
    else {
      $viewEl.removeClass('vm-centered');
    }

    if (true === options.modal) {
      $viewEl.addClass('vm-modal');
      view.on('render', function () {
        self.showModal($viewEl);
      }, this);
      view.once('close', function () {
        self.hideModal($viewEl);
      }, this);
    }

    if (!attached) {

      this.$el.append($viewEl);

      view.once('close', function () {
        view.off(null, null, self);
        $viewEl.remove();
      }, this);

      view.setElement($viewEl);
    }

    view.render();

    if (true === options.toFront || true === options.modal) {
      this.toFront(view);
    }

    return this;
  };


  ViewManager.prototype.resizeView = function ($viewEl) {

    var options = $viewEl.data('vm-options') || {},
      sizes = this.getSizes(),
      css;

    if (true === options.fill) {
      css = {
        width: sizes.fullscreenWidth,
        height: sizes.availableHeight,
        position: 'absolute',
        top: sizes.mainBarHeight,
        left: 0,
        overflow: 'auto'
      };
    }

    if (true === options.fullscreen) {
      css = {
        width: sizes.fullscreenWidth,
        height: sizes.fullscreenHeight,
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto'
      };

    }

    if (css) {
      $viewEl.css(css);
window.console.log(
  'ViewManager.resizeView(): ',
  $viewEl.get(0).firstChild && $viewEl.get(0).firstChild.className || $viewEl
);
    }

    return this;
  };


  ViewManager.prototype.positionView = function ($viewEl) {

    var options = $viewEl.data('vm-options') || {},
      sizes = this.getSizes(),
      viewWidth = $viewEl.outerWidth(),
      viewHeight = $viewEl.outerHeight(),
      availableWidth = (true === options.fullscreen) ? sizes.windowWidth : sizes.availableWidth,
      availableHeight = (true === options.fullscreen) ? sizes.windowHeight : sizes.availableHeight,
      css = {};

    if ('vertical' === options.center || 'both' === options.center) {
      css.top = (availableHeight / 2 - viewHeight / 2) + (true === options.fullscreen ? 0 : sizes.mainBarHeight);
    }
    if ('horizontal' === options.center || 'both' === options.center) {
      css.left = availableWidth / 2 - viewWidth / 2;
    }

    $viewEl.css(css);

    return this;
  };

  return ViewManager;

});
