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

```
$ mocha -R spec ./test/viewManagerTest.js
```

License
-------
[WTFPL](http://www.wtfpl.net/)
