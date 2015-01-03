backbone-viewmanager
====================

AMD module to manage backbone views

API
---


Use
---
```
// requires: window, jQuery, underscore.js, backbone.js

var vm = new ViewManager({
  window: window,
  $: $,
  $el: $('body', $(window))
});

var view = vm.extendView();

vm
  .show(
    view,
    {
      modal: true,
      center: true
    }
  )
  .toFront(view);

```

Test
----

requires phantomjs ("^1.9.13") and mocha-phantomjs ("^3.5.2") installed:

```
sudo npm install -g phantomjs
sudo npm install -g mocha-phantomjs
sudo npm install
```

run test:

```
$ grunt test
```

Build
----
target dir: build/

```
$ grunt build
```
or
```
$ grunt
```

License
-------
[WTFPL](http://www.wtfpl.net/)
