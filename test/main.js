require.config({
    paths: {
        jquery: 'test/libs/jquery',
        underscore: 'test/libs/underscore',
        backbone: 'test/libs/backbone',
        chai: '/node_modules/chai/chai',
        BackboneViewmanager: 'src/backbone-viewmanager'
    },
    baseUrl: '/'
});

mocha.setup({
    ui: 'bdd'
});

require([
    // testPathname
], function () {

    /* jshint browser: true */
    if (window.mochaPhantomJS) {
      /* global mochaPhantomJS */
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
});
