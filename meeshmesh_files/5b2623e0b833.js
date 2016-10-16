!function(element, proceed) {
  if ("object" == typeof module && "object" == typeof module.exports) {
    module.exports = element.document ? proceed(element, true) : function(element) {
      if (!element.document) {
        throw new Error("jQuery requires a window with a document");
      }
      return proceed(element);
    };
  } else {
    proceed(element);
  }
}("undefined" != typeof window ? window : this, function(win, dataAndEvents) {
  /**
   * @param {Object} exports
   * @return {?}
   */
  function isArraylike(exports) {
    var value = "length" in exports && exports.length;
    var type = jQuery.type(exports);
    return "function" === type || jQuery.isWindow(exports) ? false : 1 === exports.nodeType && value ? true : "array" === type || (0 === value || "number" == typeof value && (value > 0 && value - 1 in exports));
  }
  /**
   * @param {Object} pdataOld
   * @param {Object} ok
   * @param {Object} name
   * @return {?}
   */
  function winnow(pdataOld, ok, name) {
    if (jQuery.isFunction(ok)) {
      return jQuery.grep(pdataOld, function(that, value) {
        return!!ok.call(that, value, that) !== name;
      });
    }
    if (ok.nodeType) {
      return jQuery.grep(pdataOld, function(result) {
        return result === ok !== name;
      });
    }
    if ("string" == typeof ok) {
      if (QUnit.test(ok)) {
        return jQuery.filter(ok, pdataOld, name);
      }
      ok = jQuery.filter(ok, pdataOld);
    }
    return jQuery.grep(pdataOld, function(arg) {
      return jQuery.inArray(arg, ok) >= 0 !== name;
    });
  }
  /**
   * @param {Object} cur
   * @param {string} dir
   * @return {?}
   */
  function sibling(cur, dir) {
    do {
      cur = cur[dir];
    } while (cur && 1 !== cur.nodeType);
    return cur;
  }
  /**
   * @param {string} options
   * @return {?}
   */
  function createOptions(options) {
    var buf = optionsCache[options] = {};
    return jQuery.each(options.match(core_rnotwhite) || [], function(dataAndEvents, off) {
      /** @type {boolean} */
      buf[off] = true;
    }), buf;
  }
  /**
   * @return {undefined}
   */
  function domReady() {
    if (doc.addEventListener) {
      doc.removeEventListener("DOMContentLoaded", init, false);
      win.removeEventListener("load", init, false);
    } else {
      doc.detachEvent("onreadystatechange", init);
      win.detachEvent("onload", init);
    }
  }
  /**
   * @return {undefined}
   */
  function init() {
    if (doc.addEventListener || ("load" === event.type || "complete" === doc.readyState)) {
      domReady();
      jQuery.ready();
    }
  }
  /**
   * @param {Object} exports
   * @param {Object} pdataOld
   * @param {string} data
   * @return {?}
   */
  function dataAttr(exports, pdataOld, data) {
    if (void 0 === data && 1 === exports.nodeType) {
      var name = "data-" + pdataOld.replace(r20, "-$1").toLowerCase();
      if (data = exports.getAttribute(name), "string" == typeof data) {
        try {
          data = "true" === data ? true : "false" === data ? false : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (e) {
        }
        jQuery.data(exports, pdataOld, data);
      } else {
        data = void 0;
      }
    }
    return data;
  }
  /**
   * @param {Object} obj
   * @return {?}
   */
  function filter(obj) {
    var name;
    for (name in obj) {
      if (("data" !== name || !jQuery.isEmptyObject(obj[name])) && "toJSON" !== name) {
        return false;
      }
    }
    return true;
  }
  /**
   * @param {Object} elem
   * @param {string} data
   * @param {string} state
   * @param {Object} dataAndEvents
   * @return {?}
   */
  function callback(elem, data, state, dataAndEvents) {
    if (jQuery.acceptData(elem)) {
      var sortby;
      var item;
      var internalKey = jQuery.expando;
      var isNode = elem.nodeType;
      var cache = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
      if (id && (cache[id] && (dataAndEvents || cache[id].data)) || (void 0 !== state || "string" != typeof data)) {
        return id || (id = isNode ? elem[internalKey] = core_deletedIds.pop() || jQuery.guid++ : internalKey), cache[id] || (cache[id] = isNode ? {} : {
          toJSON : jQuery.noop
        }), ("object" == typeof data || "function" == typeof data) && (dataAndEvents ? cache[id] = jQuery.extend(cache[id], data) : cache[id].data = jQuery.extend(cache[id].data, data)), item = cache[id], dataAndEvents || (item.data || (item.data = {}), item = item.data), void 0 !== state && (item[jQuery.camelCase(data)] = state), "string" == typeof data ? (sortby = item[data], null == sortby && (sortby = item[jQuery.camelCase(data)])) : sortby = item, sortby;
      }
    }
  }
  /**
   * @param {Object} elem
   * @param {Object} name
   * @param {boolean} keepData
   * @return {undefined}
   */
  function remove(elem, name, keepData) {
    if (jQuery.acceptData(elem)) {
      var cache;
      var i;
      var isNode = elem.nodeType;
      var response = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[jQuery.expando] : jQuery.expando;
      if (response[id]) {
        if (name && (cache = keepData ? response[id] : response[id].data)) {
          if (jQuery.isArray(name)) {
            name = name.concat(jQuery.map(name, jQuery.camelCase));
          } else {
            if (name in cache) {
              /** @type {Array} */
              name = [name];
            } else {
              name = jQuery.camelCase(name);
              name = name in cache ? [name] : name.split(" ");
            }
          }
          i = name.length;
          for (;i--;) {
            delete cache[name[i]];
          }
          if (keepData ? !filter(cache) : !jQuery.isEmptyObject(cache)) {
            return;
          }
        }
        if (keepData || (delete response[id].data, filter(response[id]))) {
          if (isNode) {
            jQuery.cleanData([elem], true);
          } else {
            if (support.deleteExpando || response != response.window) {
              delete response[id];
            } else {
              /** @type {null} */
              response[id] = null;
            }
          }
        }
      }
    }
  }
  /**
   * @return {?}
   */
  function returnTrue() {
    return true;
  }
  /**
   * @return {?}
   */
  function returnFalse() {
    return false;
  }
  /**
   * @return {?}
   */
  function safeActiveElement() {
    try {
      return doc.activeElement;
    } catch (a) {
    }
  }
  /**
   * @param {(Document|DocumentFragment)} doc
   * @return {?}
   */
  function save(doc) {
    /** @type {Array.<string>} */
    var braceStack = uHostName.split("|");
    var ctx = doc.createDocumentFragment();
    if (ctx.createElement) {
      for (;braceStack.length;) {
        ctx.createElement(braceStack.pop());
      }
    }
    return ctx;
  }
  /**
   * @param {Node} context
   * @param {Object} tag
   * @return {?}
   */
  function getAll(context, tag) {
    var opt_nodes;
    var node;
    /** @type {number} */
    var i = 0;
    var ret = typeof context.getElementsByTagName !== text ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== text ? context.querySelectorAll(tag || "*") : void 0;
    if (!ret) {
      /** @type {Array} */
      ret = [];
      opt_nodes = context.childNodes || context;
      for (;null != (node = opt_nodes[i]);i++) {
        if (!tag || jQuery.nodeName(node, tag)) {
          ret.push(node);
        } else {
          jQuery.merge(ret, getAll(node, tag));
        }
      }
    }
    return void 0 === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
  }
  /**
   * @param {Element} elem
   * @return {undefined}
   */
  function set(elem) {
    if (manipulation_rcheckableType.test(elem.type)) {
      elem.defaultChecked = elem.checked;
    }
  }
  /**
   * @param {Node} elem
   * @param {Array} content
   * @return {?}
   */
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, "table") && jQuery.nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function restoreScript(elem) {
    return elem.type = (null !== jQuery.find.attr(elem, "type")) + "/" + elem.type, elem;
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function fn(elem) {
    /** @type {(Array.<string>|null)} */
    var match = rscriptTypeMasked.exec(elem.type);
    return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
  }
  /**
   * @param {(Array|NodeList)} elems
   * @param {Array} refElements
   * @return {undefined}
   */
  function setGlobalEval(elems, refElements) {
    var node;
    /** @type {number} */
    var i = 0;
    for (;null != (node = elems[i]);i++) {
      jQuery._data(node, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
    }
  }
  /**
   * @param {Object} src
   * @param {Object} dest
   * @return {undefined}
   */
  function cloneCopyEvent(src, dest) {
    if (1 === dest.nodeType && jQuery.hasData(src)) {
      var type;
      var i;
      var ilen;
      var oldData = jQuery._data(src);
      var curData = jQuery._data(dest, oldData);
      var events = oldData.events;
      if (events) {
        delete curData.handle;
        curData.events = {};
        for (type in events) {
          /** @type {number} */
          i = 0;
          ilen = events[type].length;
          for (;ilen > i;i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
      if (curData.data) {
        curData.data = jQuery.extend({}, curData.data);
      }
    }
  }
  /**
   * @param {Element} src
   * @param {Object} dest
   * @return {undefined}
   */
  function cloneFixAttributes(src, dest) {
    var name;
    var type;
    var pdataCur;
    if (1 === dest.nodeType) {
      if (name = dest.nodeName.toLowerCase(), !support.noCloneEvent && dest[jQuery.expando]) {
        pdataCur = jQuery._data(dest);
        for (type in pdataCur.events) {
          jQuery.removeEvent(dest, type, pdataCur.handle);
        }
        dest.removeAttribute(jQuery.expando);
      }
      if ("script" === name && dest.text !== src.text) {
        restoreScript(dest).text = src.text;
        fn(dest);
      } else {
        if ("object" === name) {
          if (dest.parentNode) {
            dest.outerHTML = src.outerHTML;
          }
          if (support.html5Clone) {
            if (src.innerHTML) {
              if (!jQuery.trim(dest.innerHTML)) {
                dest.innerHTML = src.innerHTML;
              }
            }
          }
        } else {
          if ("input" === name && manipulation_rcheckableType.test(src.type)) {
            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
              dest.value = src.value;
            }
          } else {
            if ("option" === name) {
              dest.defaultSelected = dest.selected = src.defaultSelected;
            } else {
              if ("input" === name || "textarea" === name) {
                dest.defaultValue = src.defaultValue;
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {?} name
   * @param {Document} doc
   * @return {?}
   */
  function actualDisplay(name, doc) {
    var result;
    var elem = jQuery(doc.createElement(name)).appendTo(doc.body);
    var f = win.getDefaultComputedStyle && (result = win.getDefaultComputedStyle(elem[0])) ? result.display : jQuery.css(elem[0], "display");
    return elem.detach(), f;
  }
  /**
   * @param {?} nodeName
   * @return {?}
   */
  function defaultDisplay(nodeName) {
    var d = doc;
    var display = elemdisplay[nodeName];
    return display || (display = actualDisplay(nodeName, d), "none" !== display && display || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (iframe[0].contentWindow || iframe[0].contentDocument).document, d.write(), d.close(), display = actualDisplay(nodeName, d), iframe.detach()), elemdisplay[nodeName] = display), display;
  }
  /**
   * @param {?} require
   * @param {Function} hookFn
   * @return {?}
   */
  function addGetHookIf(require, hookFn) {
    return{
      /**
       * @return {?}
       */
      get : function() {
        var Block = require();
        if (null != Block) {
          return Block ? void delete this.get : (this.get = hookFn).apply(this, arguments);
        }
      }
    };
  }
  /**
   * @param {Object} style
   * @param {string} name
   * @return {?}
   */
  function vendorPropName(style, name) {
    if (name in style) {
      return name;
    }
    var capName = name.charAt(0).toUpperCase() + name.slice(1);
    /** @type {string} */
    var origName = name;
    /** @type {number} */
    var i = cssPrefixes.length;
    for (;i--;) {
      if (name = cssPrefixes[i] + capName, name in style) {
        return name;
      }
    }
    return origName;
  }
  /**
   * @param {Array} elements
   * @param {boolean} show
   * @return {?}
   */
  function showHide(elements, show) {
    var display;
    var elem;
    var hidden;
    /** @type {Array} */
    var values = [];
    /** @type {number} */
    var index = 0;
    var length = elements.length;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        values[index] = jQuery._data(elem, "olddisplay");
        display = elem.style.display;
        if (show) {
          if (!values[index]) {
            if (!("none" !== display)) {
              /** @type {string} */
              elem.style.display = "";
            }
          }
          if ("" === elem.style.display) {
            if (ok(elem)) {
              values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
            }
          }
        } else {
          hidden = ok(elem);
          if (display && "none" !== display || !hidden) {
            jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
          }
        }
      }
    }
    /** @type {number} */
    index = 0;
    for (;length > index;index++) {
      elem = elements[index];
      if (elem.style) {
        if (!(show && ("none" !== elem.style.display && "" !== elem.style.display))) {
          elem.style.display = show ? values[index] || "" : "none";
        }
      }
    }
    return elements;
  }
  /**
   * @param {Object} a
   * @param {Object} value
   * @param {string} actual
   * @return {?}
   */
  function compare(a, value, actual) {
    /** @type {(Array.<string>|null)} */
    var iterator = rrelNum.exec(value);
    return iterator ? Math.max(0, iterator[1] - (actual || 0)) + (iterator[2] || "px") : value;
  }
  /**
   * @param {Object} elem
   * @param {string} prop
   * @param {string} extra
   * @param {boolean} isBorderBox
   * @param {?} styles
   * @return {?}
   */
  function augmentWidthOrHeight(elem, prop, extra, isBorderBox, styles) {
    /** @type {number} */
    var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === prop ? 1 : 0;
    /** @type {number} */
    var val = 0;
    for (;4 > i;i += 2) {
      if ("margin" === extra) {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if ("content" === extra) {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if ("margin" !== extra) {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      } else {
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        if ("padding" !== extra) {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    }
    return val;
  }
  /**
   * @param {Object} elem
   * @param {string} name
   * @param {string} extra
   * @return {?}
   */
  function getWidthOrHeight(elem, name, extra) {
    /** @type {boolean} */
    var valueIsBorderBox = true;
    var val = "width" === name ? elem.offsetWidth : elem.offsetHeight;
    var styles = getStyles(elem);
    /** @type {boolean} */
    var isBorderBox = support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", false, styles);
    if (0 >= val || null == val) {
      if (val = get(elem, name, styles), (0 > val || null == val) && (val = elem.style[name]), rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
      /** @type {number} */
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
  }
  /**
   * @param {string} selector
   * @param {string} context
   * @param {string} prop
   * @param {string} end
   * @param {string} easing
   * @return {?}
   */
  function Tween(selector, context, prop, end, easing) {
    return new Tween.prototype.init(selector, context, prop, end, easing);
  }
  /**
   * @return {?}
   */
  function createFxNow() {
    return setTimeout(function() {
      fxNow = void 0;
    }), fxNow = jQuery.now();
  }
  /**
   * @param {number} type
   * @param {boolean} includeWidth
   * @return {?}
   */
  function genFx(type, includeWidth) {
    var which;
    var attrs = {
      height : type
    };
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    includeWidth = includeWidth ? 1 : 0;
    for (;4 > i;i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    return includeWidth && (attrs.opacity = attrs.width = type), attrs;
  }
  /**
   * @param {?} value
   * @param {?} prop
   * @param {?} animation
   * @return {?}
   */
  function createTween(value, prop, animation) {
    var tween;
    var q = (cache[prop] || []).concat(cache["*"]);
    /** @type {number} */
    var i = 0;
    var l = q.length;
    for (;l > i;i++) {
      if (tween = q[i].call(animation, prop, value)) {
        return tween;
      }
    }
  }
  /**
   * @param {Object} elem
   * @param {Object} props
   * @param {Object} opts
   * @return {undefined}
   */
  function defaultPrefilter(elem, props, opts) {
    var prop;
    var value;
    var thisp;
    var tween;
    var hooks;
    var oldfire;
    var oldDisplay;
    var type;
    var anim = this;
    var orig = {};
    var style = elem.style;
    var hidden = elem.nodeType && ok(elem);
    var dataShow = jQuery._data(elem, "fxshow");
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, "fx");
      if (null == hooks.unqueued) {
        /** @type {number} */
        hooks.unqueued = 0;
        /** @type {function (): undefined} */
        oldfire = hooks.empty.fire;
        /**
         * @return {undefined}
         */
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function() {
        anim.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (1 === elem.nodeType) {
      if ("height" in props || "width" in props) {
        /** @type {Array} */
        opts.overflow = [style.overflow, style.overflowX, style.overflowY];
        oldDisplay = jQuery.css(elem, "display");
        type = "none" === oldDisplay ? jQuery._data(elem, "olddisplay") || defaultDisplay(elem.nodeName) : oldDisplay;
        if ("inline" === type) {
          if ("none" === jQuery.css(elem, "float")) {
            if (support.inlineBlockNeedsLayout && "inline" !== defaultDisplay(elem.nodeName)) {
              /** @type {number} */
              style.zoom = 1;
            } else {
              /** @type {string} */
              style.display = "inline-block";
            }
          }
        }
      }
    }
    if (opts.overflow) {
      /** @type {string} */
      style.overflow = "hidden";
      if (!support.shrinkWrapBlocks()) {
        anim.always(function() {
          style.overflow = opts.overflow[0];
          style.overflowX = opts.overflow[1];
          style.overflowY = opts.overflow[2];
        });
      }
    }
    for (prop in props) {
      if (value = props[prop], rplusequals.exec(value)) {
        if (delete props[prop], thisp = thisp || "toggle" === value, value === (hidden ? "hide" : "show")) {
          if ("show" !== value || (!dataShow || void 0 === dataShow[prop])) {
            continue;
          }
          /** @type {boolean} */
          hidden = true;
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      } else {
        oldDisplay = void 0;
      }
    }
    if (jQuery.isEmptyObject(orig)) {
      if ("inline" === ("none" === oldDisplay ? defaultDisplay(elem.nodeName) : oldDisplay)) {
        style.display = oldDisplay;
      }
    } else {
      if (dataShow) {
        if ("hidden" in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = jQuery._data(elem, "fxshow", {});
      }
      if (thisp) {
        /** @type {boolean} */
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(elem).show();
      } else {
        anim.done(function() {
          jQuery(elem).hide();
        });
      }
      anim.done(function() {
        var pdataOld;
        jQuery._removeData(elem, "fxshow");
        for (pdataOld in orig) {
          jQuery.style(elem, pdataOld, orig[pdataOld]);
        }
      });
      for (prop in orig) {
        tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            /** @type {number} */
            tween.start = "width" === prop || "height" === prop ? 1 : 0;
          }
        }
      }
    }
  }
  /**
   * @param {Object} obj
   * @param {Object} members
   * @return {undefined}
   */
  function propFilter(obj, members) {
    var key;
    var name;
    var member;
    var value;
    var hooks;
    for (key in obj) {
      if (name = jQuery.camelCase(key), member = members[name], value = obj[key], jQuery.isArray(value) && (member = value[1], value = obj[key] = value[0]), key !== name && (obj[name] = value, delete obj[key]), hooks = jQuery.cssHooks[name], hooks && "expand" in hooks) {
        value = hooks.expand(value);
        delete obj[name];
        for (key in value) {
          if (!(key in obj)) {
            obj[key] = value[key];
            members[key] = member;
          }
        }
      } else {
        members[name] = member;
      }
    }
  }
  /**
   * @param {string} elem
   * @param {?} properties
   * @param {Object} options
   * @return {?}
   */
  function Animation(elem, properties, options) {
    var result;
    var e;
    /** @type {number} */
    var index = 0;
    /** @type {number} */
    var length = animationPrefilters.length;
    var deferred = jQuery.Deferred().always(function() {
      delete tick.elem;
    });
    /**
     * @return {?}
     */
    var tick = function() {
      if (e) {
        return false;
      }
      var currentTime = fxNow || createFxNow();
      /** @type {number} */
      var remaining = Math.max(0, animation.startTime + animation.duration - currentTime);
      /** @type {number} */
      var temp = remaining / animation.duration || 0;
      /** @type {number} */
      var percent = 1 - temp;
      /** @type {number} */
      var index = 0;
      var startOffset = animation.tweens.length;
      for (;startOffset > index;index++) {
        animation.tweens[index].run(percent);
      }
      return deferred.notifyWith(elem, [animation, percent, remaining]), 1 > percent && startOffset ? remaining : (deferred.resolveWith(elem, [animation]), false);
    };
    var animation = deferred.promise({
      elem : elem,
      props : jQuery.extend({}, properties),
      opts : jQuery.extend(true, {
        specialEasing : {}
      }, options),
      originalProperties : properties,
      originalOptions : options,
      startTime : fxNow || createFxNow(),
      duration : options.duration,
      tweens : [],
      /**
       * @param {string} prop
       * @param {string} end
       * @return {?}
       */
      createTween : function(prop, end) {
        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
        return animation.tweens.push(tween), tween;
      },
      /**
       * @param {boolean} gotoEnd
       * @return {?}
       */
      stop : function(gotoEnd) {
        /** @type {number} */
        var index = 0;
        var length = gotoEnd ? animation.tweens.length : 0;
        if (e) {
          return this;
        }
        /** @type {boolean} */
        e = true;
        for (;length > index;index++) {
          animation.tweens[index].run(1);
        }
        return gotoEnd ? deferred.resolveWith(elem, [animation, gotoEnd]) : deferred.rejectWith(elem, [animation, gotoEnd]), this;
      }
    });
    var props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (;length > index;index++) {
      if (result = animationPrefilters[index].call(animation, elem, props, animation.opts)) {
        return result;
      }
    }
    return jQuery.map(props, createTween, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), jQuery.fx.timer(jQuery.extend(tick, {
      elem : elem,
      anim : animation,
      queue : animation.opts.queue
    })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  /**
   * @param {Array} structure
   * @return {?}
   */
  function addToPrefiltersOrTransports(structure) {
    return function(selector, fn) {
      if ("string" != typeof selector) {
        /** @type {(Function|string)} */
        fn = selector;
        /** @type {string} */
        selector = "*";
      }
      var node;
      /** @type {number} */
      var i = 0;
      var elem = selector.toLowerCase().match(core_rnotwhite) || [];
      if (jQuery.isFunction(fn)) {
        for (;node = elem[i++];) {
          if ("+" === node.charAt(0)) {
            node = node.slice(1) || "*";
            (structure[node] = structure[node] || []).unshift(fn);
          } else {
            (structure[node] = structure[node] || []).push(fn);
          }
        }
      }
    };
  }
  /**
   * @param {?} structure
   * @param {?} options
   * @param {Object} originalOptions
   * @param {?} jqXHR
   * @return {?}
   */
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    /**
     * @param {string} key
     * @return {?}
     */
    function inspect(key) {
      var oldName;
      return old[key] = true, jQuery.each(structure[key] || [], function(dataAndEvents, prefilterOrFactory) {
        var name = prefilterOrFactory(options, originalOptions, jqXHR);
        return "string" != typeof name || (seekingTransport || old[name]) ? seekingTransport ? !(oldName = name) : void 0 : (options.dataTypes.unshift(name), inspect(name), false);
      }), oldName;
    }
    var old = {};
    /** @type {boolean} */
    var seekingTransport = structure === transports;
    return inspect(options.dataTypes[0]) || !old["*"] && inspect("*");
  }
  /**
   * @param {(Object|string)} target
   * @param {Object} src
   * @return {?}
   */
  function ajaxExtend(target, src) {
    var deep;
    var key;
    var flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (void 0 !== src[key]) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    return deep && jQuery.extend(true, target, deep), target;
  }
  /**
   * @param {Object} s
   * @param {XMLHttpRequest} jqXHR
   * @param {Object} responses
   * @return {?}
   */
  function ajaxHandleResponses(s, jqXHR, responses) {
    var firstDataType;
    var ct;
    var finalDataType;
    var type;
    var contents = s.contents;
    var dataTypes = s.dataTypes;
    for (;"*" === dataTypes[0];) {
      dataTypes.shift();
      if (void 0 === ct) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          /** @type {string} */
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          /** @type {string} */
          firstDataType = type;
        }
      }
      /** @type {(string|undefined)} */
      finalDataType = finalDataType || firstDataType;
    }
    return finalDataType ? (finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType]) : void 0;
  }
  /**
   * @param {Object} s
   * @param {(Object|string)} response
   * @param {?} jqXHR
   * @param {Object} isSuccess
   * @return {?}
   */
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2;
    var current;
    var conv;
    var tmp;
    var prev;
    var converters = {};
    var dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    for (;current;) {
      if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), !prev && (isSuccess && (s.dataFilter && (response = s.dataFilter(response, s.dataType)))), prev = current, current = dataTypes.shift()) {
        if ("*" === current) {
          current = prev;
        } else {
          if ("*" !== prev && prev !== current) {
            if (conv = converters[prev + " " + current] || converters["* " + current], !conv) {
              for (conv2 in converters) {
                if (tmp = conv2.split(" "), tmp[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else {
                    if (converters[conv2] !== true) {
                      /** @type {string} */
                      current = tmp[0];
                      dataTypes.unshift(tmp[1]);
                    }
                  }
                  break;
                }
              }
            }
            if (conv !== true) {
              if (conv && s["throws"]) {
                response = conv(response);
              } else {
                try {
                  response = conv(response);
                } catch (e) {
                  return{
                    state : "parsererror",
                    error : conv ? e : "No conversion from " + prev + " to " + current
                  };
                }
              }
            }
          }
        }
      }
    }
    return{
      state : "success",
      data : response
    };
  }
  /**
   * @param {string} prefix
   * @param {Object} exports
   * @param {boolean} traditional
   * @param {Function} add
   * @return {undefined}
   */
  function buildParams(prefix, exports, traditional, add) {
    var name;
    if (jQuery.isArray(exports)) {
      jQuery.each(exports, function(i, v) {
        if (traditional || rmargin.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
        }
      });
    } else {
      if (traditional || "object" !== jQuery.type(exports)) {
        add(prefix, exports);
      } else {
        for (name in exports) {
          buildParams(prefix + "[" + name + "]", exports[name], traditional, add);
        }
      }
    }
  }
  /**
   * @return {?}
   */
  function createStandardXHR() {
    try {
      return new win.XMLHttpRequest;
    } catch (b) {
    }
  }
  /**
   * @return {?}
   */
  function createActiveXHR() {
    try {
      return new win.ActiveXObject("Microsoft.XMLHTTP");
    } catch (b) {
    }
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType ? elem.defaultView || elem.parentWindow : false;
  }
  /** @type {Array} */
  var core_deletedIds = [];
  /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
  var core_slice = core_deletedIds.slice;
  /** @type {function (this:*, ...[*]): Array} */
  var core_concat = core_deletedIds.concat;
  /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
  var core_push = core_deletedIds.push;
  /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
  var core_indexOf = core_deletedIds.indexOf;
  var class2type = {};
  /** @type {function (this:*): string} */
  var core_toString = class2type.toString;
  /** @type {function (this:Object, *): boolean} */
  var core_hasOwn = class2type.hasOwnProperty;
  var support = {};
  /** @type {string} */
  var core_version = "1.11.3";
  /**
   * @param {string} selector
   * @param {string} context
   * @return {?}
   */
  var jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context);
  };
  /** @type {RegExp} */
  var badChars = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  /** @type {RegExp} */
  var rmsPrefix = /^-ms-/;
  /** @type {RegExp} */
  var emptyParagraphRegexp = /-([\da-z])/gi;
  /**
   * @param {?} all
   * @param {string} letter
   * @return {?}
   */
  var fcamelCase = function(all, letter) {
    return letter.toUpperCase();
  };
  jQuery.fn = jQuery.prototype = {
    jquery : core_version,
    /** @type {function (string, string): ?} */
    constructor : jQuery,
    selector : "",
    length : 0,
    /**
     * @return {?}
     */
    toArray : function() {
      return core_slice.call(this);
    },
    /**
     * @param {Object} num
     * @return {?}
     */
    get : function(num) {
      return null != num ? 0 > num ? this[num + this.length] : this[num] : core_slice.call(this);
    },
    /**
     * @param {Array} elems
     * @return {?}
     */
    pushStack : function(elems) {
      var ret = jQuery.merge(this.constructor(), elems);
      return ret.prevObject = this, ret.context = this.context, ret;
    },
    /**
     * @param {Function} opt_attributes
     * @param {Function} args
     * @return {?}
     */
    each : function(opt_attributes, args) {
      return jQuery.each(this, opt_attributes, args);
    },
    /**
     * @param {Function} callback
     * @return {?}
     */
    map : function(callback) {
      return this.pushStack(jQuery.map(this, function(el, operation) {
        return callback.call(el, operation, el);
      }));
    },
    /**
     * @return {?}
     */
    slice : function() {
      return this.pushStack(core_slice.apply(this, arguments));
    },
    /**
     * @return {?}
     */
    first : function() {
      return this.eq(0);
    },
    /**
     * @return {?}
     */
    last : function() {
      return this.eq(-1);
    },
    /**
     * @param {number} b
     * @return {?}
     */
    eq : function(b) {
      var l = this.length;
      var i = +b + (0 > b ? l : 0);
      return this.pushStack(i >= 0 && l > i ? [this[i]] : []);
    },
    /**
     * @return {?}
     */
    end : function() {
      return this.prevObject || this.constructor(null);
    },
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    push : core_push,
    /** @type {function (this:(Array.<T>|{length: number}), function (T, T): number=): ?} */
    sort : core_deletedIds.sort,
    /** @type {function (this:(Array.<T>|{length: number}), *=, *=, ...[T]): Array.<T>} */
    splice : core_deletedIds.splice
  };
  /** @type {function (): ?} */
  jQuery.extend = jQuery.fn.extend = function() {
    var src;
    var copyIsArray;
    var copy;
    var name;
    var options;
    var clone;
    var target = arguments[0] || {};
    /** @type {number} */
    var i = 1;
    /** @type {number} */
    var l = arguments.length;
    /** @type {boolean} */
    var deep = false;
    if ("boolean" == typeof target) {
      /** @type {boolean} */
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (!("object" == typeof target)) {
      if (!jQuery.isFunction(target)) {
        target = {};
      }
    }
    if (i === l) {
      target = this;
      i--;
    }
    for (;l > i;i++) {
      if (null != (options = arguments[i])) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target !== copy) {
            if (deep && (copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))))) {
              if (copyIsArray) {
                /** @type {boolean} */
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : [];
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              target[name] = jQuery.extend(deep, clone, copy);
            } else {
              if (void 0 !== copy) {
                target[name] = copy;
              }
            }
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando : "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
    isReady : true,
    /**
     * @param {Object} a
     * @return {?}
     */
    error : function(a) {
      throw new Error(a);
    },
    /**
     * @return {undefined}
     */
    noop : function() {
    },
    /**
     * @param {Object} ok
     * @return {?}
     */
    isFunction : function(ok) {
      return "function" === jQuery.type(ok);
    },
    /** @type {function (*): boolean} */
    isArray : Array.isArray || function(ok) {
      return "array" === jQuery.type(ok);
    },
    /**
     * @param {Object} obj
     * @return {?}
     */
    isWindow : function(obj) {
      return null != obj && obj == obj.window;
    },
    /**
     * @param {string} value
     * @return {?}
     */
    isNumeric : function(value) {
      return!jQuery.isArray(value) && value - parseFloat(value) + 1 >= 0;
    },
    /**
     * @param {?} obj
     * @return {?}
     */
    isEmptyObject : function(obj) {
      var prop;
      for (prop in obj) {
        return false;
      }
      return true;
    },
    /**
     * @param {Object} exports
     * @return {?}
     */
    isPlainObject : function(exports) {
      var key;
      if (!exports || ("object" !== jQuery.type(exports) || (exports.nodeType || jQuery.isWindow(exports)))) {
        return false;
      }
      try {
        if (exports.constructor && (!core_hasOwn.call(exports, "constructor") && !core_hasOwn.call(exports.constructor.prototype, "isPrototypeOf"))) {
          return false;
        }
      } catch (c) {
        return false;
      }
      if (support.ownLast) {
        for (key in exports) {
          return core_hasOwn.call(exports, key);
        }
      }
      for (key in exports) {
      }
      return void 0 === key || core_hasOwn.call(exports, key);
    },
    /**
     * @param {Object} a
     * @return {?}
     */
    type : function(a) {
      return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? class2type[core_toString.call(a)] || "object" : typeof a;
    },
    /**
     * @param {?} data
     * @return {undefined}
     */
    globalEval : function(data) {
      if (data) {
        if (jQuery.trim(data)) {
          (win.execScript || function(expr) {
            win.eval.call(win, expr);
          })(data);
        }
      }
    },
    /**
     * @param {string} string
     * @return {?}
     */
    camelCase : function(string) {
      return string.replace(rmsPrefix, "ms-").replace(emptyParagraphRegexp, fcamelCase);
    },
    /**
     * @param {Node} elem
     * @param {string} name
     * @return {?}
     */
    nodeName : function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    /**
     * @param {Function} obj
     * @param {Function} callback
     * @param {Object} args
     * @return {?}
     */
    each : function(obj, callback, args) {
      var value;
      /** @type {number} */
      var i = 0;
      var l = obj.length;
      var isArray = isArraylike(obj);
      if (args) {
        if (isArray) {
          for (;l > i;i++) {
            if (value = callback.apply(obj[i], args), value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            if (value = callback.apply(obj[i], args), value === false) {
              break;
            }
          }
        }
      } else {
        if (isArray) {
          for (;l > i;i++) {
            if (value = callback.call(obj[i], i, obj[i]), value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            if (value = callback.call(obj[i], i, obj[i]), value === false) {
              break;
            }
          }
        }
      }
      return obj;
    },
    /**
     * @param {Object} text
     * @return {?}
     */
    trim : function(text) {
      return null == text ? "" : (text + "").replace(badChars, "");
    },
    /**
     * @param {?} arr
     * @param {Array} results
     * @return {?}
     */
    makeArray : function(arr, results) {
      var ret = results || [];
      return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [arr] : arr) : core_push.call(ret, arr)), ret;
    },
    /**
     * @param {?} elem
     * @param {Array} arr
     * @param {number} i
     * @return {?}
     */
    inArray : function(elem, arr, i) {
      var len;
      if (arr) {
        if (core_indexOf) {
          return core_indexOf.call(arr, elem, i);
        }
        len = arr.length;
        i = i ? 0 > i ? Math.max(0, len + i) : i : 0;
        for (;len > i;i++) {
          if (i in arr && arr[i] === elem) {
            return i;
          }
        }
      }
      return-1;
    },
    /**
     * @param {(Function|string)} first
     * @param {?} second
     * @return {?}
     */
    merge : function(first, second) {
      /** @type {number} */
      var jlen = +second.length;
      /** @type {number} */
      var j = 0;
      var i = first.length;
      for (;jlen > j;) {
        first[i++] = second[j++];
      }
      if (jlen !== jlen) {
        for (;void 0 !== second[j];) {
          first[i++] = second[j++];
        }
      }
      return first.length = i, first;
    },
    /**
     * @param {Array} elems
     * @param {Function} callback
     * @param {?} inv
     * @return {?}
     */
    grep : function(elems, callback, inv) {
      var val;
      /** @type {Array} */
      var ret = [];
      /** @type {number} */
      var i = 0;
      var l = elems.length;
      /** @type {boolean} */
      var skip = !inv;
      for (;l > i;i++) {
        /** @type {boolean} */
        val = !callback(elems[i], i);
        if (val !== skip) {
          ret.push(elems[i]);
        }
      }
      return ret;
    },
    /**
     * @param {Object} elems
     * @param {Function} callback
     * @param {Object} arg
     * @return {?}
     */
    map : function(elems, callback, arg) {
      var value;
      /** @type {number} */
      var i = 0;
      var l = elems.length;
      var isArray = isArraylike(elems);
      /** @type {Array} */
      var ret = [];
      if (isArray) {
        for (;l > i;i++) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret.push(value);
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret.push(value);
          }
        }
      }
      return core_concat.apply([], ret);
    },
    guid : 1,
    /**
     * @param {Object} fn
     * @param {(Function|string)} context
     * @return {?}
     */
    proxy : function(fn, context) {
      var args;
      var proxy;
      var tmp;
      return "string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn) ? (args = core_slice.call(arguments, 2), proxy = function() {
        return fn.apply(context || this, args.concat(core_slice.call(arguments)));
      }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : void 0;
    },
    /**
     * @return {?}
     */
    now : function() {
      return+new Date;
    },
    support : support
  });
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(dataAndEvents, m3) {
    class2type["[object " + m3 + "]"] = m3.toLowerCase();
  });
  var Sizzle = function(win) {
    /**
     * @param {string} selector
     * @param {Object} context
     * @param {Array} results
     * @param {Array} seed
     * @return {?}
     */
    function Sizzle(selector, context, results, seed) {
      var match;
      var elem;
      var m;
      var type;
      var i;
      var groups;
      var old;
      var nid;
      var newContext;
      var newSelector;
      if ((context ? context.ownerDocument || context : preferredDoc) !== doc && setDocument(context), context = context || doc, results = results || [], type = context.nodeType, "string" != typeof selector || (!selector || 1 !== type && (9 !== type && 11 !== type))) {
        return results;
      }
      if (!seed && documentIsHTML) {
        if (11 !== type && (match = rquickExpr.exec(selector))) {
          if (m = match[1]) {
            if (9 === type) {
              if (elem = context.getElementById(m), !elem || !elem.parentNode) {
                return results;
              }
              if (elem.id === m) {
                return results.push(elem), results;
              }
            } else {
              if (context.ownerDocument && ((elem = context.ownerDocument.getElementById(m)) && (contains(context, elem) && elem.id === m))) {
                return results.push(elem), results;
              }
            }
          } else {
            if (match[2]) {
              return push.apply(results, context.getElementsByTagName(selector)), results;
            }
            if ((m = match[3]) && support.getElementsByClassName) {
              return push.apply(results, context.getElementsByClassName(m)), results;
            }
          }
        }
        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          if (nid = old = expando, newContext = context, newSelector = 1 !== type && selector, 1 === type && "object" !== context.nodeName.toLowerCase()) {
            groups = tokenize(selector);
            if (old = context.getAttribute("id")) {
              nid = old.replace(r20, "\\$&");
            } else {
              context.setAttribute("id", nid);
            }
            /** @type {string} */
            nid = "[id='" + nid + "'] ";
            i = groups.length;
            for (;i--;) {
              /** @type {string} */
              groups[i] = nid + toSelector(groups[i]);
            }
            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
            newSelector = groups.join(",");
          }
          if (newSelector) {
            try {
              return push.apply(results, newContext.querySelectorAll(newSelector)), results;
            } catch (y) {
            } finally {
              if (!old) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    /**
     * @return {?}
     */
    function createCache() {
      /**
       * @param {string} key
       * @param {?} value
       * @return {?}
       */
      function cache(key, value) {
        return buf.push(key + " ") > Expr.cacheLength && delete cache[buf.shift()], cache[key + " "] = value;
      }
      /** @type {Array} */
      var buf = [];
      return cache;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function markFunction(fn) {
      return fn[expando] = true, fn;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function assert(fn) {
      var t = doc.createElement("div");
      try {
        return!!fn(t);
      } catch (c) {
        return false;
      } finally {
        if (t.parentNode) {
          t.parentNode.removeChild(t);
        }
        /** @type {null} */
        t = null;
      }
    }
    /**
     * @param {string} attrs
     * @param {Function} handler
     * @return {undefined}
     */
    function addHandle(attrs, handler) {
      var arr = attrs.split("|");
      var i = attrs.length;
      for (;i--;) {
        /** @type {Function} */
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    /**
     * @param {Object} a
     * @param {Object} b
     * @return {?}
     */
    function siblingCheck(a, b) {
      var cur = b && a;
      var diff = cur && (1 === a.nodeType && (1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE)));
      if (diff) {
        return diff;
      }
      if (cur) {
        for (;cur = cur.nextSibling;) {
          if (cur === b) {
            return-1;
          }
        }
      }
      return a ? 1 : -1;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createInputPseudo(type) {
      return function(elem) {
        var b = elem.nodeName.toLowerCase();
        return "input" === b && elem.type === type;
      };
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createButtonPseudo(type) {
      return function(elem) {
        var NULL = elem.nodeName.toLowerCase();
        return("input" === NULL || "button" === NULL) && elem.type === type;
      };
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        return argument = +argument, markFunction(function(seed, matches) {
          var j;
          var matchIndexes = fn([], seed.length, argument);
          var i = matchIndexes.length;
          for (;i--;) {
            if (seed[j = matchIndexes[i]]) {
              /** @type {boolean} */
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    /**
     * @param {Object} context
     * @return {?}
     */
    function testContext(context) {
      return context && ("undefined" != typeof context.getElementsByTagName && context);
    }
    /**
     * @return {undefined}
     */
    function setFilters() {
    }
    /**
     * @param {Array} tokens
     * @return {?}
     */
    function toSelector(tokens) {
      /** @type {number} */
      var i = 0;
      var nTokens = tokens.length;
      /** @type {string} */
      var selector = "";
      for (;nTokens > i;i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    /**
     * @param {Function} matcher
     * @param {Object} combinator
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    function addCombinator(matcher, combinator, dataAndEvents) {
      var dir = combinator.dir;
      var e = dataAndEvents && "parentNode" === dir;
      /** @type {number} */
      var doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        for (;elem = elem[dir];) {
          if (1 === elem.nodeType || e) {
            return matcher(elem, context, xml);
          }
        }
      } : function(elem, context, xml) {
        var oldCache;
        var outerCache;
        /** @type {Array} */
        var newCache = [dirruns, doneName];
        if (xml) {
          for (;elem = elem[dir];) {
            if ((1 === elem.nodeType || e) && matcher(elem, context, xml)) {
              return true;
            }
          }
        } else {
          for (;elem = elem[dir];) {
            if (1 === elem.nodeType || e) {
              if (outerCache = elem[expando] || (elem[expando] = {}), (oldCache = outerCache[dir]) && (oldCache[0] === dirruns && oldCache[1] === doneName)) {
                return newCache[2] = oldCache[2];
              }
              if (outerCache[dir] = newCache, newCache[2] = matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        }
      };
    }
    /**
     * @param {Array} matchers
     * @return {?}
     */
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function(elem, context, xml) {
        var i = matchers.length;
        for (;i--;) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    /**
     * @param {string} selector
     * @param {Array} contexts
     * @param {?} results
     * @return {?}
     */
    function multipleContexts(selector, contexts, results) {
      /** @type {number} */
      var i = 0;
      var len = contexts.length;
      for (;len > i;i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    /**
     * @param {Array} value
     * @param {Object} val
     * @param {string} fn
     * @param {Object} type
     * @param {string} data
     * @return {?}
     */
    function ondata(value, val, fn, type, data) {
      var child;
      /** @type {Array} */
      var paragraph = [];
      /** @type {number} */
      var i = 0;
      var len = value.length;
      /** @type {boolean} */
      var change = null != val;
      for (;len > i;i++) {
        if (child = value[i]) {
          if (!fn || fn(child, type, data)) {
            paragraph.push(child);
            if (change) {
              val.push(i);
            }
          }
        }
      }
      return paragraph;
    }
    /**
     * @param {string} preFilter
     * @param {Object} selector
     * @param {boolean} func
     * @param {Object} postFilter
     * @param {Object} postFinder
     * @param {Object} postSelector
     * @return {?}
     */
    function setMatcher(preFilter, selector, func, postFilter, postFinder, postSelector) {
      return postFilter && (!postFilter[expando] && (postFilter = setMatcher(postFilter))), postFinder && (!postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector))), markFunction(function(seed, pdataOld, elem, xml) {
        var ok;
        var i;
        var item;
        /** @type {Array} */
        var val = [];
        /** @type {Array} */
        var list = [];
        var preexisting = pdataOld.length;
        var udataCur = seed || multipleContexts(selector || "*", elem.nodeType ? [elem] : elem, []);
        var result = !preFilter || !seed && selector ? udataCur : ondata(udataCur, val, preFilter, elem, xml);
        var name = func ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : pdataOld : result;
        if (func && func(result, name, elem, xml), postFilter) {
          ok = ondata(name, list);
          postFilter(ok, [], elem, xml);
          i = ok.length;
          for (;i--;) {
            if (item = ok[i]) {
              /** @type {boolean} */
              name[list[i]] = !(result[list[i]] = item);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              /** @type {Array} */
              ok = [];
              i = name.length;
              for (;i--;) {
                if (item = name[i]) {
                  ok.push(result[i] = item);
                }
              }
              postFinder(null, name = [], ok, xml);
            }
            i = name.length;
            for (;i--;) {
              if (item = name[i]) {
                if ((ok = postFinder ? getDistance(seed, item) : val[i]) > -1) {
                  /** @type {boolean} */
                  seed[ok] = !(pdataOld[ok] = item);
                }
              }
            }
          }
        } else {
          name = ondata(name === pdataOld ? name.splice(preexisting, name.length) : name);
          if (postFinder) {
            postFinder(null, pdataOld, name, xml);
          } else {
            push.apply(pdataOld, name);
          }
        }
      });
    }
    /**
     * @param {Object} tokens
     * @return {?}
     */
    function matcherFromTokens(tokens) {
      var target;
      var matcher;
      var j;
      var len = tokens.length;
      var leadingRelative = Expr.relative[tokens[0].type];
      var implicitRelative = leadingRelative || Expr.relative[" "];
      /** @type {number} */
      var i = leadingRelative ? 1 : 0;
      var matchContext = addCombinator(function(value) {
        return value === target;
      }, implicitRelative, true);
      var matchAnyContext = addCombinator(function(walkers) {
        return getDistance(target, walkers) > -1;
      }, implicitRelative, true);
      /** @type {Array} */
      var matchers = [function(elem, context, xml) {
        var e = !leadingRelative && (xml || context !== queuedFn) || ((target = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
        return target = null, e;
      }];
      for (;len > i;i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          /** @type {Array} */
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
            /** @type {number} */
            j = ++i;
            for (;len > j;j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
              value : " " === tokens[i - 2].type ? "*" : ""
            })).replace(rtrim, "$1"), matcher, j > i && matcherFromTokens(tokens.slice(i, j)), len > j && matcherFromTokens(tokens = tokens.slice(j)), len > j && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    /**
     * @param {Array} elementMatchers
     * @param {Array} setMatchers
     * @return {?}
     */
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      /** @type {boolean} */
      var bySet = setMatchers.length > 0;
      /** @type {boolean} */
      var triggerElem = elementMatchers.length > 0;
      /**
       * @param {HTMLElement} dataAndEvents
       * @param {Function} xml
       * @param {?} results
       * @param {Array} context
       * @param {Element} seed
       * @return {?}
       */
      var superMatcher = function(dataAndEvents, xml, results, context, seed) {
        var elem;
        var j;
        var matcher;
        /** @type {number} */
        var matchedCount = 0;
        /** @type {string} */
        var i = "0";
        var unmatched = dataAndEvents && [];
        /** @type {Array} */
        var ret = [];
        var fn = queuedFn;
        var elems = dataAndEvents || triggerElem && Expr.find.TAG("*", seed);
        var dirrunsUnique = dirruns += null == fn ? 1 : Math.random() || 0.1;
        var len = elems.length;
        if (seed) {
          queuedFn = xml !== doc && xml;
        }
        for (;i !== len && null != (elem = elems[i]);i++) {
          if (triggerElem && elem) {
            /** @type {number} */
            j = 0;
            for (;matcher = elementMatchers[j++];) {
              if (matcher(elem, xml, results)) {
                context.push(elem);
                break;
              }
            }
            if (seed) {
              dirruns = dirrunsUnique;
            }
          }
          if (bySet) {
            if (elem = !matcher && elem) {
              matchedCount--;
            }
            if (dataAndEvents) {
              unmatched.push(elem);
            }
          }
        }
        if (matchedCount += i, bySet && i !== matchedCount) {
          /** @type {number} */
          j = 0;
          for (;matcher = setMatchers[j++];) {
            matcher(unmatched, ret, xml, results);
          }
          if (dataAndEvents) {
            if (matchedCount > 0) {
              for (;i--;) {
                if (!unmatched[i]) {
                  if (!ret[i]) {
                    ret[i] = pop.call(context);
                  }
                }
              }
            }
            ret = ondata(ret);
          }
          push.apply(context, ret);
          if (seed) {
            if (!dataAndEvents) {
              if (ret.length > 0) {
                if (matchedCount + setMatchers.length > 1) {
                  Sizzle.uniqueSort(context);
                }
              }
            }
          }
        }
        return seed && (dirruns = dirrunsUnique, queuedFn = fn), unmatched;
      };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    var i;
    var support;
    var Expr;
    var getText;
    var objectToString;
    var tokenize;
    var compile;
    var select;
    var queuedFn;
    var sortInput;
    var stability;
    var setDocument;
    var doc;
    var docElem;
    var documentIsHTML;
    var rbuggyQSA;
    var rbuggyMatches;
    var matches;
    var contains;
    /** @type {string} */
    var expando = "sizzle" + 1 * new Date;
    var preferredDoc = win.document;
    /** @type {number} */
    var dirruns = 0;
    /** @type {number} */
    var done = 0;
    var classCache = createCache();
    var tokenCache = createCache();
    var compilerCache = createCache();
    /**
     * @param {?} type
     * @param {?} code
     * @return {?}
     */
    var a = function(type, code) {
      return type === code && (stability = true), 0;
    };
    /** @type {number} */
    var MAX_NEGATIVE = 1 << 31;
    /** @type {function (this:Object, *): boolean} */
    var hasOwn = {}.hasOwnProperty;
    /** @type {Array} */
    var arr = [];
    /** @type {function (this:(Array.<T>|{length: number})): T} */
    var pop = arr.pop;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var push_native = arr.push;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var push = arr.push;
    /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
    var slice = arr.slice;
    /**
     * @param {Object} a
     * @param {?} obj
     * @return {?}
     */
    var getDistance = function(a, obj) {
      /** @type {number} */
      var i = 0;
      var l = a.length;
      for (;l > i;i++) {
        if (a[i] === obj) {
          return i;
        }
      }
      return-1;
    };
    /** @type {string} */
    var booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
    /** @type {string} */
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    /** @type {string} */
    var characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";
    /** @type {string} */
    var identifier = characterEncoding.replace("w", "w#");
    /** @type {string} */
    var attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]";
    /** @type {string} */
    var pseudos = ":(" + characterEncoding + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)";
    /** @type {RegExp} */
    var regexp = new RegExp(whitespace + "+", "g");
    /** @type {RegExp} */
    var rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");
    /** @type {RegExp} */
    var rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*");
    /** @type {RegExp} */
    var rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*");
    /** @type {RegExp} */
    var rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g");
    /** @type {RegExp} */
    var rpseudo = new RegExp(pseudos);
    /** @type {RegExp} */
    var ridentifier = new RegExp("^" + identifier + "$");
    var matchExpr = {
      ID : new RegExp("^#(" + characterEncoding + ")"),
      CLASS : new RegExp("^\\.(" + characterEncoding + ")"),
      TAG : new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
      ATTR : new RegExp("^" + attributes),
      PSEUDO : new RegExp("^" + pseudos),
      CHILD : new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
      bool : new RegExp("^(?:" + booleans + ")$", "i"),
      needsContext : new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
    };
    /** @type {RegExp} */
    var rinputs = /^(?:input|select|textarea|button)$/i;
    /** @type {RegExp} */
    var rheader = /^h\d$/i;
    /** @type {RegExp} */
    var rnative = /^[^{]+\{\s*\[native \w/;
    /** @type {RegExp} */
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    /** @type {RegExp} */
    var rsibling = /[+~]/;
    /** @type {RegExp} */
    var r20 = /'|\\/g;
    /** @type {RegExp} */
    var runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig");
    /**
     * @param {?} _
     * @param {(number|string)} escaped
     * @param {boolean} escapedWhitespace
     * @return {?}
     */
    var funescape = function(_, escaped, escapedWhitespace) {
      /** @type {number} */
      var high = "0x" + escaped - 65536;
      return high !== high || escapedWhitespace ? escaped : 0 > high ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320);
    };
    /**
     * @return {undefined}
     */
    var onComplete = function() {
      setDocument();
    };
    try {
      push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (fa) {
      push = {
        /** @type {function (?, ?): undefined} */
        apply : arr.length ? function(value, array) {
          push_native.apply(value, slice.call(array));
        } : function(target, a) {
          var j = target.length;
          /** @type {number} */
          var ia = 0;
          for (;target[j++] = a[ia++];) {
          }
          /** @type {number} */
          target.length = j - 1;
        }
      };
    }
    support = Sizzle.support = {};
    /** @type {function (Object): ?} */
    objectToString = Sizzle.isXML = function(elem) {
      var node = elem && (elem.ownerDocument || elem).documentElement;
      return node ? "HTML" !== node.nodeName : false;
    };
    /** @type {function (string): ?} */
    setDocument = Sizzle.setDocument = function(node) {
      var n;
      var parent;
      var d = node ? node.ownerDocument || node : preferredDoc;
      return d !== doc && (9 === d.nodeType && d.documentElement) ? (doc = d, docElem = d.documentElement, parent = d.defaultView, parent && (parent !== parent.top && (parent.addEventListener ? parent.addEventListener("unload", onComplete, false) : parent.attachEvent && parent.attachEvent("onunload", onComplete))), documentIsHTML = !objectToString(d), support.attributes = assert(function(div) {
        return div.className = "i", !div.getAttribute("className");
      }), support.getElementsByTagName = assert(function(div) {
        return div.appendChild(d.createComment("")), !div.getElementsByTagName("*").length;
      }), support.getElementsByClassName = rnative.test(d.getElementsByClassName), support.getById = assert(function(div) {
        return docElem.appendChild(div).id = expando, !d.getElementsByName || !d.getElementsByName(expando).length;
      }), support.getById ? (Expr.find.ID = function(id, context) {
        if ("undefined" != typeof context.getElementById && documentIsHTML) {
          var m = context.getElementById(id);
          return m && m.parentNode ? [m] : [];
        }
      }, Expr.filter.ID = function(id) {
        var attrId = id.replace(runescape, funescape);
        return function(elem) {
          return elem.getAttribute("id") === attrId;
        };
      }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
        var attrId = id.replace(runescape, funescape);
        return function(elem) {
          var node = "undefined" != typeof elem.getAttributeNode && elem.getAttributeNode("id");
          return node && node.value === attrId;
        };
      }), Expr.find.TAG = support.getElementsByTagName ? function(selector, el) {
        return "undefined" != typeof el.getElementsByTagName ? el.getElementsByTagName(selector) : support.qsa ? el.querySelectorAll(selector) : void 0;
      } : function(tag, from) {
        var elem;
        /** @type {Array} */
        var tmp = [];
        /** @type {number} */
        var index = 0;
        var results = from.getElementsByTagName(tag);
        if ("*" === tag) {
          for (;elem = results[index++];) {
            if (1 === elem.nodeType) {
              tmp.push(elem);
            }
          }
          return tmp;
        }
        return results;
      }, Expr.find.CLASS = support.getElementsByClassName && function(m, c) {
        return documentIsHTML ? c.getElementsByClassName(m) : void 0;
      }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(d.querySelectorAll)) && (assert(function(div) {
        /** @type {string} */
        docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\f]' msallowcapture=''><option selected=''></option></select>";
        if (div.querySelectorAll("[msallowcapture^='']").length) {
          rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
        }
        if (!div.querySelectorAll("[selected]").length) {
          rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
        }
        if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
          rbuggyQSA.push("~=");
        }
        if (!div.querySelectorAll(":checked").length) {
          rbuggyQSA.push(":checked");
        }
        if (!div.querySelectorAll("a#" + expando + "+*").length) {
          rbuggyQSA.push(".#.+[+~]");
        }
      }), assert(function(div) {
        var input = d.createElement("input");
        input.setAttribute("type", "hidden");
        div.appendChild(input).setAttribute("name", "D");
        if (div.querySelectorAll("[name=d]").length) {
          rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
        }
        if (!div.querySelectorAll(":enabled").length) {
          rbuggyQSA.push(":enabled", ":disabled");
        }
        div.querySelectorAll("*,:x");
        rbuggyQSA.push(",.*:");
      })), (support.matchesSelector = rnative.test(matches = docElem.matches || (docElem.webkitMatchesSelector || (docElem.mozMatchesSelector || (docElem.oMatchesSelector || docElem.msMatchesSelector))))) && assert(function(div) {
        support.disconnectedMatch = matches.call(div, "div");
        matches.call(div, "[s!='']:x");
        rbuggyMatches.push("!=", pseudos);
      }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), n = rnative.test(docElem.compareDocumentPosition), contains = n || rnative.test(docElem.contains) ? function(a, b) {
        var adown = 9 === a.nodeType ? a.documentElement : a;
        var bup = b && b.parentNode;
        return a === bup || !(!bup || (1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup))));
      } : function(a, b) {
        if (b) {
          for (;b = b.parentNode;) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      }, a = n ? function(a, b) {
        if (a === b) {
          return stability = true, 0;
        }
        /** @type {number} */
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        return compare ? compare : (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === d || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === d || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? getDistance(sortInput, a) - getDistance(sortInput, b) : 0 : 4 & compare ? -1 : 1);
      } : function(a, b) {
        if (a === b) {
          return stability = true, 0;
        }
        var cur;
        /** @type {number} */
        var i = 0;
        var aup = a.parentNode;
        var bup = b.parentNode;
        /** @type {Array} */
        var ap = [a];
        /** @type {Array} */
        var bp = [b];
        if (!aup || !bup) {
          return a === d ? -1 : b === d ? 1 : aup ? -1 : bup ? 1 : sortInput ? getDistance(sortInput, a) - getDistance(sortInput, b) : 0;
        }
        if (aup === bup) {
          return siblingCheck(a, b);
        }
        /** @type {Object} */
        cur = a;
        for (;cur = cur.parentNode;) {
          ap.unshift(cur);
        }
        cur = b;
        for (;cur = cur.parentNode;) {
          bp.unshift(cur);
        }
        for (;ap[i] === bp[i];) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      }, d) : doc;
    };
    /**
     * @param {string} expr
     * @param {Array} elements
     * @return {?}
     */
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    /**
     * @param {HTMLElement} elem
     * @param {string} expr
     * @return {?}
     */
    Sizzle.matchesSelector = function(elem, expr) {
      if ((elem.ownerDocument || elem) !== doc && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']"), !(!support.matchesSelector || (!documentIsHTML || (rbuggyMatches && rbuggyMatches.test(expr) || rbuggyQSA && rbuggyQSA.test(expr))))) {
        try {
          var ret = matches.call(elem, expr);
          if (ret || (support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType)) {
            return ret;
          }
        } catch (e) {
        }
      }
      return Sizzle(expr, doc, null, [elem]).length > 0;
    };
    /**
     * @param {Object} context
     * @param {Object} b
     * @return {?}
     */
    Sizzle.contains = function(context, b) {
      return(context.ownerDocument || context) !== doc && setDocument(context), contains(context, b);
    };
    /**
     * @param {Object} elem
     * @param {string} name
     * @return {?}
     */
    Sizzle.attr = function(elem, name) {
      if ((elem.ownerDocument || elem) !== doc) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()];
      var val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
      return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    };
    /**
     * @param {Object} a
     * @return {?}
     */
    Sizzle.error = function(a) {
      throw new Error("Syntax error, unrecognized expression: " + a);
    };
    /**
     * @param {Array} results
     * @return {?}
     */
    Sizzle.uniqueSort = function(results) {
      var elem;
      /** @type {Array} */
      var duplicates = [];
      /** @type {number} */
      var j = 0;
      /** @type {number} */
      var i = 0;
      if (stability = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(a), stability) {
        for (;elem = results[i++];) {
          if (elem === results[i]) {
            /** @type {number} */
            j = duplicates.push(i);
          }
        }
        for (;j--;) {
          results.splice(duplicates[j], 1);
        }
      }
      return sortInput = null, results;
    };
    /** @type {function (Object): ?} */
    getText = Sizzle.getText = function(a) {
      var node;
      /** @type {string} */
      var ret = "";
      /** @type {number} */
      var ia = 0;
      var type = a.nodeType;
      if (type) {
        if (1 === type || (9 === type || 11 === type)) {
          if ("string" == typeof a.textContent) {
            return a.textContent;
          }
          a = a.firstChild;
          for (;a;a = a.nextSibling) {
            ret += getText(a);
          }
        } else {
          if (3 === type || 4 === type) {
            return a.nodeValue;
          }
        }
      } else {
        for (;node = a[ia++];) {
          ret += getText(node);
        }
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength : 50,
      /** @type {function (Function): ?} */
      createPseudo : markFunction,
      match : matchExpr,
      attrHandle : {},
      find : {},
      relative : {
        ">" : {
          dir : "parentNode",
          first : true
        },
        " " : {
          dir : "parentNode"
        },
        "+" : {
          dir : "previousSibling",
          first : true
        },
        "~" : {
          dir : "previousSibling"
        }
      },
      preFilter : {
        /**
         * @param {Array} match
         * @return {?}
         */
        ATTR : function(match) {
          return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || (match[4] || (match[5] || ""))).replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        CHILD : function(match) {
          return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match;
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        PSEUDO : function(match) {
          var excess;
          var unquoted = !match[6] && match[2];
          return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || (match[5] || "") : unquoted && (rpseudo.test(unquoted) && ((excess = tokenize(unquoted, true)) && ((excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess))))), match.slice(0, 3));
        }
      },
      filter : {
        /**
         * @param {string} nodeNameSelector
         * @return {?}
         */
        TAG : function(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return "*" === nodeNameSelector ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        /**
         * @param {string} className
         * @return {?}
         */
        CLASS : function(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
            return pattern.test("string" == typeof elem.className && elem.className || ("undefined" != typeof elem.getAttribute && elem.getAttribute("class") || ""));
          });
        },
        /**
         * @param {string} name
         * @param {string} not
         * @param {string} check
         * @return {?}
         */
        ATTR : function(name, not, check) {
          return function(elem) {
            var result = Sizzle.attr(elem, name);
            return null == result ? "!=" === not : not ? (result += "", "=" === not ? result === check : "!=" === not ? result !== check : "^=" === not ? check && 0 === result.indexOf(check) : "*=" === not ? check && result.indexOf(check) > -1 : "$=" === not ? check && result.slice(-check.length) === check : "~=" === not ? (" " + result.replace(regexp, " ") + " ").indexOf(check) > -1 : "|=" === not ? result === check || result.slice(0, check.length + 1) === check + "-" : false) : true;
          };
        },
        /**
         * @param {string} type
         * @param {string} argument
         * @param {?} dataAndEvents
         * @param {number} first
         * @param {number} last
         * @return {?}
         */
        CHILD : function(type, argument, dataAndEvents, first, last) {
          /** @type {boolean} */
          var simple = "nth" !== type.slice(0, 3);
          /** @type {boolean} */
          var forward = "last" !== type.slice(-4);
          /** @type {boolean} */
          var value = "of-type" === argument;
          return 1 === first && 0 === last ? function(contestant) {
            return!!contestant.parentNode;
          } : function(elem, dataAndEvents, computed) {
            var cache;
            var outerCache;
            var node;
            var diff;
            var nodeIndex;
            var eventPath;
            /** @type {string} */
            var which = simple !== forward ? "nextSibling" : "previousSibling";
            var parent = elem.parentNode;
            var attrNames = value && elem.nodeName.toLowerCase();
            /** @type {boolean} */
            var useCache = !computed && !value;
            if (parent) {
              if (simple) {
                for (;which;) {
                  /** @type {Node} */
                  node = elem;
                  for (;node = node[which];) {
                    if (value ? node.nodeName.toLowerCase() === attrNames : 1 === node.nodeType) {
                      return false;
                    }
                  }
                  /** @type {(boolean|string)} */
                  eventPath = which = "only" === type && (!eventPath && "nextSibling");
                }
                return true;
              }
              if (eventPath = [forward ? parent.firstChild : parent.lastChild], forward && useCache) {
                outerCache = parent[expando] || (parent[expando] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = cache[0] === dirruns && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];
                for (;node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop());) {
                  if (1 === node.nodeType && (++diff && node === elem)) {
                    /** @type {Array} */
                    outerCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                if (useCache && ((cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns)) {
                  diff = cache[1];
                } else {
                  for (;node = ++nodeIndex && (node && node[which]) || ((diff = nodeIndex = 0) || eventPath.pop());) {
                    if ((value ? node.nodeName.toLowerCase() === attrNames : 1 === node.nodeType) && (++diff && (useCache && ((node[expando] || (node[expando] = {}))[type] = [dirruns, diff]), node === elem))) {
                      break;
                    }
                  }
                }
              }
              return diff -= last, diff === first || diff % first === 0 && diff / first >= 0;
            }
          };
        },
        /**
         * @param {string} pseudo
         * @param {?} argument
         * @return {?}
         */
        PSEUDO : function(pseudo, argument) {
          var args;
          var fn = Expr.pseudos[pseudo] || (Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo));
          return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [pseudo, pseudo, "", argument], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(x, values) {
            var i;
            var data = fn(x, argument);
            var j = data.length;
            for (;j--;) {
              i = getDistance(x, data[j]);
              /** @type {boolean} */
              x[i] = !(values[i] = data[j]);
            }
          }) : function(err) {
            return fn(err, 0, args);
          }) : fn;
        }
      },
      pseudos : {
        not : markFunction(function(selector) {
          /** @type {Array} */
          var elem = [];
          /** @type {Array} */
          var memory = [];
          var matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function(seed, qs, dataAndEvents, xml) {
            var val;
            var unmatched = matcher(seed, null, xml, []);
            var i = seed.length;
            for (;i--;) {
              if (val = unmatched[i]) {
                /** @type {boolean} */
                seed[i] = !(qs[i] = val);
              }
            }
          }) : function(value, dataAndEvents, xml) {
            return elem[0] = value, matcher(elem, null, xml, memory), elem[0] = null, !memory.pop();
          };
        }),
        has : markFunction(function(selector) {
          return function(elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        contains : markFunction(function(id) {
          return id = id.replace(runescape, funescape), function(elem) {
            return(elem.textContent || (elem.innerText || getText(elem))).indexOf(id) > -1;
          };
        }),
        lang : markFunction(function(lang) {
          return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
            var elemLang;
            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                return elemLang = elemLang.toLowerCase(), elemLang === lang || 0 === elemLang.indexOf(lang + "-");
              }
            } while ((elem = elem.parentNode) && 1 === elem.nodeType);
            return false;
          };
        }),
        /**
         * @param {Object} a
         * @return {?}
         */
        target : function(a) {
          var models = win.location && win.location.hash;
          return models && models.slice(1) === a.id;
        },
        /**
         * @param {undefined} elem
         * @return {?}
         */
        root : function(elem) {
          return elem === docElem;
        },
        /**
         * @param {Object} a
         * @return {?}
         */
        focus : function(a) {
          return a === doc.activeElement && ((!doc.hasFocus || doc.hasFocus()) && !!(a.type || (a.href || ~a.tabIndex)));
        },
        /**
         * @param {EventTarget} a
         * @return {?}
         */
        enabled : function(a) {
          return a.disabled === false;
        },
        /**
         * @param {EventTarget} elem
         * @return {?}
         */
        disabled : function(elem) {
          return elem.disabled === true;
        },
        /**
         * @param {Node} node
         * @return {?}
         */
        checked : function(node) {
          var b = node.nodeName.toLowerCase();
          return "input" === b && !!node.checked || "option" === b && !!node.selected;
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        selected : function(elem) {
          return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === true;
        },
        /**
         * @param {Object} elem
         * @return {?}
         */
        empty : function(elem) {
          elem = elem.firstChild;
          for (;elem;elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        },
        /**
         * @param {Object} elem
         * @return {?}
         */
        parent : function(elem) {
          return!Expr.pseudos.empty(elem);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        header : function(elem) {
          return rheader.test(elem.nodeName);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        input : function(elem) {
          return rinputs.test(elem.nodeName);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        button : function(elem) {
          var b = elem.nodeName.toLowerCase();
          return "input" === b && "button" === elem.type || "button" === b;
        },
        /**
         * @param {Object} a
         * @return {?}
         */
        text : function(a) {
          var evt;
          return "input" === a.nodeName.toLowerCase() && ("text" === a.type && (null == (evt = a.getAttribute("type")) || "text" === evt.toLowerCase()));
        },
        first : createPositionalPseudo(function() {
          return[0];
        }),
        last : createPositionalPseudo(function(dataAndEvents, deepDataAndEvents) {
          return[deepDataAndEvents - 1];
        }),
        eq : createPositionalPseudo(function(dataAndEvents, length, index) {
          return[0 > index ? index + length : index];
        }),
        even : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 0;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        odd : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 1;
          for (;dataAndEvents > vvar;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        lt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;--vvar >= 0;) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        gt : createPositionalPseudo(function(assigns, length, index) {
          var vvar = 0 > index ? index + length : index;
          for (;++vvar < length;) {
            assigns.push(vvar);
          }
          return assigns;
        })
      }
    };
    Expr.pseudos.nth = Expr.pseudos.eq;
    for (i in{
      radio : true,
      checkbox : true,
      file : true,
      password : true,
      image : true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in{
      submit : true,
      reset : true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters;
    /** @type {function (Object, boolean): ?} */
    tokenize = Sizzle.tokenize = function(QUnit, parseOnly) {
      var matched;
      var match;
      var tokens;
      var type;
      var soFar;
      var groups;
      var preFilters;
      var cached = tokenCache[QUnit + " "];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      /** @type {Object} */
      soFar = QUnit;
      /** @type {Array} */
      groups = [];
      preFilters = Expr.preFilter;
      for (;soFar;) {
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push(tokens = []);
        }
        /** @type {boolean} */
        matched = false;
        if (match = rcombinators.exec(soFar)) {
          /** @type {string} */
          matched = match.shift();
          tokens.push({
            value : matched,
            type : match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if (!!(match = matchExpr[type].exec(soFar))) {
            if (!(preFilters[type] && !(match = preFilters[type](match)))) {
              matched = match.shift();
              tokens.push({
                value : matched,
                type : type,
                matches : match
              });
              soFar = soFar.slice(matched.length);
            }
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(QUnit) : tokenCache(QUnit, groups).slice(0);
    };
    return compile = Sizzle.compile = function(selector, group) {
      var i;
      /** @type {Array} */
      var setMatchers = [];
      /** @type {Array} */
      var elementMatchers = [];
      var cached = compilerCache[selector + " "];
      if (!cached) {
        if (!group) {
          group = tokenize(selector);
        }
        i = group.length;
        for (;i--;) {
          cached = matcherFromTokens(group[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        /** @type {string} */
        cached.selector = selector;
      }
      return cached;
    }, select = Sizzle.select = function(selector, pdataOld, results, exports) {
      var i;
      var tokens;
      var token;
      var type;
      var find;
      /** @type {(Function|boolean)} */
      var compiled = "function" == typeof selector && selector;
      var match = !exports && tokenize(selector = compiled.selector || selector);
      if (results = results || [], 1 === match.length) {
        if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && ("ID" === (token = tokens[0]).type && (support.getById && (9 === pdataOld.nodeType && (documentIsHTML && Expr.relative[tokens[1].type]))))) {
          if (pdataOld = (Expr.find.ID(token.matches[0].replace(runescape, funescape), pdataOld) || [])[0], !pdataOld) {
            return results;
          }
          if (compiled) {
            pdataOld = pdataOld.parentNode;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
        for (;i--;) {
          if (token = tokens[i], Expr.relative[type = token.type]) {
            break;
          }
          if ((find = Expr.find[type]) && (exports = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(pdataOld.parentNode) || pdataOld))) {
            if (tokens.splice(i, 1), selector = exports.length && toSelector(tokens), !selector) {
              return push.apply(results, exports), results;
            }
            break;
          }
        }
      }
      return(compiled || compile(selector, match))(exports, pdataOld, !documentIsHTML, results, rsibling.test(selector) && testContext(pdataOld.parentNode) || pdataOld), results;
    }, support.sortStable = expando.split("").sort(a).join("") === expando, support.detectDuplicates = !!stability, setDocument(), support.sortDetached = assert(function(div1) {
      return 1 & div1.compareDocumentPosition(doc.createElement("div"));
    }), assert(function(div) {
      return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href");
    }) || addHandle("type|href|height|width", function(elem, name, flag_xml) {
      return flag_xml ? void 0 : elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
    }), support.attributes && assert(function(div) {
      return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value");
    }) || addHandle("value", function(target, dataAndEvents, defaultValue) {
      return defaultValue || "input" !== target.nodeName.toLowerCase() ? void 0 : target.defaultValue;
    }), assert(function(div) {
      return null == div.getAttribute("disabled");
    }) || addHandle(booleans, function(elem, name, dataAndEvents) {
      var val;
      return dataAndEvents ? void 0 : elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    }), Sizzle;
  }(win);
  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors;
  jQuery.expr[":"] = jQuery.expr.pseudos;
  jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;
  var rneedsContext = jQuery.expr.match.needsContext;
  /** @type {RegExp} */
  var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  /** @type {RegExp} */
  var QUnit = /^.[^:#\[\.,]*$/;
  /**
   * @param {Object} a
   * @param {Object} value
   * @param {string} ary
   * @return {?}
   */
  jQuery.filter = function(a, value, ary) {
    var elem = value[0];
    return ary && (a = ":not(" + a + ")"), 1 === value.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, a) ? [elem] : [] : jQuery.find.matches(a, jQuery.grep(value, function(dest) {
      return 1 === dest.nodeType;
    }));
  };
  jQuery.fn.extend({
    /**
     * @param {string} selector
     * @return {?}
     */
    find : function(selector) {
      var i;
      /** @type {Array} */
      var ret = [];
      var self = this;
      var len = self.length;
      if ("string" != typeof selector) {
        return this.pushStack(jQuery(selector).filter(function() {
          /** @type {number} */
          i = 0;
          for (;len > i;i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      /** @type {number} */
      i = 0;
      for (;len > i;i++) {
        jQuery.find(selector, self[i], ret);
      }
      return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, ret;
    },
    /**
     * @param {Object} a
     * @return {?}
     */
    filter : function(a) {
      return this.pushStack(winnow(this, a || [], false));
    },
    /**
     * @param {Array} selector
     * @return {?}
     */
    not : function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    /**
     * @param {string} selector
     * @return {?}
     */
    is : function(selector) {
      return!!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    }
  });
  var rootjQuery;
  var doc = win.document;
  /** @type {RegExp} */
  var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
  /** @type {function (string, Object): ?} */
  var T = jQuery.fn.init = function(selector, context) {
    var match;
    var elem;
    if (!selector) {
      return this;
    }
    if ("string" == typeof selector) {
      if (match = "<" === selector.charAt(0) && (">" === selector.charAt(selector.length - 1) && selector.length >= 3) ? [null, selector, null] : rquickExpr.exec(selector), !match || !match[1] && context) {
        return!context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
      }
      if (match[1]) {
        if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : doc, true)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
          for (match in context) {
            if (jQuery.isFunction(this[match])) {
              this[match](context[match]);
            } else {
              this.attr(match, context[match]);
            }
          }
        }
        return this;
      }
      if (elem = doc.getElementById(match[2]), elem && elem.parentNode) {
        if (elem.id !== match[2]) {
          return rootjQuery.find(selector);
        }
        /** @type {number} */
        this.length = 1;
        this[0] = elem;
      }
      return this.context = doc, this.selector = selector, this;
    }
    return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? "undefined" != typeof rootjQuery.ready ? rootjQuery.ready(selector) : selector(jQuery) : (void 0 !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
  };
  T.prototype = jQuery.fn;
  rootjQuery = jQuery(doc);
  /** @type {RegExp} */
  var rparentsprev = /^(?:parents|prev(?:Until|All))/;
  var guaranteedUnique = {
    children : true,
    contents : true,
    next : true,
    prev : true
  };
  jQuery.extend({
    /**
     * @param {Object} elems
     * @param {string} dir
     * @param {number} until
     * @return {?}
     */
    dir : function(elems, dir, until) {
      /** @type {Array} */
      var matched = [];
      var elem = elems[dir];
      for (;elem && (9 !== elem.nodeType && (void 0 === until || (1 !== elem.nodeType || !jQuery(elem).is(until))));) {
        if (1 === elem.nodeType) {
          matched.push(elem);
        }
        elem = elem[dir];
      }
      return matched;
    },
    /**
     * @param {Object} n
     * @param {Object} elem
     * @return {?}
     */
    sibling : function(n, elem) {
      /** @type {Array} */
      var r = [];
      for (;n;n = n.nextSibling) {
        if (1 === n.nodeType) {
          if (n !== elem) {
            r.push(n);
          }
        }
      }
      return r;
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} target
     * @return {?}
     */
    has : function(target) {
      var i;
      var targets = jQuery(target, this);
      var l = targets.length;
      return this.filter(function() {
        /** @type {number} */
        i = 0;
        for (;l > i;i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    /**
     * @param {string} selectors
     * @param {number} context
     * @return {?}
     */
    closest : function(selectors, context) {
      var cur;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {Array} */
      var matched = [];
      var pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0;
      for (;l > i;i++) {
        cur = this[i];
        for (;cur && cur !== context;cur = cur.parentNode) {
          if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
            matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
    },
    /**
     * @param {string} elem
     * @return {?}
     */
    index : function(elem) {
      return elem ? "string" == typeof elem ? jQuery.inArray(this[0], jQuery(elem)) : jQuery.inArray(elem.jquery ? elem[0] : elem, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    /**
     * @param {Function} selector
     * @param {string} context
     * @return {?}
     */
    add : function(selector, context) {
      return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))));
    },
    /**
     * @param {Object} QUnit
     * @return {?}
     */
    addBack : function(QUnit) {
      return this.add(null == QUnit ? this.prevObject : this.prevObject.filter(QUnit));
    }
  });
  jQuery.each({
    /**
     * @param {Node} elem
     * @return {?}
     */
    parent : function(elem) {
      var parent = elem.parentNode;
      return parent && 11 !== parent.nodeType ? parent : null;
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    parents : function(elem) {
      return jQuery.dir(elem, "parentNode");
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {number} until
     * @return {?}
     */
    parentsUntil : function(elem, i, until) {
      return jQuery.dir(elem, "parentNode", until);
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    next : function(elem) {
      return sibling(elem, "nextSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    prev : function(elem) {
      return sibling(elem, "previousSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    nextAll : function(elem) {
      return jQuery.dir(elem, "nextSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    prevAll : function(elem) {
      return jQuery.dir(elem, "previousSibling");
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {number} until
     * @return {?}
     */
    nextUntil : function(elem, i, until) {
      return jQuery.dir(elem, "nextSibling", until);
    },
    /**
     * @param {Object} elem
     * @param {?} i
     * @param {number} until
     * @return {?}
     */
    prevUntil : function(elem, i, until) {
      return jQuery.dir(elem, "previousSibling", until);
    },
    /**
     * @param {HTMLElement} elem
     * @return {?}
     */
    siblings : function(elem) {
      return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
    },
    /**
     * @param {Element} elem
     * @return {?}
     */
    children : function(elem) {
      return jQuery.sibling(elem.firstChild);
    },
    /**
     * @param {Element} elem
     * @return {?}
     */
    contents : function(elem) {
      return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
    }
  }, function(name, restoreScript) {
    /**
     * @param {Object} until
     * @param {Object} QUnit
     * @return {?}
     */
    jQuery.fn[name] = function(until, QUnit) {
      var pdataOld = jQuery.map(this, restoreScript, until);
      return "Until" !== name.slice(-5) && (QUnit = until), QUnit && ("string" == typeof QUnit && (pdataOld = jQuery.filter(QUnit, pdataOld))), this.length > 1 && (guaranteedUnique[name] || (pdataOld = jQuery.unique(pdataOld)), rparentsprev.test(name) && (pdataOld = pdataOld.reverse())), this.pushStack(pdataOld);
    };
  });
  /** @type {RegExp} */
  var core_rnotwhite = /\S+/g;
  var optionsCache = {};
  /**
   * @param {Object} options
   * @return {?}
   */
  jQuery.Callbacks = function(options) {
    options = "string" == typeof options ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
    var r;
    var memory;
    var d;
    var i;
    var firingIndex;
    var firingStart;
    /** @type {Array} */
    var list = [];
    /** @type {(Array|boolean)} */
    var stack = !options.once && [];
    /**
     * @param {Array} data
     * @return {undefined}
     */
    var fire = function(data) {
      memory = options.memory && data;
      /** @type {boolean} */
      d = true;
      firingIndex = firingStart || 0;
      /** @type {number} */
      firingStart = 0;
      i = list.length;
      /** @type {boolean} */
      r = true;
      for (;list && i > firingIndex;firingIndex++) {
        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
          /** @type {boolean} */
          memory = false;
          break;
        }
      }
      /** @type {boolean} */
      r = false;
      if (list) {
        if (stack) {
          if (stack.length) {
            fire(stack.shift());
          }
        } else {
          if (memory) {
            /** @type {Array} */
            list = [];
          } else {
            self.disable();
          }
        }
      }
    };
    var self = {
      /**
       * @return {?}
       */
      add : function() {
        if (list) {
          var start = list.length;
          !function add(a) {
            jQuery.each(a, function(dataAndEvents, exports) {
              var type = jQuery.type(exports);
              if ("function" === type) {
                if (!(options.unique && self.has(exports))) {
                  list.push(exports);
                }
              } else {
                if (exports) {
                  if (exports.length) {
                    if ("string" !== type) {
                      add(exports);
                    }
                  }
                }
              }
            });
          }(arguments);
          if (r) {
            i = list.length;
          } else {
            if (memory) {
              firingStart = start;
              fire(memory);
            }
          }
        }
        return this;
      },
      /**
       * @return {?}
       */
      remove : function() {
        return list && jQuery.each(arguments, function(dataAndEvents, arg) {
          var index;
          for (;(index = jQuery.inArray(arg, list, index)) > -1;) {
            list.splice(index, 1);
            if (r) {
              if (i >= index) {
                i--;
              }
              if (firingIndex >= index) {
                firingIndex--;
              }
            }
          }
        }), this;
      },
      /**
       * @param {Object} fn
       * @return {?}
       */
      has : function(fn) {
        return fn ? jQuery.inArray(fn, list) > -1 : !(!list || !list.length);
      },
      /**
       * @return {?}
       */
      empty : function() {
        return list = [], i = 0, this;
      },
      /**
       * @return {?}
       */
      disable : function() {
        return list = stack = memory = void 0, this;
      },
      /**
       * @return {?}
       */
      disabled : function() {
        return!list;
      },
      /**
       * @return {?}
       */
      lock : function() {
        return stack = void 0, memory || self.disable(), this;
      },
      /**
       * @return {?}
       */
      locked : function() {
        return!stack;
      },
      /**
       * @param {?} context
       * @param {Array} args
       * @return {?}
       */
      fireWith : function(context, args) {
        return!list || (d && !stack || (args = args || [], args = [context, args.slice ? args.slice() : args], r ? stack.push(args) : fire(args))), this;
      },
      /**
       * @return {?}
       */
      fire : function() {
        return self.fireWith(this, arguments), this;
      },
      /**
       * @return {?}
       */
      fired : function() {
        return!!d;
      }
    };
    return self;
  };
  jQuery.extend({
    /**
     * @param {Function} func
     * @return {?}
     */
    Deferred : function(func) {
      /** @type {Array} */
      var which = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]];
      /** @type {string} */
      var state = "pending";
      var promise = {
        /**
         * @return {?}
         */
        state : function() {
          return state;
        },
        /**
         * @return {?}
         */
        always : function() {
          return deferred.done(arguments).fail(arguments), this;
        },
        /**
         * @return {?}
         */
        then : function() {
          /** @type {Arguments} */
          var fns = arguments;
          return jQuery.Deferred(function(newDefer) {
            jQuery.each(which, function(i, tuple) {
              var fn = jQuery.isFunction(fns[i]) && fns[i];
              deferred[tuple[1]](function() {
                var returned = fn && fn.apply(this, arguments);
                if (returned && jQuery.isFunction(returned.promise)) {
                  returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                } else {
                  newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                }
              });
            });
            /** @type {null} */
            fns = null;
          }).promise();
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        promise : function(obj) {
          return null != obj ? jQuery.extend(obj, promise) : promise;
        }
      };
      var deferred = {};
      return promise.pipe = promise.then, jQuery.each(which, function(dataAndEvents, tuple) {
        var list = tuple[2];
        var stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString;
          }, which[1 ^ dataAndEvents][2].disable, which[2][2].lock);
        }
        /**
         * @return {?}
         */
        deferred[tuple[0]] = function() {
          return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
    },
    /**
     * @param {Object} subordinate
     * @return {?}
     */
    when : function(subordinate) {
      /** @type {number} */
      var i = 0;
      /** @type {Array.<?>} */
      var resolveValues = core_slice.call(arguments);
      /** @type {number} */
      var length = resolveValues.length;
      /** @type {number} */
      var remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0;
      var deferred = 1 === remaining ? subordinate : jQuery.Deferred();
      /**
       * @param {number} i
       * @param {(Array|NodeList)} contexts
       * @param {Array} values
       * @return {?}
       */
      var updateFunc = function(i, contexts, values) {
        return function(value) {
          contexts[i] = this;
          values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
          if (values === progressValues) {
            deferred.notifyWith(contexts, values);
          } else {
            if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          }
        };
      };
      var progressValues;
      var progressContexts;
      var resolveContexts;
      if (length > 1) {
        /** @type {Array} */
        progressValues = new Array(length);
        /** @type {Array} */
        progressContexts = new Array(length);
        /** @type {Array} */
        resolveContexts = new Array(length);
        for (;length > i;i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }
      return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
    }
  });
  var readyList;
  /**
   * @param {Object} ok
   * @return {?}
   */
  jQuery.fn.ready = function(ok) {
    return jQuery.ready.promise().done(ok), this;
  };
  jQuery.extend({
    isReady : false,
    readyWait : 1,
    /**
     * @param {?} hold
     * @return {undefined}
     */
    holdReady : function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    /**
     * @param {boolean} wait
     * @return {?}
     */
    ready : function(wait) {
      if (wait === true ? !--jQuery.readyWait : !jQuery.isReady) {
        if (!doc.body) {
          return setTimeout(jQuery.ready);
        }
        /** @type {boolean} */
        jQuery.isReady = true;
        if (!(wait !== true && --jQuery.readyWait > 0)) {
          readyList.resolveWith(doc, [jQuery]);
          if (jQuery.fn.triggerHandler) {
            jQuery(doc).triggerHandler("ready");
            jQuery(doc).off("ready");
          }
        }
      }
    }
  });
  /**
   * @param {string} obj
   * @return {?}
   */
  jQuery.ready.promise = function(obj) {
    if (!readyList) {
      if (readyList = jQuery.Deferred(), "complete" === doc.readyState) {
        setTimeout(jQuery.ready);
      } else {
        if (doc.addEventListener) {
          doc.addEventListener("DOMContentLoaded", init, false);
          win.addEventListener("load", init, false);
        } else {
          doc.attachEvent("onreadystatechange", init);
          win.attachEvent("onload", init);
          /** @type {boolean} */
          var t = false;
          try {
            t = null == win.frameElement && doc.documentElement;
          } catch (d) {
          }
          if (t) {
            if (t.doScroll) {
              !function doScrollCheck() {
                if (!jQuery.isReady) {
                  try {
                    t.doScroll("left");
                  } catch (a) {
                    return setTimeout(doScrollCheck, 50);
                  }
                  domReady();
                  jQuery.ready();
                }
              }();
            }
          }
        }
      }
    }
    return readyList.promise(obj);
  };
  /** @type {string} */
  var text = "undefined";
  var i;
  for (i in jQuery(support)) {
    break;
  }
  /** @type {boolean} */
  support.ownLast = "0" !== i;
  /** @type {boolean} */
  support.inlineBlockNeedsLayout = false;
  jQuery(function() {
    var xhrSupported;
    var div;
    var body;
    var container;
    body = doc.getElementsByTagName("body")[0];
    if (body) {
      if (body.style) {
        div = doc.createElement("div");
        container = doc.createElement("div");
        /** @type {string} */
        container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
        body.appendChild(container).appendChild(div);
        if (typeof div.style.zoom !== text) {
          /** @type {string} */
          div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";
          /** @type {boolean} */
          support.inlineBlockNeedsLayout = xhrSupported = 3 === div.offsetWidth;
          if (xhrSupported) {
            /** @type {number} */
            body.style.zoom = 1;
          }
        }
        body.removeChild(container);
      }
    }
  });
  (function() {
    var closer = doc.createElement("div");
    if (null == support.deleteExpando) {
      /** @type {boolean} */
      support.deleteExpando = true;
      try {
        delete closer.test;
      } catch (b) {
        /** @type {boolean} */
        support.deleteExpando = false;
      }
    }
    /** @type {null} */
    closer = null;
  })();
  /**
   * @param {Node} elem
   * @return {?}
   */
  jQuery.acceptData = function(elem) {
    var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()];
    /** @type {number} */
    var code = +elem.nodeType || 1;
    return 1 !== code && 9 !== code ? false : !noData || noData !== true && elem.getAttribute("classid") === noData;
  };
  /** @type {RegExp} */
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
  /** @type {RegExp} */
  var r20 = /([A-Z])/g;
  jQuery.extend({
    cache : {},
    noData : {
      "applet " : true,
      "embed " : true,
      "object " : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    hasData : function(elem) {
      return elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando], !!elem && !filter(elem);
    },
    /**
     * @param {Object} a
     * @param {Object} value
     * @param {string} name
     * @return {?}
     */
    data : function(a, value, name) {
      return callback(a, value, name);
    },
    /**
     * @param {Object} key
     * @param {?} name
     * @return {?}
     */
    removeData : function(key, name) {
      return remove(key, name);
    },
    /**
     * @param {Object} owner
     * @param {string} data
     * @param {boolean} expectedNumberOfNonCommentArgs
     * @return {?}
     */
    _data : function(owner, data, expectedNumberOfNonCommentArgs) {
      return callback(owner, data, expectedNumberOfNonCommentArgs, true);
    },
    /**
     * @param {Object} owner
     * @param {string} name
     * @return {?}
     */
    _removeData : function(owner, name) {
      return remove(owner, name, true);
    }
  });
  jQuery.fn.extend({
    /**
     * @param {Object} a
     * @param {Object} value
     * @return {?}
     */
    data : function(a, value) {
      var i;
      var name;
      var data;
      var exports = this[0];
      var types = exports && exports.attributes;
      if (void 0 === a) {
        if (this.length && (data = jQuery.data(exports), 1 === exports.nodeType && !jQuery._data(exports, "parsedAttrs"))) {
          i = types.length;
          for (;i--;) {
            if (types[i]) {
              name = types[i].name;
              if (0 === name.indexOf("data-")) {
                name = jQuery.camelCase(name.slice(5));
                dataAttr(exports, name, data[name]);
              }
            }
          }
          jQuery._data(exports, "parsedAttrs", true);
        }
        return data;
      }
      return "object" == typeof a ? this.each(function() {
        jQuery.data(this, a);
      }) : arguments.length > 1 ? this.each(function() {
        jQuery.data(this, a, value);
      }) : exports ? dataAttr(exports, a, jQuery.data(exports, a)) : void 0;
    },
    /**
     * @param {?} key
     * @return {?}
     */
    removeData : function(key) {
      return this.each(function() {
        jQuery.removeData(this, key);
      });
    }
  });
  jQuery.extend({
    /**
     * @param {Object} elem
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    queue : function(elem, type, data) {
      var queue;
      return elem ? (type = (type || "fx") + "queue", queue = jQuery._data(elem, type), data && (!queue || jQuery.isArray(data) ? queue = jQuery._data(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || []) : void 0;
    },
    /**
     * @param {string} elem
     * @param {string} type
     * @return {undefined}
     */
    dequeue : function(elem, type) {
      type = type || "fx";
      var queue = jQuery.queue(elem, type);
      var ln = queue.length;
      var fn = queue.shift();
      var hooks = jQuery._queueHooks(elem, type);
      /**
       * @return {undefined}
       */
      var next = function() {
        jQuery.dequeue(elem, type);
      };
      if ("inprogress" === fn) {
        fn = queue.shift();
        ln--;
      }
      if (fn) {
        if ("fx" === type) {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!ln) {
        if (hooks) {
          hooks.empty.fire();
        }
      }
    },
    /**
     * @param {Object} elem
     * @param {string} type
     * @return {?}
     */
    _queueHooks : function(elem, type) {
      /** @type {string} */
      var key = type + "queueHooks";
      return jQuery._data(elem, key) || jQuery._data(elem, key, {
        empty : jQuery.Callbacks("once memory").add(function() {
          jQuery._removeData(elem, type + "queue");
          jQuery._removeData(elem, key);
        })
      });
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} type
     * @param {string} data
     * @return {?}
     */
    queue : function(type, data) {
      /** @type {number} */
      var setter = 2;
      return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
        var queue = jQuery.queue(this, type, data);
        jQuery._queueHooks(this, type);
        if ("fx" === type) {
          if ("inprogress" !== queue[0]) {
            jQuery.dequeue(this, type);
          }
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    dequeue : function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    clearQueue : function(type) {
      return this.queue(type || "fx", []);
    },
    /**
     * @param {string} type
     * @param {string} obj
     * @return {?}
     */
    promise : function(type, obj) {
      var body;
      /** @type {number} */
      var d = 1;
      var defer = jQuery.Deferred();
      var elements = this;
      var i = this.length;
      /**
       * @return {undefined}
       */
      var resolve = function() {
        if (!--d) {
          defer.resolveWith(elements, [elements]);
        }
      };
      if ("string" != typeof type) {
        /** @type {string} */
        obj = type;
        type = void 0;
      }
      type = type || "fx";
      for (;i--;) {
        body = jQuery._data(elements[i], type + "queueHooks");
        if (body) {
          if (body.empty) {
            d++;
            body.empty.add(resolve);
          }
        }
      }
      return resolve(), defer.promise(obj);
    }
  });
  /** @type {string} */
  var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  /** @type {Array} */
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  /**
   * @param {Object} b
   * @param {Function} a
   * @return {?}
   */
  var ok = function(b, a) {
    return b = a || b, "none" === jQuery.css(b, "display") || !jQuery.contains(b.ownerDocument, b);
  };
  /** @type {function (Object, Function, Object, Function, boolean, string, boolean): ?} */
  var access = jQuery.access = function(elems, fn, ok, value, chainable, emptyGet, raw) {
    /** @type {number} */
    var i = 0;
    var length = elems.length;
    /** @type {boolean} */
    var bulk = null == ok;
    if ("object" === jQuery.type(ok)) {
      /** @type {boolean} */
      chainable = true;
      for (i in ok) {
        jQuery.access(elems, fn, i, ok[i], true, emptyGet, raw);
      }
    } else {
      if (void 0 !== value && (chainable = true, jQuery.isFunction(value) || (raw = true), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, a, value) {
        return bulk.call(jQuery(elem), value);
      })), fn)) {
        for (;length > i;i++) {
          fn(elems[i], ok, raw ? value : value.call(elems[i], i, fn(elems[i], ok)));
        }
      }
    }
    return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], ok) : emptyGet;
  };
  /** @type {RegExp} */
  var manipulation_rcheckableType = /^(?:checkbox|radio)$/i;
  !function() {
    var input = doc.createElement("input");
    var div = doc.createElement("div");
    var fragment = doc.createDocumentFragment();
    if (div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", support.leadingWhitespace = 3 === div.firstChild.nodeType, support.tbody = !div.getElementsByTagName("tbody").length, support.htmlSerialize = !!div.getElementsByTagName("link").length, support.html5Clone = "<:nav></:nav>" !== doc.createElement("nav").cloneNode(true).outerHTML, input.type = "checkbox", input.checked = true, fragment.appendChild(input), support.appendChecked = input.checked, div.innerHTML = 
    "<textarea>x</textarea>", support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue, fragment.appendChild(div), div.innerHTML = "<input type='radio' checked='checked' name='t'/>", support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked, support.noCloneEvent = true, div.attachEvent && (div.attachEvent("onclick", function() {
      /** @type {boolean} */
      support.noCloneEvent = false;
    }), div.cloneNode(true).click()), null == support.deleteExpando) {
      /** @type {boolean} */
      support.deleteExpando = true;
      try {
        delete div.test;
      } catch (d) {
        /** @type {boolean} */
        support.deleteExpando = false;
      }
    }
  }();
  (function() {
    var i;
    var eventName;
    var div = doc.createElement("div");
    for (i in{
      submit : true,
      change : true,
      focusin : true
    }) {
      /** @type {string} */
      eventName = "on" + i;
      if (!(support[i + "Bubbles"] = eventName in win)) {
        div.setAttribute(eventName, "t");
        /** @type {boolean} */
        support[i + "Bubbles"] = div.attributes[eventName].expando === false;
      }
    }
    /** @type {null} */
    div = null;
  })();
  /** @type {RegExp} */
  var rformElems = /^(?:input|select|textarea)$/i;
  /** @type {RegExp} */
  var rmouseEvent = /^key/;
  /** @type {RegExp} */
  var rkeyEvent = /^(?:mouse|pointer|contextmenu)|click/;
  /** @type {RegExp} */
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
  /** @type {RegExp} */
  var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
  jQuery.event = {
    global : {},
    /**
     * @param {Object} elem
     * @param {Object} types
     * @param {Function} handler
     * @param {Object} e
     * @param {(Function|string)} selector
     * @return {undefined}
     */
    add : function(elem, types, handler, e, selector) {
      var segmentMatch;
      var events;
      var t;
      var handleObjIn;
      var special;
      var eventHandle;
      var handleObj;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = jQuery._data(elem);
      if (elemData) {
        if (handler.handler) {
          /** @type {Function} */
          handleObjIn = handler;
          handler = handleObjIn.handler;
          selector = handleObjIn.selector;
        }
        if (!handler.guid) {
          /** @type {number} */
          handler.guid = jQuery.guid++;
        }
        if (!(events = elemData.events)) {
          events = elemData.events = {};
        }
        if (!(eventHandle = elemData.handle)) {
          /** @type {function (Object): ?} */
          eventHandle = elemData.handle = function(src) {
            return typeof jQuery === text || src && jQuery.event.triggered === src.type ? void 0 : jQuery.event.dispatch.apply(eventHandle.elem, arguments);
          };
          /** @type {Object} */
          eventHandle.elem = elem;
        }
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          /** @type {Array} */
          segmentMatch = rtypenamespace.exec(types[t]) || [];
          type = origType = segmentMatch[1];
          namespaces = (segmentMatch[2] || "").split(".").sort();
          if (type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type : type,
              origType : origType,
              data : e,
              /** @type {Function} */
              handler : handler,
              guid : handler.guid,
              selector : selector,
              needsContext : selector && jQuery.expr.match.needsContext.test(selector),
              namespace : namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              /** @type {Array} */
              handlers = events[type] = [];
              /** @type {number} */
              handlers.delegateCount = 0;
              if (!(special.setup && special.setup.call(elem, e, namespaces, eventHandle) !== false)) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle, false);
                } else {
                  if (elem.attachEvent) {
                    elem.attachEvent("on" + type, eventHandle);
                  }
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            /** @type {boolean} */
            jQuery.event.global[type] = true;
          }
        }
        /** @type {null} */
        elem = null;
      }
    },
    /**
     * @param {Object} elem
     * @param {Object} types
     * @param {Function} handler
     * @param {boolean} selector
     * @param {boolean} keepData
     * @return {undefined}
     */
    remove : function(elem, types, handler, selector, keepData) {
      var j;
      var handleObj;
      var tmp;
      var origCount;
      var t;
      var events;
      var special;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = jQuery.hasData(elem) && jQuery._data(elem);
      if (elemData && (events = elemData.events)) {
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            for (;j--;) {
              handleObj = handlers[j];
              if (!(!keepData && origType !== handleObj.origType)) {
                if (!(handler && handler.guid !== handleObj.guid)) {
                  if (!(tmp && !tmp.test(handleObj.namespace))) {
                    if (!(selector && (selector !== handleObj.selector && ("**" !== selector || !handleObj.selector)))) {
                      handlers.splice(j, 1);
                      if (handleObj.selector) {
                        handlers.delegateCount--;
                      }
                      if (special.remove) {
                        special.remove.call(elem, handleObj);
                      }
                    }
                  }
                }
              }
            }
            if (origCount) {
              if (!handlers.length) {
                if (!(special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== false)) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
          } else {
            for (type in events) {
              jQuery.event.remove(elem, type + types[t], handler, selector, true);
            }
          }
        }
        if (jQuery.isEmptyObject(events)) {
          delete elemData.handle;
          jQuery._removeData(elem, "events");
        }
      }
    },
    /**
     * @param {Object} event
     * @param {?} data
     * @param {Object} elem
     * @param {boolean} onlyHandlers
     * @return {?}
     */
    trigger : function(event, data, elem, onlyHandlers) {
      var handle;
      var ontype;
      var cur;
      var bubbleType;
      var special;
      var tmp;
      var i;
      /** @type {Array} */
      var eventPath = [elem || doc];
      var type = core_hasOwn.call(event, "type") ? event.type : event;
      var namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      if (cur = tmp = elem = elem || doc, 3 !== elem.nodeType && (8 !== elem.nodeType && (!rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") >= 0 && (namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.namespace_re = event.namespace ? 
      new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = void 0, event.target || (event.target = elem), data = null == data ? [event] : jQuery.makeArray(data, [event]), special = jQuery.event.special[type] || {}, onlyHandlers || (!special.trigger || special.trigger.apply(elem, data) !== false))))) {
        if (!onlyHandlers && (!special.noBubble && !jQuery.isWindow(elem))) {
          bubbleType = special.delegateType || type;
          if (!rfocusMorph.test(bubbleType + type)) {
            cur = cur.parentNode;
          }
          for (;cur;cur = cur.parentNode) {
            eventPath.push(cur);
            tmp = cur;
          }
          if (tmp === (elem.ownerDocument || doc)) {
            eventPath.push(tmp.defaultView || (tmp.parentWindow || win));
          }
        }
        /** @type {number} */
        i = 0;
        for (;(cur = eventPath[i++]) && !event.isPropagationStopped();) {
          event.type = i > 1 ? bubbleType : special.bindType || type;
          handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
          if (handle) {
            handle.apply(cur, data);
          }
          handle = ontype && cur[ontype];
          if (handle) {
            if (handle.apply) {
              if (jQuery.acceptData(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
          }
        }
        if (event.type = type, !onlyHandlers && (!event.isDefaultPrevented() && ((!special._default || special._default.apply(eventPath.pop(), data) === false) && (jQuery.acceptData(elem) && (ontype && (elem[type] && !jQuery.isWindow(elem))))))) {
          tmp = elem[ontype];
          if (tmp) {
            /** @type {null} */
            elem[ontype] = null;
          }
          jQuery.event.triggered = type;
          try {
            elem[type]();
          } catch (r) {
          }
          jQuery.event.triggered = void 0;
          if (tmp) {
            elem[ontype] = tmp;
          }
        }
        return event.result;
      }
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    dispatch : function(event) {
      event = jQuery.event.fix(event);
      var i;
      var ret;
      var handleObj;
      var matched;
      var j;
      /** @type {Array} */
      var handlerQueue = [];
      /** @type {Array.<?>} */
      var args = core_slice.call(arguments);
      var handlers = (jQuery._data(this, "events") || {})[event.type] || [];
      var special = jQuery.event.special[event.type] || {};
      if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== false) {
        handlerQueue = jQuery.event.handlers.call(this, event, handlers);
        /** @type {number} */
        i = 0;
        for (;(matched = handlerQueue[i++]) && !event.isPropagationStopped();) {
          event.currentTarget = matched.elem;
          /** @type {number} */
          j = 0;
          for (;(handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();) {
            if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
              event.handleObj = handleObj;
              event.data = handleObj.data;
              ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
              if (void 0 !== ret) {
                if ((event.result = ret) === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }
            }
          }
        }
        return special.postDispatch && special.postDispatch.call(this, event), event.result;
      }
    },
    /**
     * @param {Event} event
     * @param {Object} handlers
     * @return {?}
     */
    handlers : function(event, handlers) {
      var sel;
      var handleObj;
      var matches;
      var j;
      /** @type {Array} */
      var handlerQueue = [];
      var delegateCount = handlers.delegateCount;
      var cur = event.target;
      if (delegateCount && (cur.nodeType && (!event.button || "click" !== event.type))) {
        for (;cur != this;cur = cur.parentNode || this) {
          if (1 === cur.nodeType && (cur.disabled !== true || "click" !== event.type)) {
            /** @type {Array} */
            matches = [];
            /** @type {number} */
            j = 0;
            for (;delegateCount > j;j++) {
              handleObj = handlers[j];
              /** @type {string} */
              sel = handleObj.selector + " ";
              if (void 0 === matches[sel]) {
                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem : cur,
                handlers : matches
              });
            }
          }
        }
      }
      return delegateCount < handlers.length && handlerQueue.push({
        elem : this,
        handlers : handlers.slice(delegateCount)
      }), handlerQueue;
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    fix : function(event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var i;
      var prop;
      var copy;
      var type = event.type;
      /** @type {Object} */
      var pdataOld = event;
      var fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = rkeyEvent.test(type) ? this.mouseHooks : rmouseEvent.test(type) ? this.keyHooks : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new jQuery.Event(pdataOld);
      i = copy.length;
      for (;i--;) {
        prop = copy[i];
        event[prop] = pdataOld[prop];
      }
      return event.target || (event.target = pdataOld.srcElement || doc), 3 === event.target.nodeType && (event.target = event.target.parentNode), event.metaKey = !!event.metaKey, fixHook.filter ? fixHook.filter(event, pdataOld) : event;
    },
    props : "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks : {},
    keyHooks : {
      props : "char charCode key keyCode".split(" "),
      /**
       * @param {Object} a
       * @param {Object} value
       * @return {?}
       */
      filter : function(a, value) {
        return null == a.which && (a.which = null != value.charCode ? value.charCode : value.keyCode), a;
      }
    },
    mouseHooks : {
      props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      /**
       * @param {Object} a
       * @param {Object} value
       * @return {?}
       */
      filter : function(a, value) {
        var b;
        var d;
        var de;
        var old = value.button;
        var fromElement = value.fromElement;
        return null == a.pageX && (null != value.clientX && (d = a.target.ownerDocument || doc, de = d.documentElement, b = d.body, a.pageX = value.clientX + (de && de.scrollLeft || (b && b.scrollLeft || 0)) - (de && de.clientLeft || (b && b.clientLeft || 0)), a.pageY = value.clientY + (de && de.scrollTop || (b && b.scrollTop || 0)) - (de && de.clientTop || (b && b.clientTop || 0)))), !a.relatedTarget && (fromElement && (a.relatedTarget = fromElement === a.target ? value.toElement : fromElement)), 
        a.which || (void 0 === old || (a.which = 1 & old ? 1 : 2 & old ? 3 : 4 & old ? 2 : 0)), a;
      }
    },
    special : {
      load : {
        noBubble : true
      },
      focus : {
        /**
         * @return {?}
         */
        trigger : function() {
          if (this !== safeActiveElement() && this.focus) {
            try {
              return this.focus(), false;
            } catch (a) {
            }
          }
        },
        delegateType : "focusin"
      },
      blur : {
        /**
         * @return {?}
         */
        trigger : function() {
          return this === safeActiveElement() && this.blur ? (this.blur(), false) : void 0;
        },
        delegateType : "focusout"
      },
      click : {
        /**
         * @return {?}
         */
        trigger : function() {
          return jQuery.nodeName(this, "input") && ("checkbox" === this.type && this.click) ? (this.click(), false) : void 0;
        },
        /**
         * @param {Function} selector
         * @return {?}
         */
        _default : function(selector) {
          return jQuery.nodeName(selector.target, "a");
        }
      },
      beforeunload : {
        /**
         * @param {Object} event
         * @return {undefined}
         */
        postDispatch : function(event) {
          if (void 0 !== event.result) {
            if (event.originalEvent) {
              event.originalEvent.returnValue = event.result;
            }
          }
        }
      }
    },
    /**
     * @param {string} type
     * @param {?} elem
     * @param {Event} event
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    simulate : function(type, elem, event, dataAndEvents) {
      var e = jQuery.extend(new jQuery.Event, event, {
        type : type,
        isSimulated : true,
        originalEvent : {}
      });
      if (dataAndEvents) {
        jQuery.event.trigger(e, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, e);
      }
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };
  /** @type {function (Object, ?, ?): undefined} */
  jQuery.removeEvent = doc.removeEventListener ? function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle, false);
    }
  } : function(elem, keepData, listener) {
    /** @type {string} */
    var type = "on" + keepData;
    if (elem.detachEvent) {
      if (typeof elem[type] === text) {
        /** @type {null} */
        elem[type] = null;
      }
      elem.detachEvent(type, listener);
    }
  };
  /**
   * @param {Object} src
   * @param {boolean} props
   * @return {?}
   */
  jQuery.Event = function(src, props) {
    return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && src.returnValue === false ? returnTrue : returnFalse) : this.type = src, props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), void(this[jQuery.expando] = true)) : new jQuery.Event(src, props);
  };
  jQuery.Event.prototype = {
    /** @type {function (): ?} */
    isDefaultPrevented : returnFalse,
    /** @type {function (): ?} */
    isPropagationStopped : returnFalse,
    /** @type {function (): ?} */
    isImmediatePropagationStopped : returnFalse,
    /**
     * @return {undefined}
     */
    preventDefault : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isDefaultPrevented = returnTrue;
      if (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          /** @type {boolean} */
          e.returnValue = false;
        }
      }
    },
    /**
     * @return {undefined}
     */
    stopPropagation : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isPropagationStopped = returnTrue;
      if (e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        /** @type {boolean} */
        e.cancelBubble = true;
      }
    },
    /**
     * @return {undefined}
     */
    stopImmediatePropagation : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isImmediatePropagationStopped = returnTrue;
      if (e) {
        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
      }
      this.stopPropagation();
    }
  };
  jQuery.each({
    mouseenter : "mouseover",
    mouseleave : "mouseout",
    pointerenter : "pointerover",
    pointerleave : "pointerout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType : fix,
      bindType : fix,
      /**
       * @param {Object} event
       * @return {?}
       */
      handle : function(event) {
        var returnValue;
        var target = this;
        var related = event.relatedTarget;
        var handleObj = event.handleObj;
        return(!related || related !== target && !jQuery.contains(target, related)) && (event.type = handleObj.origType, returnValue = handleObj.handler.apply(this, arguments), event.type = fix), returnValue;
      }
    };
  });
  if (!support.submitBubbles) {
    jQuery.event.special.submit = {
      /**
       * @return {?}
       */
      setup : function() {
        return jQuery.nodeName(this, "form") ? false : void jQuery.event.add(this, "click._submit keypress._submit", function(e) {
          var elem = e.target;
          var dest = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : void 0;
          if (dest) {
            if (!jQuery._data(dest, "submitBubbles")) {
              jQuery.event.add(dest, "submit._submit", function(event) {
                /** @type {boolean} */
                event._submit_bubble = true;
              });
              jQuery._data(dest, "submitBubbles", true);
            }
          }
        });
      },
      /**
       * @param {Event} event
       * @return {undefined}
       */
      postDispatch : function(event) {
        if (event._submit_bubble) {
          delete event._submit_bubble;
          if (this.parentNode) {
            if (!event.isTrigger) {
              jQuery.event.simulate("submit", this.parentNode, event, true);
            }
          }
        }
      },
      /**
       * @return {?}
       */
      teardown : function() {
        return jQuery.nodeName(this, "form") ? false : void jQuery.event.remove(this, "._submit");
      }
    };
  }
  if (!support.changeBubbles) {
    jQuery.event.special.change = {
      /**
       * @return {?}
       */
      setup : function() {
        return rformElems.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (jQuery.event.add(this, "propertychange._change", function(event) {
          if ("checked" === event.originalEvent.propertyName) {
            /** @type {boolean} */
            this._just_changed = true;
          }
        }), jQuery.event.add(this, "click._change", function(event) {
          if (this._just_changed) {
            if (!event.isTrigger) {
              /** @type {boolean} */
              this._just_changed = false;
            }
          }
          jQuery.event.simulate("change", this, event, true);
        })), false) : void jQuery.event.add(this, "beforeactivate._change", function(ev) {
          var node = ev.target;
          if (rformElems.test(node.nodeName)) {
            if (!jQuery._data(node, "changeBubbles")) {
              jQuery.event.add(node, "change._change", function(event) {
                if (!!this.parentNode) {
                  if (!event.isSimulated) {
                    if (!event.isTrigger) {
                      jQuery.event.simulate("change", this.parentNode, event, true);
                    }
                  }
                }
              });
              jQuery._data(node, "changeBubbles", true);
            }
          }
        });
      },
      /**
       * @param {Event} event
       * @return {?}
       */
      handle : function(event) {
        var current = event.target;
        return this !== current || (event.isSimulated || (event.isTrigger || "radio" !== current.type && "checkbox" !== current.type)) ? event.handleObj.handler.apply(this, arguments) : void 0;
      },
      /**
       * @return {?}
       */
      teardown : function() {
        return jQuery.event.remove(this, "._change"), !rformElems.test(this.nodeName);
      }
    };
  }
  if (!support.focusinBubbles) {
    jQuery.each({
      focus : "focusin",
      blur : "focusout"
    }, function(name, fix) {
      /**
       * @param {Object} event
       * @return {undefined}
       */
      var handler = function(event) {
        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
      };
      jQuery.event.special[fix] = {
        /**
         * @return {undefined}
         */
        setup : function() {
          var target = this.ownerDocument || this;
          var targets = jQuery._data(target, fix);
          if (!targets) {
            target.addEventListener(name, handler, true);
          }
          jQuery._data(target, fix, (targets || 0) + 1);
        },
        /**
         * @return {undefined}
         */
        teardown : function() {
          var node = this.ownerDocument || this;
          /** @type {number} */
          var value = jQuery._data(node, fix) - 1;
          if (value) {
            jQuery._data(node, fix, value);
          } else {
            node.removeEventListener(name, handler, true);
            jQuery._removeData(node, fix);
          }
        }
      };
    });
  }
  jQuery.fn.extend({
    /**
     * @param {Object} types
     * @param {Object} selector
     * @param {Object} data
     * @param {Object} fn
     * @param {(number|string)} one
     * @return {?}
     */
    on : function(types, selector, data, fn, one) {
      var type;
      var origFn;
      if ("object" == typeof types) {
        if ("string" != typeof selector) {
          data = data || selector;
          selector = void 0;
        }
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }
      if (null == data && null == fn ? (fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (fn = data, data = void 0) : (fn = data, data = selector, selector = void 0)), fn === false) {
        /** @type {function (): ?} */
        fn = returnFalse;
      } else {
        if (!fn) {
          return this;
        }
      }
      return 1 === one && (origFn = fn, fn = function(event) {
        return jQuery().off(event), origFn.apply(this, arguments);
      }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    /**
     * @param {Object} types
     * @param {Object} selector
     * @param {Object} data
     * @param {Object} fn
     * @return {?}
     */
    one : function(types, selector, data, fn) {
      return this.on(types, selector, data, fn, 1);
    },
    /**
     * @param {Object} types
     * @param {Object} selector
     * @param {Object} fn
     * @return {?}
     */
    off : function(types, selector, fn) {
      var handleObj;
      var type;
      if (types && (types.preventDefault && types.handleObj)) {
        return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
      }
      if ("object" == typeof types) {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      return(selector === false || "function" == typeof selector) && (fn = selector, selector = void 0), fn === false && (fn = returnFalse), this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    trigger : function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    triggerHandler : function(type, data) {
      var parent = this[0];
      return parent ? jQuery.event.trigger(type, data, parent, true) : void 0;
    }
  });
  /** @type {string} */
  var uHostName = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video";
  /** @type {RegExp} */
  var normalizr = / jQuery\d+="(?:null|\d+)"/g;
  /** @type {RegExp} */
  var regexp = new RegExp("<(?:" + uHostName + ")[\\s/>]", "i");
  /** @type {RegExp} */
  var rtagName = /^\s+/;
  /** @type {RegExp} */
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
  /** @type {RegExp} */
  var matches = /<([\w:]+)/;
  /** @type {RegExp} */
  var rhtml = /<tbody/i;
  /** @type {RegExp} */
  var selector = /<|&#?\w+;/;
  /** @type {RegExp} */
  var rchecked = /<(?:script|style|link)/i;
  /** @type {RegExp} */
  var rRadial = /checked\s*(?:[^=]|=\s*.checked.)/i;
  /** @type {RegExp} */
  var stopParent = /^$|\/(?:java|ecma)script/i;
  /** @type {RegExp} */
  var rscriptTypeMasked = /^true\/(.*)/;
  /** @type {RegExp} */
  var rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  var wrapMap = {
    option : [1, "<select multiple='multiple'>", "</select>"],
    legend : [1, "<fieldset>", "</fieldset>"],
    area : [1, "<map>", "</map>"],
    param : [1, "<object>", "</object>"],
    thead : [1, "<table>", "</table>"],
    tr : [2, "<table><tbody>", "</tbody></table>"],
    col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
    td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default : support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
  };
  var el = save(doc);
  var fragmentDiv = el.appendChild(doc.createElement("div"));
  /** @type {Array} */
  wrapMap.optgroup = wrapMap.option;
  /** @type {Array} */
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  /** @type {Array} */
  wrapMap.th = wrapMap.td;
  jQuery.extend({
    /**
     * @param {Object} node
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(node, dataAndEvents, deepDataAndEvents) {
      var destElements;
      var elem;
      var clone;
      var i;
      var tmp;
      var inPage = jQuery.contains(node.ownerDocument, node);
      if (support.html5Clone || (jQuery.isXMLDoc(node) || !regexp.test("<" + node.nodeName + ">")) ? clone = node.cloneNode(true) : (fragmentDiv.innerHTML = node.outerHTML, fragmentDiv.removeChild(clone = fragmentDiv.firstChild)), !(support.noCloneEvent && support.noCloneChecked || (1 !== node.nodeType && 11 !== node.nodeType || jQuery.isXMLDoc(node)))) {
        destElements = getAll(clone);
        tmp = getAll(node);
        /** @type {number} */
        i = 0;
        for (;null != (elem = tmp[i]);++i) {
          if (destElements[i]) {
            cloneFixAttributes(elem, destElements[i]);
          }
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          tmp = tmp || getAll(node);
          destElements = destElements || getAll(clone);
          /** @type {number} */
          i = 0;
          for (;null != (elem = tmp[i]);i++) {
            cloneCopyEvent(elem, destElements[i]);
          }
        } else {
          cloneCopyEvent(node, clone);
        }
      }
      return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(node, "script")), destElements = tmp = elem = null, clone;
    },
    /**
     * @param {Array} elems
     * @param {Document} context
     * @param {boolean} scripts
     * @param {Object} selection
     * @return {?}
     */
    buildFragment : function(elems, context, scripts, selection) {
      var j;
      var elem;
      var contains;
      var tmp;
      var tag;
      var tbody;
      var wrap;
      var l = elems.length;
      var safe = save(context);
      /** @type {Array} */
      var nodes = [];
      /** @type {number} */
      var i = 0;
      for (;l > i;i++) {
        if (elem = elems[i], elem || 0 === elem) {
          if ("object" === jQuery.type(elem)) {
            jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
          } else {
            if (selector.test(elem)) {
              tmp = tmp || safe.appendChild(context.createElement("div"));
              tag = (matches.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
              j = wrap[0];
              for (;j--;) {
                tmp = tmp.lastChild;
              }
              if (!support.leadingWhitespace && (rtagName.test(elem) && nodes.push(context.createTextNode(rtagName.exec(elem)[0]))), !support.tbody) {
                elem = "table" !== tag || rhtml.test(elem) ? "<table>" !== wrap[1] || rhtml.test(elem) ? 0 : tmp : tmp.firstChild;
                j = elem && elem.childNodes.length;
                for (;j--;) {
                  if (jQuery.nodeName(tbody = elem.childNodes[j], "tbody")) {
                    if (!tbody.childNodes.length) {
                      elem.removeChild(tbody);
                    }
                  }
                }
              }
              jQuery.merge(nodes, tmp.childNodes);
              /** @type {string} */
              tmp.textContent = "";
              for (;tmp.firstChild;) {
                tmp.removeChild(tmp.firstChild);
              }
              tmp = safe.lastChild;
            } else {
              nodes.push(context.createTextNode(elem));
            }
          }
        }
      }
      if (tmp) {
        safe.removeChild(tmp);
      }
      if (!support.appendChecked) {
        jQuery.grep(getAll(nodes, "input"), set);
      }
      /** @type {number} */
      i = 0;
      for (;elem = nodes[i++];) {
        if ((!selection || -1 === jQuery.inArray(elem, selection)) && (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(safe.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts)) {
          /** @type {number} */
          j = 0;
          for (;elem = tmp[j++];) {
            if (stopParent.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }
      return tmp = null, safe;
    },
    /**
     * @param {Array} elems
     * @param {?} dataAndEvents
     * @return {undefined}
     */
    cleanData : function(elems, dataAndEvents) {
      var elem;
      var type;
      var id;
      var data;
      /** @type {number} */
      var i = 0;
      var expando = jQuery.expando;
      var cache = jQuery.cache;
      /** @type {boolean} */
      var deleteExpando = support.deleteExpando;
      var special = jQuery.event.special;
      for (;null != (elem = elems[i]);i++) {
        if ((dataAndEvents || jQuery.acceptData(elem)) && (id = elem[expando], data = id && cache[id])) {
          if (data.events) {
            for (type in data.events) {
              if (special[type]) {
                jQuery.event.remove(elem, type);
              } else {
                jQuery.removeEvent(elem, type, data.handle);
              }
            }
          }
          if (cache[id]) {
            delete cache[id];
            if (deleteExpando) {
              delete elem[expando];
            } else {
              if (typeof elem.removeAttribute !== text) {
                elem.removeAttribute(expando);
              } else {
                /** @type {null} */
                elem[expando] = null;
              }
            }
            core_deletedIds.push(id);
          }
        }
      }
    }
  });
  jQuery.fn.extend({
    /**
     * @param {Object} a
     * @return {?}
     */
    text : function(a) {
      return access(this, function(text) {
        return void 0 === text ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || doc).createTextNode(text));
      }, null, a, arguments.length);
    },
    /**
     * @return {?}
     */
    append : function() {
      return this.domManip(arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    /**
     * @return {?}
     */
    prepend : function() {
      return this.domManip(arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    /**
     * @return {?}
     */
    before : function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    /**
     * @return {?}
     */
    after : function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    /**
     * @param {Object} exports
     * @param {string} keepData
     * @return {?}
     */
    remove : function(exports, keepData) {
      var elem;
      var curLoop = exports ? jQuery.filter(exports, this) : this;
      /** @type {number} */
      var i = 0;
      for (;null != (elem = curLoop[i]);i++) {
        if (!keepData) {
          if (!(1 !== elem.nodeType)) {
            jQuery.cleanData(getAll(elem));
          }
        }
        if (elem.parentNode) {
          if (keepData) {
            if (jQuery.contains(elem.ownerDocument, elem)) {
              setGlobalEval(getAll(elem, "script"));
            }
          }
          elem.parentNode.removeChild(elem);
        }
      }
      return this;
    },
    /**
     * @return {?}
     */
    empty : function() {
      var elem;
      /** @type {number} */
      var unlock = 0;
      for (;null != (elem = this[unlock]);unlock++) {
        if (1 === elem.nodeType) {
          jQuery.cleanData(getAll(elem, false));
        }
        for (;elem.firstChild;) {
          elem.removeChild(elem.firstChild);
        }
        if (elem.options) {
          if (jQuery.nodeName(elem, "select")) {
            /** @type {number} */
            elem.options.length = 0;
          }
        }
      }
      return this;
    },
    /**
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(dataAndEvents, deepDataAndEvents) {
      return dataAndEvents = null == dataAndEvents ? false : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    /**
     * @param {Function} value
     * @return {?}
     */
    html : function(value) {
      return access(this, function(value) {
        var elem = this[0] || {};
        /** @type {number} */
        var i = 0;
        var l = this.length;
        if (void 0 === value) {
          return 1 === elem.nodeType ? elem.innerHTML.replace(normalizr, "") : void 0;
        }
        if (!("string" != typeof value || (rchecked.test(value) || (!support.htmlSerialize && regexp.test(value) || (!support.leadingWhitespace && rtagName.test(value) || wrapMap[(matches.exec(value) || ["", ""])[1].toLowerCase()]))))) {
          /** @type {string} */
          value = value.replace(rxhtmlTag, "<$1></$2>");
          try {
            for (;l > i;i++) {
              elem = this[i] || {};
              if (1 === elem.nodeType) {
                jQuery.cleanData(getAll(elem, false));
                /** @type {string} */
                elem.innerHTML = value;
              }
            }
            /** @type {number} */
            elem = 0;
          } catch (e) {
          }
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    /**
     * @return {?}
     */
    replaceWith : function() {
      var arg = arguments[0];
      return this.domManip(arguments, function(s) {
        arg = this.parentNode;
        jQuery.cleanData(getAll(this));
        if (arg) {
          arg.replaceChild(s, this);
        }
      }), arg && (arg.length || arg.nodeType) ? this : this.remove();
    },
    /**
     * @param {Object} selector
     * @return {?}
     */
    detach : function(selector) {
      return this.remove(selector, true);
    },
    /**
     * @param {Object} args
     * @param {Function} callback
     * @return {?}
     */
    domManip : function(args, callback) {
      /** @type {Array} */
      args = core_concat.apply([], args);
      var first;
      var node;
      var _len;
      var scripts;
      var doc;
      var fragment;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      var set = this;
      /** @type {number} */
      var iNoClone = l - 1;
      var value = args[0];
      var isFunction = jQuery.isFunction(value);
      if (isFunction || l > 1 && ("string" == typeof value && (!support.checkClone && rRadial.test(value)))) {
        return this.each(function(index) {
          var self = set.eq(index);
          if (isFunction) {
            args[0] = value.call(this, index, self.html());
          }
          self.domManip(args, callback);
        });
      }
      if (l && (fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this), first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), first)) {
        scripts = jQuery.map(getAll(fragment, "script"), restoreScript);
        _len = scripts.length;
        for (;l > i;i++) {
          node = fragment;
          if (i !== iNoClone) {
            node = jQuery.clone(node, true, true);
            if (_len) {
              jQuery.merge(scripts, getAll(node, "script"));
            }
          }
          callback.call(this[i], node, i);
        }
        if (_len) {
          doc = scripts[scripts.length - 1].ownerDocument;
          jQuery.map(scripts, fn);
          /** @type {number} */
          i = 0;
          for (;_len > i;i++) {
            node = scripts[i];
            if (stopParent.test(node.type || "")) {
              if (!jQuery._data(node, "globalEval")) {
                if (jQuery.contains(doc, node)) {
                  if (node.src) {
                    if (jQuery._evalUrl) {
                      jQuery._evalUrl(node.src);
                    }
                  } else {
                    jQuery.globalEval((node.text || (node.textContent || (node.innerHTML || ""))).replace(rcleanScript, ""));
                  }
                }
              }
            }
          }
        }
        /** @type {null} */
        fragment = first = null;
      }
      return this;
    }
  });
  jQuery.each({
    appendTo : "append",
    prependTo : "prepend",
    insertBefore : "before",
    insertAfter : "after",
    replaceAll : "replaceWith"
  }, function(original, method) {
    /**
     * @param {string} scripts
     * @return {?}
     */
    jQuery.fn[original] = function(scripts) {
      var resp;
      /** @type {number} */
      var i = 0;
      /** @type {Array} */
      var ret = [];
      var insert = jQuery(scripts);
      /** @type {number} */
      var segments = insert.length - 1;
      for (;segments >= i;i++) {
        resp = i === segments ? this : this.clone(true);
        jQuery(insert[i])[method](resp);
        core_push.apply(ret, resp.get());
      }
      return this.pushStack(ret);
    };
  });
  var iframe;
  var elemdisplay = {};
  !function() {
    var shrinkWrapBlocks;
    /**
     * @return {?}
     */
    support.shrinkWrapBlocks = function() {
      if (null != shrinkWrapBlocks) {
        return shrinkWrapBlocks;
      }
      /** @type {boolean} */
      shrinkWrapBlocks = false;
      var div;
      var target;
      var container;
      return target = doc.getElementsByTagName("body")[0], target && target.style ? (div = doc.createElement("div"), container = doc.createElement("div"), container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", target.appendChild(container).appendChild(div), typeof div.style.zoom !== text && (div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", div.appendChild(doc.createElement("div")).style.width = 
      "5px", shrinkWrapBlocks = 3 !== div.offsetWidth), target.removeChild(container), shrinkWrapBlocks) : void 0;
    };
  }();
  /** @type {RegExp} */
  var rbracket = /^margin/;
  /** @type {RegExp} */
  var rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
  var getStyles;
  var get;
  /** @type {RegExp} */
  var eventSplitter = /^(top|right|bottom|left)$/;
  if (win.getComputedStyle) {
    /**
     * @param {Object} elem
     * @return {?}
     */
    getStyles = function(elem) {
      return elem.ownerDocument.defaultView.opener ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : win.getComputedStyle(elem, null);
    };
    /**
     * @param {Object} elem
     * @param {Object} prop
     * @param {Object} computed
     * @return {?}
     */
    get = function(elem, prop, computed) {
      var width;
      var minWidth;
      var maxWidth;
      var ret;
      var style = elem.style;
      return computed = computed || getStyles(elem), ret = computed ? computed.getPropertyValue(prop) || computed[prop] : void 0, computed && ("" !== ret || (jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, prop))), rnumnonpx.test(ret) && (rbracket.test(prop) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = 
      maxWidth))), void 0 === ret ? ret : ret + "";
    };
  } else {
    if (doc.documentElement.currentStyle) {
      /**
       * @param {Object} a
       * @return {?}
       */
      getStyles = function(a) {
        return a.currentStyle;
      };
      /**
       * @param {Object} elem
       * @param {string} name
       * @param {Object} computed
       * @return {?}
       */
      get = function(elem, name, computed) {
        var left;
        var rs;
        var rsLeft;
        var ret;
        var style = elem.style;
        return computed = computed || getStyles(elem), ret = computed ? computed[name] : void 0, null == ret && (style && (style[name] && (ret = style[name]))), rnumnonpx.test(ret) && (!eventSplitter.test(name) && (left = style.left, rs = elem.runtimeStyle, rsLeft = rs && rs.left, rsLeft && (rs.left = elem.currentStyle.left), style.left = "fontSize" === name ? "1em" : ret, ret = style.pixelLeft + "px", style.left = left, rsLeft && (rs.left = rsLeft))), void 0 === ret ? ret : ret + "" || "auto";
      };
    }
  }
  !function() {
    var div;
    var style;
    var domNode;
    var stack;
    var memory;
    var g;
    var h;
    if (div = doc.createElement("div"), div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", domNode = div.getElementsByTagName("a")[0], style = domNode && domNode.style) {
      /** @type {string} */
      style.cssText = "float:left;opacity:.5";
      /** @type {boolean} */
      support.opacity = "0.5" === style.opacity;
      /** @type {boolean} */
      support.cssFloat = !!style.cssFloat;
      /** @type {string} */
      div.style.backgroundClip = "content-box";
      /** @type {string} */
      div.cloneNode(true).style.backgroundClip = "";
      /** @type {boolean} */
      support.clearCloneStyle = "content-box" === div.style.backgroundClip;
      /** @type {boolean} */
      support.boxSizing = "" === style.boxSizing || ("" === style.MozBoxSizing || "" === style.WebkitBoxSizing);
      jQuery.extend(support, {
        /**
         * @return {?}
         */
        reliableHiddenOffsets : function() {
          return null == g && getSize(), g;
        },
        /**
         * @return {?}
         */
        boxSizingReliable : function() {
          return null == memory && getSize(), memory;
        },
        /**
         * @return {?}
         */
        pixelPosition : function() {
          return null == stack && getSize(), stack;
        },
        /**
         * @return {?}
         */
        reliableMarginRight : function() {
          return null == h && getSize(), h;
        }
      });
      /**
       * @return {undefined}
       */
      var getSize = function() {
        var div;
        var body;
        var container;
        var marginDiv;
        body = doc.getElementsByTagName("body")[0];
        if (body) {
          if (body.style) {
            div = doc.createElement("div");
            container = doc.createElement("div");
            /** @type {string} */
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);
            /** @type {string} */
            div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute";
            /** @type {boolean} */
            stack = memory = false;
            /** @type {boolean} */
            h = true;
            if (win.getComputedStyle) {
              /** @type {boolean} */
              stack = "1%" !== (win.getComputedStyle(div, null) || {}).top;
              /** @type {boolean} */
              memory = "4px" === (win.getComputedStyle(div, null) || {
                width : "4px"
              }).width;
              marginDiv = div.appendChild(doc.createElement("div"));
              /** @type {string} */
              marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0";
              /** @type {string} */
              marginDiv.style.marginRight = marginDiv.style.width = "0";
              /** @type {string} */
              div.style.width = "1px";
              /** @type {boolean} */
              h = !parseFloat((win.getComputedStyle(marginDiv, null) || {}).marginRight);
              div.removeChild(marginDiv);
            }
            /** @type {string} */
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            marginDiv = div.getElementsByTagName("td");
            /** @type {string} */
            marginDiv[0].style.cssText = "margin:0;border:0;padding:0;display:none";
            /** @type {boolean} */
            g = 0 === marginDiv[0].offsetHeight;
            if (g) {
              /** @type {string} */
              marginDiv[0].style.display = "";
              /** @type {string} */
              marginDiv[1].style.display = "none";
              /** @type {boolean} */
              g = 0 === marginDiv[0].offsetHeight;
            }
            body.removeChild(container);
          }
        }
      };
    }
  }();
  /**
   * @param {Object} elem
   * @param {Object} options
   * @param {Function} callback
   * @param {Array} args
   * @return {?}
   */
  jQuery.swap = function(elem, options, callback, args) {
    var ret;
    var name;
    var old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.apply(elem, args || []);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  };
  /** @type {RegExp} */
  var ralpha = /alpha\([^)]*\)/i;
  /** @type {RegExp} */
  var emptyType = /opacity\s*=\s*([^)]*)/;
  /** @type {RegExp} */
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
  /** @type {RegExp} */
  var rrelNum = new RegExp("^(" + core_pnum + ")(.*)$", "i");
  /** @type {RegExp} */
  var re2 = new RegExp("^([+-])=(" + core_pnum + ")", "i");
  var props = {
    position : "absolute",
    visibility : "hidden",
    display : "block"
  };
  var object = {
    letterSpacing : "0",
    fontWeight : "400"
  };
  /** @type {Array} */
  var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
  jQuery.extend({
    cssHooks : {
      opacity : {
        /**
         * @param {Object} elem
         * @param {string} keepData
         * @return {?}
         */
        get : function(elem, keepData) {
          if (keepData) {
            var value = get(elem, "opacity");
            return "" === value ? "1" : value;
          }
        }
      }
    },
    cssNumber : {
      columnCount : true,
      fillOpacity : true,
      flexGrow : true,
      flexShrink : true,
      fontWeight : true,
      lineHeight : true,
      opacity : true,
      order : true,
      orphans : true,
      widows : true,
      zIndex : true,
      zoom : true
    },
    cssProps : {
      "float" : support.cssFloat ? "cssFloat" : "styleFloat"
    },
    /**
     * @param {Object} a
     * @param {Object} value
     * @param {string} val
     * @param {string} name
     * @return {?}
     */
    style : function(a, value, val, name) {
      if (a && (3 !== a.nodeType && (8 !== a.nodeType && a.style))) {
        var ret;
        var type;
        var hooks;
        var origName = jQuery.camelCase(value);
        var style = a.style;
        if (value = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), hooks = jQuery.cssHooks[value] || jQuery.cssHooks[origName], void 0 === val) {
          return hooks && ("get" in hooks && void 0 !== (ret = hooks.get(a, false, name))) ? ret : style[value];
        }
        if (type = typeof val, "string" === type && ((ret = re2.exec(val)) && (val = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(a, value)), type = "number")), null != val && (val === val && ("number" !== type || (jQuery.cssNumber[origName] || (val += "px")), support.clearCloneStyle || ("" !== val || (0 !== value.indexOf("background") || (style[value] = "inherit"))), !(hooks && ("set" in hooks && void 0 === (val = hooks.set(a, val, name))))))) {
          try {
            /** @type {string} */
            style[value] = val;
          } catch (j) {
          }
        }
      }
    },
    /**
     * @param {Object} elem
     * @param {string} prop
     * @param {boolean} recurring
     * @param {?} property
     * @return {?}
     */
    css : function(elem, prop, recurring, property) {
      var key;
      var value;
      var hooks;
      var origName = jQuery.camelCase(prop);
      return prop = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), hooks = jQuery.cssHooks[prop] || jQuery.cssHooks[origName], hooks && ("get" in hooks && (value = hooks.get(elem, true, recurring))), void 0 === value && (value = get(elem, prop, property)), "normal" === value && (prop in object && (value = object[prop])), "" === recurring || recurring ? (key = parseFloat(value), recurring === true || jQuery.isNumeric(key) ? key || 0 : value) : value;
    }
  });
  jQuery.each(["height", "width"], function(dataAndEvents, prop) {
    jQuery.cssHooks[prop] = {
      /**
       * @param {Object} elem
       * @param {Object} keepData
       * @param {string} extra
       * @return {?}
       */
      get : function(elem, keepData, extra) {
        return keepData ? rdisplayswap.test(jQuery.css(elem, "display")) && 0 === elem.offsetWidth ? jQuery.swap(elem, props, function() {
          return getWidthOrHeight(elem, prop, extra);
        }) : getWidthOrHeight(elem, prop, extra) : void 0;
      },
      /**
       * @param {Object} a
       * @param {Object} value
       * @param {string} name
       * @return {?}
       */
      set : function(a, value, name) {
        var styles = name && getStyles(a);
        return compare(a, value, name ? augmentWidthOrHeight(a, prop, name, support.boxSizing && "border-box" === jQuery.css(a, "boxSizing", false, styles), styles) : 0);
      }
    };
  });
  if (!support.opacity) {
    jQuery.cssHooks.opacity = {
      /**
       * @param {Object} elem
       * @param {Object} computed
       * @return {?}
       */
      get : function(elem, computed) {
        return emptyType.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
      },
      /**
       * @param {Object} a
       * @param {Object} value
       * @return {undefined}
       */
      set : function(a, value) {
        var style = a.style;
        var currentStyle = a.currentStyle;
        /** @type {string} */
        var opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "";
        var filter = currentStyle && currentStyle.filter || (style.filter || "");
        /** @type {number} */
        style.zoom = 1;
        if (!((value >= 1 || "" === value) && ("" === jQuery.trim(filter.replace(ralpha, "")) && (style.removeAttribute && (style.removeAttribute("filter"), "" === value || currentStyle && !currentStyle.filter))))) {
          style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
        }
      }
    };
  }
  jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(cur, value) {
    return value ? jQuery.swap(cur, {
      display : "inline-block"
    }, get, [cur, "marginRight"]) : void 0;
  });
  jQuery.each({
    margin : "",
    padding : "",
    border : "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      /**
       * @param {string} str
       * @return {?}
       */
      expand : function(str) {
        /** @type {number} */
        var i = 0;
        var expanded = {};
        /** @type {Array} */
        var tokens = "string" == typeof str ? str.split(" ") : [str];
        for (;4 > i;i++) {
          expanded[prefix + cssExpand[i] + suffix] = tokens[i] || (tokens[i - 2] || tokens[0]);
        }
        return expanded;
      }
    };
    if (!rbracket.test(prefix)) {
      /** @type {function (Object, Object, string): ?} */
      jQuery.cssHooks[prefix + suffix].set = compare;
    }
  });
  jQuery.fn.extend({
    /**
     * @param {Object} a
     * @param {string} value
     * @return {?}
     */
    css : function(a, value) {
      return access(this, function(QUnit, pdataOld, name) {
        var styles;
        var ilen;
        var map = {};
        /** @type {number} */
        var i = 0;
        if (jQuery.isArray(pdataOld)) {
          styles = getStyles(QUnit);
          ilen = pdataOld.length;
          for (;ilen > i;i++) {
            map[pdataOld[i]] = jQuery.css(QUnit, pdataOld[i], false, styles);
          }
          return map;
        }
        return void 0 !== name ? jQuery.style(QUnit, pdataOld, name) : jQuery.css(QUnit, pdataOld);
      }, a, value, arguments.length > 1);
    },
    /**
     * @return {?}
     */
    show : function() {
      return showHide(this, true);
    },
    /**
     * @return {?}
     */
    hide : function() {
      return showHide(this);
    },
    /**
     * @param {?} state
     * @return {?}
     */
    toggle : function(state) {
      return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
        if (ok(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  /** @type {function (string, string, string, string, string): ?} */
  jQuery.Tween = Tween;
  Tween.prototype = {
    /** @type {function (string, string, string, string, string): ?} */
    constructor : Tween,
    /**
     * @param {Object} allBindingsAccessor
     * @param {Object} options
     * @param {?} prop
     * @param {number} to
     * @param {string} easing
     * @param {string} unit
     * @return {undefined}
     */
    init : function(allBindingsAccessor, options, prop, to, easing, unit) {
      /** @type {Object} */
      this.elem = allBindingsAccessor;
      this.prop = prop;
      this.easing = easing || "swing";
      /** @type {Object} */
      this.options = options;
      this.start = this.now = this.cur();
      /** @type {number} */
      this.end = to;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    /**
     * @return {?}
     */
    cur : function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    /**
     * @param {number} percent
     * @return {?}
     */
    run : function(percent) {
      var eased;
      var hooks = Tween.propHooks[this.prop];
      return this.options.duration ? this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : this.pos = eased = percent, this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default : {
      /**
       * @param {Object} elem
       * @return {?}
       */
      get : function(elem) {
        var node;
        return null == elem.elem[elem.prop] || elem.elem.style && null != elem.elem.style[elem.prop] ? (node = jQuery.css(elem.elem, elem.prop, ""), node && "auto" !== node ? node : 0) : elem.elem[elem.prop];
      },
      /**
       * @param {Object} a
       * @return {undefined}
       */
      set : function(a) {
        if (jQuery.fx.step[a.prop]) {
          jQuery.fx.step[a.prop](a);
        } else {
          if (a.elem.style && (null != a.elem.style[jQuery.cssProps[a.prop]] || jQuery.cssHooks[a.prop])) {
            jQuery.style(a.elem, a.prop, a.now + a.unit);
          } else {
            a.elem[a.prop] = a.now;
          }
        }
      }
    }
  };
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    /**
     * @param {Object} a
     * @return {undefined}
     */
    set : function(a) {
      if (a.elem.nodeType) {
        if (a.elem.parentNode) {
          a.elem[a.prop] = a.now;
        }
      }
    }
  };
  jQuery.easing = {
    /**
     * @param {?} t
     * @return {?}
     */
    linear : function(t) {
      return t;
    },
    /**
     * @param {number} p
     * @return {?}
     */
    swing : function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    }
  };
  /** @type {function (Object, Object, ?, number, string, string): undefined} */
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.step = {};
  var fxNow;
  var scrollIntervalId;
  /** @type {RegExp} */
  var rplusequals = /^(?:toggle|show|hide)$/;
  /** @type {RegExp} */
  var rfxnum = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i");
  /** @type {RegExp} */
  var numbers = /queueHooks$/;
  /** @type {Array} */
  var animationPrefilters = [defaultPrefilter];
  var cache = {
    "*" : [function(prop, value) {
      var tween = this.createTween(prop, value);
      var l0 = tween.cur();
      /** @type {(Array.<string>|null)} */
      var parts = rfxnum.exec(value);
      /** @type {string} */
      var unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px");
      var start = (jQuery.cssNumber[prop] || "px" !== unit && +l0) && rfxnum.exec(jQuery.css(tween.elem, prop));
      /** @type {number} */
      var scale = 1;
      /** @type {number} */
      var i = 20;
      if (start && start[3] !== unit) {
        unit = unit || start[3];
        /** @type {Array} */
        parts = parts || [];
        /** @type {number} */
        start = +l0 || 1;
        do {
          /** @type {(number|string)} */
          scale = scale || ".5";
          start /= scale;
          jQuery.style(tween.elem, prop, start + unit);
        } while (scale !== (scale = tween.cur() / l0) && (1 !== scale && --i));
      }
      return parts && (start = tween.start = +start || (+l0 || 0), tween.unit = unit, tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2]), tween;
    }]
  };
  jQuery.Animation = jQuery.extend(Animation, {
    /**
     * @param {Object} props
     * @param {Function} callback
     * @return {undefined}
     */
    tweener : function(props, callback) {
      if (jQuery.isFunction(props)) {
        /** @type {Object} */
        callback = props;
        /** @type {Array} */
        props = ["*"];
      } else {
        props = props.split(" ");
      }
      var prop;
      /** @type {number} */
      var p = 0;
      var len = props.length;
      for (;len > p;p++) {
        prop = props[p];
        cache[prop] = cache[prop] || [];
        cache[prop].unshift(callback);
      }
    },
    /**
     * @param {?} suite
     * @param {?} prepend
     * @return {undefined}
     */
    prefilter : function(suite, prepend) {
      if (prepend) {
        animationPrefilters.unshift(suite);
      } else {
        animationPrefilters.push(suite);
      }
    }
  });
  /**
   * @param {Object} speed
   * @param {Object} easing
   * @param {Object} fn
   * @return {?}
   */
  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
      complete : fn || (!fn && easing || jQuery.isFunction(speed) && speed),
      duration : speed,
      easing : fn && easing || easing && (!jQuery.isFunction(easing) && easing)
    };
    return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, (null == opt.queue || opt.queue === true) && (opt.queue = "fx"), opt.old = opt.complete, opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    }, opt;
  };
  jQuery.fn.extend({
    /**
     * @param {number} speed
     * @param {(number|string)} to
     * @param {Object} callback
     * @param {Object} _callback
     * @return {?}
     */
    fadeTo : function(speed, to, callback, _callback) {
      return this.filter(ok).css("opacity", 0).show().end().animate({
        opacity : to
      }, speed, callback, _callback);
    },
    /**
     * @param {?} prop
     * @param {number} speed
     * @param {Object} easing
     * @param {Object} callback
     * @return {?}
     */
    animate : function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop);
      var optall = jQuery.speed(speed, easing, callback);
      /**
       * @return {undefined}
       */
      var doAnimation = function() {
        var anim = Animation(this, jQuery.extend({}, prop), optall);
        if (empty || jQuery._data(this, "finish")) {
          anim.stop(true);
        }
      };
      return doAnimation.finish = doAnimation, empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    /**
     * @param {boolean} type
     * @param {boolean} clearQueue
     * @param {boolean} gotoEnd
     * @return {?}
     */
    stop : function(type, clearQueue, gotoEnd) {
      /**
       * @param {Object} e
       * @return {undefined}
       */
      var stop = function(e) {
        var stop = e.stop;
        delete e.stop;
        stop(gotoEnd);
      };
      return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), clearQueue && (type !== false && this.queue(type || "fx", [])), this.each(function() {
        /** @type {boolean} */
        var dequeue = true;
        var i = null != type && type + "queueHooks";
        /** @type {Array} */
        var timers = jQuery.timers;
        var gradient = jQuery._data(this);
        if (i) {
          if (gradient[i]) {
            if (gradient[i].stop) {
              stop(gradient[i]);
            }
          }
        } else {
          for (i in gradient) {
            if (gradient[i]) {
              if (gradient[i].stop) {
                if (numbers.test(i)) {
                  stop(gradient[i]);
                }
              }
            }
          }
        }
        /** @type {number} */
        i = timers.length;
        for (;i--;) {
          if (!(timers[i].elem !== this)) {
            if (!(null != type && timers[i].queue !== type)) {
              timers[i].anim.stop(gotoEnd);
              /** @type {boolean} */
              dequeue = false;
              timers.splice(i, 1);
            }
          }
        }
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    finish : function(type) {
      return type !== false && (type = type || "fx"), this.each(function() {
        var index;
        var data = jQuery._data(this);
        var array = data[type + "queue"];
        var event = data[type + "queueHooks"];
        /** @type {Array} */
        var timers = jQuery.timers;
        var length = array ? array.length : 0;
        /** @type {boolean} */
        data.finish = true;
        jQuery.queue(this, type, []);
        if (event) {
          if (event.stop) {
            event.stop.call(this, true);
          }
        }
        /** @type {number} */
        index = timers.length;
        for (;index--;) {
          if (timers[index].elem === this) {
            if (timers[index].queue === type) {
              timers[index].anim.stop(true);
              timers.splice(index, 1);
            }
          }
        }
        /** @type {number} */
        index = 0;
        for (;length > index;index++) {
          if (array[index]) {
            if (array[index].finish) {
              array[index].finish.call(this);
            }
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each(["toggle", "show", "hide"], function(dataAndEvents, name) {
    var matcherFunction = jQuery.fn[name];
    /**
     * @param {number} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[name] = function(speed, callback, next_callback) {
      return null == speed || "boolean" == typeof speed ? matcherFunction.apply(this, arguments) : this.animate(genFx(name, true), speed, callback, next_callback);
    };
  });
  jQuery.each({
    slideDown : genFx("show"),
    slideUp : genFx("hide"),
    slideToggle : genFx("toggle"),
    fadeIn : {
      opacity : "show"
    },
    fadeOut : {
      opacity : "hide"
    },
    fadeToggle : {
      opacity : "toggle"
    }
  }, function(original, props) {
    /**
     * @param {number} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[original] = function(speed, callback, next_callback) {
      return this.animate(props, speed, callback, next_callback);
    };
  });
  /** @type {Array} */
  jQuery.timers = [];
  /**
   * @return {undefined}
   */
  jQuery.fx.tick = function() {
    var last;
    /** @type {Array} */
    var timers = jQuery.timers;
    /** @type {number} */
    var i = 0;
    fxNow = jQuery.now();
    for (;i < timers.length;i++) {
      last = timers[i];
      if (!last()) {
        if (!(timers[i] !== last)) {
          timers.splice(i--, 1);
        }
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = void 0;
  };
  /**
   * @param {?} timer
   * @return {undefined}
   */
  jQuery.fx.timer = function(timer) {
    jQuery.timers.push(timer);
    if (timer()) {
      jQuery.fx.start();
    } else {
      jQuery.timers.pop();
    }
  };
  /** @type {number} */
  jQuery.fx.interval = 13;
  /**
   * @return {undefined}
   */
  jQuery.fx.start = function() {
    if (!scrollIntervalId) {
      /** @type {number} */
      scrollIntervalId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  /**
   * @return {undefined}
   */
  jQuery.fx.stop = function() {
    clearInterval(scrollIntervalId);
    /** @type {null} */
    scrollIntervalId = null;
  };
  jQuery.fx.speeds = {
    slow : 600,
    fast : 200,
    _default : 400
  };
  /**
   * @param {HTMLElement} time
   * @param {string} type
   * @return {?}
   */
  jQuery.fn.delay = function(time, type) {
    return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, event) {
      /** @type {number} */
      var timeout = setTimeout(next, time);
      /**
       * @return {undefined}
       */
      event.stop = function() {
        clearTimeout(timeout);
      };
    });
  };
  (function() {
    var input;
    var d;
    var select;
    var e;
    var opt;
    d = doc.createElement("div");
    d.setAttribute("className", "t");
    /** @type {string} */
    d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    e = d.getElementsByTagName("a")[0];
    select = doc.createElement("select");
    opt = select.appendChild(doc.createElement("option"));
    input = d.getElementsByTagName("input")[0];
    /** @type {string} */
    e.style.cssText = "top:1px";
    /** @type {boolean} */
    support.getSetAttribute = "t" !== d.className;
    /** @type {boolean} */
    support.style = /top/.test(e.getAttribute("style"));
    /** @type {boolean} */
    support.hrefNormalized = "/a" === e.getAttribute("href");
    /** @type {boolean} */
    support.checkOn = !!input.value;
    support.optSelected = opt.selected;
    /** @type {boolean} */
    support.enctype = !!doc.createElement("form").enctype;
    /** @type {boolean} */
    select.disabled = true;
    /** @type {boolean} */
    support.optDisabled = !opt.disabled;
    input = doc.createElement("input");
    input.setAttribute("value", "");
    /** @type {boolean} */
    support.input = "" === input.getAttribute("value");
    /** @type {string} */
    input.value = "t";
    input.setAttribute("type", "radio");
    /** @type {boolean} */
    support.radioValue = "t" === input.value;
  })();
  /** @type {RegExp} */
  var rreturn = /\r/g;
  jQuery.fn.extend({
    /**
     * @param {Function} value
     * @return {?}
     */
    val : function(value) {
      var hooks;
      var ret;
      var isFunction;
      var elem = this[0];
      if (arguments.length) {
        return isFunction = jQuery.isFunction(value), this.each(function(i) {
          var val;
          if (1 === this.nodeType) {
            val = isFunction ? value.call(this, i, jQuery(this).val()) : value;
            if (null == val) {
              /** @type {string} */
              val = "";
            } else {
              if ("number" == typeof val) {
                val += "";
              } else {
                if (jQuery.isArray(val)) {
                  val = jQuery.map(val, function(month) {
                    return null == month ? "" : month + "";
                  });
                }
              }
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!(hooks && ("set" in hooks && void 0 !== hooks.set(this, val, "value")))) {
              this.value = val;
            }
          }
        });
      }
      if (elem) {
        return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], hooks && ("get" in hooks && void 0 !== (ret = hooks.get(elem, "value"))) ? ret : (ret = elem.value, "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret);
      }
    }
  });
  jQuery.extend({
    valHooks : {
      option : {
        /**
         * @param {Object} elem
         * @return {?}
         */
        get : function(elem) {
          var handle = jQuery.find.attr(elem, "value");
          return null != handle ? handle : jQuery.trim(jQuery.text(elem));
        }
      },
      select : {
        /**
         * @param {Object} elem
         * @return {?}
         */
        get : function(elem) {
          var vvar;
          var option;
          var options = elem.options;
          var index = elem.selectedIndex;
          /** @type {boolean} */
          var one = "select-one" === elem.type || 0 > index;
          /** @type {(Array|null)} */
          var assigns = one ? null : [];
          var max = one ? index + 1 : options.length;
          var i = 0 > index ? max : one ? index : 0;
          for (;max > i;i++) {
            if (option = options[i], !(!option.selected && i !== index || ((support.optDisabled ? option.disabled : null !== option.getAttribute("disabled")) || option.parentNode.disabled && jQuery.nodeName(option.parentNode, "optgroup")))) {
              if (vvar = jQuery(option).val(), one) {
                return vvar;
              }
              assigns.push(vvar);
            }
          }
          return assigns;
        },
        /**
         * @param {Object} a
         * @param {Object} value
         * @return {?}
         */
        set : function(a, value) {
          var selected;
          var cur;
          var tokenized = a.options;
          var values = jQuery.makeArray(value);
          var index = tokenized.length;
          for (;index--;) {
            if (cur = tokenized[index], jQuery.inArray(jQuery.valHooks.option.get(cur), values) >= 0) {
              try {
                /** @type {boolean} */
                cur.selected = selected = true;
              } catch (h) {
                cur.scrollHeight;
              }
            } else {
              /** @type {boolean} */
              cur.selected = false;
            }
          }
          return selected || (a.selectedIndex = -1), tokenized;
        }
      }
    }
  });
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {
      /**
       * @param {Object} a
       * @param {Object} value
       * @return {?}
       */
      set : function(a, value) {
        return jQuery.isArray(value) ? a.checked = jQuery.inArray(jQuery(a).val(), value) >= 0 : void 0;
      }
    };
    if (!support.checkOn) {
      /**
       * @param {Object} elem
       * @return {?}
       */
      jQuery.valHooks[this].get = function(elem) {
        return null === elem.getAttribute("value") ? "on" : elem.value;
      };
    }
  });
  var nodeHook;
  var boolHook;
  var map = jQuery.expr.attrHandle;
  /** @type {RegExp} */
  var exclude = /^(?:checked|selected)$/i;
  var getSetAttribute = support.getSetAttribute;
  var str = support.input;
  jQuery.fn.extend({
    /**
     * @param {Object} name
     * @param {string} val
     * @return {?}
     */
    attr : function(name, val) {
      return access(this, jQuery.attr, name, val, arguments.length > 1);
    },
    /**
     * @param {Object} name
     * @return {?}
     */
    removeAttr : function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    }
  });
  jQuery.extend({
    /**
     * @param {Object} elem
     * @param {string} name
     * @param {Object} value
     * @return {?}
     */
    attr : function(elem, name, value) {
      var hooks;
      var ret;
      var nodeType = elem.nodeType;
      if (elem && (3 !== nodeType && (8 !== nodeType && 2 !== nodeType))) {
        return typeof elem.getAttribute === text ? jQuery.prop(elem, name, value) : (1 === nodeType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook)), void 0 === value ? hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name))) ? ret : (ret = jQuery.find.attr(elem, name), null == ret ? void 0 : ret) : null !== value ? hooks && ("set" in hooks && void 0 !== (ret = hooks.set(elem, value, name))) ? 
        ret : (elem.setAttribute(name, value + ""), value) : void jQuery.removeAttr(elem, name));
      }
    },
    /**
     * @param {Object} elem
     * @param {string} value
     * @return {undefined}
     */
    removeAttr : function(elem, value) {
      var name;
      var propName;
      /** @type {number} */
      var i = 0;
      var attrNames = value && value.match(core_rnotwhite);
      if (attrNames && 1 === elem.nodeType) {
        for (;name = attrNames[i++];) {
          propName = jQuery.propFix[name] || name;
          if (jQuery.expr.match.bool.test(name)) {
            if (str && getSetAttribute || !exclude.test(name)) {
              /** @type {boolean} */
              elem[propName] = false;
            } else {
              /** @type {boolean} */
              elem[jQuery.camelCase("default-" + name)] = elem[propName] = false;
            }
          } else {
            jQuery.attr(elem, name, "");
          }
          elem.removeAttribute(getSetAttribute ? name : propName);
        }
      }
    },
    attrHooks : {
      type : {
        /**
         * @param {Object} a
         * @param {Object} value
         * @return {?}
         */
        set : function(a, value) {
          if (!support.radioValue && ("radio" === value && jQuery.nodeName(a, "input"))) {
            var b = a.value;
            return a.setAttribute("type", value), b && (a.value = b), value;
          }
        }
      }
    }
  });
  boolHook = {
    /**
     * @param {Object} a
     * @param {Object} value
     * @param {string} name
     * @return {?}
     */
    set : function(a, value, name) {
      return value === false ? jQuery.removeAttr(a, name) : str && getSetAttribute || !exclude.test(name) ? a.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name) : a[jQuery.camelCase("default-" + name)] = a[name] = true, name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(dataAndEvents, name) {
    var getter = map[name] || jQuery.find.attr;
    /** @type {function (Object, string, Object): ?} */
    map[name] = str && getSetAttribute || !exclude.test(name) ? function(elem, name, isXML) {
      var source;
      var value;
      return isXML || (value = map[name], map[name] = source, source = null != getter(elem, name, isXML) ? name.toLowerCase() : null, map[name] = value), source;
    } : function(dataAndEvents, name, deepDataAndEvents) {
      return deepDataAndEvents ? void 0 : dataAndEvents[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null;
    };
  });
  if (!(str && getSetAttribute)) {
    jQuery.attrHooks.value = {
      /**
       * @param {Object} a
       * @param {Object} value
       * @param {string} name
       * @return {?}
       */
      set : function(a, value, name) {
        return jQuery.nodeName(a, "input") ? void(a.defaultValue = value) : nodeHook && nodeHook.set(a, value, name);
      }
    };
  }
  if (!getSetAttribute) {
    nodeHook = {
      /**
       * @param {Object} a
       * @param {Object} value
       * @param {string} name
       * @return {?}
       */
      set : function(a, value, name) {
        var ret = a.getAttributeNode(name);
        return ret || a.setAttributeNode(ret = a.ownerDocument.createAttribute(name)), ret.value = value += "", "value" === name || value === a.getAttribute(name) ? value : void 0;
      }
    };
    /** @type {function (Object, ?, boolean): ?} */
    map.id = map.name = map.coords = function(elem, name, isXML) {
      var weight;
      return isXML ? void 0 : (weight = elem.getAttributeNode(name)) && "" !== weight.value ? weight.value : null;
    };
    jQuery.valHooks.button = {
      /**
       * @param {Object} elem
       * @param {string} name
       * @return {?}
       */
      get : function(elem, name) {
        var node = elem.getAttributeNode(name);
        return node && node.specified ? node.value : void 0;
      },
      /** @type {function (Object, Object, string): ?} */
      set : nodeHook.set
    };
    jQuery.attrHooks.contenteditable = {
      /**
       * @param {Object} a
       * @param {Object} value
       * @param {string} name
       * @return {undefined}
       */
      set : function(a, value, name) {
        nodeHook.set(a, "" === value ? false : value, name);
      }
    };
    jQuery.each(["width", "height"], function(dataAndEvents, name) {
      jQuery.attrHooks[name] = {
        /**
         * @param {Object} a
         * @param {Object} value
         * @return {?}
         */
        set : function(a, value) {
          return "" === value ? (a.setAttribute(name, "auto"), value) : void 0;
        }
      };
    });
  }
  if (!support.style) {
    jQuery.attrHooks.style = {
      /**
       * @param {Object} elem
       * @return {?}
       */
      get : function(elem) {
        return elem.style.cssText || void 0;
      },
      /**
       * @param {Object} a
       * @param {Object} value
       * @return {?}
       */
      set : function(a, value) {
        return a.style.cssText = value + "";
      }
    };
  }
  /** @type {RegExp} */
  var rinputs = /^(?:input|select|textarea|button|object)$/i;
  /** @type {RegExp} */
  var rheader = /^(?:a|area)$/i;
  jQuery.fn.extend({
    /**
     * @param {Object} value
     * @param {?} name
     * @return {?}
     */
    prop : function(value, name) {
      return access(this, jQuery.prop, value, name, arguments.length > 1);
    },
    /**
     * @param {Text} name
     * @return {?}
     */
    removeProp : function(name) {
      return name = jQuery.propFix[name] || name, this.each(function() {
        try {
          this[name] = void 0;
          delete this[name];
        } catch (b) {
        }
      });
    }
  });
  jQuery.extend({
    propFix : {
      "for" : "htmlFor",
      "class" : "className"
    },
    /**
     * @param {Object} elem
     * @param {string} name
     * @param {Object} pdataOld
     * @return {?}
     */
    prop : function(elem, name, pdataOld) {
      var ret;
      var hooks;
      var n;
      var nodeType = elem.nodeType;
      if (elem && (3 !== nodeType && (8 !== nodeType && 2 !== nodeType))) {
        return n = 1 !== nodeType || !jQuery.isXMLDoc(elem), n && (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), void 0 !== pdataOld ? hooks && ("set" in hooks && void 0 !== (ret = hooks.set(elem, pdataOld, name))) ? ret : elem[name] = pdataOld : hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name))) ? ret : elem[name];
      }
    },
    propHooks : {
      tabIndex : {
        /**
         * @param {Object} elem
         * @return {?}
         */
        get : function(elem) {
          var tabindex = jQuery.find.attr(elem, "tabindex");
          return tabindex ? parseInt(tabindex, 10) : rinputs.test(elem.nodeName) || rheader.test(elem.nodeName) && elem.href ? 0 : -1;
        }
      }
    }
  });
  if (!support.hrefNormalized) {
    jQuery.each(["href", "src"], function(dataAndEvents, name) {
      jQuery.propHooks[name] = {
        /**
         * @param {Object} elem
         * @return {?}
         */
        get : function(elem) {
          return elem.getAttribute(name, 4);
        }
      };
    });
  }
  if (!support.optSelected) {
    jQuery.propHooks.selected = {
      /**
       * @param {Object} elem
       * @return {?}
       */
      get : function(elem) {
        var parent = elem.parentNode;
        return parent && (parent.selectedIndex, parent.parentNode && parent.parentNode.selectedIndex), null;
      }
    };
  }
  jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  if (!support.enctype) {
    /** @type {string} */
    jQuery.propFix.enctype = "encoding";
  }
  /** @type {RegExp} */
  var rclass = /[\t\r\n\f]/g;
  jQuery.fn.extend({
    /**
     * @param {string} value
     * @return {?}
     */
    addClass : function(value) {
      var classes;
      var elem;
      var cur;
      var clazz;
      var j;
      var finalValue;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {(boolean|string)} */
      var proceed = "string" == typeof value && value;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).addClass(value.call(this, j, this.className));
        });
      }
      if (proceed) {
        classes = (value || "").match(core_rnotwhite) || [];
        for (;l > i;i++) {
          if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
            /** @type {number} */
            j = 0;
            for (;clazz = classes[j++];) {
              if (cur.indexOf(" " + clazz + " ") < 0) {
                cur += clazz + " ";
              }
            }
            finalValue = jQuery.trim(cur);
            if (elem.className !== finalValue) {
              elem.className = finalValue;
            }
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @return {?}
     */
    removeClass : function(value) {
      var res;
      var elem;
      var cur;
      var apn;
      var resLength;
      var finalValue;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {(boolean|string)} */
      var j = 0 === arguments.length || "string" == typeof value && value;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).removeClass(value.call(this, j, this.className));
        });
      }
      if (j) {
        res = (value || "").match(core_rnotwhite) || [];
        for (;l > i;i++) {
          if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
            /** @type {number} */
            resLength = 0;
            for (;apn = res[resLength++];) {
              for (;cur.indexOf(" " + apn + " ") >= 0;) {
                /** @type {string} */
                cur = cur.replace(" " + apn + " ", " ");
              }
            }
            finalValue = value ? jQuery.trim(cur) : "";
            if (elem.className !== finalValue) {
              elem.className = finalValue;
            }
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @param {?} stateVal
     * @return {?}
     */
    toggleClass : function(value, stateVal) {
      /** @type {string} */
      var type = typeof value;
      return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : this.each(jQuery.isFunction(value) ? function(i) {
        jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
      } : function() {
        if ("string" === type) {
          var className;
          /** @type {number} */
          var i = 0;
          var self = jQuery(this);
          var classNames = value.match(core_rnotwhite) || [];
          for (;className = classNames[i++];) {
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        } else {
          if (type === text || "boolean" === type) {
            if (this.className) {
              jQuery._data(this, "__className__", this.className);
            }
            this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
          }
        }
      });
    },
    /**
     * @param {string} selector
     * @return {?}
     */
    hasClass : function(selector) {
      /** @type {string} */
      var tval = " " + selector + " ";
      /** @type {number} */
      var i = 0;
      var l = this.length;
      for (;l > i;i++) {
        if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(tval) >= 0) {
          return true;
        }
      }
      return false;
    }
  });
  jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(dataAndEvents, name) {
    /**
     * @param {Object} data
     * @param {Object} fn
     * @return {?}
     */
    jQuery.fn[name] = function(data, fn) {
      return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    /**
     * @param {undefined} fnOver
     * @param {Object} fnOut
     * @return {?}
     */
    hover : function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
    /**
     * @param {Object} types
     * @param {Object} data
     * @param {Object} fn
     * @return {?}
     */
    bind : function(types, data, fn) {
      return this.on(types, null, data, fn);
    },
    /**
     * @param {Object} types
     * @param {Object} fn
     * @return {?}
     */
    unbind : function(types, fn) {
      return this.off(types, null, fn);
    },
    /**
     * @param {Object} selector
     * @param {Object} types
     * @param {Object} data
     * @param {Object} fn
     * @return {?}
     */
    delegate : function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    /**
     * @param {string} selector
     * @param {Object} types
     * @param {Object} fn
     * @return {?}
     */
    undelegate : function(selector, types, fn) {
      return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    }
  });
  var iIdCounter = jQuery.now();
  /** @type {RegExp} */
  var rquery = /\?/;
  /** @type {RegExp} */
  var rSlash = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
  /**
   * @param {Object} data
   * @return {?}
   */
  jQuery.parseJSON = function(data) {
    if (win.JSON && win.JSON.parse) {
      return win.JSON.parse(data + "");
    }
    var result;
    /** @type {null} */
    var deferred = null;
    var s = jQuery.trim(data + "");
    return s && !jQuery.trim(s.replace(rSlash, function(promise, err2, err, dataAndEvents) {
      return result && (err2 && (deferred = 0)), 0 === deferred ? promise : (result = err || err2, deferred += !dataAndEvents - !err, "");
    })) ? Function("return " + s)() : jQuery.error("Invalid JSON: " + data);
  };
  /**
   * @param {string} data
   * @return {?}
   */
  jQuery.parseXML = function(data) {
    var xml;
    var tmp;
    if (!data || "string" != typeof data) {
      return null;
    }
    try {
      if (win.DOMParser) {
        /** @type {DOMParser} */
        tmp = new DOMParser;
        /** @type {(Document|null)} */
        xml = tmp.parseFromString(data, "text/xml");
      } else {
        xml = new ActiveXObject("Microsoft.XMLDOM");
        /** @type {string} */
        xml.async = "false";
        xml.loadXML(data);
      }
    } catch (e) {
      xml = void 0;
    }
    return xml && (xml.documentElement && !xml.getElementsByTagName("parsererror").length) || jQuery.error("Invalid XML: " + data), xml;
  };
  var prop;
  var ajaxLocation;
  /** @type {RegExp} */
  var currDirRegExp = /#.*$/;
  /** @type {RegExp} */
  var rts = /([?&])_=[^&]*/;
  /** @type {RegExp} */
  var re = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm;
  /** @type {RegExp} */
  var fnTest = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
  /** @type {RegExp} */
  var rnoContent = /^(?:GET|HEAD)$/;
  /** @type {RegExp} */
  var rprotocol = /^\/\//;
  /** @type {RegExp} */
  var quickExpr = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/;
  var prefilters = {};
  var transports = {};
  /** @type {string} */
  var Jb = "*/".concat("*");
  try {
    /** @type {string} */
    ajaxLocation = location.href;
  } catch (Kb) {
    ajaxLocation = doc.createElement("a");
    /** @type {string} */
    ajaxLocation.href = "";
    /** @type {string} */
    ajaxLocation = ajaxLocation.href;
  }
  /** @type {Array} */
  prop = quickExpr.exec(ajaxLocation.toLowerCase()) || [];
  jQuery.extend({
    active : 0,
    lastModified : {},
    etag : {},
    ajaxSettings : {
      url : ajaxLocation,
      type : "GET",
      isLocal : fnTest.test(prop[1]),
      global : true,
      processData : true,
      async : true,
      contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      accepts : {
        "*" : Jb,
        text : "text/plain",
        html : "text/html",
        xml : "application/xml, text/xml",
        json : "application/json, text/javascript"
      },
      contents : {
        xml : /xml/,
        html : /html/,
        json : /json/
      },
      responseFields : {
        xml : "responseXML",
        text : "responseText",
        json : "responseJSON"
      },
      converters : {
        /** @type {function (new:String, *=): string} */
        "* text" : String,
        "text html" : true,
        /** @type {function (Object): ?} */
        "text json" : jQuery.parseJSON,
        /** @type {function (string): ?} */
        "text xml" : jQuery.parseXML
      },
      flatOptions : {
        url : true,
        context : true
      }
    },
    /**
     * @param {(Object|string)} target
     * @param {Object} settings
     * @return {?}
     */
    ajaxSetup : function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter : addToPrefiltersOrTransports(prefilters),
    ajaxTransport : addToPrefiltersOrTransports(transports),
    /**
     * @param {Object} url
     * @param {Object} options
     * @return {?}
     */
    ajax : function(url, options) {
      /**
       * @param {number} status
       * @param {(number|string)} nativeStatusText
       * @param {Object} responses
       * @param {string} total
       * @return {undefined}
       */
      function done(status, nativeStatusText, responses, total) {
        var isSuccess;
        var success;
        var error;
        var response;
        var modified;
        /** @type {(number|string)} */
        var statusText = nativeStatusText;
        if (2 !== number) {
          /** @type {number} */
          number = 2;
          if (tref) {
            clearTimeout(tref);
          }
          transport = void 0;
          value = total || "";
          /** @type {number} */
          jqXHR.readyState = status > 0 ? 4 : 0;
          /** @type {boolean} */
          isSuccess = status >= 200 && 300 > status || 304 === status;
          if (responses) {
            response = ajaxHandleResponses(s, jqXHR, responses);
          }
          response = ajaxConvert(s, response, jqXHR, isSuccess);
          if (isSuccess) {
            if (s.ifModified) {
              modified = jqXHR.getResponseHeader("Last-Modified");
              if (modified) {
                jQuery.lastModified[cacheURL] = modified;
              }
              modified = jqXHR.getResponseHeader("etag");
              if (modified) {
                jQuery.etag[cacheURL] = modified;
              }
            }
            if (204 === status || "HEAD" === s.type) {
              /** @type {string} */
              statusText = "nocontent";
            } else {
              if (304 === status) {
                /** @type {string} */
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                /** @type {boolean} */
                isSuccess = !error;
              }
            }
          } else {
            error = statusText;
            if (status || !statusText) {
              /** @type {string} */
              statusText = "error";
              if (0 > status) {
                /** @type {number} */
                status = 0;
              }
            }
          }
          /** @type {number} */
          jqXHR.status = status;
          /** @type {string} */
          jqXHR.statusText = (nativeStatusText || statusText) + "";
          if (isSuccess) {
            deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
          } else {
            deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
          }
          jqXHR.statusCode(statusCode);
          statusCode = void 0;
          if (h) {
            globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
          }
          completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
          if (h) {
            globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
            if (!--jQuery.active) {
              jQuery.event.trigger("ajaxStop");
            }
          }
        }
      }
      if ("object" == typeof url) {
        /** @type {Object} */
        options = url;
        url = void 0;
      }
      options = options || {};
      var c;
      var i;
      var cacheURL;
      var value;
      var tref;
      var h;
      var transport;
      var target;
      var s = jQuery.ajaxSetup({}, options);
      var callbackContext = s.context || s;
      var globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event;
      var deferred = jQuery.Deferred();
      var completeDeferred = jQuery.Callbacks("once memory");
      var statusCode = s.statusCode || {};
      var requestHeaders = {};
      var requestHeadersNames = {};
      /** @type {number} */
      var number = 0;
      /** @type {string} */
      var strAbort = "canceled";
      var jqXHR = {
        readyState : 0,
        /**
         * @param {string} key
         * @return {?}
         */
        getResponseHeader : function(key) {
          var src;
          if (2 === number) {
            if (!target) {
              target = {};
              for (;src = re.exec(value);) {
                /** @type {string} */
                target[src[1].toLowerCase()] = src[2];
              }
            }
            src = target[key.toLowerCase()];
          }
          return null == src ? null : src;
        },
        /**
         * @return {?}
         */
        getAllResponseHeaders : function() {
          return 2 === number ? value : null;
        },
        /**
         * @param {string} name
         * @param {?} value
         * @return {?}
         */
        setRequestHeader : function(name, value) {
          var lname = name.toLowerCase();
          return number || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value), this;
        },
        /**
         * @param {(Object|number)} type
         * @return {?}
         */
        overrideMimeType : function(type) {
          return number || (s.mimeType = type), this;
        },
        /**
         * @param {Object} map
         * @return {?}
         */
        statusCode : function(map) {
          var letter;
          if (map) {
            if (2 > number) {
              for (letter in map) {
                /** @type {Array} */
                statusCode[letter] = [statusCode[letter], map[letter]];
              }
            } else {
              jqXHR.always(map[jqXHR.status]);
            }
          }
          return this;
        },
        /**
         * @param {string} statusText
         * @return {?}
         */
        abort : function(statusText) {
          var finalText = statusText || strAbort;
          return transport && transport.abort(finalText), done(0, finalText), this;
        }
      };
      if (deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, s.url = ((url || (s.url || ajaxLocation)) + "").replace(currDirRegExp, "").replace(rprotocol, prop[1] + "//"), s.type = options.method || (options.type || (s.method || s.type)), s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [""], null == s.crossDomain && (c = quickExpr.exec(s.url.toLowerCase()), s.crossDomain = !(!c || c[1] === prop[1] && (c[2] === 
      prop[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (prop[3] || ("http:" === prop[1] ? "80" : "443"))))), s.data && (s.processData && ("string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)))), inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === number) {
        return jqXHR;
      }
      h = jQuery.event && s.global;
      if (h) {
        if (0 === jQuery.active++) {
          jQuery.event.trigger("ajaxStart");
        }
      }
      s.type = s.type.toUpperCase();
      /** @type {boolean} */
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          /** @type {string} */
          cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + iIdCounter++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + iIdCounter++;
        }
      }
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }
      if (s.data && (s.hasContent && s.contentType !== false) || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + Jb + "; q=0.01" : "") : s.accepts["*"]);
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || 2 === number)) {
        return jqXHR.abort();
      }
      /** @type {string} */
      strAbort = "abort";
      for (i in{
        success : 1,
        error : 1,
        complete : 1
      }) {
        jqXHR[i](s[i]);
      }
      if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
        /** @type {number} */
        jqXHR.readyState = 1;
        if (h) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        }
        if (s.async) {
          if (s.timeout > 0) {
            /** @type {number} */
            tref = setTimeout(function() {
              jqXHR.abort("timeout");
            }, s.timeout);
          }
        }
        try {
          /** @type {number} */
          number = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (!(2 > number)) {
            throw e;
          }
          done(-1, e);
        }
      } else {
        done(-1, "No Transport");
      }
      return jqXHR;
    },
    /**
     * @param {Object} cur
     * @param {string} name
     * @param {string} callback
     * @return {?}
     */
    getJSON : function(cur, name, callback) {
      return jQuery.get(cur, name, callback, "json");
    },
    /**
     * @param {Object} cur
     * @param {string} callback
     * @return {?}
     */
    getScript : function(cur, callback) {
      return jQuery.get(cur, void 0, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function(dataAndEvents, method) {
    /**
     * @param {string} requestUrl
     * @param {Object} data
     * @param {Function} success
     * @param {(Object|string)} dataType
     * @return {?}
     */
    jQuery[method] = function(requestUrl, data, success, dataType) {
      return jQuery.isFunction(data) && (dataType = dataType || success, success = data, data = void 0), jQuery.ajax({
        url : requestUrl,
        type : method,
        dataType : dataType,
        data : data,
        /** @type {Function} */
        success : success
      });
    };
  });
  /**
   * @param {string} url
   * @return {?}
   */
  jQuery._evalUrl = function(url) {
    return jQuery.ajax({
      url : url,
      type : "GET",
      dataType : "script",
      async : false,
      global : false,
      "throws" : true
    });
  };
  jQuery.fn.extend({
    /**
     * @param {Function} html
     * @return {?}
     */
    wrapAll : function(html) {
      if (jQuery.isFunction(html)) {
        return this.each(function(i) {
          jQuery(this).wrapAll(html.call(this, i));
        });
      }
      if (this[0]) {
        var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function() {
          var sandbox = this;
          for (;sandbox.firstChild && 1 === sandbox.firstChild.nodeType;) {
            sandbox = sandbox.firstChild;
          }
          return sandbox;
        }).append(this);
      }
      return this;
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrapInner : function(html) {
      return this.each(jQuery.isFunction(html) ? function(i) {
        jQuery(this).wrapInner(html.call(this, i));
      } : function() {
        var self = jQuery(this);
        var contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrap : function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    /**
     * @return {?}
     */
    unwrap : function() {
      return this.parent().each(function() {
        if (!jQuery.nodeName(this, "body")) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    }
  });
  /**
   * @param {Object} a
   * @return {?}
   */
  jQuery.expr.filters.hidden = function(a) {
    return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !support.reliableHiddenOffsets() && "none" === (a.style && a.style.display || jQuery.css(a, "display"));
  };
  /**
   * @param {Object} QUnit
   * @return {?}
   */
  jQuery.expr.filters.visible = function(QUnit) {
    return!jQuery.expr.filters.hidden(QUnit);
  };
  /** @type {RegExp} */
  var rQuot = /%20/g;
  /** @type {RegExp} */
  var rmargin = /\[\]$/;
  /** @type {RegExp} */
  var rCRLF = /\r?\n/g;
  /** @type {RegExp} */
  var mouseTypeRegex = /^(?:submit|button|image|reset|file)$/i;
  /** @type {RegExp} */
  var rsubmittable = /^(?:input|select|textarea|keygen)/i;
  /**
   * @param {Object} a
   * @param {Object} traditional
   * @return {?}
   */
  jQuery.param = function(a, traditional) {
    var prefix;
    /** @type {Array} */
    var klass = [];
    /**
     * @param {?} key
     * @param {string} value
     * @return {undefined}
     */
    var add = function(key, value) {
      value = jQuery.isFunction(value) ? value() : null == value ? "" : value;
      /** @type {string} */
      klass[klass.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (void 0 === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      jQuery.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return klass.join("&").replace(rQuot, "+");
  };
  jQuery.fn.extend({
    /**
     * @return {?}
     */
    serialize : function() {
      return jQuery.param(this.serializeArray());
    },
    /**
     * @return {?}
     */
    serializeArray : function() {
      return this.map(function() {
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && (!jQuery(this).is(":disabled") && (rsubmittable.test(this.nodeName) && (!mouseTypeRegex.test(type) && (this.checked || !manipulation_rcheckableType.test(type)))));
      }).map(function(dataAndEvents, elem) {
        var val = jQuery(this).val();
        return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
          return{
            name : elem.name,
            value : val.replace(rCRLF, "\r\n")
          };
        }) : {
          name : elem.name,
          value : val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  /** @type {function (): ?} */
  jQuery.ajaxSettings.xhr = void 0 !== win.ActiveXObject ? function() {
    return!this.isLocal && (/^(get|post|head|put|delete|options)$/i.test(this.type) && createStandardXHR()) || createActiveXHR();
  } : createStandardXHR;
  /** @type {number} */
  var rafHandle = 0;
  var requests = {};
  var nativeXHR = jQuery.ajaxSettings.xhr();
  if (win.attachEvent) {
    win.attachEvent("onunload", function() {
      var i;
      for (i in requests) {
        requests[i](void 0, true);
      }
    });
  }
  /** @type {boolean} */
  support.cors = !!nativeXHR && "withCredentials" in nativeXHR;
  /** @type {boolean} */
  nativeXHR = support.ajax = !!nativeXHR;
  if (nativeXHR) {
    jQuery.ajaxTransport(function(s) {
      if (!s.crossDomain || support.cors) {
        var callback;
        return{
          /**
           * @param {Object} headers
           * @param {Function} complete
           * @return {undefined}
           */
          send : function(headers, complete) {
            var i;
            var xhr = s.xhr();
            /** @type {number} */
            var callbackHandle = ++rafHandle;
            if (xhr.open(s.type, s.url, s.async, s.username, s.password), s.xhrFields) {
              for (i in s.xhrFields) {
                xhr[i] = s.xhrFields[i];
              }
            }
            if (s.mimeType) {
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType(s.mimeType);
              }
            }
            if (!s.crossDomain) {
              if (!headers["X-Requested-With"]) {
                /** @type {string} */
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
            }
            for (i in headers) {
              if (void 0 !== headers[i]) {
                xhr.setRequestHeader(i, headers[i] + "");
              }
            }
            xhr.send(s.hasContent && s.data || null);
            /**
             * @param {?} opt_attributes
             * @param {boolean} isAbort
             * @return {undefined}
             */
            callback = function(opt_attributes, isAbort) {
              var e;
              var statusText;
              var responses;
              if (callback && (isAbort || 4 === xhr.readyState)) {
                if (delete requests[callbackHandle], callback = void 0, xhr.onreadystatechange = jQuery.noop, isAbort) {
                  if (4 !== xhr.readyState) {
                    xhr.abort();
                  }
                } else {
                  responses = {};
                  e = xhr.status;
                  if ("string" == typeof xhr.responseText) {
                    /** @type {string} */
                    responses.text = xhr.responseText;
                  }
                  try {
                    statusText = xhr.statusText;
                  } catch (k) {
                    /** @type {string} */
                    statusText = "";
                  }
                  if (e || (!s.isLocal || s.crossDomain)) {
                    if (1223 === e) {
                      /** @type {number} */
                      e = 204;
                    }
                  } else {
                    /** @type {number} */
                    e = responses.text ? 200 : 404;
                  }
                }
              }
              if (responses) {
                complete(e, statusText, responses, xhr.getAllResponseHeaders());
              }
            };
            if (s.async) {
              if (4 === xhr.readyState) {
                setTimeout(callback);
              } else {
                /** @type {function (?, boolean): undefined} */
                xhr.onreadystatechange = requests[callbackHandle] = callback;
              }
            } else {
              callback();
            }
          },
          /**
           * @return {undefined}
           */
          abort : function() {
            if (callback) {
              callback(void 0, true);
            }
          }
        };
      }
    });
  }
  jQuery.ajaxSetup({
    accepts : {
      script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents : {
      script : /(?:java|ecma)script/
    },
    converters : {
      /**
       * @param {?} value
       * @return {?}
       */
      "text script" : function(value) {
        return jQuery.globalEval(value), value;
      }
    }
  });
  jQuery.ajaxPrefilter("script", function(s) {
    if (void 0 === s.cache) {
      /** @type {boolean} */
      s.cache = false;
    }
    if (s.crossDomain) {
      /** @type {string} */
      s.type = "GET";
      /** @type {boolean} */
      s.global = false;
    }
  });
  jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script;
      var head = doc.head || (jQuery("head")[0] || doc.documentElement);
      return{
        /**
         * @param {?} _
         * @param {Function} callback
         * @return {undefined}
         */
        send : function(_, callback) {
          script = doc.createElement("script");
          /** @type {boolean} */
          script.async = true;
          if (s.scriptCharset) {
            script.charset = s.scriptCharset;
          }
          script.src = s.url;
          /** @type {function (?, boolean): undefined} */
          script.onload = script.onreadystatechange = function(evt, aEvt) {
            if (aEvt || (!script.readyState || /loaded|complete/.test(script.readyState))) {
              /** @type {null} */
              script.onload = script.onreadystatechange = null;
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
              /** @type {null} */
              script = null;
              if (!aEvt) {
                callback(200, "success");
              }
            }
          };
          head.insertBefore(script, head.firstChild);
        },
        /**
         * @return {undefined}
         */
        abort : function() {
          if (script) {
            script.onload(void 0, true);
          }
        }
      };
    }
  });
  /** @type {Array} */
  var eventPath = [];
  /** @type {RegExp} */
  var rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp : "callback",
    /**
     * @return {?}
     */
    jsonpCallback : function() {
      var unlock = eventPath.pop() || jQuery.expando + "_" + iIdCounter++;
      return this[unlock] = true, unlock;
    }
  });
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var name;
    var value;
    var args;
    /** @type {(boolean|string)} */
    var jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && (!(s.contentType || "").indexOf("application/x-www-form-urlencoded") && (rjsonp.test(s.data) && "data")));
    return jsonProp || "jsonp" === s.dataTypes[0] ? (name = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + name) : s.jsonp !== false && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + name), s.converters["script json"] = function() {
      return args || jQuery.error(name + " was not called"), args[0];
    }, s.dataTypes[0] = "json", value = win[name], win[name] = function() {
      /** @type {Arguments} */
      args = arguments;
    }, jqXHR.always(function() {
      win[name] = value;
      if (s[name]) {
        s.jsonpCallback = originalSettings.jsonpCallback;
        eventPath.push(name);
      }
      if (args) {
        if (jQuery.isFunction(value)) {
          value(args[0]);
        }
      }
      args = value = void 0;
    }), "script") : void 0;
  });
  /**
   * @param {?} data
   * @param {Object} context
   * @param {(Function|string)} keepScripts
   * @return {?}
   */
  jQuery.parseHTML = function(data, context, keepScripts) {
    if (!data || "string" != typeof data) {
      return null;
    }
    if ("boolean" == typeof context) {
      /** @type {Object} */
      keepScripts = context;
      /** @type {boolean} */
      context = false;
    }
    context = context || doc;
    /** @type {(Array.<string>|null)} */
    var parsed = rsingleTag.exec(data);
    /** @type {(Array|boolean)} */
    var scripts = !keepScripts && [];
    return parsed ? [context.createElement(parsed[1])] : (parsed = jQuery.buildFragment([data], context, scripts), scripts && (scripts.length && jQuery(scripts).remove()), jQuery.merge([], parsed.childNodes));
  };
  /** @type {function (string, Object, Object): ?} */
  var matcherFunction = jQuery.fn.load;
  /**
   * @param {string} url
   * @param {Object} data
   * @param {Object} attributes
   * @return {?}
   */
  jQuery.fn.load = function(url, data, attributes) {
    if ("string" != typeof url && matcherFunction) {
      return matcherFunction.apply(this, arguments);
    }
    var selector;
    var response;
    var type;
    var self = this;
    var off = url.indexOf(" ");
    return off >= 0 && (selector = jQuery.trim(url.slice(off, url.length)), url = url.slice(0, off)), jQuery.isFunction(data) ? (attributes = data, data = void 0) : data && ("object" == typeof data && (type = "POST")), self.length > 0 && jQuery.ajax({
      url : url,
      type : type,
      dataType : "html",
      data : data
    }).done(function(responseText) {
      /** @type {Arguments} */
      response = arguments;
      self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
    }).complete(attributes && function(a, value) {
      self.each(attributes, response || [a.responseText, value, a]);
    }), this;
  };
  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(dataAndEvents, name) {
    /**
     * @param {Object} selector
     * @return {?}
     */
    jQuery.fn[name] = function(selector) {
      return this.on(name, selector);
    };
  });
  /**
   * @param {undefined} elem
   * @return {?}
   */
  jQuery.expr.filters.animated = function(elem) {
    return jQuery.grep(jQuery.timers, function(fn) {
      return elem === fn.elem;
    }).length;
  };
  var docElem = win.document.documentElement;
  jQuery.offset = {
    /**
     * @param {Object} elem
     * @param {Object} options
     * @param {?} i
     * @return {undefined}
     */
    setOffset : function(elem, options, i) {
      var curPosition;
      var curLeft;
      var curCSSTop;
      var curTop;
      var curOffset;
      var curCSSLeft;
      var j;
      var position = jQuery.css(elem, "position");
      var curElem = jQuery(elem);
      var props = {};
      if ("static" === position) {
        /** @type {string} */
        elem.style.position = "relative";
      }
      curOffset = curElem.offset();
      curCSSTop = jQuery.css(elem, "top");
      curCSSLeft = jQuery.css(elem, "left");
      /** @type {boolean} */
      j = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1;
      if (j) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        /** @type {number} */
        curTop = parseFloat(curCSSTop) || 0;
        /** @type {number} */
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }
      if (null != options.top) {
        /** @type {number} */
        props.top = options.top - curOffset.top + curTop;
      }
      if (null != options.left) {
        /** @type {number} */
        props.left = options.left - curOffset.left + curLeft;
      }
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery.fn.extend({
    /**
     * @param {number} options
     * @return {?}
     */
    offset : function(options) {
      if (arguments.length) {
        return void 0 === options ? this : this.each(function(dataName) {
          jQuery.offset.setOffset(this, options, dataName);
        });
      }
      var doc;
      var win;
      var animation = {
        top : 0,
        left : 0
      };
      var b = this[0];
      var elem = b && b.ownerDocument;
      if (elem) {
        return doc = elem.documentElement, jQuery.contains(doc, b) ? (typeof b.getBoundingClientRect !== text && (animation = b.getBoundingClientRect()), win = getWindow(elem), {
          top : animation.top + (win.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
          left : animation.left + (win.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
        }) : animation;
      }
    },
    /**
     * @return {?}
     */
    position : function() {
      if (this[0]) {
        var offsetParent;
        var offset;
        var parentOffset = {
          top : 0,
          left : 0
        };
        var body = this[0];
        return "fixed" === jQuery.css(body, "position") ? offset = body.getBoundingClientRect() : (offsetParent = this.offsetParent(), offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true)), {
          top : offset.top - parentOffset.top - jQuery.css(body, "marginTop", true),
          left : offset.left - parentOffset.left - jQuery.css(body, "marginLeft", true)
        };
      }
    },
    /**
     * @return {?}
     */
    offsetParent : function() {
      return this.map(function() {
        var offsetParent = this.offsetParent || docElem;
        for (;offsetParent && (!jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position"));) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });
  jQuery.each({
    scrollLeft : "pageXOffset",
    scrollTop : "pageYOffset"
  }, function(name, prop) {
    /** @type {boolean} */
    var top = /Y/.test(prop);
    /**
     * @param {Function} isXML
     * @return {?}
     */
    jQuery.fn[name] = function(isXML) {
      return access(this, function(elem, method, val) {
        var win = getWindow(elem);
        return void 0 === val ? win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method] : void(win ? win.scrollTo(top ? jQuery(win).scrollLeft() : val, top ? val : jQuery(win).scrollTop()) : elem[method] = val);
      }, name, isXML, arguments.length, null);
    };
  });
  jQuery.each(["top", "left"], function(dataAndEvents, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, val) {
      return val ? (val = get(elem, prop), rnumnonpx.test(val) ? jQuery(elem).position()[prop] + "px" : val) : void 0;
    });
  });
  jQuery.each({
    Height : "height",
    Width : "width"
  }, function(type, value) {
    jQuery.each({
      padding : "inner" + type,
      content : value,
      "" : "outer" + type
    }, function(defaultExtra, original) {
      /**
       * @param {?} margin
       * @param {boolean} dataAndEvents
       * @return {?}
       */
      jQuery.fn[original] = function(margin, dataAndEvents) {
        var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin);
        var extra = defaultExtra || (margin === true || dataAndEvents === true ? "margin" : "border");
        return access(this, function(exports, pdataOld, name) {
          var doc;
          return jQuery.isWindow(exports) ? exports.document.documentElement["client" + type] : 9 === exports.nodeType ? (doc = exports.documentElement, Math.max(exports.body["scroll" + type], doc["scroll" + type], exports.body["offset" + type], doc["offset" + type], doc["client" + type])) : void 0 === name ? jQuery.css(exports, pdataOld, extra) : jQuery.style(exports, pdataOld, name, extra);
        }, value, chainable ? margin : void 0, chainable, null);
      };
    });
  });
  /**
   * @return {?}
   */
  jQuery.fn.size = function() {
    return this.length;
  };
  jQuery.fn.andSelf = jQuery.fn.addBack;
  if ("function" == typeof define) {
    if (define.amd) {
      define("jquery", [], function() {
        return jQuery;
      });
    }
  }
  var $ = win.jQuery;
  var _$ = win.$;
  return jQuery.noConflict = function(deep) {
    return win.$ === jQuery && (win.$ = _$), deep && (win.jQuery === jQuery && (win.jQuery = $)), jQuery;
  }, typeof dataAndEvents === text && (win.jQuery = win.$ = jQuery), jQuery;
});
!function(win, doc, url) {
  /**
   * @param {string} str
   * @return {?}
   */
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
  }
  /**
   * @return {undefined}
   */
  function initialize() {
    var time;
    /** @type {boolean} */
    elIsCancel = false;
    /** @type {number} */
    ratio = win.devicePixelRatio;
    internalValues = {};
    obj = {};
    /** @type {number} */
    time = (ratio || 1) * bounds.xQuant;
    if (!bounds.uT) {
      /** @type {number} */
      bounds.maxX = Math.max(1.3, bounds.maxX);
      /** @type {number} */
      time = Math.min(time, bounds.maxX);
      /** @type {number} */
      self.DPR = time;
    }
    /** @type {number} */
    info.width = Math.max(win.innerWidth || 0, testEl.clientWidth);
    /** @type {number} */
    info.height = Math.max(win.innerHeight || 0, testEl.clientHeight);
    /** @type {number} */
    info.vw = info.width / 100;
    /** @type {number} */
    info.vh = info.height / 100;
    info.em = self.getEmValue();
    info.rem = info.em;
    /** @type {number} */
    begin = bounds.lazyFactor / 2;
    /** @type {number} */
    begin = begin * time + begin;
    /** @type {number} */
    lineStart = 0.2 + 0.1 * time;
    /** @type {number} */
    maxX = 0.5 + 0.2 * time;
    /** @type {number} */
    m = 0.5 + 0.25 * time;
    /** @type {number} */
    lastTime = time + 1.3;
    if (!(n = info.width > info.height)) {
      begin *= 0.9;
    }
    if (ontype) {
      begin *= 0.9;
    }
    /** @type {string} */
    node = [info.width, info.height, time].join("-");
  }
  /**
   * @param {number} x
   * @param {number} callback
   * @param {(number|string)} y
   * @return {?}
   */
  function pow(x, callback, y) {
    /** @type {number} */
    var chunk = callback * Math.pow(x - 0.3, 1.9);
    return n || (chunk /= 1.3), x += chunk, x > y;
  }
  /**
   * @param {Object} v
   * @return {undefined}
   */
  function isDate(v) {
    var ids;
    var values = self.getSet(v);
    /** @type {boolean} */
    var r = false;
    if ("pending" != values) {
      r = node;
      if (values) {
        ids = self.setRes(values);
        r = self.applySetCandidate(ids, v);
      }
    }
    v[self.ns].evaled = r;
  }
  /**
   * @param {Object} res
   * @param {Object} msg
   * @return {?}
   */
  function cb(res, msg) {
    return res.res - msg.res;
  }
  /**
   * @param {Object} v
   * @param {Object} value
   * @param {(Array|string)} c
   * @return {?}
   */
  function set(v, value, c) {
    var res;
    return!c && (value && (c = v[self.ns].sets, c = c && c[c.length - 1])), res = equals(value, c), res && (value = self.makeUrl(value), v[self.ns].curSrc = value, v[self.ns].curCan = res, res.res || fn(res, res.set.sizes)), res;
  }
  /**
   * @param {Object} a
   * @param {string} b
   * @return {?}
   */
  function equals(a, b) {
    var i;
    var rst;
    var codeSegments;
    if (a && b) {
      codeSegments = self.parseSet(b);
      a = self.makeUrl(a);
      /** @type {number} */
      i = 0;
      for (;i < codeSegments.length;i++) {
        if (a == self.makeUrl(codeSegments[i].url)) {
          rst = codeSegments[i];
          break;
        }
      }
    }
    return rst;
  }
  /**
   * @param {Node} context
   * @param {Array} result
   * @return {undefined}
   */
  function next(context, result) {
    var _i;
    var _len;
    var element;
    var srcset;
    var all = context.getElementsByTagName("source");
    /** @type {number} */
    _i = 0;
    _len = all.length;
    for (;_len > _i;_i++) {
      element = all[_i];
      /** @type {boolean} */
      element[self.ns] = true;
      srcset = element.getAttribute("srcset");
      if (srcset) {
        result.push({
          srcset : srcset,
          media : element.getAttribute("media"),
          type : element.getAttribute("type"),
          sizes : element.getAttribute("sizes")
        });
      }
    }
  }
  doc.createElement("picture");
  var maxX;
  var m;
  var n;
  var begin;
  var lastTime;
  var lineStart;
  var ret;
  var src;
  var timeout;
  var node;
  var self = {};
  /**
   * @return {undefined}
   */
  var val = function() {
  };
  /** @type {Element} */
  var elem = doc.createElement("img");
  /** @type {function (this:Element, string, (null|number)=): string} */
  var parent = elem.getAttribute;
  /** @type {function (this:Element, string, (boolean|number|string)): undefined} */
  var Y = elem.setAttribute;
  /** @type {function (this:Element, string): undefined} */
  var options = elem.removeAttribute;
  /** @type {Element} */
  var testEl = doc.documentElement;
  var data = {};
  var bounds = {
    xQuant : 1,
    lazyFactor : 0.4,
    maxX : 2
  };
  /** @type {string} */
  var i = "data-risrc";
  /** @type {string} */
  var e = i + "set";
  /** @type {boolean} */
  var webkitBackfaceVisibility = "webkitBackfaceVisibility" in testEl.style;
  /** @type {string} */
  var ua = navigator.userAgent;
  /** @type {(boolean|null)} */
  var ontype = /rident/.test(ua) || /ecko/.test(ua) && (ua.match(/rv\:(\d+)/) && RegExp.$1 > 35);
  /** @type {string} */
  var attr = "currentSrc";
  /** @type {RegExp} */
  var stopParent = /\s+\+?\d+(e\d+)?w/;
  /** @type {RegExp} */
  var typePattern = /((?:\([^)]+\)(?:\s*and\s*|\s*or\s*|\s*not\s*)?)+)?\s*(.+)/;
  /** @type {RegExp} */
  var ru = /^([\+eE\d\.]+)(w|x)$/;
  /** @type {RegExp} */
  var rCurrLoc = /\s*\d+h\s*/;
  var rows = win.respimgCFG;
  /** @type {string} */
  var stylesString = ("https:" == location.protocol, "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)");
  /** @type {string} */
  var oldCSS = "font-size:100%!important;";
  /** @type {boolean} */
  var elIsCancel = true;
  var internalValues = {};
  var obj = {};
  /** @type {number} */
  var ratio = win.devicePixelRatio;
  var info = {
    px : 1,
    "in" : 96
  };
  /** @type {Element} */
  var element = doc.createElement("a");
  /** @type {boolean} */
  var btnIsLeft = false;
  /**
   * @param {HTMLElement} el
   * @param {string} eventName
   * @param {Function} fn
   * @param {boolean} capture
   * @return {undefined}
   */
  var addEvent = function(el, eventName, fn, capture) {
    if (el.addEventListener) {
      el.addEventListener(eventName, fn, capture || false);
    } else {
      if (el.attachEvent) {
        el.attachEvent("on" + eventName, fn);
      }
    }
  };
  /**
   * @param {Function} func
   * @return {?}
   */
  var bind = function(func) {
    var map = {};
    return function(c) {
      return c in map || (map[c] = func(c)), map[c];
    };
  };
  var MAP = function() {
    /** @type {RegExp} */
    var delegateEventSplitter = /^([\d\.]+)(em|vw|px)$/;
    /**
     * @return {?}
     */
    var appendModelPrefix = function() {
      /** @type {Arguments} */
      var args = arguments;
      /** @type {number} */
      var i = 0;
      var value = args[0];
      for (;++i in args;) {
        value = value.replace(args[i], args[++i]);
      }
      return value;
    };
    var compile = bind(function(line) {
      return "return " + appendModelPrefix((line || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi, "");
    });
    return function(key, requires) {
      var match;
      if (!(key in internalValues)) {
        if (internalValues[key] = false, requires && (match = key.match(delegateEventSplitter))) {
          /** @type {number} */
          internalValues[key] = match[1] * info[match[2]];
        } else {
          try {
            internalValues[key] = (new Function("e", compile(key)))(info);
          } catch (f) {
          }
        }
      }
      return internalValues[key];
    };
  }();
  /**
   * @param {Object} args
   * @param {string} event
   * @return {?}
   */
  var fn = function(args, event) {
    return args.w ? (args.cWidth = self.calcListLength(event || "100vw"), args.res = args.w / args.cWidth) : args.res = args.x, args;
  };
  /**
   * @param {Object} opts
   * @return {undefined}
   */
  var init = function(opts) {
    var scripts;
    var property;
    var _len;
    var options = opts || {};
    if (options.elements && (1 == options.elements.nodeType && ("IMG" == options.elements.nodeName.toUpperCase() ? options.elements = [options.elements] : (options.context = options.elements, options.elements = null))), options.reparse && (!options.reevaluate && (options.reevaluate = true, win.console && (console.warn && console.warn("reparse was renamed to reevaluate!")))), scripts = options.elements || self.qsa(options.context || doc, options.reevaluate || options.reselect ? self.sel : self.selShort), 
    _len = scripts.length) {
      self.setupRun(options);
      /** @type {boolean} */
      btnIsLeft = true;
      /** @type {number} */
      property = 0;
      for (;_len > property;property++) {
        self.fillImg(scripts[property], options);
      }
      self.teardownRun(options);
    }
  };
  var baseDifference = bind(function(classNames) {
    /** @type {Array} */
    var arr = [1, "x"];
    var requestUrl = trim(classNames || "");
    return requestUrl && (requestUrl = requestUrl.replace(rCurrLoc, ""), arr = requestUrl.match(ru) ? [1 * RegExp.$1, RegExp.$2] : false), arr;
  });
  if (!(attr in elem)) {
    /** @type {string} */
    attr = "src";
  }
  /** @type {boolean} */
  data["image/jpeg"] = true;
  /** @type {boolean} */
  data["image/gif"] = true;
  /** @type {boolean} */
  data["image/png"] = true;
  /** @type {boolean} */
  data["image/svg+xml"] = doc.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image", "1.1");
  /** @type {string} */
  self.ns = ("ri" + (new Date).getTime()).substr(0, 9);
  /** @type {boolean} */
  self.supSrcset = "srcset" in elem;
  /** @type {boolean} */
  self.supSizes = "sizes" in elem;
  /** @type {string} */
  self.selShort = "picture>img,img[srcset]";
  /** @type {string} */
  self.sel = self.selShort;
  self.cfg = bounds;
  if (self.supSrcset) {
    self.sel += ",img[" + e + "]";
  }
  self.DPR = ratio || 1;
  self.u = info;
  self.types = data;
  /** @type {boolean} */
  src = self.supSrcset && !self.supSizes;
  /** @type {function (): undefined} */
  self.setSize = val;
  self.makeUrl = bind(function(value) {
    return element.href = value, element.href;
  });
  /**
   * @param {HTMLElement} element
   * @param {string} selector
   * @return {?}
   */
  self.qsa = function(element, selector) {
    return element.querySelectorAll(selector);
  };
  /**
   * @return {?}
   */
  self.matchesMedia = function() {
    return self.matchesMedia = win.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches ? function(media) {
      return!media || matchMedia(media).matches;
    } : self.mMQ, self.matchesMedia.apply(this, arguments);
  };
  /**
   * @param {boolean} elements
   * @return {?}
   */
  self.mMQ = function(elements) {
    return elements ? MAP(elements) : true;
  };
  /**
   * @param {?} body
   * @return {?}
   */
  self.calcLength = function(body) {
    var t = MAP(body, true) || false;
    return 0 > t && (t = false), t;
  };
  /**
   * @param {boolean} name
   * @return {?}
   */
  self.supportsType = function(name) {
    return name ? data[name] : true;
  };
  self.parseSize = bind(function(value) {
    var units = (value || "").match(typePattern);
    return{
      media : units && units[1],
      length : units && units[2]
    };
  });
  /**
   * @param {Function} options
   * @return {?}
   */
  self.parseSet = function(options) {
    if (!options.cands) {
      var spaceIdx;
      var output;
      var props;
      var currentHash;
      var nextSpaceIdx;
      var css;
      var message = options.srcset;
      /** @type {Array} */
      options.cands = [];
      for (;message;) {
        message = message.replace(/^\s+/g, "");
        spaceIdx = message.search(/\s/g);
        /** @type {null} */
        props = null;
        if (-1 != spaceIdx) {
          output = message.slice(0, spaceIdx);
          currentHash = output.charAt(output.length - 1);
          if (!("," != currentHash && output)) {
            output = output.replace(/,+$/, "");
            /** @type {string} */
            props = "";
          }
          message = message.slice(spaceIdx + 1);
          if (null == props) {
            nextSpaceIdx = message.indexOf(",");
            if (-1 != nextSpaceIdx) {
              props = message.slice(0, nextSpaceIdx);
              message = message.slice(nextSpaceIdx + 1);
            } else {
              props = message;
              /** @type {string} */
              message = "";
            }
          }
        } else {
          output = message;
          /** @type {string} */
          message = "";
        }
        if (output) {
          if (props = baseDifference(props)) {
            css = {
              url : output.replace(/^,+/, ""),
              /** @type {Function} */
              set : options
            };
            css[props[1]] = props[0];
            if ("x" == props[1]) {
              if (1 == props[0]) {
                /** @type {boolean} */
                options.has1x = true;
              }
            }
            options.cands.push(css);
          }
        }
      }
    }
    return options.cands;
  };
  /**
   * @return {?}
   */
  self.getEmValue = function() {
    var html;
    if (!ret && (html = doc.body)) {
      /** @type {Element} */
      var div = doc.createElement("div");
      /** @type {string} */
      var _beforeStyle = testEl.style.cssText;
      /** @type {string} */
      var oldCssText = html.style.cssText;
      /** @type {string} */
      div.style.cssText = stylesString;
      /** @type {string} */
      testEl.style.cssText = oldCSS;
      /** @type {string} */
      html.style.cssText = oldCSS;
      html.appendChild(div);
      ret = div.offsetWidth;
      html.removeChild(div);
      /** @type {number} */
      ret = parseFloat(ret, 10);
      /** @type {string} */
      testEl.style.cssText = _beforeStyle;
      /** @type {string} */
      html.style.cssText = oldCssText;
    }
    return ret || 16;
  };
  /**
   * @param {string} key
   * @return {?}
   */
  self.calcListLength = function(key) {
    if (!(key in obj) || bounds.uT) {
      var property;
      var s;
      var b;
      var media;
      var i;
      var len;
      var rawParams = trim(key).split(/\s*,\s*/);
      /** @type {boolean} */
      var value = false;
      /** @type {number} */
      i = 0;
      len = rawParams.length;
      for (;len > i && (property = rawParams[i], s = self.parseSize(property), b = s.length, media = s.media, !b || (!self.matchesMedia(media) || (value = self.calcLength(b)) === false));i++) {
      }
      obj[key] = value ? value : info.width;
    }
    return obj[key];
  };
  /**
   * @param {Function} options
   * @return {?}
   */
  self.setRes = function(options) {
    var context;
    if (options) {
      context = self.parseSet(options);
      /** @type {number} */
      var i = 0;
      var j = context.length;
      for (;j > i;i++) {
        fn(context[i], options.sizes);
      }
    }
    return context;
  };
  /** @type {function (Object, string): ?} */
  self.setRes.res = fn;
  /**
   * @param {Array} list
   * @param {Object} el
   * @return {?}
   */
  self.applySetCandidate = function(list, el) {
    if (list.length) {
      var ev;
      var y;
      var _i;
      var i;
      var restoreScript;
      var pos;
      var data;
      var udataCur;
      var that;
      var currentSection;
      var id;
      var handle;
      var x;
      var attributes = el[self.ns];
      var current = node;
      var tmp = begin;
      var j = lineStart;
      if (udataCur = attributes.curSrc || el[attr], that = attributes.curCan || set(el, udataCur, list[0].set), y = self.DPR, x = that && that.res, !data && (udataCur && (handle = ontype && (!el.complete && (that && x > y)), handle || (that && !(lastTime > x) || (that && (y > x && (x > maxX && (m > x && (tmp *= 0.87, j += 0.04 * y), that.res += tmp * Math.pow(x - j, 2)))), currentSection = !attributes.pic || that && that.set == list[0].set, that && (currentSection && (that.res >= y && (data = that))))))), 
      !data) {
        if (x) {
          /** @type {number} */
          that.res = that.res - (that.res - x) / 2;
        }
        list.sort(cb);
        pos = list.length;
        data = list[pos - 1];
        /** @type {number} */
        _i = 0;
        for (;pos > _i;_i++) {
          if (ev = list[_i], ev.res >= y) {
            /** @type {number} */
            i = _i - 1;
            data = list[i] && ((restoreScript = ev.res - y) && ((handle || udataCur != self.makeUrl(ev.url)) && pow(list[i].res, restoreScript, y))) ? list[i] : ev;
            break;
          }
        }
      }
      return x && (that.res = x), data && (id = self.makeUrl(data.url), attributes.curSrc = id, attributes.curCan = data, id != udataCur && self.setSrc(el, data), self.setSize(el)), current;
    }
  };
  /**
   * @param {Object} el
   * @param {Object} data
   * @return {undefined}
   */
  self.setSrc = function(el, data) {
    var zoom;
    el.src = data.url;
    if (webkitBackfaceVisibility) {
      zoom = el.style.zoom;
      /** @type {string} */
      el.style.zoom = "0.999";
      el.style.zoom = zoom;
    }
  };
  /**
   * @param {Object} v
   * @return {?}
   */
  self.getSet = function(v) {
    var i;
    var options;
    var o;
    /** @type {boolean} */
    var fn = false;
    var codeSegments = v[self.ns].sets;
    /** @type {number} */
    i = 0;
    for (;i < codeSegments.length && !fn;i++) {
      if (options = codeSegments[i], options.srcset && (self.matchesMedia(options.media) && (o = self.supportsType(options.type)))) {
        if ("pending" == o) {
          options = o;
        }
        fn = options;
        break;
      }
    }
    return fn;
  };
  /**
   * @param {Object} item
   * @param {Node} elem
   * @param {Element} pane
   * @return {undefined}
   */
  self.parseSets = function(item, elem, pane) {
    var id;
    var last;
    var destroying;
    var h;
    /** @type {boolean} */
    var waiting = "PICTURE" == elem.nodeName.toUpperCase();
    var data = item[self.ns];
    if (data.src === url || pane.src) {
      /** @type {string} */
      data.src = parent.call(item, "src");
      if (data.src) {
        Y.call(item, i, data.src);
      } else {
        options.call(item, i);
      }
    }
    if (data.srcset === url || (!self.supSrcset || (item.srcset || pane.srcset))) {
      /** @type {string} */
      id = parent.call(item, "srcset");
      /** @type {string} */
      data.srcset = id;
      /** @type {boolean} */
      h = true;
    }
    /** @type {Array} */
    data.sets = [];
    if (waiting) {
      /** @type {boolean} */
      data.pic = true;
      next(elem, data.sets);
    }
    if (data.srcset) {
      last = {
        srcset : data.srcset,
        sizes : parent.call(item, "sizes")
      };
      data.sets.push(last);
      destroying = (src || data.src) && stopParent.test(data.srcset || "");
      if (!destroying) {
        if (!!data.src) {
          if (!equals(data.src, last)) {
            if (!last.has1x) {
              last.srcset += ", " + data.src;
              last.cands.push({
                url : data.src,
                x : 1,
                set : last
              });
            }
          }
        }
      }
    } else {
      if (data.src) {
        data.sets.push({
          srcset : data.src,
          sizes : null
        });
      }
    }
    /** @type {null} */
    data.curCan = null;
    /** @type {string} */
    data.curSrc = url;
    /** @type {boolean} */
    data.supported = !(waiting || (last && !self.supSrcset || destroying));
    if (h) {
      if (self.supSrcset) {
        if (!data.supported) {
          if (id) {
            Y.call(item, e, id);
            /** @type {string} */
            item.srcset = "";
          } else {
            options.call(item, e);
          }
        }
      }
    }
    if (data.supported) {
      if (!data.srcset) {
        if (!data.src && item.src || item.src != self.makeUrl(data.src)) {
          if (null == data.src) {
            item.removeAttribute("src");
          } else {
            item.src = data.src;
          }
        }
      }
    }
    /** @type {boolean} */
    data.parsed = true;
  };
  /**
   * @param {Object} v
   * @param {Element} scope
   * @return {undefined}
   */
  self.fillImg = function(v, scope) {
    var p;
    var a;
    var e = scope.reselect || scope.reevaluate;
    if (v[self.ns] || (v[self.ns] = {}), a = v[self.ns], e || a.evaled != node) {
      if (!a.parsed || scope.reevaluate) {
        if (p = v.parentNode, !p) {
          return;
        }
        self.parseSets(v, p, scope);
      }
      if (a.supported) {
        a.evaled = node;
      } else {
        isDate(v);
      }
    }
  };
  /**
   * @param {Object} selector
   * @return {undefined}
   */
  self.setupRun = function(selector) {
    if (!btnIsLeft || (elIsCancel || ratio != win.devicePixelRatio)) {
      initialize();
      if (!selector.elements) {
        if (!selector.context) {
          clearTimeout(timeout);
        }
      }
    }
  };
  if (win.HTMLPictureElement) {
    /** @type {function (): undefined} */
    init = val;
    /** @type {function (): undefined} */
    self.fillImg = val;
  } else {
    !function() {
      var passed;
      /** @type {RegExp} */
      var rchecked = win.attachEvent ? /d$|^c/ : /d$|^c|^i/;
      /**
       * @return {undefined}
       */
      var load = function() {
        /** @type {string} */
        var value = doc.readyState || "";
        /** @type {number} */
        to = setTimeout(load, "loading" == value ? 200 : 999);
        if (doc.body) {
          passed = passed || rchecked.test(value);
          self.fillImgs();
          if (passed) {
            clearTimeout(to);
          }
        }
      };
      /**
       * @return {undefined}
       */
      var later = function() {
        self.fillImgs();
      };
      /**
       * @return {undefined}
       */
      var mousedown = function() {
        clearTimeout(timeout);
        /** @type {boolean} */
        elIsCancel = true;
        /** @type {number} */
        timeout = setTimeout(later, 99);
      };
      /** @type {number} */
      var to = setTimeout(load, doc.body ? 9 : 99);
      addEvent(win, "resize", mousedown);
      addEvent(doc, "readystatechange", load);
    }();
  }
  /** @type {function (Object): undefined} */
  self.respimage = init;
  /** @type {function (Object): undefined} */
  self.fillImgs = init;
  /** @type {function (): undefined} */
  self.teardownRun = val;
  init._ = self;
  /** @type {function (Object): undefined} */
  win.respimage = init;
  win.respimgCFG = {
    ri : self,
    /**
     * @param {?} name
     * @return {undefined}
     */
    push : function(name) {
      var i = name.shift();
      if ("function" == typeof self[i]) {
        self[i].apply(self, name);
      } else {
        bounds[i] = name[0];
        if (btnIsLeft) {
          self.fillImgs({
            reselect : true
          });
        }
      }
    }
  };
  for (;rows && rows.length;) {
    win.respimgCFG.push(rows.shift());
  }
}(window, document);
