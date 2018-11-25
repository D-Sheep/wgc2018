(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GameApp = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
var Vue // late bind
var version
var map = Object.create(null)
if (typeof window !== 'undefined') {
  window.__VUE_HOT_MAP__ = map
}
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }

  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cached together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

},{}],3:[function(require,module,exports){
(function (process){
/*!
  * vue-router v3.0.2
  * (c) 2018 Evan You
  * @license MIT
  */
'use strict';

/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

function extend (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

var View = {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    // used by devtools to display a router-view badge
    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
}

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */

var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
      ? 'router-link-active'
      : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
      ? 'router-link-exact-active'
      : globalExactActiveClass;
    var activeClass = this.activeClass == null
      ? activeClassFallback
      : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
      ? exactActiveClassFallback
      : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
}

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}
pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */

function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = extend({}, next);
    next._normalized = true;
    var params = extend(extend({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

/*  */



function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
      ? originalRedirect(createRoute(record, location, null, router))
      : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */

var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
  window.history.replaceState({ key: getStateKey() }, '', window.location.href.replace(window.location.origin, ''));
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior.call(router, to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (
    instances[key] &&
    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */

var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (supportsScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = decodeURI(window.location.pathname);
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */

var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : decodeURI(href.slice(index + 1))
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */

var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */



var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.2';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

module.exports = VueRouter;

}).call(this,require('_process'))
},{"_process":1}],4:[function(require,module,exports){
var inserted = exports.cache = {}

function noop () {}

exports.insert = function (css) {
  if (inserted[css]) return noop
  inserted[css] = true

  var elem = document.createElement('style')
  elem.setAttribute('type', 'text/css')

  if ('textContent' in elem) {
    elem.textContent = css
  } else {
    elem.styleSheet.cssText = css
  }

  document.getElementsByTagName('head')[0].appendChild(elem)
  return function () {
    document.getElementsByTagName('head')[0].removeChild(elem)
    inserted[css] = false
  }
}

},{}],5:[function(require,module,exports){
(function (process){
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
'use strict';

var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};

module.exports = index;

}).call(this,require('_process'))
},{"_process":1}],6:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 10, stdin */\n.navigation[data-v-6f952a2a] {\n  position: absolute;\n  z-index: 10;\n  padding: 0;\n  margin: 0;\n  width: 100%;\n  display: inline-flex;\n  justify-content: flex-start;\n  align-items: center; }\n  /* line 22, stdin */\n  .navigation ul[data-v-6f952a2a] {\n    list-style-type: none;\n    padding: 0;\n    margin: 0; }\n    /* line 27, stdin */\n    .navigation ul li[data-v-6f952a2a] {\n      display: inline-block;\n      cursor: pointer;\n      width: 70px;\n      height: 30px;\n      border: 2px solid burlywood;\n      text-align: center;\n      text-transform: uppercase;\n      line-height: 30px;\n      font-size: 14px;\n      border-radius: 3px;\n      margin: 10px 0;\n      margin-right: 10px;\n      background: white; }\n      /* line 42, stdin */\n      .navigation ul li[data-v-6f952a2a]:hover {\n        background: #e6e6e6; }\n      /* line 46, stdin */\n      .navigation ul li[data-v-6f952a2a]:first-child {\n        margin-left: 10px; }\n      /* line 50, stdin */\n      .navigation ul li[data-v-6f952a2a]:last-child {\n        margin-right: 0; }")
;(function(){
'use strict';

module.exports = {
	name: 'Navigation',
	props: ['navigationItems'],
	data: function data() {
		return {
			enterGym: false
		};
	},

	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		},
		player: function player() {
			return this.$store.state.player;
		},
		canVisitGym: function canVisitGym() {
			return this.player.states.money >= BASE_GYM_FEE;
		}
	},
	methods: {
		navigate: function navigate(route) {
			if (route === 'gym') {
				if (this.canVisitGym) {
					this.warnAboutFee();
				} else {
					this.notifyAboutFee();
				}

				return;
			}

			this.route = route;
		},
		warnAboutFee: function warnAboutFee() {
			var _this = this;

			swal({
				html: 'Entering the GYM will cost you ' + BASE_GYM_FEE + ' coins.',
				showCancelButton: true,
				focusConfirm: false

			}).then(function (result) {
				if (result.value) {
					_this.route = 'gym';
				}
			});
		},
		notifyAboutFee: function notifyAboutFee() {
			swal({
				html: 'It costs ' + BASE_GYM_FEE + ' coins to hit the gym.'
			});
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"navigation"},[_c('ul',_vm._l((_vm.navigationItems),function(label,item){return _c('li',{on:{"click":function($event){$event.preventDefault();_vm.navigate(item)}}},[_vm._v(_vm._s(label))])}))])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-6f952a2a"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6f952a2a", __vue__options__)
  } else {
    hotAPI.reload("data-v-6f952a2a", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],7:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 8, stdin */\n.overlay[data-v-88cb11ee] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  pointer-events: none; }")
;(function(){
'use strict';

module.exports = {
	name: 'Overlay',
	components: {
		'player-stats': require('./PlayerStats.vue'),
		'player-states': require('./PlayerStates.vue')
	},
	computed: {
		player: function player() {
			return this.$store.state.player;
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"overlay"},[_c('player-stats',{attrs:{"stats":_vm.player.stats,"states":_vm.player.states,"lives":_vm.player.ownedItems.length}})],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-88cb11ee"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-88cb11ee", __vue__options__)
  } else {
    hotAPI.reload("data-v-88cb11ee", __vue__options__)
  }
})()}
},{"./PlayerStates.vue":8,"./PlayerStats.vue":9,"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],8:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 14, stdin */\n.player__states[data-v-330185da] {\n  position: fixed;\n  top: 10px;\n  right: 10px; }\n  /* line 19, stdin */\n  .player__states ul[data-v-330185da] {\n    padding: 0;\n    margin: 0;\n    list-style-type: none; }")
;(function(){
'use strict';

module.exports = {
	name: 'PlayerStates',
	props: ['states', 'lives']
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"player__states"},[_c('ul',[_c('li',[_vm._v("Lives: "+_vm._s(_vm.lives))]),_vm._v(" "),_vm._l((_vm.states),function(value,slug){return _c('li',[_vm._v("\n\t\t\t"+_vm._s(slug + ': ' + value)+"\n\t\t")])})],2)])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-330185da"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-330185da", __vue__options__)
  } else {
    hotAPI.reload("data-v-330185da", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],9:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 22, stdin */\n.player__stats[data-v-23547177] {\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  height: 100px;\n  display: flex;\n  align-items: center;\n  padding-left: 50px;\n  background-color: #204361;\n  box-sizing: border-box; }\n  /* line 33, stdin */\n  .player__stats-item[data-v-23547177] {\n    margin-right: 50px;\n    display: inline-flex;\n    align-items: center; }\n  /* line 39, stdin */\n  .player__stats-icon[data-v-23547177] {\n    display: inline-block;\n    width: 50px;\n    height: 50px;\n    background-size: contain;\n    background-position: center;\n    background-repeat: no-repeat;\n    margin-right: 10px; }\n    /* line 48, stdin */\n    .player__stats-icon--energy[data-v-23547177] {\n      background-image: url(\"assets/img/icons/energy.png\"); }\n    /* line 51, stdin */\n    .player__stats-icon--hunger[data-v-23547177] {\n      background-image: url(\"assets/img/icons/hunger.png\"); }\n    /* line 54, stdin */\n    .player__stats-icon--injury[data-v-23547177] {\n      background-image: url(\"assets/img/icons/injury.png\"); }\n    /* line 57, stdin */\n    .player__stats-icon--strength[data-v-23547177] {\n      background-image: url(\"assets/img/icons/strength.png\"); }\n    /* line 60, stdin */\n    .player__stats-icon--money[data-v-23547177] {\n      background-image: url(\"assets/img/icons/money.png\"); }\n    /* line 63, stdin */\n    .player__stats-icon--lives[data-v-23547177] {\n      background-image: url(\"assets/img/icons/lives.png\"); }\n  /* line 68, stdin */\n  .player__stats-number[data-v-23547177] {\n    font-size: 40px;\n    color: #65869e; }\n  /* line 73, stdin */\n  .player__stats-bar[data-v-23547177] {\n    display: inline-block;\n    background-color: #65869e;\n    height: 40px; }\n    /* line 78, stdin */\n    .player__stats-bar-wrap[data-v-23547177] {\n      height: 40px;\n      display: inline-block;\n      width: 200px;\n      border: 4px solid white;\n      background-color: #204361; }\n  /* line 87, stdin */\n  .player__stats > [data-v-23547177]:last-child {\n    margin-right: 0; }")
;(function(){
'use strict';

module.exports = {
	name: 'PlayerStats',
	props: ['stats', 'states', 'lives'],
	components: {
		navigation: require('./Navigation.vue')
	},
	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		}
	},
	methods: {
		getStatBarWidth: function getStatBarWidth(value) {
			return value + '%';
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"player__stats"},[_vm._l((_vm.stats),function(value,slug){return _c('div',{staticClass:"player__stats-item"},[_c('span',{staticClass:"player__stats-icon",class:'player__stats-icon--' + slug}),_vm._v(" "),_c('span',{staticClass:"player__stats-bar-wrap"},[_c('span',{staticClass:"player__stats-bar",style:({width: _vm.getStatBarWidth(value)})})])])}),_vm._v(" "),_c('div',{staticClass:"player__stats-item"},[_c('span',{staticClass:"player__stats-icon player__stats-icon--money"}),_vm._v(" "),_c('span',{staticClass:"player__stats-number"},[_vm._v(_vm._s(_vm.states.money))])]),_vm._v(" "),_c('div',{staticClass:"player__stats-item"},[_c('span',{staticClass:"player__stats-icon player__stats-icon--lives"}),_vm._v(" "),_c('span',{staticClass:"player__stats-number"},[_vm._v(_vm._s(_vm.lives))])])],2)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-23547177"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-23547177", __vue__options__)
  } else {
    hotAPI.reload("data-v-23547177", __vue__options__)
  }
})()}
},{"./Navigation.vue":6,"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],10:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 13, stdin */\n.training__progress[data-v-354b1ac5] {\n  position: absolute;\n  background: linear-gradient(to left, white 50%, transparent 50%);\n  background-size: 200% 100%;\n  background-position: left bottom;\n  left: 0;\n  right: 0;\n  top: 145px;\n  margin-left: auto;\n  margin-right: auto;\n  padding: 30px;\n  width: 590px;\n  vertical-align: middle;\n  line-height: 1.5em;\n  font-size: 30px;\n  text-align: center;\n  color: #65869e;\n  border: 4px solid #65869e;\n  border-radius: 80px;\n  text-transform: uppercase;\n  transition: ease background .1s; }\n\n/* line 47, stdin */\n.training__hand[data-v-354b1ac5] {\n  position: absolute;\n  z-index: 2;\n  bottom: 250px;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  margin-right: auto;\n  width: 280px;\n  height: 326px;\n  background-image: url(\"assets/img/gym/hand.gif\");\n  background-position: 50% 50%;\n  background-repeat: no-repeat; }\n\n/* line 65, stdin */\n.training__arrow[data-v-354b1ac5] {\n  position: absolute;\n  z-index: 1;\n  bottom: 100px;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  margin-right: auto;\n  width: 502px;\n  height: 640px;\n  background-image: url(\"assets/img/gym/arrow.png\");\n  background-position: 50% 50%;\n  background-repeat: no-repeat; }")
;(function(){
'use strict';

module.exports = {
	name: 'Training',
	props: ['training', 'player'],
	data: function data() {
		return {
			trained: 0,
			difficulityInterval: null,
			keyPressed: false
		};
	},

	computed: {
		finishedTraining: function finishedTraining() {
			return this.trained >= MAX_TRAINED;
		}
	},
	watch: {
		finishedTraining: function finishedTraining(value) {
			if (value) {
				var newStrengthValue = this.player.stats.strength + this.training.reward > MAX_STRENGTH ? MAX_STRENGTH : this.player.stats.strength + this.training.reward;
				var newInjuryValue = this.player.stats.injury - this.training.reward <= 0 ? 0 : this.player.stats.injury - this.training.reward;

				this.$store.commit('updatePlayerStat', { stat: 'strength', value: newStrengthValue });
				this.$store.commit('updatePlayerStat', { stat: 'injury', value: newInjuryValue });
				this.trained = 0;
				this.$emit('trained');
			}
		}
	},
	beforeDestroy: function beforeDestroy() {
		clearInterval(this.difficulityInterval);
		$('body').off('keydown');
		$('body').off('keyup');
	},
	mounted: function mounted() {
		this.initControls();
		this.setDifficulityInterval();
	},

	methods: {
		initControls: function initControls() {
			var _this = this;

			$('body').on('keydown', function (event) {
				if (event.keyCode === KEY_UP) {
					_this.pressed();
				}
			});

			$('body').on('keyup', function (event) {
				if (event.keyCode === KEY_UP) {
					_this.keyPressed = false;
				}
			});
		},
		setDifficulityInterval: function setDifficulityInterval() {
			var _this2 = this;

			this.difficulityInterval = setInterval(function () {
				if (_this2.finishedTraining) {
					clearInterval(_this2.difficulityInterval);
				}

				if (_this2.trained <= 0) {
					_this2.trained = 0;

					return;
				}

				_this2.trained -= 2;
			}, 100);
		},
		pressed: function pressed() {
			if (!this.keyPressed) {
				this.keyPressed = true;

				this.trained += Math.floor(10 - this.training.reward / 12);
			}
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"training"},[_c('div',{staticClass:"training__progress",style:({backgroundPositionX: -_vm.trained + '%'})},[_vm._v("\n\t\tkeep pressing"),_c('br'),_vm._v(" the \""),_c('strong',[_vm._v("UP")]),_vm._v("\" arrow\n\t")]),_vm._v(" "),_c('div',{staticClass:"training__hand"}),_vm._v(" "),_c('div',{staticClass:"training__arrow"})])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-354b1ac5"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-354b1ac5", __vue__options__)
  } else {
    hotAPI.reload("data-v-354b1ac5", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],11:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 11, stdin */\n.training-option[data-v-1b5ea71a] {\n  margin: 25px;\n  cursor: pointer;\n  width: 421px;\n  height: 147px; }")
;(function(){
'use strict';

module.exports = {
	name: 'TrainingOption',
	props: ['trainingOption'],
	methods: {
		train: function train() {
			this.$emit('isTraining', {
				state: true,
				option: this.trainingOption
			});
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"training-option",style:({backgroundImage: 'url(assets/img/gym/'+ _vm.trainingOption.name +'.png)'}),on:{"click":_vm.train}})}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-1b5ea71a"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1b5ea71a", __vue__options__)
  } else {
    hotAPI.reload("data-v-1b5ea71a", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],12:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 16, stdin */\n.training-options[data-v-5421dd49] {\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n  /* line 21, stdin */\n  .training-options__header[data-v-5421dd49] {\n    margin: 10px;\n    font-weight: bold; }")
;(function(){
'use strict';

module.exports = {
	name: 'TrainingOptions',
	components: {
		'training-option': require('./TrainingOption.vue')
	},
	computed: {
		trainingOptions: function trainingOptions() {
			return require('../../../../../../../assets/items/gym/training-options.json');
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"training-options"},[_c('div',{staticClass:"training-options__content"},[_c('div',{staticClass:"training-options__wrapper"},_vm._l((_vm.trainingOptions),function(trainingOption){return _c('training-option',{attrs:{"training-option":trainingOption},on:{"isTraining":function($event){_vm.$emit('isTraining', $event)}}})}))])])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-5421dd49"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5421dd49", __vue__options__)
  } else {
    hotAPI.reload("data-v-5421dd49", __vue__options__)
  }
})()}
},{"../../../../../../../assets/items/gym/training-options.json":26,"./TrainingOption.vue":11,"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],13:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 25, stdin */\n.shop-item[data-v-1ca28b5b] {\n  display: inline-block;\n  margin: 10px;\n  margin-top: 65px;\n  text-align: center; }\n  /* line 32, stdin */\n  .shop-item--disabled[data-v-1ca28b5b] {\n    opacity: .3; }\n    /* line 35, stdin */\n    .shop-item--disabled .shop-item__icon[data-v-1ca28b5b] {\n      cursor: not-allowed; }\n  /* line 40, stdin */\n  .shop-item__icon[data-v-1ca28b5b] {\n    background-size: contain;\n    background-position: 50% 50%;\n    background-repeat: no-repeat;\n    cursor: pointer;\n    width: 130px;\n    height: 130px;\n    border-radius: 3px; }\n  /* line 51, stdin */\n  .shop-item__info[data-v-1ca28b5b] {\n    font-size: 25px;\n    margin: 10px; }\n    /* line 55, stdin */\n    .shop-item__info-name[data-v-1ca28b5b] {\n      font-weight: bold; }")
;(function(){
'use strict';

module.exports = {
	name: 'ShopItem',
	props: ['item', 'player'],
	computed: {
		canBuy: function canBuy() {
			return this.player.states.money >= this.item.price;
		},
		isFood: function isFood() {
			return this.item.type === 'food';
		},
		isFurniture: function isFurniture() {
			return this.item.type === 'furniture';
		},
		isFull: function isFull() {
			return this.isFood && this.player.stats.hunger < 1;
		},
		isOwned: function isOwned() {
			return this.isFurniture && this.player.ownedItems.indexOf(this.item.name.toLowerCase()) !== -1;
		}
	},
	methods: {
		purchase: function purchase() {
			if (!this.canBuy || this.isFull || this.isOwned) {
				return;
			}

			this.takeMoney();
			this.givePlayer();
		},
		takeMoney: function takeMoney() {
			this.$store.commit('updatePlayerState', {
				state: 'money',
				value: this.player.states.money - this.item.price < 1 ? 0 : this.player.states.money - this.item.price
			});
		},
		givePlayer: function givePlayer() {
			switch (this.item.type) {
				case 'food':
					this.$store.commit('updatePlayerStat', {
						stat: 'hunger',
						value: this.player.stats.hunger - this.item.stat < 1 ? 0 : this.player.stats.hunger - this.item.stat
					});
					break;
				case 'furniture':
					this.$store.commit('addPlayerItem', this.item.name.toLowerCase());
					break;
			}
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"shop-item",class:{'shop-item--disabled': !_vm.canBuy || _vm.isFull || _vm.isOwned}},[_c('div',{staticClass:"shop-item__info"},[_c('div',{staticClass:"shop-item__info-name"},[_vm._v("\n\t\t\t"+_vm._s(_vm.item.name)+"\n\t\t")]),_vm._v(" "),_c('div',{staticClass:"shop-item__info-price"},[_vm._v("\n\t\t\t"+_vm._s(_vm.item.price)+" coins\n\t\t")]),_vm._v(" "),(_vm.isFood)?_c('div',{staticClass:"shop-item__info-refills"},[_vm._v("\n\t\t\tRefills "+_vm._s(_vm.item.stat)+"\n\t\t")]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"shop-item__icon",style:({backgroundImage: 'url('+_vm.item.icon+')'}),on:{"click":_vm.purchase}})])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-1ca28b5b"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1ca28b5b", __vue__options__)
  } else {
    hotAPI.reload("data-v-1ca28b5b", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],14:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 17, stdin */\n.level__complete[data-v-5860e714] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(32, 67, 97, 0.8);\n  color: #ffffff; }\n  /* line 27, stdin */\n  .level__complete-texts[data-v-5860e714] {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translateX(-50%);\n    font-size: 60px;\n    text-align: center; }\n    /* line 35, stdin */\n    .level__complete-texts ul[data-v-5860e714] {\n      padding: 0;\n      margin: 0;\n      list-style-type: none; }\n  /* line 42, stdin */\n  .level__complete-reason[data-v-5860e714] {\n    font-size: 60px;\n    margin-bottom: 1.5em; }\n  /* line 47, stdin */\n  .level__complete-text[data-v-5860e714] {\n    font-size: 40px;\n    line-height: 1.5em; }\n  /* line 52, stdin */\n  .level__complete-heading[data-v-5860e714] {\n    position: absolute;\n    top: 30%;\n    left: 50%;\n    transform: translateX(-50%); }\n  /* line 59, stdin */\n  .level__complete-continue[data-v-5860e714] {\n    position: absolute;\n    bottom: 200px;\n    left: 0;\n    right: 0;\n    margin-left: auto;\n    margin-right: auto;\n    background-image: url(\"assets/img/continue.png\");\n    width: 491px;\n    height: 112px; }\n    /* line 72, stdin */\n    .level__complete-continue[data-v-5860e714]:hover {\n      cursor: pointer; }")
;(function(){
'use strict';

module.exports = {
	name: 'Popup',
	computed: {
		summary: function summary() {
			return window.player.summary;
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"level__complete"},[_c('img',{staticClass:"level__complete-heading",attrs:{"src":"assets/img/level_complete.png","alt":""}}),_vm._v(" "),_c('div',{staticClass:"level__complete-texts"},[_c('ul',[_c('li',[_vm._v("You got "+_vm._s(_vm.summary.money)+" coins")]),_vm._v(" "),_c('li',[_vm._v("You suffered "+_vm._s(_vm.summary.injury)+" damage")])])]),_vm._v(" "),_c('div',{staticClass:"level__complete-continue",on:{"click":function($event){_vm.$emit('closePopup')}}})])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-5860e714"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5860e714", __vue__options__)
  } else {
    hotAPI.reload("data-v-5860e714", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],15:[function(require,module,exports){
'use strict';

var Vuex = require('vuex');
var VueRouter = require('vue-router');

module.exports = {
	vueEl: '#Game',

	init: function init() {
		if ($(this.vueEl).length < 1) {
			return false;
		}

		Vue.use(Vuex);
		Vue.use(VueRouter);

		this.vue = new Vue({
			name: 'GameApp',
			el: this.vueEl,
			router: require('./router.js'),
			store: require('./store.js'),
			render: function render(createElement) {
				return createElement(require('./pages/App.vue'));
			}
		});
	}
};

},{"./pages/App.vue":16,"./router.js":23,"./store.js":24,"vue-router":3,"vuex":5}],16:[function(require,module,exports){
;(function(){
'use strict';

module.exports = {
	name: 'App',
	mounted: function mounted() {}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('router-view')}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-2ea5a9d4"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ea5a9d4", __vue__options__)
  } else {
    hotAPI.reload("data-v-2ea5a9d4", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2}],17:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 18, stdin */\n.vue-app[data-v-7b3c646e] {\n  height: 100%;\n  background-image: url(\"assets/img/gym/bg.jpg\");\n  background-position: 50% 50%;\n  background-repeat: no-repeat; }\n  /* line 25, stdin */\n  .vue-app .home[data-v-7b3c646e] {\n    position: absolute;\n    top: 0;\n    background-image: url(\"assets/img/home.png\");\n    margin: 25px;\n    cursor: pointer;\n    width: 421px;\n    height: 147px; }")
;(function(){
'use strict';

module.exports = {
	name: 'Gym',
	components: {
		'training-options': require('../components/gym/TrainingOptions.vue'),
		training: require('../components/gym/Training.vue')
	},
	data: function data() {
		return {
			isTraining: false,
			training: {},
			trained: 0
		};
	},

	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		},
		player: function player() {
			return this.$store.state.player;
		},
		canVisit: function canVisit() {
			return this.player.states.money >= BASE_GYM_FEE;
		}
	},
	watch: {
		trained: function trained(value) {
			if (value >= MAX_TRAININGS) {
				this.route = 'lobby';
				this.notifyAboutMaxTrainings();
			}
		}
	},
	mounted: function mounted() {
		if (!this.canVisit) {
			this.route = 'lobby';
		}

		this.takeMoney();
	},

	methods: {
		notifyAboutMaxTrainings: function notifyAboutMaxTrainings() {
			swal({
				html: 'For ' + BASE_GYM_FEE + ' coins you can only train ' + MAX_TRAININGS + ' times!'
			});
		},
		takeMoney: function takeMoney() {
			this.$store.commit('updatePlayerState', {
				state: 'money',
				value: this.player.states.money - BASE_GYM_FEE < 1 ? 0 : this.player.states.money - BASE_GYM_FEE
			});
		},
		setupTraining: function setupTraining($event) {
			this.isTraining = $event.state;
			this.training = $event.option;
		},
		resetTraining: function resetTraining() {
			this.trained++;
			this.isTraining = false;
			this.training = {};
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-app"},[(!_vm.isTraining)?_c('training-options',{on:{"isTraining":_vm.setupTraining}}):_vm._e(),_vm._v(" "),(_vm.isTraining)?_c('training',{attrs:{"training":_vm.training,"player":_vm.player},on:{"trained":_vm.resetTraining}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"home",on:{"click":function($event){_vm.route = 'lobby'}}})],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-7b3c646e"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7b3c646e", __vue__options__)
  } else {
    hotAPI.reload("data-v-7b3c646e", __vue__options__)
  }
})()}
},{"../components/gym/Training.vue":10,"../components/gym/TrainingOptions.vue":12,"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],18:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 14, stdin */\n.vue-container[data-v-5d60c576] {\n  width: 1920px;\n  height: 1080px;\n  position: relative; }")
;(function(){
'use strict';

module.exports = {
	name: 'Index',
	components: {
		navigation: require('../../../../components/Navigation.vue'),
		overlay: require('../components/Overlay.vue'),
		welcome: require('./Welcome.vue'),
		stage: require('./Stage.vue'),
		lobby: require('./Lobby.vue'),
		shop: require('./Shop.vue'),
		gym: require('./Gym.vue')
	},
	data: function data() {
		return {
			isLoading: false,
			isDebug: window.ENV.isDebug
		};
	},

	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		}
	},
	mounted: function mounted() {
		window.assetStorage = new AssetStorage();
		window.mapSectionStorage = new MapSectionStorage();

		this.$store.dispatch('fetchAssets');
	},

	methods: {}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-container"},[(_vm.isDebug)?_c('navigation'):_vm._e(),_vm._v(" "),(_vm.route === 'index')?_c('welcome'):_vm._e(),_vm._v(" "),(_vm.route === 'stage')?_c('stage'):_vm._e(),_vm._v(" "),(_vm.route === 'lobby')?_c('lobby'):_vm._e(),_vm._v(" "),(_vm.route === 'shop')?_c('shop'):_vm._e(),_vm._v(" "),(_vm.route === 'gym')?_c('gym'):_vm._e(),_vm._v(" "),(_vm.route !== 'index')?_c('overlay'):_vm._e()],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-5d60c576"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5d60c576", __vue__options__)
  } else {
    hotAPI.reload("data-v-5d60c576", __vue__options__)
  }
})()}
},{"../../../../components/Navigation.vue":25,"../components/Overlay.vue":7,"./Gym.vue":17,"./Lobby.vue":19,"./Shop.vue":20,"./Stage.vue":21,"./Welcome.vue":22,"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],19:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 16, stdin */\n.app__game-over[data-v-f1bda36e] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(32, 67, 97, 0.8); }\n  /* line 24, stdin */\n  .app__game-over-heading[data-v-f1bda36e] {\n    position: absolute;\n    top: 30%;\n    left: 50%;\n    transform: translateX(-50%); }\n\n/* line 32, stdin */\n.buttons[data-v-f1bda36e] {\n  position: absolute; }\n  /* line 35, stdin */\n  .buttons .gym[data-v-f1bda36e],\n  .buttons .shop[data-v-f1bda36e],\n  .buttons .next-level[data-v-f1bda36e] {\n    margin: 25px;\n    cursor: pointer;\n    width: 421px;\n    height: 147px; }\n  /* line 45, stdin */\n  .buttons .gym[data-v-f1bda36e] {\n    background-image: url(\"assets/img/lobby/gym.png\"); }\n  /* line 49, stdin */\n  .buttons .shop[data-v-f1bda36e] {\n    background-image: url(\"assets/img/lobby/shop.png\"); }\n  /* line 53, stdin */\n  .buttons .next-level[data-v-f1bda36e] {\n    background-image: url(\"assets/img/lobby/next_level.png\");\n    width: 519px; }")
;(function(){
'use strict';

module.exports = {
	name: 'Lobby',
	data: function data() {
		return {
			isLoading: false,
			displayGameOver: false
		};
	},

	computed: {
		player: function player() {
			return this.$store.state.player;
		},

		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		},
		canVisitGym: function canVisitGym() {
			return this.player.states.money >= BASE_GYM_FEE;
		}
	},
	beforeDestroy: function beforeDestroy() {
		window.application.stopRadio();
		window.application.destroy();
	},
	mounted: function mounted() {
		var _this = this;

		this.$store.dispatch('fetchAssets').then(function () {
			window.application = new LobbyApplication({
				view: _this.$refs.canvas,
				width: VIEW_WIDTH,
				height: VIEW_HEIGHT
			});

			_this.placeItems();
		});

		window.eventHub.$on('lobby.itemRemoved', function () {
			_this.placeItems();
		});

		window.eventHub.$on('gameOver', function () {
			_this.displayGameOver = true;
			setTimeout(function () {
				_this.$store.commit('setPlayerItems', BASE_ITEMS.slice());
				_this.route = 'index';
			}, 2000);
		});
	},

	methods: {
		playerHasItem: function playerHasItem(slug) {
			return this.player.ownedItems.indexOf(slug) !== -1;
		},
		placeItems: function placeItems() {
			window.application.itemContainer.removeChildren();

			window.application.displayOwnedItem('Fridge', {
				x: 1660,
				y: 650
			});

			window.application.displayOwnedItem('Hat', {
				x: 825,
				y: 854
			});

			window.application.displayOwnedItem('Telescope', {
				x: 469,
				y: 436
			});

			window.application.displayOwnedItem('Table', {
				x: 16,
				y: 716
			});

			window.application.displayOwnedItem('Chair', {
				x: 147,
				y: 809
			});

			window.application.displayOwnedItem('Picture', {
				x: 1180,
				y: 293
			});

			var radioPos = this.playerHasItem('table') ? { x: 222, y: 532 } : { x: 222, y: 781 };

			window.application.displayOwnedItem('Radio', radioPos);

			var lampPos = this.playerHasItem('table') ? { x: -28, y: 537 } : { x: -28, y: 781 };

			window.application.displayOwnedItem('Lamp', lampPos);

			var fanPos = this.playerHasItem('fridge') ? { x: 1690, y: 438 } : { x: 1690, y: 741 };

			window.application.displayOwnedItem('Fan', fanPos);

			window.application.displayOwnedItem('Plushie', {
				x: 1100,
				y: 617
			});
		},
		gotoGym: function gotoGym() {
			if (!this.canVisitGym) {
				swal({
					html: 'You need at least ' + BASE_GYM_FEE + ' coins to hit the gym!'
				});
			} else {
				this.route = 'gym';
			}
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-app"},[_c('div',{staticClass:"buttons"},[_c('div',{staticClass:"next-level",on:{"click":function($event){_vm.route = 'stage'}}}),_vm._v(" "),_c('div',{staticClass:"gym",on:{"click":_vm.gotoGym}}),_vm._v(" "),_c('div',{staticClass:"shop",on:{"click":function($event){_vm.route = 'shop'}}})]),_vm._v(" "),_c('canvas',{ref:"canvas",attrs:{"id":"app-canvas"}}),_vm._v(" "),(_vm.displayGameOver)?_c('div',{staticClass:"app__game-over"},[_c('img',{staticClass:"app__game-over-heading",attrs:{"src":"assets/img/GameOver.png","alt":""}})]):_vm._e()])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-f1bda36e"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f1bda36e", __vue__options__)
  } else {
    hotAPI.reload("data-v-f1bda36e", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],20:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 21, stdin */\n.vue-app[data-v-4e7f6053] {\n  height: 100%;\n  width: 100%;\n  background-image: url(\"assets/img/shop.png\");\n  background-position: 50% 50%;\n  background-repeat: no-repeat; }\n\n/* line 30, stdin */\n.home[data-v-4e7f6053] {\n  position: absolute;\n  background-image: url(\"assets/img/home.png\");\n  margin: 25px;\n  cursor: pointer;\n  width: 421px;\n  height: 147px; }\n\n/* line 42, stdin */\n.shop[data-v-4e7f6053] {\n  height: 100%;\n  width: 820px;\n  top: 40px;\n  left: 810px;\n  position: absolute; }\n  /* line 53, stdin */\n  .shop__furniture-header[data-v-4e7f6053], .shop__food-header[data-v-4e7f6053] {\n    font-weight: bold;\n    margin: 10px; }\n  /* line 59, stdin */\n  .shop__furniture[data-v-4e7f6053] {\n    margin-top: -30px; }")
;(function(){
'use strict';

module.exports = {
	name: 'Shop',
	components: {
		'shop-item': require('../components/shop/ShopItem.vue')
	},
	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		},
		player: function player() {
			return this.$store.state.player;
		},
		food: function food() {
			return require('../../../../../../assets/items/shop/food.json');
		},
		furniture: function furniture() {
			return require('../../../../../../assets/items/shop/furniture.json');
		}
	},
	mounted: function mounted() {}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-app"},[_c('div',{staticClass:"shop"},[_c('div',{staticClass:"shop__food"},[_c('div',{staticClass:"shop__food-items"},_vm._l((_vm.food),function(item){return _c('shop-item',{attrs:{"item":item,"player":_vm.player}})}))]),_vm._v(" "),_c('div',{staticClass:"shop__furniture"},[_c('div',{staticClass:"shop__furniture-items"},_vm._l((_vm.furniture),function(item){return _c('shop-item',{attrs:{"item":item,"player":_vm.player}})}))])]),_vm._v(" "),_c('div',{staticClass:"home",on:{"click":function($event){_vm.route = 'lobby'}}})])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-4e7f6053"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4e7f6053", __vue__options__)
  } else {
    hotAPI.reload("data-v-4e7f6053", __vue__options__)
  }
})()}
},{"../../../../../../assets/items/shop/food.json":27,"../../../../../../assets/items/shop/furniture.json":28,"../components/shop/ShopItem.vue":13,"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],21:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 22, stdin */\n#app-canvas[data-v-6eee4171] {\n  display: block; }\n\n/* line 26, stdin */\n.app__hospitalized[data-v-6eee4171] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(32, 67, 97, 0.8);\n  color: #ffffff; }\n  /* line 36, stdin */\n  .app__hospitalized-texts[data-v-6eee4171] {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translateX(-50%);\n    font-size: 60px;\n    text-align: center; }\n  /* line 45, stdin */\n  .app__hospitalized-reason[data-v-6eee4171] {\n    font-size: 60px;\n    margin-bottom: 1.5em; }\n  /* line 50, stdin */\n  .app__hospitalized-text[data-v-6eee4171] {\n    font-size: 40px;\n    line-height: 1.5em; }\n  /* line 55, stdin */\n  .app__hospitalized-heading[data-v-6eee4171] {\n    position: absolute;\n    top: 30%;\n    left: 50%;\n    transform: translateX(-50%); }")
;(function(){
'use strict';

module.exports = {
	name: 'Stage',
	components: {
		popup: require('../components/stage/Popup.vue')
	},
	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		},

		canAffordHospitalization: function canAffordHospitalization() {
			return this.$store.state.player.states.money >= 40;
		}
	},
	data: function data() {
		return {
			isLoading: false,
			displayPopup: false,
			displayHospitalized: false,
			hospitalizedReason: ''
		};
	},

	watch: {
		'$store.state.player.stats.injury': function $storeStatePlayerStatsInjury(newVal) {
			if (newVal >= MAX_INJURY) {
				window.eventHub.$emit('hospitalized', {
					reason: 'You were severely injured.'
				});
			}
		},
		'$store.state.player.stats.hunger': function $storeStatePlayerStatsHunger(newVal) {
			if (newVal >= MAX_HUNGER) {
				window.eventHub.$emit('hospitalized', {
					reason: 'You almost starved to death.'
				});
			}
		}
	},
	beforeDestroy: function beforeDestroy() {
		window.application.backgroundMusic.pause();
		window.application.destroy();
	},
	mounted: function mounted() {
		var _this = this;

		this.$store.dispatch('fetchAssets').then(function () {
			window.controls = new Controls();
			window.application = new Application({
				view: _this.$refs.canvas,
				width: VIEW_WIDTH,
				height: VIEW_HEIGHT
			});
			window.camera = new Camera();
			window.collisionManager = new CollisionManager();
			window.player = new Player(assetStorage.getAnimatedTexture('Player'));
			window.player.position.set(200, 400);

			var sections = ['city01', 'city02', 'city03', 'city04', 'city05'];

			var mapSection = new MapSection();
			mapSection.useSection('start');
			application.addMapSection(mapSection);

			var countBefore = Helpers.rnd(5, 10);
			for (var i = 0; i < countBefore; i++) {
				mapSection = new MapSection();
				mapSection.useSection(Helpers.choose(sections));
				application.addMapSection(mapSection);
			}

			mapSection = new MapSection();
			mapSection.useSection('musicband');
			application.addMapSection(mapSection);

			var countAfter = Helpers.rnd(5, 10);
			for (var _i = 0; _i < countAfter; _i++) {
				mapSection = new MapSection();
				mapSection.useSection(Helpers.choose(sections));
				application.addMapSection(mapSection);
			}

			mapSection = new MapSection();
			mapSection.useSection('finish');
			application.addMapSection(mapSection);

			application.world.addChild(window.player);

			var bgNoise = window.assetStorage.getSound('city');
			bgNoise.loop = true;
			bgNoise.play();
		});

		this.setupEventListeners();
	},

	methods: {
		setupEventListeners: function setupEventListeners() {
			var _this2 = this;

			window.eventHub.$on('levelFinished', function () {
				_this2.displayPopup = true;
				window.controls.disableControls();
				clearTimeout(window.application.hungerInterval);
			});

			window.eventHub.$on('hospitalized', function (data) {
				window.controls.disableControls();
				_this2.displayHospitalized = true;
				_this2.hospitalizedReason = data.reason;
				clearInterval(window.application.hungerInterval);

				setTimeout(function () {
					_this2.healPlayer();
					if (_this2.canAffordHospitalization) {
						_this2.$store.commit('updatePlayerState', {
							state: 'money',
							value: _this2.$store.state.player.states.money - 40
						});
					} else {
						_this2.$store.commit('pendingReposession', true);
					}
					_this2.route = 'lobby';
				}, 4000);
			});
		},
		closePopup: function closePopup() {
			if (this.displayPopup) {
				this.route = 'lobby';
			}
		},
		healPlayer: function healPlayer() {
			this.$store.commit('updatePlayerStat', {
				stat: 'injury',
				value: 0
			});
			this.$store.commit('updatePlayerStat', {
				stat: 'hunger',
				value: 0
			});
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-app"},[_c('canvas',{ref:"canvas",attrs:{"id":"app-canvas"}}),_vm._v(" "),(_vm.displayPopup)?_c('popup',{on:{"closePopup":_vm.closePopup}}):_vm._e(),_vm._v(" "),(_vm.displayHospitalized)?_c('div',{staticClass:"app__hospitalized"},[_c('img',{staticClass:"app__hospitalized-heading",attrs:{"src":"assets/img/Hospitalized.png","alt":""}}),_vm._v(" "),_c('div',{staticClass:"app__hospitalized-texts"},[_c('p',{staticClass:"app__hospitalized-reason"},[_vm._v(_vm._s(_vm.hospitalizedReason))]),_vm._v(" "),(_vm.canAffordHospitalization)?_c('p',{staticClass:"app__hospitalized-text"},[_vm._v("Hospital costs: $40")]):_c('p',{staticClass:"app__hospitalized-text"},[_vm._v("No money to pay bills."),_c('br'),_vm._v("Reposession imminent.")])])]):_vm._e()],1)}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-6eee4171"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6eee4171", __vue__options__)
  } else {
    hotAPI.reload("data-v-6eee4171", __vue__options__)
  }
})()}
},{"../components/stage/Popup.vue":14,"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],22:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 10, stdin */\n.vue-app[data-v-aaf605d6] {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  background-image: url(\"assets/img/title.png\");\n  background-position: 50% 50%;\n  background-repeat: no-repeat; }\n  /* line 21, stdin */\n  .vue-app .play-button[data-v-aaf605d6] {\n    position: absolute;\n    top: 494px;\n    right: 364px;\n    width: 527px;\n    height: 154px;\n    background-image: url(\"assets/img/play_button.png\"); }\n    /* line 31, stdin */\n    .vue-app .play-button[data-v-aaf605d6]:hover {\n      cursor: pointer; }\n  /* line 36, stdin */\n  .vue-app .help-button[data-v-aaf605d6] {\n    position: absolute;\n    top: 696px;\n    right: 446px;\n    width: 368px;\n    height: 107px;\n    background-image: url(\"assets/img/help_button.png\"); }\n    /* line 46, stdin */\n    .vue-app .help-button[data-v-aaf605d6]:hover {\n      cursor: pointer; }\n  /* line 51, stdin */\n  .vue-app .logo[data-v-aaf605d6] {\n    position: absolute;\n    top: 123px;\n    right: 330px;\n    width: 598px;\n    height: 296px;\n    background-image: url(\"assets/img/logo.png\"); }")
;(function(){
'use strict';

module.exports = {
	name: 'Welcome',
	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		}
	},
	methods: {
		help: function help() {
			swal({
				type: 'info',
				title: 'HELP',
				html: 'In each level, fix a water accident in a house at the end of the level. Avoid touching animals and plants. On your way pick enough money to cover all your expenses. If you don\'t have enough money to pay your bills, executor will take away your properties. If you gather enough money, you can buy stuff. Your goal is to have a fully furnished room.<br><br>Controls:<br>Movement - Arrows<br>Action - enter'
			});
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-app"},[_c('div',{staticClass:"logo"}),_vm._v(" "),_c('div',{staticClass:"play-button",on:{"click":function($event){$event.preventDefault();_vm.route = 'stage'}}}),_vm._v(" "),_c('div',{staticClass:"help-button",on:{"click":_vm.help}})])}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-aaf605d6"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-aaf605d6", __vue__options__)
  } else {
    hotAPI.reload("data-v-aaf605d6", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],23:[function(require,module,exports){
'use strict';

var VueRouter = require('vue-router');

var router = new VueRouter({
	base: '/frigus/wgc2018/',
	mode: 'history',
	routes: [{
		path: '/',
		component: require('./pages/Index.vue')
	}]
});

module.exports = router;

},{"./pages/Index.vue":18,"vue-router":3}],24:[function(require,module,exports){
'use strict';

var Vuex = require('vuex');

module.exports = new Vuex.Store({
	state: {
		player: {
			stats: {
				//general
				injury: BASE_INJURY,
				hunger: BASE_HUNGER,
				strength: BASE_STRENGTH,
				//short-time energy
				energy: BASE_ENERGY
			},
			states: {
				//non-breaking stat, only makes it slightly harder/easier
				happiness: BASE_HAPPINESS,
				//general
				money: BASE_MONEY
			},
			ownedItems: BASE_ITEMS.slice()
		},
		reposession: false,
		route: 'index'
	},
	mutations: {
		updatePlayerStat: function updatePlayerStat(state, payload) {
			state.player.stats[payload.stat] = payload.value;
		},
		updatePlayerStats: function updatePlayerStats(state, payload) {
			state.player.stats = payload;
		},
		updatePlayerState: function updatePlayerState(state, payload) {
			state.player.states[payload.state] = payload.value;
		},
		setPlayerItems: function setPlayerItems(state, payload) {
			state.player.ownedItems = payload;
		},
		addPlayerItem: function addPlayerItem(state, payload) {
			state.player.ownedItems.push(payload);
		},
		removePlayerItem: function removePlayerItem(state, payload) {
			var itemIndex = _.findIndex(state.player.ownedItems, function (value) {
				return value === payload;
			});

			state.player.ownedItems.splice(itemIndex, 1);
		},
		navigateTo: function navigateTo(state, payload) {
			state.route = payload;
		},
		setAssetPromise: function setAssetPromise(state, promise) {
			state.assetPromise = promise;
		},
		pendingReposession: function pendingReposession(state, reposession) {
			state.reposession = reposession;
		}
	},
	actions: {
		fetchAssets: function fetchAssets(context) {
			if (!context.state.assetPromise) {
				var promise = Promise.all([assetStorage.loadTextures(), assetStorage.loadSounds(), mapSectionStorage.loadMapSections()]);
				context.commit('setAssetPromise', promise);
			}

			return context.state.assetPromise;
		}
	}
});

},{"vuex":5}],25:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/* line 8, stdin */\n.navigation[data-v-1ab0364b] {\n  position: absolute;\n  z-index: 10; }\n  /* line 12, stdin */\n  .navigation a[data-v-1ab0364b] {\n    margin-right: 5px;\n    font-size: 24px; }\n    /* line 16, stdin */\n    .navigation a[data-v-1ab0364b]:last-child {\n      margin-right: 0; }")
;(function(){
'use strict';

module.exports = {
	name: 'Navigation',
	data: function data() {
		return {
			routes: ROUTES
		};
	},

	computed: {
		route: {
			get: function get() {
				return this.$store.state.route;
			},
			set: function set($event) {
				this.$store.commit('navigateTo', $event);
			}
		}
	}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('nav',{staticClass:"navigation"},_vm._l((_vm.routes),function(slug){return _c('a',{attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();_vm.route = slug}}},[_vm._v(_vm._s(slug))])}))}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-1ab0364b"
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1ab0364b", __vue__options__)
  } else {
    hotAPI.reload("data-v-1ab0364b", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":2,"vueify/lib/insert-css":4}],26:[function(require,module,exports){
module.exports=[
	{
		"name": "Back",
		"reward": 10
	},
	{
		"name": "Abs",
		"reward": 15
	},
	{
		"name": "Legs",
		"reward": 20
	},
	{
		"name": "Cardio",
		"reward": 30
	}
]
},{}],27:[function(require,module,exports){
module.exports=[
	{
		"type": "food",
		"name": "Hamburger",
		"stat": 10,
		"price": 8,
		"icon": "assets/img/food/burger.png"
	},
	{
		"type": "food",
		"name": "Pizza",
		"stat": 20,
		"price": 15,
		"icon": "assets/img/food/pizza.png"
	},
	{
		"type": "food",
		"name": "Apple",
		"stat": 5,
		"price": 4,
		"icon": "assets/img/food/apple.png"
	},
	{
		"type": "food",
		"name": "Meat balls",
		"stat": 15,
		"price": 12,
		"icon": "assets/img/food/meat_balls.png"
	},
	{
		"type": "food",
		"name": "Chinese soup",
		"stat": 1,
		"price": 1,
		"icon": "assets/img/food/chinese_soup.png"
	}
]
},{}],28:[function(require,module,exports){
module.exports=[
	{
		"type": "furniture",
		"name": "Table",
		"stat": 1,
		"price": 90,
		"icon": "assets/img/furniture/table.png"
	},
	{
		"type": "furniture",
		"name": "Chair",
		"stat": 1,
		"price": 75,
		"icon": "assets/img/furniture/chair.png"
	},
	{
		"type": "furniture",
		"name": "Hat",
		"stat": 1,
		"price": 25,
		"icon": "assets/img/furniture/hat.png"
	},
	{
		"type": "furniture",
		"name": "Fridge",
		"stat": 1,
		"price": 300,
		"icon": "assets/img/furniture/fridge.png"
	},
	{
		"type": "furniture",
		"name": "Fan",
		"stat": 1,
		"price": 150,
		"icon": "assets/img/furniture/fan.png"
	},
	{
		"type": "furniture",
		"name": "Lamp",
		"stat": 1,
		"price": 40,
		"icon": "assets/img/furniture/lamp.png"
	},
	{
		"type": "furniture",
		"name": "Plushie",
		"stat": 1,
		"price": 50,
		"icon": "assets/img/furniture/plushie.png"
	},
	{
		"type": "furniture",
		"name": "Radio",
		"stat": 1,
		"price": 200,
		"icon": "assets/img/furniture/radio.png"
	},
	{
		"type": "furniture",
		"name": "Picture",
		"stat": 1,
		"price": 100,
		"icon": "assets/img/furniture/picture.png"
	},
	{
		"type": "furniture",
		"name": "Telescope",
		"stat": 1,
		"price": 250,
		"icon": "assets/img/furniture/telescope.png"
	}
]
},{}]},{},[15])(15)
});
