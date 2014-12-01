backbone-viewmanager
====================

AMD module to manage backbone views

API
---


Use
---
```

var vm = new ViewManager({
  $el: $('body'),
  $window: $(window)
});

var view = Backbone.View.extend({});

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
$ mocha
```

License
-------
[WTFPL](http://www.wtfpl.net/)
