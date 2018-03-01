(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SGN = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var microevent = createCommonjsModule(function (module) {
/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 * 
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent	= function(){};
MicroEvent.prototype	= {
	bind	: function(event, fct){
		this._events = this._events || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	unbind	: function(event, fct){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger	: function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
};

// export in common js
if( 'object' !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent;
}
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Config,
    MicroEvent,
    indexOf = [].indexOf;

MicroEvent = microevent;

Config = Config = function () {
  var Config = function () {
    function Config() {
      classCallCheck(this, Config);

      this.attrs = {};
      return;
    }

    createClass(Config, [{
      key: 'set',
      value: function set$$1() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var changedAttributes, key, value;
        changedAttributes = {};
        for (key in config) {
          value = config[key];
          if (indexOf.call(this.keys, key) >= 0) {
            this.attrs[key] = value;
            changedAttributes[key] = value;
          }
        }
        this.trigger('change', changedAttributes);
      }
    }, {
      key: 'get',
      value: function get$$1(option) {
        return this.attrs[option];
      }
    }]);
    return Config;
  }();

  Config.prototype.keys = ['appVersion', 'appKey', 'appSecret', 'authToken', 'eventTracker', 'locale', 'coreSessionToken', 'coreSessionClientId', 'coreUrl', 'graphUrl', 'eventsTrackUrl', 'eventsPulseUrl', 'assetsFileUploadUrl'];

  return Config;
}.call(commonjsGlobal);

MicroEvent.mixin(Config);

var config = Config;

var mustache = createCommonjsModule(function (module, exports) {
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if ('object' === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof undefined === 'function' && undefined.amd) {
    undefined(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(commonjsGlobal, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.3.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));
});

var Mustache, pairs;

Mustache = mustache;

pairs = {
  'paged_publication.hotspot_picker.header': 'Which offer did you mean?',
  'incito_publication.product_picker.header': 'Which product?'
};

var translations = {
  t: function t(key, view) {
    var ref, template;
    template = (ref = pairs[key]) != null ? ref : '';
    return Mustache.render(template, view);
  },
  update: function update(translations) {
    var key, value;
    for (key in translations) {
      value = translations[key];
      pairs[key] = value;
    }
  }
};

var browser = createCommonjsModule(function (module) {
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
} ());
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

process.listeners = function (name) { return [] };

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };
});

var process, util;

process = browser;

util = {
  isBrowser: function isBrowser() {
    return typeof process !== 'undefined' && process.browser;
  },
  isNode: function isNode() {
    return !util.isBrowser();
  },
  error: function error(err, options) {
    var key, value;
    err.message = err.message || null;
    if (typeof options === 'string') {
      err.message = options;
    } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options != null) {
      for (key in options) {
        value = options[key];
        err[key] = value;
      }
      if (options.message != null) {
        err.message = options.message;
      }
      if (options.code != null || options.message != null) {
        err.code = options.code || options.name;
      }
      if (options.stack != null) {
        err.stack = options.stack;
      }
    }
    err.name = options && options.name || err.name || err.code || 'Error';
    err.time = new Date();
    return err;
  },
  uuid: function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  },
  getQueryParam: function getQueryParam(field, url) {
    var href, reg, string;
    href = url ? url : window.location.href;
    reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    string = reg.exec(href);
    if (string) {
      return string[1];
    } else {
      return void 0;
    }
  },
  formatQueryParams: function formatQueryParams() {
    var queryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return Object.keys(queryParams).map(function (key) {
      return key + '=' + encodeURIComponent(queryParams[key]);
    }).join('&');
  },
  getRandomNumberBetween: function getRandomNumberBetween(from, to) {
    return Math.floor(Math.random() * to) + from;
  },
  getOS: function getOS() {
    var name, ua;
    name = null;
    ua = window.navigator.userAgent;
    if (ua.indexOf('Windows') > -1) {
      name = 'Windows';
    } else if (ua.indexOf('Mac') > -1) {
      name = 'macOS';
    } else if (ua.indexOf('X11') > -1) {
      name = 'unix';
    } else if (ua.indexOf('Linux') > -1) {
      name = 'Linux';
    } else if (ua.indexOf('iOS') > -1) {
      name = 'iOS';
    } else if (ua.indexOf('Android') > -1) {
      name = 'Android';
    }
    return name;
  },
  getDeviceCategory: function getDeviceCategory() {
    var deviceCategory;
    deviceCategory = 'desktop';
    if (navigator.platform === 'iPod' || navigator.platform === 'iPhone') {
      deviceCategory = 'mobile';
    } else if (navigator.platform === 'iPad') {
      deviceCategory = 'tablet';
    } else if (navigator.platform === 'Android' || /android/gi.test(navigator.userAgent)) {
      if (/tablet/gi.test(navigator.userAgent)) {
        deviceCategory = 'tablet';
      } else {
        deviceCategory = 'mobile';
      }
    }
    return deviceCategory;
  },
  getPointer: function getPointer() {
    var pointer;
    pointer = 'fine';
    if (matchMedia('(pointer:coarse)').matches) {
      pointer = 'coarse';
    }
    return pointer;
  },
  getOrientation: function getOrientation(width, height) {
    if (width === height) {
      return 'quadratic';
    } else if (width > height) {
      return 'horizontal';
    } else {
      return 'vertical';
    }
  },
  getScreenDimensions: function getScreenDimensions() {
    var density, logical, physical, ref;
    density = (ref = window.devicePixelRatio) != null ? ref : 1;
    logical = {
      width: window.screen.width,
      height: window.screen.height
    };
    physical = {
      width: Math.round(logical.width * density),
      height: Math.round(logical.height * density)
    };
    return {
      density: density,
      logical: logical,
      physical: physical
    };
  },
  getUtcOffsetSeconds: function getUtcOffsetSeconds() {
    var jan1, jan2, now, stdTimeOffset, tmp;
    now = new Date();
    jan1 = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    tmp = jan1.toGMTString();
    jan2 = new Date(tmp.substring(0, tmp.lastIndexOf(' ') - 1));
    stdTimeOffset = (jan1 - jan2) / 1000;
    return stdTimeOffset;
  },
  getUtcDstOffsetSeconds: function getUtcDstOffsetSeconds() {
    return new Date().getTimezoneOffset() * 60 * -1;
  },
  getColorBrightness: function getColorBrightness(color) {
    var hex, rgb, s, sum, x;
    color = color.replace('#', '');
    hex = parseInt((hex + '').replace(/[^a-f0-9]/gi, ''), 16);
    rgb = [];
    sum = 0;
    x = 0;
    while (x < 3) {
      s = parseInt(color.substring(2 * x, 2), 16);
      rgb[x] = s;
      if (s > 0) {
        sum += s;
      }
      ++x;
    }
    if (sum <= 381) {
      return 'dark';
    } else {
      return 'light';
    }
  },
  btoa: function (_btoa) {
    function btoa(_x2) {
      return _btoa.apply(this, arguments);
    }

    btoa.toString = function () {
      return _btoa.toString();
    };

    return btoa;
  }(function (str) {
    var buffer;
    if (util.isBrowser()) {
      return btoa(str);
    } else {
      buffer = null;
      if (str instanceof Buffer) {
        buffer = str;
      } else {
        buffer = new Buffer(str.toString(), 'binary');
      }
      return buffer.toString('base64');
    }
  }),
  find: function find(arr, fn) {
    var item, j, len;
    for (j = 0, len = arr.length; j < len; j++) {
      item = arr[j];
      if (fn(item) === true) {
        return item;
      }
    }
  },
  chunk: function chunk(arr, size) {
    var results;
    results = [];
    while (arr.length) {
      results.push(arr.splice(0, size));
    }
    return results;
  },
  throttle: function throttle(fn) {
    var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
    var scope = arguments[2];

    var deferTimer, last;
    last = void 0;
    deferTimer = void 0;
    return function () {
      var args, context, now;
      context = scope || this;
      now = new Date().getTime();
      args = arguments;
      if (last && now < last + threshold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  },
  loadImage: function loadImage(src, callback) {
    var img;
    img = new Image();
    img.onload = function () {
      return callback(null, img.width, img.height);
    };
    img.onerror = function () {
      return callback(new Error());
    };
    img.src = src;
    return img;
  },
  distance: function distance(lat1, lng1, lat2, lng2) {
    var dist, radlat1, radlat2, radtheta, theta;
    radlat1 = Math.PI * lat1 / 180;
    radlat2 = Math.PI * lat2 / 180;
    theta = lng1 - lng2;
    radtheta = Math.PI * theta / 180;
    dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344 * 1000;
    return dist;
  },
  async: {
    parallel: function parallel(asyncCalls, sharedCallback) {
      var allResults, counter, k, makeCallback;
      counter = asyncCalls.length;
      allResults = [];
      k = 0;
      makeCallback = function makeCallback(index) {
        return function () {
          var i, results;
          results = [];
          i = 0;
          counter--;
          while (i < arguments.length) {
            results.push(arguments[i]);
            i++;
          }
          allResults[index] = results;
          if (counter === 0) {
            sharedCallback(allResults);
          }
        };
      };
      while (k < asyncCalls.length) {
        asyncCalls[k](makeCallback(k));
        k++;
      }
    }
  }
};

var util_1 = util;

var Config$1, config$1, translations$1, util$1;

Config$1 = config;

translations$1 = translations;

util$1 = util_1;

config$1 = new Config$1();

// Set default values.
config$1.set({
  locale: 'en_US',
  coreUrl: 'https://api.etilbudsavis.dk',
  graphUrl: 'https://graph.service.shopgun.com',
  eventsTrackUrl: 'https://events.service.shopgun.com/track',
  eventsPulseUrl: 'wss://events.service.shopgun.com/pulse',
  assetsFileUploadUrl: 'https://assets.service.shopgun.com/upload'
});

var core = {
  config: config$1,
  translations: translations$1,
  util: util$1
};

var sgn = core;

var prefixKey;

prefixKey = 'sgn-';

var clientLocal = {
  key: 'sgn-',
  storage: function () {
    var storage;
    try {
      storage = window.localStorage;
      storage[prefixKey + 'test-storage'] = 'foobar';
      delete storage[prefixKey + 'test-storage'];
      return storage;
    } catch (error) {
      return {};
    }
  }(),
  get: function get(key) {
    try {
      return JSON.parse(this.storage['' + prefixKey + key]);
    } catch (error) {}
  },
  set: function set(key, value) {
    try {
      this.storage['' + prefixKey + key] = JSON.stringify(value);
    } catch (error) {}
    return this;
  }
};

var prefixKey$1;

prefixKey$1 = 'sgn-';

var clientSession = {
  key: 'sgn-',
  storage: function () {
    var storage;
    try {
      storage = window.sessionStorage;
      storage[prefixKey$1 + 'test-storage'] = 'foobar';
      delete storage[prefixKey$1 + 'test-storage'];
      return storage;
    } catch (error) {
      return {};
    }
  }(),
  get: function get(key) {
    try {
      return JSON.parse(this.storage['' + prefixKey$1 + key]);
    } catch (error) {}
  },
  set: function set(key, value) {
    try {
      this.storage['' + prefixKey$1 + key] = JSON.stringify(value);
    } catch (error) {}
    return this;
  }
};

var SGN$3, prefixKey$2;

SGN$3 = sgn;

prefixKey$2 = 'sgn-';

var clientCookie = {
  get: function get(key) {
    var c, ca, ct, i, len, name, value;
    if (SGN$3.util.isNode()) {
      return;
    }
    try {
      name = '' + prefixKey$2 + key + '=';
      ca = document.cookie.split(';');
      for (i = 0, len = ca.length; i < len; i++) {
        c = ca[i];
        ct = c.trim();
        if (ct.indexOf(name) === 0) {
          value = ct.substring(name.length, ct.length);
        }
      }
      value = JSON.parse(value);
    } catch (error) {
      value = {};
    }
    return value;
  },
  set: function set(key, value) {
    var date, days, str;
    if (SGN$3.util.isNode()) {
      return;
    }
    try {
      days = 365;
      date = new Date();
      str = JSON.stringify(value);
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = '' + prefixKey$2 + key + '=' + str + ';expires=' + date.toUTCString() + ';path=/';
    } catch (error) {
    }
  }
};

var SGN$4;

SGN$4 = sgn;

var browser$1 = function browser() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];
  var progressCallback = arguments[2];

  var formData, header, headers, http, key, method, queryParams, ref, ref1, ref2, ref3, url, value;
  http = new XMLHttpRequest();
  method = (ref = options.method) != null ? ref : 'get';
  url = options.url;
  headers = (ref1 = options.headers) != null ? ref1 : {};
  if (options.qs != null) {
    queryParams = SGN$4.util.formatQueryParams(options.qs);
    if (url.indexOf('?') === -1) {
      url += '?' + queryParams;
    } else {
      url += '&' + queryParams;
    }
  }
  http.open(method.toUpperCase(), url);
  if (options.timeout != null) {
    http.timeout = options.timeout;
  }
  if (options.useCookies === true) {
    http.withCredentials = true;
  }
  if (options.json === true) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  ref2 = options.headers;
  for (header in ref2) {
    value = ref2[header];
    if (value != null) {
      http.setRequestHeader(header, value);
    }
  }
  http.addEventListener('load', function () {
    var body;
    headers = http.getAllResponseHeaders().split('\r\n');
    headers = headers.reduce(function (acc, current, i) {
      var parts;
      parts = current.split(': ');
      acc[parts[0].toLowerCase()] = parts[1];
      return acc;
    }, {});
    body = http.responseText;
    if (options.json === true) {
      body = JSON.parse(body);
    }
    callback(null, {
      statusCode: http.status,
      headers: headers,
      body: body
    });
  });
  http.addEventListener('error', function () {
    callback(new Error());
  });
  http.addEventListener('timeout', function () {
    callback(new Error());
  });
  http.addEventListener('progress', function (e) {
    if (e.lengthComputable && typeof progressCallback === 'function') {
      progressCallback(e.loaded, e.total);
    }
  });
  if (options.formData != null) {
    formData = new FormData();
    ref3 = options.formData;
    for (key in ref3) {
      value = ref3[key];
      formData.append(key, value);
    }
    http.send(formData);
  } else if (options.body != null) {
    if (options.json === true) {
      http.send(JSON.stringify(options.body));
    } else {
      http.send(options.body);
    }
  } else {
    http.send();
  }
};

var SGN$5;

SGN$5 = sgn;

var fileUpload = function fileUpload() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];
  var progressCallback = arguments[2];

  var timeout, url;
  if (options.file == null) {
    throw new Error('File is not defined');
  }
  url = SGN$5.config.get('assetsFileUploadUrl');
  timeout = 1000 * 60 * 60;
  SGN$5.request({
    method: 'post',
    url: url,
    headers: {
      'Accept': 'application/json'
    },
    formData: {
      file: options.file
    },
    timeout: timeout
  }, function (err, data) {
    if (err != null) {
      callback(SGN$5.util.error(new Error('Request error'), {
        code: 'RequestError'
      }));
    } else {
      if (data.statusCode === 200) {
        callback(null, JSON.parse(data.body));
      } else {
        callback(SGN$5.util.error(new Error('Request error'), {
          code: 'RequestError',
          statusCode: data.statusCode
        }));
      }
    }
  }, function (loaded, total) {
    if (typeof progressCallback === 'function') {
      progressCallback({
        progress: loaded / total,
        loaded: loaded,
        total: total
      });
    }
  });
};

var assets = {
  fileUpload: fileUpload
};

var SGN$6, Tracker, clientLocalStorage, getPool, pool;

SGN$6 = sgn;

clientLocalStorage = clientLocal;

getPool = function getPool() {
  var data;
  data = clientLocalStorage.get('event-tracker-pool');
  if (Array.isArray(data) === false) {
    data = [];
  }
  return data;
};

pool = getPool();

clientLocalStorage.set('event-tracker-pool', []);

try {
  window.addEventListener('unload', function () {
    pool = pool.concat(getPool());
    clientLocalStorage.set('event-tracker-pool', pool);
  }, false);
} catch (error) {}

var tracker = Tracker = function () {
  var Tracker = function () {
    function Tracker() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, Tracker);

      var key, ref, value;
      ref = this.defaultOptions;
      for (key in ref) {
        value = ref[key];
        this[key] = options[key] || value;
      }
      this.dispatching = false;
      this.session = {
        id: SGN$6.util.uuid()
      };
      this.client = {
        trackId: this.trackId,
        id: SGN$6.client.id
      };
      this.view = {
        path: [],
        previousPath: [],
        uri: null
      };
      this.location = {};
      this.application = {};
      this.identity = {};
      // Dispatch events periodically.
      this.interval = setInterval(this.dispatch.bind(this), this.dispatchInterval);
      return;
    }

    createClass(Tracker, [{
      key: 'trackEvent',
      value: function trackEvent(type) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1.0.0';

        if (typeof type !== 'string') {
          throw SGN$6.util.error(new Error('Event type is required'));
        }
        if (this.trackId == null) {
          return;
        }
        pool.push({
          id: SGN$6.util.uuid(),
          type: type,
          version: version,
          recordedAt: new Date().toISOString(),
          sentAt: null,
          client: {
            id: this.client.id,
            trackId: this.client.trackId
          },
          context: this.getContext(),
          properties: properties
        });
        while (this.getPoolSize() > this.poolLimit) {
          pool.shift();
        }
        return this;
      }
    }, {
      key: 'identify',
      value: function identify(id) {
        this.identity.id = id;
        return this;
      }
    }, {
      key: 'setLocation',
      value: function setLocation() {
        var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var ref, ref1;
        this.location.determinedAt = new Date(location.timestamp).toISOString();
        this.location.latitude = location.latitude;
        this.location.longitude = location.longitude;
        this.location.altitude = location.altitude;
        this.location.accuracy = {
          horizontal: (ref = location.accuracy) != null ? ref.horizontal : void 0,
          vertical: (ref1 = location.accuracy) != null ? ref1.vertical : void 0
        };
        this.location.speed = location.speed;
        this.location.floor = location.floor;
        return this;
      }
    }, {
      key: 'setApplication',
      value: function setApplication() {
        var application = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.application.name = application.name;
        this.application.version = application.version;
        this.application.build = application.build;
        return this;
      }
    }, {
      key: 'setView',
      value: function setView(path) {
        this.view.previousPath = this.view.path;
        if (Array.isArray(path) === true) {
          this.view.path = path;
        }
        this.view.uri = window.location.href;
        return this;
      }
    }, {
      key: 'getView',
      value: function getView() {
        var view;
        view = {};
        if (this.view.path.length > 0) {
          view.path = this.view.path;
        }
        if (this.view.previousPath.length > 0) {
          view.previousPath = this.view.previousPath;
        }
        if (this.view.uri != null) {
          view.uri = this.view.uri;
        }
        return view;
      }
    }, {
      key: 'getContext',
      value: function getContext() {
        var application, campaign, context, loc, os, ref, ref1, screenDimensions;
        screenDimensions = SGN$6.util.getScreenDimensions();
        os = SGN$6.util.getOS();
        context = {
          userAgent: window.navigator.userAgent,
          locale: navigator.language,
          timeZone: {
            utcOffsetSeconds: SGN$6.util.getUtcOffsetSeconds(),
            utcDstOffsetSeconds: SGN$6.util.getUtcDstOffsetSeconds()
          },
          device: {
            screen: {
              width: screenDimensions.physical.width,
              height: screenDimensions.physical.height,
              density: screenDimensions.density
            }
          },
          session: {
            id: this.session.id
          },
          view: this.getView()
        };
        application = {
          name: this.application.name,
          version: this.application.version,
          build: this.application.build
        };
        campaign = {
          source: SGN$6.util.getQueryParam('utm_source'),
          medium: SGN$6.util.getQueryParam('utm_medium'),
          name: SGN$6.util.getQueryParam('utm_campaign'),
          term: SGN$6.util.getQueryParam('utm_term'),
          content: SGN$6.util.getQueryParam('utm_content')
        };
        loc = {
          determinedAt: this.location.determinedAt,
          latitude: this.location.latitude,
          longitude: this.location.longitude,
          altitude: this.location.altitude,
          speed: this.location.speed,
          floor: this.location.floor,
          accuracy: {
            horizontal: (ref = this.location.accuracy) != null ? ref.horizontal : void 0,
            vertical: (ref1 = this.location.accuracy) != null ? ref1.vertical : void 0
          }
        };
        if (os != null) {
          // Operating system.
          context.os = {
            name: os
          };
        }
        if (document.referrer.length > 0) {
          // Session referrer.
          context.session.referrer = document.referrer;
        }
        // Application.
        ['name', 'version', 'build'].forEach(function (key) {
          if (typeof application[key] !== 'string' || application[key].length === 0) {
            delete application[key];
          }
        });
        if (Object.keys(application).length > 0) {
          context.application = application;
        }
        // Campaign.
        ['source', 'medium', 'name', 'term', 'content'].forEach(function (key) {
          if (typeof campaign[key] !== 'string' || campaign[key].length === 0) {
            delete campaign[key];
          }
        });
        if (Object.keys(campaign).length > 0) {
          context.campaign = campaign;
        }
        // Location.
        ['latitude', 'longitude', 'altitude', 'speed', 'floor'].forEach(function (key) {
          if (typeof loc[key] !== 'number') {
            delete loc[key];
          }
        });
        if (typeof loc.accuracy.horizontal !== 'number') {
          delete loc.accuracy.horizontal;
        }
        if (typeof loc.accuracy.vertical !== 'number') {
          delete loc.accuracy.vertical;
        }
        if (Object.keys(loc.accuracy).length === 0) {
          delete loc.accuracy;
        }
        if (typeof loc.determinedAt !== 'string' || loc.determinedAt.length === 0) {
          delete loc.determinedAt;
        }
        if (Object.keys(loc).length > 0) {
          context.location = loc;
        }
        if (this.identity.id != null) {
          // Person identifier.
          context.personId = this.identity.id;
        }
        return context;
      }
    }, {
      key: 'getPoolSize',
      value: function getPoolSize() {
        return pool.length;
      }
    }, {
      key: 'dispatch',
      value: function dispatch() {
        var _this = this;

        var events, nacks;
        if (this.dispatching === true || this.getPoolSize() === 0) {
          return;
        }
        if (this.dryRun === true) {
          return pool.splice(0, this.dispatchLimit);
        }
        events = pool.slice(0, this.dispatchLimit);
        nacks = 0;
        this.dispatching = true;
        this.ship(events, function (err, response) {
          _this.dispatching = false;
          if (err == null) {
            response.events.forEach(function (resEvent) {
              if (resEvent.status === 'validation_error' || resEvent.status === 'ack') {
                pool = pool.filter(function (poolEvent) {
                  return poolEvent.id !== resEvent.id;
                });
              } else {
                nacks++;
              }
            });
            if (_this.getPoolSize() >= _this.dispatchLimit && nacks === 0) {
              // Keep dispatching until the pool size reaches a sane level.
              _this.dispatch();
            }
          }
        });
        return this;
      }
    }, {
      key: 'ship',
      value: function ship() {
        var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var callback = arguments[1];

        var http, payload, url;
        http = new XMLHttpRequest();
        url = SGN$6.config.get('eventsTrackUrl');
        payload = {
          events: events.map(function (event) {
            event.sentAt = new Date().toISOString();
            return event;
          })
        };
        http.open('POST', url);
        http.setRequestHeader('Content-Type', 'application/json');
        http.setRequestHeader('Accept', 'application/json');
        http.timeout = 1000 * 20;
        http.onload = function () {
          if (http.status === 200) {
            try {
              callback(null, JSON.parse(http.responseText));
            } catch (error) {
              callback(SGN$6.util.error(new Error('Could not parse JSON')));
            }
          } else {
            callback(SGN$6.util.error(new Error('Server did not accept request')));
          }
        };
        http.onerror = function () {
          callback(SGN$6.util.error(new Error('Could not perform network request')));
        };
        http.send(JSON.stringify(payload));
        return this;
      }
    }]);
    return Tracker;
  }();

  Tracker.prototype.defaultOptions = {
    trackId: null,
    dispatchInterval: 3000,
    dispatchLimit: 100,
    poolLimit: 1000,
    dryRun: false
  };

  return Tracker;
}.call(commonjsGlobal);

var MicroEvent$1, Pulse;

MicroEvent$1 = microevent;

Pulse = function () {
  function Pulse() {
    classCallCheck(this, Pulse);

    this.destroyed = false;
    this.connection = this.connect();
    return;
  }

  createClass(Pulse, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyed = true;
      this.connection.close();
      return this;
    }
  }, {
    key: 'connect',
    value: function connect() {
      var connection;
      connection = new WebSocket(SGN.config.get('eventsPulseUrl'));
      connection.onopen = this.onOpen.bind(this);
      connection.onmessage = this.onMessage.bind(this);
      connection.onerror = this.onError.bind(this);
      connection.onclose = this.onClose.bind(this);
      return connection;
    }
  }, {
    key: 'onOpen',
    value: function onOpen() {
      this.trigger('open');
    }
  }, {
    key: 'onMessage',
    value: function onMessage(e) {
      try {
        this.trigger('event', JSON.parse(e.data));
      } catch (error) {}
    }
  }, {
    key: 'onError',
    value: function onError() {}
  }, {
    key: 'onClose',
    value: function onClose() {
      var _this = this;

      if (this.destroyed === false) {
        setTimeout(function () {
          _this.connection = _this.connect();
        }, 2000);
      }
    }
  }]);
  return Pulse;
}();

MicroEvent$1.mixin(Pulse);

var pulse = Pulse;

var events = {
  Tracker: tracker,
  Pulse: pulse
};

var SGN$7, parseCookies;

SGN$7 = sgn;

parseCookies = function parseCookies() {
  var cookies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var parsedCookies;
  parsedCookies = {};
  cookies.map(function (cookie) {
    var key, keyValuePair, parts, value;
    parts = cookie.split('; ');
    keyValuePair = parts[0].split('=');
    key = keyValuePair[0];
    value = keyValuePair[1];
    parsedCookies[key] = value;
  });
  return parsedCookies;
};

var request = function request() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];

  var appKey, authToken, authTokenCookieName, timeout, url;
  url = SGN$7.config.get('graphUrl');
  timeout = 1000 * 12;
  appKey = SGN$7.config.get('appKey');
  authToken = SGN$7.config.get('authToken');
  authTokenCookieName = 'shopgun-auth-token';
  options = {
    method: 'post',
    url: url,
    timeout: timeout,
    json: true,
    headers: {},
    body: {
      query: options.query,
      operationName: options.operationName,
      variables: options.variables
    }
  };
  if (appKey != null) {
    // Apply authorization header when app key is provided to avoid rate limiting.
    options.headers.Authorization = 'Basic ' + SGN$7.util.btoa('app-key:' + appKey);
  }
  // Set cookies manually in node.js.
  if (SGN$7.util.isNode() && authToken != null) {
    options.cookies = [{
      key: authTokenCookieName,
      value: authToken,
      url: url
    }];
  } else if (SGN$7.util.isBrowser()) {
    options.useCookies = true;
  }
  SGN$7.request(options, function (err, data) {
    var authCookie, cookies, ref;
    if (err != null) {
      callback(SGN$7.util.error(new Error('Graph request error'), {
        code: 'GraphRequestError'
      }));
    } else {
      // Update auth token as it might have changed.
      if (SGN$7.util.isNode()) {
        cookies = parseCookies((ref = data.headers) != null ? ref['set-cookie'] : void 0);
        authCookie = cookies[authTokenCookieName];
        if (SGN$7.config.get('authToken') !== authCookie) {
          SGN$7.config.set('authToken', authCookie);
        }
      }
      if (data.statusCode === 200) {
        callback(null, data.body);
      } else {
        callback(SGN$7.util.error(new Error('Graph API error'), {
          code: 'GraphAPIError',
          statusCode: data.statusCode
        }));
      }
    }
  });
};

var graph = {
  request: request
};

var SGN$8, _request;

SGN$8 = sgn;

_request = function request() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var runs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  SGN$8.CoreKit.session.ensure(function (err) {
    var appSecret, appVersion, clientId, geo, headers, locale, qs, ref, ref1, ref2, token, url;
    if (err != null) {
      return callback(err);
    }
    url = (ref = options.url) != null ? ref : '';
    headers = (ref1 = options.headers) != null ? ref1 : {};
    token = SGN$8.config.get('coreSessionToken');
    clientId = SGN$8.config.get('coreSessionClientId');
    appVersion = SGN$8.config.get('appVersion');
    appSecret = SGN$8.config.get('appSecret');
    locale = SGN$8.config.get('locale');
    qs = (ref2 = options.qs) != null ? ref2 : {};
    geo = options.geolocation;
    headers['X-Token'] = token;
    if (appSecret != null) {
      headers['X-Signature'] = SGN$8.CoreKit.session.sign(appSecret, token);
    }
    if (locale != null) {
      qs.r_locale = locale;
    }
    if (appVersion != null) {
      qs.api_av = appVersion;
    }
    if (clientId != null) {
      qs.client_id = clientId;
    }
    if (geo != null) {
      if (geo.latitude != null && qs.r_lat == null) {
        qs.r_lat = geo.latitude;
      }
      if (geo.longitude != null && qs.r_lng == null) {
        qs.r_lng = geo.longitude;
      }
      if (geo.radius != null && qs.r_radius == null) {
        qs.r_radius = geo.radius;
      }
      if (geo.sensor != null && qs.r_sensor == null) {
        qs.r_sensor = geo.sensor;
      }
    }
    return SGN$8.request({
      method: options.method,
      url: SGN$8.config.get('coreUrl') + url,
      qs: qs,
      body: options.body,
      formData: options.formData,
      headers: headers,
      json: true,
      useCookies: false
    }, function (err, data) {
      var ref3, responseToken;
      if (err != null) {
        callback(SGN$8.util.error(new Error('Core request error'), {
          code: 'CoreRequestError'
        }));
      } else {
        token = SGN$8.config.get('coreSessionToken');
        responseToken = data.headers['x-token'];
        if (responseToken && token !== responseToken) {
          SGN$8.CoreKit.session.saveToken(responseToken);
        }
        if (data.statusCode >= 200 && data.statusCode < 300 || data.statusCode === 304) {
          callback(null, data.body);
        } else {
          if (runs === 0 && data.body != null && ((ref3 = data.body.code) === 1101 || ref3 === 1107 || ref3 === 1108)) {
            SGN$8.config.set({
              coreSessionToken: void 0
            });
            _request(options, callback, ++runs);
          } else {
            callback(SGN$8.util.error(new Error('Core API error'), {
              code: 'CoreAPIError',
              statusCode: data.statusCode
            }), data.body);
          }
        }
      }
    });
  });
};

var request_1 = _request;

var convertHex = createCommonjsModule(function (module) {
!function(globals) {

var convertHex = {
  bytesToHex: function(bytes) {
    /*if (typeof bytes.byteLength != 'undefined') {
      var newBytes = []

      if (typeof bytes.buffer != 'undefined')
        bytes = new DataView(bytes.buffer)
      else
        bytes = new DataView(bytes)

      for (var i = 0; i < bytes.byteLength; ++i) {
        newBytes.push(bytes.getUint8(i))
      }
      bytes = newBytes
    }*/
    return arrBytesToHex(bytes)
  },
  hexToBytes: function(hex) {
    if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.")
    if (hex.indexOf('0x') === 0) hex = hex.slice(2);
    return hex.match(/../g).map(function(x) { return parseInt(x,16) })
  }
};


// PRIVATE

function arrBytesToHex(bytes) {
  return bytes.map(function(x) { return padLeft(x.toString(16),2) }).join('')
}

function padLeft(orig, len) {
  if (orig.length > len) return orig
  return Array(len - orig.length + 1).join('0') + orig
}


if ('object' !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertHex;
} else {
  globals.convertHex = convertHex;
}

}(commonjsGlobal);
});

var convertString = createCommonjsModule(function (module) {
!function(globals) {

var convertString = {
  bytesToString: function(bytes) {
    return bytes.map(function(x){ return String.fromCharCode(x) }).join('')
  },
  stringToBytes: function(str) {
    return str.split('').map(function(x) { return x.charCodeAt(0) })
  }
};

//http://hossa.in/2012/07/20/utf-8-in-javascript.html
convertString.UTF8 = {
   bytesToString: function(bytes) {
    return decodeURIComponent(escape(convertString.bytesToString(bytes)))
  },
  stringToBytes: function(str) {
   return convertString.stringToBytes(unescape(encodeURIComponent(str)))
  }
};

if ('object' !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertString;
} else {
  globals.convertString = convertString;
}

}(commonjsGlobal);
});

var sha256 = createCommonjsModule(function (module) {
!function(globals) {

var _imports = {};

if ('object' !== 'undefined' && module.exports) { //CommonJS
  _imports.bytesToHex = convertHex.bytesToHex;
  _imports.convertString = convertString;
  module.exports = sha256;
} else {
  _imports.bytesToHex = globals.convertHex.bytesToHex;
  _imports.convertString = globals.convertString;
  globals.sha256 = sha256;
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

// Initialization round constants tables
var K = [];

// Compute constants
!function () {
  function isPrime(n) {
    var sqrtN = Math.sqrt(n);
    for (var factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) return false
    }

    return true
  }

  function getFractionalBits(n) {
    return ((n - (n | 0)) * 0x100000000) | 0
  }

  var n = 2;
  var nPrime = 0;
  while (nPrime < 64) {
    if (isPrime(n)) {
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
      nPrime++;
    }

    n++;
  }
}();

var bytesToWords = function (bytes) {
  var words = [];
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32);
  }
  return words
};

var wordsToBytes = function (words) {
  var bytes = [];
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
  }
  return bytes
};

// Reusable object
var W = [];

var processBlock = function (H, M, offset) {
  // Working variables
  var a = H[0], b = H[1], c = H[2], d = H[3];
  var e = H[4], f = H[5], g = H[6], h = H[7];

    // Computation
  for (var i = 0; i < 64; i++) {
    if (i < 16) {
      W[i] = M[offset + i] | 0;
    } else {
      var gamma0x = W[i - 15];
      var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3);

      var gamma1x = W[i - 2];
      var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10);

      W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    }

    var ch  = (e & f) ^ (~e & g);
    var maj = (a & b) ^ (a & c) ^ (b & c);

    var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    var t1 = h + sigma1 + ch + K[i] + W[i];
    var t2 = sigma0 + maj;

    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  // Intermediate hash value
  H[0] = (H[0] + a) | 0;
  H[1] = (H[1] + b) | 0;
  H[2] = (H[2] + c) | 0;
  H[3] = (H[3] + d) | 0;
  H[4] = (H[4] + e) | 0;
  H[5] = (H[5] + f) | 0;
  H[6] = (H[6] + g) | 0;
  H[7] = (H[7] + h) | 0;
};

function sha256(message, options) {  if (message.constructor === String) {
    message = _imports.convertString.UTF8.stringToBytes(message);
  }

  var H =[ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
           0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ];

  var m = bytesToWords(message);
  var l = message.length * 8;

  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  var digestbytes = wordsToBytes(H);
  return options && options.asBytes ? digestbytes :
         options && options.asString ? _imports.convertString.bytesToString(digestbytes) :
         _imports.bytesToHex(digestbytes)
}

sha256.x2 = function(message, options) {
  return sha256(sha256(message, { asBytes:true }), options)
};

}(commonjsGlobal);
});

var SGN$9, callbackQueue, clientCookieStorage, renewed, session, sha256$1;

SGN$9 = sgn;

sha256$1 = sha256;

clientCookieStorage = clientCookie;

callbackQueue = [];

renewed = false;

session = {
  ttl: 1 * 60 * 60 * 24 * 60,
  saveToken: function saveToken(token) {
    if (!token) {
      throw new Error('No token provided for saving');
    }
    SGN$9.config.set({
      coreSessionToken: token
    });
    session.saveCookie();
  },
  saveClientId: function saveClientId(clientId) {
    SGN$9.config.set({
      coreSessionClientId: clientId
    });
    session.saveCookie();
  },
  saveCookie: function saveCookie() {
    clientCookieStorage.set('session', {
      token: SGN$9.config.get('coreSessionToken'),
      client_id: SGN$9.config.get('coreSessionClientId')
    });
  },
  create: function create(callback) {
    SGN$9.request({
      method: 'post',
      url: SGN$9.config.get('coreUrl') + '/v2/sessions',
      json: true,
      qs: {
        api_key: SGN$9.config.get('appKey'),
        token_ttl: session.ttl
      }
    }, function (err, data) {
      if (err != null) {
        callback(err);
      } else if (data.statusCode === 201) {
        session.saveToken(data.body.token);
        session.saveClientId(data.body.client_id);
        callback(err, data.body);
      } else {
        callback(new Error('Could not create session'));
      }
    });
  },
  update: function update(callback) {
    var appSecret, headers, token;
    headers = {};
    token = SGN$9.config.get('coreSessionToken');
    appSecret = SGN$9.config.get('appSecret');
    headers['X-Token'] = token;
    if (appSecret != null) {
      headers['X-Signature'] = session.sign(appSecret, token);
    }
    SGN$9.request({
      url: SGN$9.config.get('coreUrl') + '/v2/sessions',
      headers: headers,
      json: true
    }, function (err, data) {
      if (err != null) {
        callback(err);
      } else if (data.statusCode === 200) {
        session.saveToken(data.body.token);
        session.saveClientId(data.body.client_id);
        callback(err, data.body);
      } else {
        callback(new Error('Could not update session'));
      }
    });
  },
  renew: function renew(callback) {
    var appSecret, headers, token;
    headers = {};
    token = SGN$9.config.get('coreSessionToken');
    appSecret = SGN$9.config.get('appSecret');
    headers['X-Token'] = token;
    if (appSecret != null) {
      headers['X-Signature'] = session.sign(appSecret, token);
    }
    SGN$9.request({
      method: 'put',
      url: SGN$9.config.get('coreUrl') + '/v2/sessions',
      headers: headers,
      json: true
    }, function (err, data) {
      if (err != null) {
        callback(err);
      } else if (data.statusCode === 200) {
        session.saveToken(data.body.token);
        session.saveClientId(data.body.client_id);
        callback(err, data.body);
      } else {
        callback(new Error('Could not renew session'));
      }
    });
  },
  ensure: function ensure(callback) {
    var complete, queueCount;
    queueCount = callbackQueue.length;
    complete = function complete(err) {
      callbackQueue = callbackQueue.filter(function (fn) {
        fn(err);
        return false;
      });
    };
    callbackQueue.push(callback);
    if (queueCount === 0) {
      if (SGN$9.config.get('coreSessionToken') == null) {
        session.create(complete);
      } else if (renewed === false) {
        renewed = true;
        session.renew(function (err) {
          if (err != null) {
            session.create(complete);
          } else {
            complete();
          }
        });
      } else {
        complete();
      }
    }
  },
  sign: function sign(appSecret, token) {
    return sha256$1([appSecret, token].join(''));
  }
};

var session_1 = session;

var request$1, session$1;

request$1 = request_1;

session$1 = session_1;

var core$1 = {
  request: request$1,
  session: session$1
};

var verso = createCommonjsModule(function (module, exports) {
(function(f){{module.exports=f();}})(function(){var define;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND", f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animation;

module.exports = Animation = function () {
  function Animation(el) {
    _classCallCheck(this, Animation);

    this.el = el;
    this.run = 0;
    return;
  }

  _createClass(Animation, [{
    key: 'animate',
    value: function animate() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      var duration, easing, ref, ref1, ref2, ref3, ref4, run, scale, transform, _transitionEnd, x, y;
      x = (ref = options.x) != null ? ref : 0;
      y = (ref1 = options.y) != null ? ref1 : 0;
      scale = (ref2 = options.scale) != null ? ref2 : 1;
      easing = (ref3 = options.easing) != null ? ref3 : 'ease-out';
      duration = (ref4 = options.duration) != null ? ref4 : 0;
      run = ++this.run;
      transform = 'translate3d(' + x + ', ' + y + ', 0px) scale3d(' + scale + ', ' + scale + ', 1)';
      if (this.el.style.transform === transform) {
        callback();
      } else if (duration > 0) {
        _transitionEnd = function transitionEnd() {
          if (run !== _this.run) {
            return;
          }
          _this.el.removeEventListener('transitionend', _transitionEnd);
          _this.el.style.transition = 'none';
          callback();
        };
        this.el.addEventListener('transitionend', _transitionEnd, false);
        this.el.style.transition = 'transform ' + easing + ' ' + duration + 'ms';
        this.el.style.transform = transform;
      } else {
        this.el.style.transition = 'none';
        this.el.style.transform = transform;
        callback();
      }
      return this;
    }
  }]);

  return Animation;
}();

},{}],2:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageSpread;

module.exports = PageSpread = function () {
  function PageSpread(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, PageSpread);

    this.el = el;
    this.options = options;
    this.visibility = 'gone';
    this.positioned = false;
    this.active = false;
    this.id = this.options.id;
    this.type = this.options.type;
    this.pageIds = this.options.pageIds;
    this.width = this.options.width;
    this.left = this.options.left;
    this.maxZoomScale = this.options.maxZoomScale;
    return;
  }

  _createClass(PageSpread, [{
    key: 'isZoomable',
    value: function isZoomable() {
      return this.getMaxZoomScale() > 1 && this.getEl().getAttribute('data-zoomable') !== 'false';
    }
  }, {
    key: 'isScrollable',
    value: function isScrollable() {
      return this.getEl().classList.contains('verso--scrollable');
    }
  }, {
    key: 'getEl',
    value: function getEl() {
      return this.el;
    }
  }, {
    key: 'getOverlayEls',
    value: function getOverlayEls() {
      return this.getEl().querySelectorAll('.verso__overlay');
    }
  }, {
    key: 'getPageEls',
    value: function getPageEls() {
      return this.getEl().querySelectorAll('.verso__page');
    }
  }, {
    key: 'getRect',
    value: function getRect() {
      return this.getEl().getBoundingClientRect();
    }
  }, {
    key: 'getContentRect',
    value: function getContentRect() {
      var boundingClientRect, i, len, offsetLeft, offsetLeftDelta, offsetTop, offsetTopDelta, pageEl, pageRect, rect, ref, ref1, ref2, ref3, ref4;
      rect = {
        top: null,
        left: null,
        right: null,
        bottom: null,
        width: null,
        height: null
      };
      ref = this.getPageEls();
      for (i = 0, len = ref.length; i < len; i++) {
        pageEl = ref[i];
        boundingClientRect = pageEl.getBoundingClientRect();
        offsetTop = pageEl.offsetTop;
        offsetLeft = pageEl.offsetLeft;
        offsetTopDelta = offsetTop - boundingClientRect.top;
        offsetLeftDelta = offsetLeft - boundingClientRect.left;
        pageRect = {
          top: boundingClientRect.top + offsetTopDelta,
          left: boundingClientRect.left + offsetLeftDelta,
          right: boundingClientRect.right + offsetLeftDelta,
          bottom: boundingClientRect.bottom + offsetTopDelta,
          width: boundingClientRect.width,
          height: boundingClientRect.height
        };
        if (pageRect.top < rect.top || rect.top == null) {
          rect.top = pageRect.top;
        }
        if (pageRect.left < rect.left || rect.left == null) {
          rect.left = pageRect.left;
        }
        if (pageRect.right > rect.right || rect.right == null) {
          rect.right = pageRect.right;
        }
        if (pageRect.bottom > rect.bottom || rect.bottom == null) {
          rect.bottom = pageRect.bottom;
        }
      }
      rect.top = (ref1 = rect.top) != null ? ref1 : 0;
      rect.left = (ref2 = rect.left) != null ? ref2 : 0;
      rect.right = (ref3 = rect.right) != null ? ref3 : 0;
      rect.bottom = (ref4 = rect.bottom) != null ? ref4 : 0;
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
      return rect;
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'getPageIds',
    value: function getPageIds() {
      return this.pageIds;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'getLeft',
    value: function getLeft() {
      return this.left;
    }
  }, {
    key: 'getMaxZoomScale',
    value: function getMaxZoomScale() {
      return this.maxZoomScale;
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'setVisibility',
    value: function setVisibility(visibility) {
      if (this.visibility !== visibility) {
        this.getEl().style.display = visibility === 'visible' ? 'block' : 'none';
        this.visibility = visibility;
      }
      return this;
    }
  }, {
    key: 'position',
    value: function position() {
      if (this.positioned === false) {
        this.getEl().style.left = this.getLeft() + '%';
        this.positioned = true;
      }
      return this;
    }
  }, {
    key: 'activate',
    value: function activate() {
      this.active = true;
      this.getEl().setAttribute('data-active', this.active);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.active = false;
      this.getEl().setAttribute('data-active', this.active);
    }
  }]);

  return PageSpread;
}();

},{}],3:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animation, Hammer, MicroEvent, PageSpread, Verso;

Hammer = _dereq_('hammerjs');

MicroEvent = _dereq_('microevent');

PageSpread = _dereq_('./page_spread');

Animation = _dereq_('./animation');

Verso = function () {
  function Verso(el1) {
    var options1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Verso);

    var ref, ref1, ref2, ref3, ref4, ref5;
    this.el = el1;
    this.options = options1;
    this.swipeVelocity = (ref = this.options.swipeVelocity) != null ? ref : 0.3;
    this.swipeThreshold = (ref1 = this.options.swipeThreshold) != null ? ref1 : 10;
    this.navigationDuration = (ref2 = this.options.navigationDuration) != null ? ref2 : 240;
    this.navigationPanDuration = (ref3 = this.options.navigationPanDuration) != null ? ref3 : 200;
    this.zoomDuration = (ref4 = this.options.zoomDuration) != null ? ref4 : 200;
    this.doubleTapDelay = (ref5 = this.options.doubleTapDelay) != null ? ref5 : 300;
    this.position = -1;
    this.pinching = false;
    this.panning = false;
    this.transform = {
      left: 0,
      top: 0,
      scale: 1
    };
    this.startTransform = {
      left: 0,
      top: 0,
      scale: 1
    };
    this.tap = {
      count: 0,
      delay: this.doubleTapDelay
    };
    this.scrollerEl = this.el.querySelector('.verso__scroller');
    this.pageSpreadEls = this.el.querySelectorAll('.verso__page-spread');
    this.pageSpreads = this.traversePageSpreads(this.pageSpreadEls);
    this.pageIds = this.buildPageIds(this.pageSpreads);
    this.animation = new Animation(this.scrollerEl);
    this.hammer = new Hammer.Manager(this.scrollerEl, {
      touchAction: 'none',
      enable: false,
      inputClass: this.getHammerInputClass()
    });
    this.hammer.add(new Hammer.Pan({
      threshold: 5,
      direction: Hammer.DIRECTION_ALL
    }));
    this.hammer.add(new Hammer.Tap({
      event: 'singletap',
      interval: 0
    }));
    this.hammer.add(new Hammer.Pinch());
    this.hammer.add(new Hammer.Press({
      time: 500
    }));
    this.hammer.on('panstart', this.onPanStart.bind(this));
    this.hammer.on('panmove', this.onPanMove.bind(this));
    this.hammer.on('panend', this.onPanEnd.bind(this));
    this.hammer.on('pancancel', this.onPanEnd.bind(this));
    this.hammer.on('singletap', this.onSingletap.bind(this));
    this.hammer.on('pinchstart', this.onPinchStart.bind(this));
    this.hammer.on('pinchmove', this.onPinchMove.bind(this));
    this.hammer.on('pinchend', this.onPinchEnd.bind(this));
    this.hammer.on('pinchcancel', this.onPinchEnd.bind(this));
    this.hammer.on('press', this.onPress.bind(this));
    this.scrollerEl.addEventListener('contextmenu', this.onContextmenu.bind(this));
    return;
  }

  _createClass(Verso, [{
    key: 'start',
    value: function start() {
      var pageId, ref;
      pageId = (ref = this.getPageSpreadPositionFromPageId(this.options.pageId)) != null ? ref : 0;
      this.hammer.set({
        enable: true
      });
      this.navigateTo(pageId, {
        duration: 0
      });
      this.resizeListener = this.onResize.bind(this);
      this.touchStartListener = this.onTouchStart.bind(this);
      this.touchEndListener = this.onTouchEnd.bind(this);
      this.el.addEventListener('touchstart', this.touchStartListener, false);
      this.el.addEventListener('touchend', this.touchEndListener, false);
      window.addEventListener('resize', this.resizeListener, false);
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.hammer.destroy();
      this.el.removeEventListener('touchstart', this.touchStartListener);
      this.el.removeEventListener('touchend', this.touchEndListener);
      window.removeEventListener('resize', this.resizeListener);
      return this;
    }
  }, {
    key: 'first',
    value: function first(options) {
      return this.navigateTo(0, options);
    }
  }, {
    key: 'prev',
    value: function prev(options) {
      return this.navigateTo(this.getPosition() - 1, options);
    }
  }, {
    key: 'next',
    value: function next(options) {
      return this.navigateTo(this.getPosition() + 1, options);
    }
  }, {
    key: 'last',
    value: function last(options) {
      return this.navigateTo(this.getPageSpreadCount() - 1, options);
    }
  }, {
    key: 'navigateTo',
    value: function navigateTo(position) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var activePageSpread, carousel, currentPageSpread, currentPosition, duration, ref, ref1, touchAction, velocity;
      if (position < 0 || position > this.getPageSpreadCount() - 1) {
        return;
      }
      currentPosition = this.getPosition();
      currentPageSpread = this.getPageSpreadFromPosition(currentPosition);
      activePageSpread = this.getPageSpreadFromPosition(position);
      carousel = this.getCarouselFromPageSpread(activePageSpread);
      velocity = (ref = options.velocity) != null ? ref : 1;
      duration = (ref1 = options.duration) != null ? ref1 : this.navigationDuration;
      duration = duration / Math.abs(velocity);
      touchAction = activePageSpread.isScrollable() ? 'pan-y' : 'none';
      if (currentPageSpread != null) {
        currentPageSpread.deactivate();
      }
      activePageSpread.activate();
      carousel.visible.forEach(function (pageSpread) {
        return pageSpread.position().setVisibility('visible');
      });
      this.hammer.set({
        touchAction: touchAction
      });
      this.transform.left = this.getLeftTransformFromPageSpread(position, activePageSpread);
      this.setPosition(position);
      if (this.transform.scale > 1) {
        this.transform.top = 0;
        this.transform.scale = 1;
        this.trigger('zoomedOut', {
          position: currentPosition
        });
      }
      this.trigger('beforeNavigation', {
        currentPosition: currentPosition,
        newPosition: position
      });
      this.animation.animate({
        x: this.transform.left + '%',
        duration: duration
      }, function () {
        carousel = _this.getCarouselFromPageSpread(_this.getActivePageSpread());
        carousel.gone.forEach(function (pageSpread) {
          return pageSpread.setVisibility('gone');
        });
        _this.trigger('afterNavigation', {
          newPosition: _this.getPosition(),
          previousPosition: currentPosition
        });
      });
    }
  }, {
    key: 'getPosition',
    value: function getPosition() {
      return this.position;
    }
  }, {
    key: 'setPosition',
    value: function setPosition(position) {
      this.position = position;
      return this;
    }
  }, {
    key: 'getLeftTransformFromPageSpread',
    value: function getLeftTransformFromPageSpread(position, pageSpread) {
      var left;
      left = 0;
      if (position === this.getPageSpreadCount() - 1) {
        left = 100 - pageSpread.getWidth() - pageSpread.getLeft();
      } else if (position > 0) {
        left = (100 - pageSpread.getWidth()) / 2 - pageSpread.getLeft();
      }
      return left;
    }
  }, {
    key: 'getCarouselFromPageSpread',
    value: function getCarouselFromPageSpread(pageSpreadSubject) {
      var carousel;
      carousel = {
        visible: [],
        gone: []
      };
      // Identify the page spreads that should be a part of the carousel.
      this.pageSpreads.forEach(function (pageSpread) {
        var visible;
        visible = false;
        if (pageSpread.getLeft() <= pageSpreadSubject.getLeft()) {
          if (pageSpread.getLeft() + pageSpread.getWidth() > pageSpreadSubject.getLeft() - 100) {
            visible = true;
          }
        } else {
          if (pageSpread.getLeft() - pageSpread.getWidth() < pageSpreadSubject.getLeft() + 100) {
            visible = true;
          }
        }
        if (visible === true) {
          carousel.visible.push(pageSpread);
        } else {
          carousel.gone.push(pageSpread);
        }
      });
      return carousel;
    }
  }, {
    key: 'traversePageSpreads',
    value: function traversePageSpreads(els) {
      var el, id, j, left, len, maxZoomScale, pageIds, pageSpread, pageSpreads, type, width;
      pageSpreads = [];
      left = 0;
      for (j = 0, len = els.length; j < len; j++) {
        el = els[j];
        id = el.getAttribute('data-id');
        type = el.getAttribute('data-type');
        pageIds = el.getAttribute('data-page-ids');
        pageIds = pageIds != null ? pageIds.split(',').map(function (i) {
          return i;
        }) : [];
        maxZoomScale = el.getAttribute('data-max-zoom-scale');
        maxZoomScale = maxZoomScale != null ? +maxZoomScale : 1;
        width = el.getAttribute('data-width');
        width = width != null ? +width : 100;
        pageSpread = new PageSpread(el, {
          id: id,
          type: type,
          pageIds: pageIds,
          maxZoomScale: maxZoomScale,
          width: width,
          left: left
        });
        left += width;
        pageSpreads.push(pageSpread);
      }
      return pageSpreads;
    }
  }, {
    key: 'buildPageIds',
    value: function buildPageIds(pageSpreads) {
      var pageIds;
      pageIds = {};
      pageSpreads.forEach(function (pageSpread, i) {
        pageSpread.options.pageIds.forEach(function (pageId) {
          pageIds[pageId] = pageSpread;
        });
      });
      return pageIds;
    }
  }, {
    key: 'isCoordinateInsideElement',
    value: function isCoordinateInsideElement(x, y, el) {
      var rect;
      rect = el.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
  }, {
    key: 'getCoordinateInfo',
    value: function getCoordinateInfo(x, y, pageSpread) {
      var contentRect, info, j, k, len, len1, overlayEl, overlayEls, pageEl, pageEls;
      x -= this.el.offsetLeft;
      y -= this.el.offsetTop;
      info = {
        x: x,
        y: y,
        contentX: 0,
        contentY: 0,
        pageX: 0,
        pageY: 0,
        overlayEls: [],
        pageEl: null,
        isInsideContentX: false,
        isInsideContentY: false,
        isInsideContent: false
      };
      contentRect = pageSpread.getContentRect();
      overlayEls = pageSpread.getOverlayEls();
      pageEls = pageSpread.getPageEls();
      for (j = 0, len = overlayEls.length; j < len; j++) {
        overlayEl = overlayEls[j];
        if (this.isCoordinateInsideElement(x, y, overlayEl)) {
          info.overlayEls.push(overlayEl);
        }
      }
      for (k = 0, len1 = pageEls.length; k < len1; k++) {
        pageEl = pageEls[k];
        if (this.isCoordinateInsideElement(x, y, pageEl)) {
          info.pageEl = pageEl;
          break;
        }
      }
      info.contentX = (x - contentRect.left) / Math.max(1, contentRect.width);
      info.contentY = (y - contentRect.top) / Math.max(1, contentRect.height);
      if (info.pageEl != null) {
        info.isInsideContentX = info.contentX >= 0 && info.contentX <= 1;
        info.isInsideContentY = info.contentY >= 0 && info.contentY <= 1;
        info.isInsideContent = info.isInsideContentX && info.isInsideContentY;
      }
      return info;
    }
  }, {
    key: 'getPageSpreadCount',
    value: function getPageSpreadCount() {
      return this.pageSpreads.length;
    }
  }, {
    key: 'getActivePageSpread',
    value: function getActivePageSpread() {
      return this.getPageSpreadFromPosition(this.getPosition());
    }
  }, {
    key: 'getPageSpreadFromPosition',
    value: function getPageSpreadFromPosition(position) {
      return this.pageSpreads[position];
    }
  }, {
    key: 'getPageSpreadPositionFromPageId',
    value: function getPageSpreadPositionFromPageId(pageId) {
      var idx, j, len, pageSpread, ref;
      ref = this.pageSpreads;
      for (idx = j = 0, len = ref.length; j < len; idx = ++j) {
        pageSpread = ref[idx];
        if (pageSpread.options.pageIds.indexOf(pageId) > -1) {
          return idx;
        }
      }
    }
  }, {
    key: 'getPageSpreadBounds',
    value: function getPageSpreadBounds(pageSpread) {
      var pageSpreadContentRect, pageSpreadRect;
      pageSpreadRect = pageSpread.getRect();
      pageSpreadContentRect = pageSpread.getContentRect();
      return {
        left: (pageSpreadContentRect.left - pageSpreadRect.left) / pageSpreadRect.width * 100,
        top: (pageSpreadContentRect.top - pageSpreadRect.top) / pageSpreadRect.height * 100,
        width: pageSpreadContentRect.width / pageSpreadRect.width * 100,
        height: pageSpreadContentRect.height / pageSpreadRect.height * 100,
        pageSpreadRect: pageSpreadRect,
        pageSpreadContentRect: pageSpreadContentRect
      };
    }
  }, {
    key: 'clipCoordinate',
    value: function clipCoordinate(coordinate, scale, size, offset) {
      if (size * scale < 100) {
        coordinate = offset * -scale + 50 - size * scale / 2;
      } else {
        coordinate = Math.min(coordinate, offset * -scale);
        coordinate = Math.max(coordinate, offset * -scale - size * scale + 100);
      }
      return coordinate;
    }
  }, {
    key: 'zoomTo',
    value: function zoomTo() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments[1];

      var activePageSpread, carouselOffset, carouselScaledOffset, curScale, pageSpreadBounds, ref, ref1, scale, x, y;
      scale = options.scale;
      curScale = this.transform.scale;
      activePageSpread = this.getActivePageSpread();
      pageSpreadBounds = this.getPageSpreadBounds(activePageSpread);
      carouselOffset = activePageSpread.getLeft();
      carouselScaledOffset = carouselOffset * curScale;
      x = (ref = options.x) != null ? ref : 0;
      y = (ref1 = options.y) != null ? ref1 : 0;
      if (scale !== 1) {
        x -= pageSpreadBounds.pageSpreadRect.left;
        y -= pageSpreadBounds.pageSpreadRect.top;
        x = x / (pageSpreadBounds.pageSpreadRect.width / curScale) * 100;
        y = y / (pageSpreadBounds.pageSpreadRect.height / curScale) * 100;
        x = this.transform.left + carouselScaledOffset + x - x * scale / curScale;
        y = this.transform.top + y - y * scale / curScale;
        // Make sure the animation doesn't exceed the content bounds.
        if (options.bounds !== false && scale > 1) {
          x = this.clipCoordinate(x, scale, pageSpreadBounds.width, pageSpreadBounds.left);
          y = this.clipCoordinate(y, scale, pageSpreadBounds.height, pageSpreadBounds.top);
        }
      } else {
        x = 0;
        y = 0;
      }
      // Account for the page spreads left of the active one.
      x -= carouselOffset * scale;
      this.transform.left = x;
      this.transform.top = y;
      this.transform.scale = scale;
      this.animation.animate({
        x: x + '%',
        y: y + '%',
        scale: scale,
        easing: options.easing,
        duration: options.duration
      }, callback);
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.pageSpreadEls = this.el.querySelectorAll('.verso__page-spread');
      this.pageSpreads = this.traversePageSpreads(this.pageSpreadEls);
      this.pageIds = this.buildPageIds(this.pageSpreads);
      return this;
    }
  }, {
    key: 'getHammerInputClass',
    value: function getHammerInputClass() {
      var mobileRegex, supportTouch;
      mobileRegex = /mobile|tablet|ip(ad|hone|od)|android/i;
      supportTouch = 'ontouchstart' in window;
      if (supportTouch && mobileRegex.test(navigator.userAgent)) {
        return Hammer.TouchInput;
      } else {
        return null;
      }
    }

    //#############
    /* Events */
    //#############

  }, {
    key: 'onPanStart',
    value: function onPanStart(e) {
      var edgeThreshold, width, x;
      // Only allow panning if zoomed in or doing a horizontal pan.
      // This ensures vertical scrolling works for scrollable page spreads.
      if (this.transform.scale > 1 || e.direction === Hammer.DIRECTION_LEFT || e.direction === Hammer.DIRECTION_RIGHT) {
        x = e.center.x;
        edgeThreshold = 30;
        width = this.scrollerEl.offsetWidth;
        // Prevent panning when edge-swiping on iOS.
        if (x > edgeThreshold && x < width - edgeThreshold) {
          this.startTransform.left = this.transform.left;
          this.startTransform.top = this.transform.top;
          this.panning = true;
          this.trigger('panStart');
        }
      }
    }
  }, {
    key: 'onPanMove',
    value: function onPanMove(e) {
      var activePageSpread, carouselOffset, carouselScaledOffset, pageSpreadBounds, scale, x, y;
      if (this.pinching === true || this.panning === false) {
        return;
      }
      if (this.transform.scale > 1) {
        activePageSpread = this.getActivePageSpread();
        carouselOffset = activePageSpread.getLeft();
        carouselScaledOffset = carouselOffset * this.transform.scale;
        pageSpreadBounds = this.getPageSpreadBounds(activePageSpread);
        scale = this.transform.scale;
        x = this.startTransform.left + carouselScaledOffset + e.deltaX / this.scrollerEl.offsetWidth * 100;
        y = this.startTransform.top + e.deltaY / this.scrollerEl.offsetHeight * 100;
        x = this.clipCoordinate(x, scale, pageSpreadBounds.width, pageSpreadBounds.left);
        y = this.clipCoordinate(y, scale, pageSpreadBounds.height, pageSpreadBounds.top);
        x -= carouselScaledOffset;
        this.transform.left = x;
        this.transform.top = y;
        this.animation.animate({
          x: x + '%',
          y: y + '%',
          scale: scale,
          easing: 'linear'
        });
      } else {
        x = this.transform.left + e.deltaX / this.scrollerEl.offsetWidth * 100;
        this.animation.animate({
          x: x + '%',
          easing: 'linear'
        });
      }
    }
  }, {
    key: 'onPanEnd',
    value: function onPanEnd(e) {
      var position, velocity;
      if (this.panning === false) {
        return;
      }
      this.panning = false;
      this.trigger('panEnd');
      if (this.transform.scale === 1 && this.pinching === false) {
        position = this.getPosition();
        velocity = e.overallVelocityX;
        if (Math.abs(velocity) >= this.swipeVelocity) {
          if (Math.abs(e.deltaX) >= this.swipeThreshold) {
            if (e.offsetDirection === Hammer.DIRECTION_LEFT) {
              this.next({
                velocity: velocity,
                duration: this.navigationPanDuration
              });
            } else if (e.offsetDirection === Hammer.DIRECTION_RIGHT) {
              this.prev({
                velocity: velocity,
                duration: this.navigationPanDuration
              });
            }
          }
        }
        if (position === this.getPosition()) {
          this.animation.animate({
            x: this.transform.left + '%',
            duration: this.navigationPanDuration
          });
          this.trigger('attemptedNavigation', {
            position: this.getPosition()
          });
        }
      }
    }
  }, {
    key: 'onPinchStart',
    value: function onPinchStart(e) {
      if (!this.getActivePageSpread().isZoomable()) {
        return;
      }
      this.pinching = true;
      this.el.setAttribute('data-pinching', true);
      this.startTransform.scale = this.transform.scale;
    }
  }, {
    key: 'onPinchMove',
    value: function onPinchMove(e) {
      if (this.pinching === false) {
        return;
      }
      this.zoomTo({
        x: e.center.x,
        y: e.center.y,
        scale: this.startTransform.scale * e.scale,
        bounds: false,
        easing: 'linear'
      });
    }
  }, {
    key: 'onPinchEnd',
    value: function onPinchEnd(e) {
      var _this2 = this;

      var activePageSpread, maxZoomScale, position, scale;
      if (this.pinching === false) {
        return;
      }
      activePageSpread = this.getActivePageSpread();
      maxZoomScale = activePageSpread.getMaxZoomScale();
      scale = Math.max(1, Math.min(this.transform.scale, maxZoomScale));
      position = this.getPosition();
      if (this.startTransform.scale === 1 && scale > 1) {
        this.trigger('zoomedIn', {
          position: position
        });
      } else if (this.startTransform.scale > 1 && scale === 1) {
        this.trigger('zoomedOut', {
          position: position
        });
      }
      this.zoomTo({
        x: e.center.x,
        y: e.center.y,
        scale: scale,
        duration: this.zoomDuration
      }, function () {
        _this2.pinching = false;
        _this2.el.setAttribute('data-pinching', false);
      });
    }
  }, {
    key: 'onPress',
    value: function onPress(e) {
      this.trigger('pressed', this.getCoordinateInfo(e.center.x, e.center.y, this.getActivePageSpread()));
    }
  }, {
    key: 'onContextmenu',
    value: function onContextmenu(e) {
      e.preventDefault();
      this.trigger('contextmenu', this.getCoordinateInfo(e.clientX, e.clientY, this.getActivePageSpread()));
      return false;
    }
  }, {
    key: 'onSingletap',
    value: function onSingletap(e) {
      var _this3 = this;

      var activePageSpread, coordinateInfo, maxZoomScale, position, scale, zoomEvent, zoomedIn;
      activePageSpread = this.getActivePageSpread();
      coordinateInfo = this.getCoordinateInfo(e.center.x, e.center.y, activePageSpread);
      clearTimeout(this.tap.timeout);
      if (this.tap.count === 1) {
        this.tap.count = 0;
        this.trigger('doubleClicked', coordinateInfo);
        if (activePageSpread.isZoomable()) {
          maxZoomScale = activePageSpread.getMaxZoomScale();
          zoomedIn = this.transform.scale > 1;
          scale = zoomedIn ? 1 : maxZoomScale;
          zoomEvent = zoomedIn ? 'zoomedOut' : 'zoomedIn';
          position = this.getPosition();
          this.zoomTo({
            x: e.center.x,
            y: e.center.y,
            scale: scale,
            duration: this.zoomDuration
          }, function () {
            _this3.trigger(zoomEvent, {
              position: position
            });
          });
        }
      } else {
        this.tap.count++;
        this.tap.timeout = setTimeout(function () {
          _this3.tap.count = 0;
          _this3.trigger('clicked', coordinateInfo);
        }, this.tap.delay);
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
      if (!this.getActivePageSpread().isScrollable()) {
        e.preventDefault();
      }
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e) {
      if (!this.getActivePageSpread().isScrollable()) {
        e.preventDefault();
      }
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      var activePageSpread, position;
      if (this.transform.scale > 1) {
        position = this.getPosition();
        activePageSpread = this.getActivePageSpread();
        this.transform.left = this.getLeftTransformFromPageSpread(position, activePageSpread);
        this.transform.top = 0;
        this.transform.scale = 1;
        this.zoomTo({
          x: this.transform.left,
          y: this.transform.top,
          scale: this.transform.scale,
          duration: 0
        });
        this.trigger('zoomedOut', {
          position: position
        });
      }
    }
  }]);

  return Verso;
}();

MicroEvent.mixin(Verso);

module.exports = Verso;

},{"./animation":1,"./page_spread":2,"hammerjs":4,"microevent":5}],4:[function(_dereq_,module,exports){
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (typeof define === 'function' && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

},{}],5:[function(_dereq_,module,exports){
/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 * 
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent	= function(){};
MicroEvent.prototype	= {
	bind	: function(event, fct){
		this._events = this._events || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	unbind	: function(event, fct){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger	: function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
};

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent;
}

},{}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvY29mZmVlc2NyaXB0L2FuaW1hdGlvbi5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L3BhZ2Vfc3ByZWFkLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvdmVyc28uY29mZmVlIiwibm9kZV9tb2R1bGVzL2hhbW1lcmpzL2hhbW1lci5qcyIsIm5vZGVfbW9kdWxlcy9taWNyb2V2ZW50L21pY3JvZXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFBOztBQUFBLEFBQU0sT0FBTixBQUFPO0FBQ0gsQUFBYSxxQkFBQTs7O0FBQUMsQUFBQyxTQUFBO0FBQ1gsQUFBQyxTQUFELEFBQUMsTUFBTSxBQUVQO0FBSFM7QUFLYixBQUFTOztBQU5JLEFBQU07OztBQU9mOztVQURNLDhFQUFELEFBQVc7VUFBSSwrRUFBVyxZQUFBLENBQTFCOztVQUNMLFVBQUEsUUFBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLFdBQUEsZ0JBQUEsR0FBQTtBQUFBLDRDQUFnQjtBQUNoQiw4Q0FBZ0I7QUFDaEIsc0RBQXdCO0FBQ3hCLHdEQUEwQjtBQUMxQiw0REFBOEI7QUFDOUIsWUFBTSxFQUFFLEFBQUMsS0FBQTtBQUNULEFBQVksbUNBQUEsQUFBZSxBQUFFLFdBQWpCLEFBQXFCLEFBQUUsd0JBQXZCLEFBQXdDLEFBQU0sZUFBOUMsQUFBa0QsQUFBTTtBQUVwRSxVQUFHLEFBQUMsS0FBQSxBQUFFLEdBQUMsQUFBSyxNQUFULEFBQVUsY0FBYixBQUEwQjtBQUExQixBQUNJO0FBREosaUJBRVEsV0FBSCxBQUFjO0FBQ2YseUJBQWdCO0FBQ1osY0FBVSxRQUFTLEFBQUMsTUFBcEIsQUFBb0IsS0FBcEI7QUFBQTs7QUFFQSxBQUFDLGdCQUFBLEFBQUUsR0FBSCxBQUFJLG9CQUFKLEFBQXdCLGlCQUF4QixBQUF5QztBQUN6QyxBQUFDLGdCQUFBLEFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmxGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQW5pbWF0aW9uXG4gICAgY29uc3RydWN0b3I6IChAZWwpIC0+XG4gICAgICAgIEBydW4gPSAwXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBhbmltYXRlOiAob3B0aW9ucyA9IHt9LCBjYWxsYmFjayA9IC0+KSAtPlxuICAgICAgICB4ID0gb3B0aW9ucy54ID8gMFxuICAgICAgICB5ID0gb3B0aW9ucy55ID8gMFxuICAgICAgICBzY2FsZSA9IG9wdGlvbnMuc2NhbGUgPyAxXG4gICAgICAgIGVhc2luZyA9IG9wdGlvbnMuZWFzaW5nID8gJ2Vhc2Utb3V0J1xuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gPyAwXG4gICAgICAgIHJ1biA9ICsrQHJ1blxuICAgICAgICB0cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKCN7eH0sICN7eX0sIDBweCkgc2NhbGUzZCgje3NjYWxlfSwgI3tzY2FsZX0sIDEpXCJcblxuICAgICAgICBpZiBAZWwuc3R5bGUudHJhbnNmb3JtIGlzIHRyYW5zZm9ybVxuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICBlbHNlIGlmIGR1cmF0aW9uID4gMFxuICAgICAgICAgICAgdHJhbnNpdGlvbkVuZCA9ID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlmIHJ1biBpc250IEBydW5cblxuICAgICAgICAgICAgICAgIEBlbC5yZW1vdmVFdmVudExpc3RlbmVyICd0cmFuc2l0aW9uZW5kJywgdHJhbnNpdGlvbkVuZFxuICAgICAgICAgICAgICAgIEBlbC5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpXG5cbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgQGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uRW5kLCBmYWxzZVxuXG4gICAgICAgICAgICBAZWwuc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtICN7ZWFzaW5nfSAje2R1cmF0aW9ufW1zXCJcbiAgICAgICAgICAgIEBlbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGVsLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcbiAgICAgICAgICAgIEBlbC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cblxuICAgICAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgICAgIEBcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFnZVNwcmVhZFxuICAgIGNvbnN0cnVjdG9yOiAoQGVsLCBAb3B0aW9ucyA9IHt9KSAtPlxuICAgICAgICBAdmlzaWJpbGl0eSA9ICdnb25lJ1xuICAgICAgICBAcG9zaXRpb25lZCA9IGZhbHNlXG4gICAgICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgICAgICBAaWQgPSBAb3B0aW9ucy5pZFxuICAgICAgICBAdHlwZSA9IEBvcHRpb25zLnR5cGVcbiAgICAgICAgQHBhZ2VJZHMgPSBAb3B0aW9ucy5wYWdlSWRzXG4gICAgICAgIEB3aWR0aCA9IEBvcHRpb25zLndpZHRoXG4gICAgICAgIEBsZWZ0ID0gQG9wdGlvbnMubGVmdFxuICAgICAgICBAbWF4Wm9vbVNjYWxlID0gQG9wdGlvbnMubWF4Wm9vbVNjYWxlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBpc1pvb21hYmxlOiAtPlxuICAgICAgICBAZ2V0TWF4Wm9vbVNjYWxlKCkgPiAxIGFuZCBAZ2V0RWwoKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtem9vbWFibGUnKSBpc250ICdmYWxzZSdcblxuICAgIGlzU2Nyb2xsYWJsZTogLT5cbiAgICAgICAgQGdldEVsKCkuY2xhc3NMaXN0LmNvbnRhaW5zICd2ZXJzby0tc2Nyb2xsYWJsZSdcblxuICAgIGdldEVsOiAtPlxuICAgICAgICBAZWxcblxuICAgIGdldE92ZXJsYXlFbHM6IC0+XG4gICAgICAgIEBnZXRFbCgpLnF1ZXJ5U2VsZWN0b3JBbGwgJy52ZXJzb19fb3ZlcmxheSdcblxuICAgIGdldFBhZ2VFbHM6IC0+XG4gICAgICAgIEBnZXRFbCgpLnF1ZXJ5U2VsZWN0b3JBbGwgJy52ZXJzb19fcGFnZSdcblxuICAgIGdldFJlY3Q6IC0+XG4gICAgICAgIEBnZXRFbCgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBnZXRDb250ZW50UmVjdDogLT5cbiAgICAgICAgcmVjdCA9XG4gICAgICAgICAgICB0b3A6IG51bGxcbiAgICAgICAgICAgIGxlZnQ6IG51bGxcbiAgICAgICAgICAgIHJpZ2h0OiBudWxsXG4gICAgICAgICAgICBib3R0b206IG51bGxcbiAgICAgICAgICAgIHdpZHRoOiBudWxsXG4gICAgICAgICAgICBoZWlnaHQ6IG51bGxcblxuICAgICAgICBmb3IgcGFnZUVsIGluIEBnZXRQYWdlRWxzKClcbiAgICAgICAgICAgIGJvdW5kaW5nQ2xpZW50UmVjdCA9IHBhZ2VFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgb2Zmc2V0VG9wID0gcGFnZUVsLm9mZnNldFRvcFxuICAgICAgICAgICAgb2Zmc2V0TGVmdCA9IHBhZ2VFbC5vZmZzZXRMZWZ0XG4gICAgICAgICAgICBvZmZzZXRUb3BEZWx0YSA9IG9mZnNldFRvcCAtIGJvdW5kaW5nQ2xpZW50UmVjdC50b3BcbiAgICAgICAgICAgIG9mZnNldExlZnREZWx0YSA9IG9mZnNldExlZnQgLSBib3VuZGluZ0NsaWVudFJlY3QubGVmdFxuICAgICAgICAgICAgcGFnZVJlY3QgPVxuICAgICAgICAgICAgICAgIHRvcDogYm91bmRpbmdDbGllbnRSZWN0LnRvcCArIG9mZnNldFRvcERlbHRhXG4gICAgICAgICAgICAgICAgbGVmdDogYm91bmRpbmdDbGllbnRSZWN0LmxlZnQgKyBvZmZzZXRMZWZ0RGVsdGFcbiAgICAgICAgICAgICAgICByaWdodDogYm91bmRpbmdDbGllbnRSZWN0LnJpZ2h0ICsgb2Zmc2V0TGVmdERlbHRhXG4gICAgICAgICAgICAgICAgYm90dG9tOiBib3VuZGluZ0NsaWVudFJlY3QuYm90dG9tICsgb2Zmc2V0VG9wRGVsdGFcbiAgICAgICAgICAgICAgICB3aWR0aDogYm91bmRpbmdDbGllbnRSZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBib3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0XG5cbiAgICAgICAgICAgIHJlY3QudG9wID0gcGFnZVJlY3QudG9wIGlmIHBhZ2VSZWN0LnRvcCA8IHJlY3QudG9wIG9yIG5vdCByZWN0LnRvcD9cbiAgICAgICAgICAgIHJlY3QubGVmdCA9IHBhZ2VSZWN0LmxlZnQgaWYgcGFnZVJlY3QubGVmdCA8IHJlY3QubGVmdCBvciBub3QgcmVjdC5sZWZ0P1xuICAgICAgICAgICAgcmVjdC5yaWdodCA9IHBhZ2VSZWN0LnJpZ2h0IGlmIHBhZ2VSZWN0LnJpZ2h0ID4gcmVjdC5yaWdodCBvciBub3QgcmVjdC5yaWdodD9cbiAgICAgICAgICAgIHJlY3QuYm90dG9tID0gcGFnZVJlY3QuYm90dG9tIGlmIHBhZ2VSZWN0LmJvdHRvbSA+IHJlY3QuYm90dG9tIG9yIG5vdCByZWN0LmJvdHRvbT9cblxuICAgICAgICByZWN0LnRvcCA9IHJlY3QudG9wID8gMFxuICAgICAgICByZWN0LmxlZnQgPSByZWN0LmxlZnQgPyAwXG4gICAgICAgIHJlY3QucmlnaHQgPSByZWN0LnJpZ2h0ID8gMFxuICAgICAgICByZWN0LmJvdHRvbSA9IHJlY3QuYm90dG9tID8gMFxuICAgICAgICByZWN0LndpZHRoID0gcmVjdC5yaWdodCAtIHJlY3QubGVmdFxuICAgICAgICByZWN0LmhlaWdodCA9IHJlY3QuYm90dG9tIC0gcmVjdC50b3BcblxuICAgICAgICByZWN0XG5cbiAgICBnZXRJZDogLT5cbiAgICAgICAgQGlkXG5cbiAgICBnZXRUeXBlOiAtPlxuICAgICAgICBAdHlwZVxuXG4gICAgZ2V0UGFnZUlkczogLT5cbiAgICAgICAgQHBhZ2VJZHNcblxuICAgIGdldFdpZHRoOiAtPlxuICAgICAgICBAd2lkdGhcblxuICAgIGdldExlZnQ6IC0+XG4gICAgICAgIEBsZWZ0XG5cbiAgICBnZXRNYXhab29tU2NhbGU6IC0+XG4gICAgICAgIEBtYXhab29tU2NhbGVcblxuICAgIGdldFZpc2liaWxpdHk6IC0+XG4gICAgICAgIEB2aXNpYmlsaXR5XG5cbiAgICBzZXRWaXNpYmlsaXR5OiAodmlzaWJpbGl0eSkgLT5cbiAgICAgICAgaWYgQHZpc2liaWxpdHkgaXNudCB2aXNpYmlsaXR5XG4gICAgICAgICAgICBAZ2V0RWwoKS5zdHlsZS5kaXNwbGF5ID0gaWYgdmlzaWJpbGl0eSBpcyAndmlzaWJsZScgdGhlbiAnYmxvY2snIGVsc2UgJ25vbmUnXG5cbiAgICAgICAgICAgIEB2aXNpYmlsaXR5ID0gdmlzaWJpbGl0eVxuXG4gICAgICAgIEBcblxuICAgIHBvc2l0aW9uOiAtPlxuICAgICAgICBpZiBAcG9zaXRpb25lZCBpcyBmYWxzZVxuICAgICAgICAgICAgQGdldEVsKCkuc3R5bGUubGVmdCA9IFwiI3tAZ2V0TGVmdCgpfSVcIlxuXG4gICAgICAgICAgICBAcG9zaXRpb25lZCA9IHRydWVcblxuICAgICAgICBAXG5cbiAgICBhY3RpdmF0ZTogLT5cbiAgICAgICAgQGFjdGl2ZSA9IHRydWVcbiAgICAgICAgQGdldEVsKCkuc2V0QXR0cmlidXRlICdkYXRhLWFjdGl2ZScsIEBhY3RpdmVcblxuICAgICAgICByZXR1cm5cblxuICAgIGRlYWN0aXZhdGU6IC0+XG4gICAgICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgICAgICBAZ2V0RWwoKS5zZXRBdHRyaWJ1dGUgJ2RhdGEtYWN0aXZlJywgQGFjdGl2ZVxuXG4gICAgICAgIHJldHVyblxuIiwiSGFtbWVyID0gcmVxdWlyZSAnaGFtbWVyanMnXG5NaWNyb0V2ZW50ID0gcmVxdWlyZSAnbWljcm9ldmVudCdcblBhZ2VTcHJlYWQgPSByZXF1aXJlICcuL3BhZ2Vfc3ByZWFkJ1xuQW5pbWF0aW9uID0gcmVxdWlyZSAnLi9hbmltYXRpb24nXG5cbmNsYXNzIFZlcnNvXG4gICAgY29uc3RydWN0b3I6IChAZWwsIEBvcHRpb25zID0ge30pIC0+XG4gICAgICAgIEBzd2lwZVZlbG9jaXR5ID0gQG9wdGlvbnMuc3dpcGVWZWxvY2l0eSA/IDAuM1xuICAgICAgICBAc3dpcGVUaHJlc2hvbGQgPSBAb3B0aW9ucy5zd2lwZVRocmVzaG9sZCA/IDEwXG4gICAgICAgIEBuYXZpZ2F0aW9uRHVyYXRpb24gPSBAb3B0aW9ucy5uYXZpZ2F0aW9uRHVyYXRpb24gPyAyNDBcbiAgICAgICAgQG5hdmlnYXRpb25QYW5EdXJhdGlvbiA9IEBvcHRpb25zLm5hdmlnYXRpb25QYW5EdXJhdGlvbiA/IDIwMFxuICAgICAgICBAem9vbUR1cmF0aW9uID0gQG9wdGlvbnMuem9vbUR1cmF0aW9uID8gMjAwXG4gICAgICAgIEBkb3VibGVUYXBEZWxheSA9IEBvcHRpb25zLmRvdWJsZVRhcERlbGF5ID8gMzAwXG5cbiAgICAgICAgQHBvc2l0aW9uID0gLTFcbiAgICAgICAgQHBpbmNoaW5nID0gZmFsc2VcbiAgICAgICAgQHBhbm5pbmcgPSBmYWxzZVxuICAgICAgICBAdHJhbnNmb3JtID0gbGVmdDogMCwgdG9wOiAwLCBzY2FsZTogMVxuICAgICAgICBAc3RhcnRUcmFuc2Zvcm0gPSBsZWZ0OiAwLCB0b3A6IDAsIHNjYWxlOiAxXG4gICAgICAgIEB0YXAgPVxuICAgICAgICAgICAgY291bnQ6IDBcbiAgICAgICAgICAgIGRlbGF5OiBAZG91YmxlVGFwRGVsYXlcblxuICAgICAgICBAc2Nyb2xsZXJFbCA9IEBlbC5xdWVyeVNlbGVjdG9yICcudmVyc29fX3Njcm9sbGVyJ1xuICAgICAgICBAcGFnZVNwcmVhZEVscyA9IEBlbC5xdWVyeVNlbGVjdG9yQWxsICcudmVyc29fX3BhZ2Utc3ByZWFkJ1xuICAgICAgICBAcGFnZVNwcmVhZHMgPSBAdHJhdmVyc2VQYWdlU3ByZWFkcyBAcGFnZVNwcmVhZEVsc1xuICAgICAgICBAcGFnZUlkcyA9IEBidWlsZFBhZ2VJZHMgQHBhZ2VTcHJlYWRzXG4gICAgICAgIEBhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIEBzY3JvbGxlckVsXG4gICAgICAgIEBoYW1tZXIgPSBuZXcgSGFtbWVyLk1hbmFnZXIgQHNjcm9sbGVyRWwsXG4gICAgICAgICAgICB0b3VjaEFjdGlvbjogJ25vbmUnXG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlXG4gICAgICAgICAgICBpbnB1dENsYXNzOiBAZ2V0SGFtbWVySW5wdXRDbGFzcygpXG5cbiAgICAgICAgQGhhbW1lci5hZGQgbmV3IEhhbW1lci5QYW4gdGhyZXNob2xkOiA1LCBkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fQUxMXG4gICAgICAgIEBoYW1tZXIuYWRkIG5ldyBIYW1tZXIuVGFwIGV2ZW50OiAnc2luZ2xldGFwJywgaW50ZXJ2YWw6IDBcbiAgICAgICAgQGhhbW1lci5hZGQgbmV3IEhhbW1lci5QaW5jaCgpXG4gICAgICAgIEBoYW1tZXIuYWRkIG5ldyBIYW1tZXIuUHJlc3MgdGltZTogNTAwXG4gICAgICAgIEBoYW1tZXIub24gJ3BhbnN0YXJ0JywgQG9uUGFuU3RhcnQuYmluZCBAXG4gICAgICAgIEBoYW1tZXIub24gJ3Bhbm1vdmUnLCBAb25QYW5Nb3ZlLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwYW5lbmQnLCBAb25QYW5FbmQuYmluZCBAXG4gICAgICAgIEBoYW1tZXIub24gJ3BhbmNhbmNlbCcsIEBvblBhbkVuZC5iaW5kIEBcbiAgICAgICAgQGhhbW1lci5vbiAnc2luZ2xldGFwJywgQG9uU2luZ2xldGFwLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwaW5jaHN0YXJ0JywgQG9uUGluY2hTdGFydC5iaW5kIEBcbiAgICAgICAgQGhhbW1lci5vbiAncGluY2htb3ZlJywgQG9uUGluY2hNb3ZlLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwaW5jaGVuZCcsIEBvblBpbmNoRW5kLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwaW5jaGNhbmNlbCcsIEBvblBpbmNoRW5kLmJpbmQgQFxuICAgICAgICBAaGFtbWVyLm9uICdwcmVzcycsIEBvblByZXNzLmJpbmQgQFxuXG4gICAgICAgIEBzY3JvbGxlckVsLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgQG9uQ29udGV4dG1lbnUuYmluZCBAXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBzdGFydDogLT5cbiAgICAgICAgcGFnZUlkID0gQGdldFBhZ2VTcHJlYWRQb3NpdGlvbkZyb21QYWdlSWQoQG9wdGlvbnMucGFnZUlkKSA/IDBcblxuICAgICAgICBAaGFtbWVyLnNldCBlbmFibGU6IHRydWVcbiAgICAgICAgQG5hdmlnYXRlVG8gcGFnZUlkLCBkdXJhdGlvbjogMFxuXG4gICAgICAgIEByZXNpemVMaXN0ZW5lciA9IEBvblJlc2l6ZS5iaW5kIEBcbiAgICAgICAgQHRvdWNoU3RhcnRMaXN0ZW5lciA9IEBvblRvdWNoU3RhcnQuYmluZCBAXG4gICAgICAgIEB0b3VjaEVuZExpc3RlbmVyID0gQG9uVG91Y2hFbmQuYmluZCBAXG5cbiAgICAgICAgQGVsLmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNoc3RhcnQnLCBAdG91Y2hTdGFydExpc3RlbmVyLCBmYWxzZVxuICAgICAgICBAZWwuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2hlbmQnLCBAdG91Y2hFbmRMaXN0ZW5lciwgZmFsc2VcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgQHJlc2l6ZUxpc3RlbmVyLCBmYWxzZVxuXG4gICAgICAgIEBcblxuICAgIGRlc3Ryb3k6IC0+XG4gICAgICAgIEBoYW1tZXIuZGVzdHJveSgpXG5cbiAgICAgICAgQGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIgJ3RvdWNoc3RhcnQnLCBAdG91Y2hTdGFydExpc3RlbmVyXG4gICAgICAgIEBlbC5yZW1vdmVFdmVudExpc3RlbmVyICd0b3VjaGVuZCcsIEB0b3VjaEVuZExpc3RlbmVyXG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIEByZXNpemVMaXN0ZW5lclxuXG4gICAgICAgIEBcblxuICAgIGZpcnN0OiAob3B0aW9ucykgLT5cbiAgICAgICAgQG5hdmlnYXRlVG8gMCwgb3B0aW9uc1xuXG4gICAgcHJldjogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBuYXZpZ2F0ZVRvIEBnZXRQb3NpdGlvbigpIC0gMSwgb3B0aW9uc1xuXG4gICAgbmV4dDogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBuYXZpZ2F0ZVRvIEBnZXRQb3NpdGlvbigpICsgMSwgb3B0aW9uc1xuXG4gICAgbGFzdDogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBuYXZpZ2F0ZVRvIEBnZXRQYWdlU3ByZWFkQ291bnQoKSAtIDEsIG9wdGlvbnNcblxuICAgIG5hdmlnYXRlVG86IChwb3NpdGlvbiwgb3B0aW9ucyA9IHt9KSAtPlxuICAgICAgICByZXR1cm4gaWYgcG9zaXRpb24gPCAwIG9yIHBvc2l0aW9uID4gQGdldFBhZ2VTcHJlYWRDb3VudCgpIC0gMVxuXG4gICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IEBnZXRQb3NpdGlvbigpXG4gICAgICAgIGN1cnJlbnRQYWdlU3ByZWFkID0gQGdldFBhZ2VTcHJlYWRGcm9tUG9zaXRpb24gY3VycmVudFBvc2l0aW9uXG4gICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQgPSBAZ2V0UGFnZVNwcmVhZEZyb21Qb3NpdGlvbiBwb3NpdGlvblxuICAgICAgICBjYXJvdXNlbCA9IEBnZXRDYXJvdXNlbEZyb21QYWdlU3ByZWFkIGFjdGl2ZVBhZ2VTcHJlYWRcbiAgICAgICAgdmVsb2NpdHkgPSBvcHRpb25zLnZlbG9jaXR5ID8gMVxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gPyBAbmF2aWdhdGlvbkR1cmF0aW9uXG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gLyBNYXRoLmFicyh2ZWxvY2l0eSlcbiAgICAgICAgdG91Y2hBY3Rpb24gPSBpZiBhY3RpdmVQYWdlU3ByZWFkLmlzU2Nyb2xsYWJsZSgpIHRoZW4gJ3Bhbi15JyBlbHNlICdub25lJ1xuXG4gICAgICAgIGN1cnJlbnRQYWdlU3ByZWFkLmRlYWN0aXZhdGUoKSBpZiBjdXJyZW50UGFnZVNwcmVhZD9cbiAgICAgICAgYWN0aXZlUGFnZVNwcmVhZC5hY3RpdmF0ZSgpXG5cbiAgICAgICAgY2Fyb3VzZWwudmlzaWJsZS5mb3JFYWNoIChwYWdlU3ByZWFkKSAtPiBwYWdlU3ByZWFkLnBvc2l0aW9uKCkuc2V0VmlzaWJpbGl0eSAndmlzaWJsZSdcblxuICAgICAgICBAaGFtbWVyLnNldCB0b3VjaEFjdGlvbjogdG91Y2hBY3Rpb25cblxuICAgICAgICBAdHJhbnNmb3JtLmxlZnQgPSBAZ2V0TGVmdFRyYW5zZm9ybUZyb21QYWdlU3ByZWFkIHBvc2l0aW9uLCBhY3RpdmVQYWdlU3ByZWFkXG4gICAgICAgIEBzZXRQb3NpdGlvbiBwb3NpdGlvblxuXG4gICAgICAgIGlmIEB0cmFuc2Zvcm0uc2NhbGUgPiAxXG4gICAgICAgICAgICBAdHJhbnNmb3JtLnRvcCA9IDBcbiAgICAgICAgICAgIEB0cmFuc2Zvcm0uc2NhbGUgPSAxXG5cbiAgICAgICAgICAgIEB0cmlnZ2VyICd6b29tZWRPdXQnLCBwb3NpdGlvbjogY3VycmVudFBvc2l0aW9uXG5cbiAgICAgICAgQHRyaWdnZXIgJ2JlZm9yZU5hdmlnYXRpb24nLFxuICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uOiBjdXJyZW50UG9zaXRpb25cbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uOiBwb3NpdGlvblxuXG4gICAgICAgIEBhbmltYXRpb24uYW5pbWF0ZVxuICAgICAgICAgICAgeDogXCIje0B0cmFuc2Zvcm0ubGVmdH0lXCJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvblxuICAgICAgICAsID0+XG4gICAgICAgICAgICBjYXJvdXNlbCA9IEBnZXRDYXJvdXNlbEZyb21QYWdlU3ByZWFkIEBnZXRBY3RpdmVQYWdlU3ByZWFkKClcblxuICAgICAgICAgICAgY2Fyb3VzZWwuZ29uZS5mb3JFYWNoIChwYWdlU3ByZWFkKSAtPiBwYWdlU3ByZWFkLnNldFZpc2liaWxpdHkgJ2dvbmUnXG5cbiAgICAgICAgICAgIEB0cmlnZ2VyICdhZnRlck5hdmlnYXRpb24nLFxuICAgICAgICAgICAgICAgIG5ld1Bvc2l0aW9uOiBAZ2V0UG9zaXRpb24oKVxuICAgICAgICAgICAgICAgIHByZXZpb3VzUG9zaXRpb246IGN1cnJlbnRQb3NpdGlvblxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXR1cm5cblxuICAgIGdldFBvc2l0aW9uOiAtPlxuICAgICAgICBAcG9zaXRpb25cblxuICAgIHNldFBvc2l0aW9uOiAocG9zaXRpb24pIC0+XG4gICAgICAgIEBwb3NpdGlvbiA9IHBvc2l0aW9uXG5cbiAgICAgICAgQFxuXG4gICAgZ2V0TGVmdFRyYW5zZm9ybUZyb21QYWdlU3ByZWFkOiAocG9zaXRpb24sIHBhZ2VTcHJlYWQpIC0+XG4gICAgICAgIGxlZnQgPSAwXG5cbiAgICAgICAgaWYgcG9zaXRpb24gaXMgQGdldFBhZ2VTcHJlYWRDb3VudCgpIC0gMVxuICAgICAgICAgICAgbGVmdCA9ICgxMDAgLSBwYWdlU3ByZWFkLmdldFdpZHRoKCkpIC0gcGFnZVNwcmVhZC5nZXRMZWZ0KClcbiAgICAgICAgZWxzZSBpZiBwb3NpdGlvbiA+IDBcbiAgICAgICAgICAgIGxlZnQgPSAoMTAwIC0gcGFnZVNwcmVhZC5nZXRXaWR0aCgpKSAvIDIgLSBwYWdlU3ByZWFkLmdldExlZnQoKVxuXG4gICAgICAgIGxlZnRcblxuICAgIGdldENhcm91c2VsRnJvbVBhZ2VTcHJlYWQ6IChwYWdlU3ByZWFkU3ViamVjdCkgLT5cbiAgICAgICAgY2Fyb3VzZWwgPVxuICAgICAgICAgICAgdmlzaWJsZTogW11cbiAgICAgICAgICAgIGdvbmU6IFtdXG5cbiAgICAgICAgIyBJZGVudGlmeSB0aGUgcGFnZSBzcHJlYWRzIHRoYXQgc2hvdWxkIGJlIGEgcGFydCBvZiB0aGUgY2Fyb3VzZWwuXG4gICAgICAgIEBwYWdlU3ByZWFkcy5mb3JFYWNoIChwYWdlU3ByZWFkKSAtPlxuICAgICAgICAgICAgdmlzaWJsZSA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIHBhZ2VTcHJlYWQuZ2V0TGVmdCgpIDw9IHBhZ2VTcHJlYWRTdWJqZWN0LmdldExlZnQoKVxuICAgICAgICAgICAgICAgIHZpc2libGUgPSB0cnVlIGlmIHBhZ2VTcHJlYWQuZ2V0TGVmdCgpICsgcGFnZVNwcmVhZC5nZXRXaWR0aCgpID4gcGFnZVNwcmVhZFN1YmplY3QuZ2V0TGVmdCgpIC0gMTAwXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdmlzaWJsZSA9IHRydWUgaWYgcGFnZVNwcmVhZC5nZXRMZWZ0KCkgLSBwYWdlU3ByZWFkLmdldFdpZHRoKCkgPCBwYWdlU3ByZWFkU3ViamVjdC5nZXRMZWZ0KCkgKyAxMDBcblxuICAgICAgICAgICAgaWYgdmlzaWJsZSBpcyB0cnVlXG4gICAgICAgICAgICAgICAgY2Fyb3VzZWwudmlzaWJsZS5wdXNoIHBhZ2VTcHJlYWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjYXJvdXNlbC5nb25lLnB1c2ggcGFnZVNwcmVhZFxuXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBjYXJvdXNlbFxuXG4gICAgdHJhdmVyc2VQYWdlU3ByZWFkczogKGVscykgLT5cbiAgICAgICAgcGFnZVNwcmVhZHMgPSBbXVxuICAgICAgICBsZWZ0ID0gMFxuXG4gICAgICAgIGZvciBlbCBpbiBlbHNcbiAgICAgICAgICAgIGlkID0gZWwuZ2V0QXR0cmlidXRlICdkYXRhLWlkJ1xuICAgICAgICAgICAgdHlwZSA9IGVsLmdldEF0dHJpYnV0ZSAnZGF0YS10eXBlJ1xuICAgICAgICAgICAgcGFnZUlkcyA9IGVsLmdldEF0dHJpYnV0ZSAnZGF0YS1wYWdlLWlkcydcbiAgICAgICAgICAgIHBhZ2VJZHMgPSBpZiBwYWdlSWRzPyB0aGVuIHBhZ2VJZHMuc3BsaXQoJywnKS5tYXAgKGkpIC0+IGkgZWxzZSBbXVxuICAgICAgICAgICAgbWF4Wm9vbVNjYWxlID0gZWwuZ2V0QXR0cmlidXRlICdkYXRhLW1heC16b29tLXNjYWxlJ1xuICAgICAgICAgICAgbWF4Wm9vbVNjYWxlID0gaWYgbWF4Wm9vbVNjYWxlPyB0aGVuICttYXhab29tU2NhbGUgZWxzZSAxXG4gICAgICAgICAgICB3aWR0aCA9IGVsLmdldEF0dHJpYnV0ZSAnZGF0YS13aWR0aCdcbiAgICAgICAgICAgIHdpZHRoID0gaWYgd2lkdGg/IHRoZW4gK3dpZHRoIGVsc2UgMTAwXG4gICAgICAgICAgICBwYWdlU3ByZWFkID0gbmV3IFBhZ2VTcHJlYWQgZWwsXG4gICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICAgICAgICAgIHBhZ2VJZHM6IHBhZ2VJZHNcbiAgICAgICAgICAgICAgICBtYXhab29tU2NhbGU6IG1heFpvb21TY2FsZVxuICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aFxuICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRcblxuICAgICAgICAgICAgbGVmdCArPSB3aWR0aFxuXG4gICAgICAgICAgICBwYWdlU3ByZWFkcy5wdXNoIHBhZ2VTcHJlYWRcblxuICAgICAgICBwYWdlU3ByZWFkc1xuXG4gICAgYnVpbGRQYWdlSWRzOiAocGFnZVNwcmVhZHMpIC0+XG4gICAgICAgIHBhZ2VJZHMgPSB7fVxuXG4gICAgICAgIHBhZ2VTcHJlYWRzLmZvckVhY2ggKHBhZ2VTcHJlYWQsIGkpIC0+XG4gICAgICAgICAgICBwYWdlU3ByZWFkLm9wdGlvbnMucGFnZUlkcy5mb3JFYWNoIChwYWdlSWQpIC0+XG4gICAgICAgICAgICAgICAgcGFnZUlkc1twYWdlSWRdID0gcGFnZVNwcmVhZFxuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHBhZ2VJZHNcblxuICAgIGlzQ29vcmRpbmF0ZUluc2lkZUVsZW1lbnQ6ICh4LCB5LCBlbCkgLT5cbiAgICAgICAgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgICAgeCA+PSByZWN0LmxlZnQgYW5kIHggPD0gcmVjdC5yaWdodCBhbmQgeSA+PSByZWN0LnRvcCBhbmQgeSA8PSByZWN0LmJvdHRvbVxuXG4gICAgZ2V0Q29vcmRpbmF0ZUluZm86ICh4LCB5LCBwYWdlU3ByZWFkKSAtPlxuICAgICAgICB4IC09IEBlbC5vZmZzZXRMZWZ0XG4gICAgICAgIHkgLT0gQGVsLm9mZnNldFRvcFxuICAgICAgICBpbmZvID1cbiAgICAgICAgICAgIHg6IHhcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgICAgIGNvbnRlbnRYOiAwXG4gICAgICAgICAgICBjb250ZW50WTogMFxuICAgICAgICAgICAgcGFnZVg6IDBcbiAgICAgICAgICAgIHBhZ2VZOiAwXG4gICAgICAgICAgICBvdmVybGF5RWxzOiBbXVxuICAgICAgICAgICAgcGFnZUVsOiBudWxsXG4gICAgICAgICAgICBpc0luc2lkZUNvbnRlbnRYOiBmYWxzZVxuICAgICAgICAgICAgaXNJbnNpZGVDb250ZW50WTogZmFsc2VcbiAgICAgICAgICAgIGlzSW5zaWRlQ29udGVudDogZmFsc2VcbiAgICAgICAgY29udGVudFJlY3QgPSBwYWdlU3ByZWFkLmdldENvbnRlbnRSZWN0KClcbiAgICAgICAgb3ZlcmxheUVscyA9IHBhZ2VTcHJlYWQuZ2V0T3ZlcmxheUVscygpXG4gICAgICAgIHBhZ2VFbHMgPSBwYWdlU3ByZWFkLmdldFBhZ2VFbHMoKVxuXG4gICAgICAgIGZvciBvdmVybGF5RWwgaW4gb3ZlcmxheUVsc1xuICAgICAgICAgICAgaW5mby5vdmVybGF5RWxzLnB1c2ggb3ZlcmxheUVsIGlmIEBpc0Nvb3JkaW5hdGVJbnNpZGVFbGVtZW50KHgsIHksIG92ZXJsYXlFbClcblxuICAgICAgICBmb3IgcGFnZUVsIGluIHBhZ2VFbHNcbiAgICAgICAgICAgIGlmIEBpc0Nvb3JkaW5hdGVJbnNpZGVFbGVtZW50KHgsIHksIHBhZ2VFbClcbiAgICAgICAgICAgICAgICBpbmZvLnBhZ2VFbCA9IHBhZ2VFbFxuICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgaW5mby5jb250ZW50WCA9ICh4IC0gY29udGVudFJlY3QubGVmdCkgLyBNYXRoLm1heCgxLCBjb250ZW50UmVjdC53aWR0aClcbiAgICAgICAgaW5mby5jb250ZW50WSA9ICh5IC0gY29udGVudFJlY3QudG9wKSAvIE1hdGgubWF4KDEsIGNvbnRlbnRSZWN0LmhlaWdodClcblxuICAgICAgICBpZiBpbmZvLnBhZ2VFbD9cbiAgICAgICAgICAgIGluZm8uaXNJbnNpZGVDb250ZW50WCA9IGluZm8uY29udGVudFggPj0gMCBhbmQgaW5mby5jb250ZW50WCA8PSAxXG4gICAgICAgICAgICBpbmZvLmlzSW5zaWRlQ29udGVudFkgPSBpbmZvLmNvbnRlbnRZID49IDAgYW5kIGluZm8uY29udGVudFkgPD0gMVxuICAgICAgICAgICAgaW5mby5pc0luc2lkZUNvbnRlbnQgPSBpbmZvLmlzSW5zaWRlQ29udGVudFggYW5kIGluZm8uaXNJbnNpZGVDb250ZW50WVxuXG4gICAgICAgIGluZm9cblxuICAgIGdldFBhZ2VTcHJlYWRDb3VudDogLT5cbiAgICAgICAgQHBhZ2VTcHJlYWRzLmxlbmd0aFxuXG4gICAgZ2V0QWN0aXZlUGFnZVNwcmVhZDogLT5cbiAgICAgICAgQGdldFBhZ2VTcHJlYWRGcm9tUG9zaXRpb24gQGdldFBvc2l0aW9uKClcblxuICAgIGdldFBhZ2VTcHJlYWRGcm9tUG9zaXRpb246IChwb3NpdGlvbikgLT5cbiAgICAgICAgQHBhZ2VTcHJlYWRzW3Bvc2l0aW9uXVxuXG4gICAgZ2V0UGFnZVNwcmVhZFBvc2l0aW9uRnJvbVBhZ2VJZDogKHBhZ2VJZCkgLT5cbiAgICAgICAgZm9yIHBhZ2VTcHJlYWQsIGlkeCBpbiBAcGFnZVNwcmVhZHNcbiAgICAgICAgICAgIHJldHVybiBpZHggaWYgcGFnZVNwcmVhZC5vcHRpb25zLnBhZ2VJZHMuaW5kZXhPZihwYWdlSWQpID4gLTFcblxuICAgIGdldFBhZ2VTcHJlYWRCb3VuZHM6IChwYWdlU3ByZWFkKSAtPlxuICAgICAgICBwYWdlU3ByZWFkUmVjdCA9IHBhZ2VTcHJlYWQuZ2V0UmVjdCgpXG4gICAgICAgIHBhZ2VTcHJlYWRDb250ZW50UmVjdCA9IHBhZ2VTcHJlYWQuZ2V0Q29udGVudFJlY3QoKVxuXG4gICAgICAgIGxlZnQ6IChwYWdlU3ByZWFkQ29udGVudFJlY3QubGVmdCAtIHBhZ2VTcHJlYWRSZWN0LmxlZnQpIC8gcGFnZVNwcmVhZFJlY3Qud2lkdGggKiAxMDBcbiAgICAgICAgdG9wOiAocGFnZVNwcmVhZENvbnRlbnRSZWN0LnRvcCAtIHBhZ2VTcHJlYWRSZWN0LnRvcCkgLyBwYWdlU3ByZWFkUmVjdC5oZWlnaHQgKiAxMDBcbiAgICAgICAgd2lkdGg6IHBhZ2VTcHJlYWRDb250ZW50UmVjdC53aWR0aCAvIHBhZ2VTcHJlYWRSZWN0LndpZHRoICogMTAwXG4gICAgICAgIGhlaWdodDogcGFnZVNwcmVhZENvbnRlbnRSZWN0LmhlaWdodCAvIHBhZ2VTcHJlYWRSZWN0LmhlaWdodCAqIDEwMFxuICAgICAgICBwYWdlU3ByZWFkUmVjdDogcGFnZVNwcmVhZFJlY3RcbiAgICAgICAgcGFnZVNwcmVhZENvbnRlbnRSZWN0OiBwYWdlU3ByZWFkQ29udGVudFJlY3RcblxuICAgIGNsaXBDb29yZGluYXRlOiAoY29vcmRpbmF0ZSwgc2NhbGUsIHNpemUsIG9mZnNldCkgLT5cbiAgICAgICAgaWYgc2l6ZSAqIHNjYWxlIDwgMTAwXG4gICAgICAgICAgICBjb29yZGluYXRlID0gb2Zmc2V0ICogLXNjYWxlICsgNTAgLSAoc2l6ZSAqIHNjYWxlIC8gMilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29vcmRpbmF0ZSA9IE1hdGgubWluIGNvb3JkaW5hdGUsIG9mZnNldCAqIC1zY2FsZVxuICAgICAgICAgICAgY29vcmRpbmF0ZSA9IE1hdGgubWF4IGNvb3JkaW5hdGUsIG9mZnNldCAqIC1zY2FsZSAtIHNpemUgKiBzY2FsZSArIDEwMFxuXG4gICAgICAgIGNvb3JkaW5hdGVcblxuICAgIHpvb21UbzogKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIC0+XG4gICAgICAgIHNjYWxlID0gb3B0aW9ucy5zY2FsZVxuICAgICAgICBjdXJTY2FsZSA9IEB0cmFuc2Zvcm0uc2NhbGVcbiAgICAgICAgYWN0aXZlUGFnZVNwcmVhZCA9IEBnZXRBY3RpdmVQYWdlU3ByZWFkKClcbiAgICAgICAgcGFnZVNwcmVhZEJvdW5kcyA9IEBnZXRQYWdlU3ByZWFkQm91bmRzIGFjdGl2ZVBhZ2VTcHJlYWRcbiAgICAgICAgY2Fyb3VzZWxPZmZzZXQgPSBhY3RpdmVQYWdlU3ByZWFkLmdldExlZnQoKVxuICAgICAgICBjYXJvdXNlbFNjYWxlZE9mZnNldCA9IGNhcm91c2VsT2Zmc2V0ICogY3VyU2NhbGVcbiAgICAgICAgeCA9IG9wdGlvbnMueCA/IDBcbiAgICAgICAgeSA9IG9wdGlvbnMueSA/IDBcblxuICAgICAgICBpZiBzY2FsZSBpc250IDFcbiAgICAgICAgICAgIHggLT0gcGFnZVNwcmVhZEJvdW5kcy5wYWdlU3ByZWFkUmVjdC5sZWZ0XG4gICAgICAgICAgICB5IC09IHBhZ2VTcHJlYWRCb3VuZHMucGFnZVNwcmVhZFJlY3QudG9wXG4gICAgICAgICAgICB4ID0geCAvIChwYWdlU3ByZWFkQm91bmRzLnBhZ2VTcHJlYWRSZWN0LndpZHRoIC8gY3VyU2NhbGUpICogMTAwXG4gICAgICAgICAgICB5ID0geSAvIChwYWdlU3ByZWFkQm91bmRzLnBhZ2VTcHJlYWRSZWN0LmhlaWdodCAvIGN1clNjYWxlKSAqIDEwMFxuICAgICAgICAgICAgeCA9IEB0cmFuc2Zvcm0ubGVmdCArIGNhcm91c2VsU2NhbGVkT2Zmc2V0ICsgeCAtICh4ICogc2NhbGUgLyBjdXJTY2FsZSlcbiAgICAgICAgICAgIHkgPSBAdHJhbnNmb3JtLnRvcCArIHkgLSAoeSAqIHNjYWxlIC8gY3VyU2NhbGUpXG5cbiAgICAgICAgICAgICMgTWFrZSBzdXJlIHRoZSBhbmltYXRpb24gZG9lc24ndCBleGNlZWQgdGhlIGNvbnRlbnQgYm91bmRzLlxuICAgICAgICAgICAgaWYgb3B0aW9ucy5ib3VuZHMgaXNudCBmYWxzZSBhbmQgc2NhbGUgPiAxXG4gICAgICAgICAgICAgICAgeCA9IEBjbGlwQ29vcmRpbmF0ZSB4LCBzY2FsZSwgcGFnZVNwcmVhZEJvdW5kcy53aWR0aCwgcGFnZVNwcmVhZEJvdW5kcy5sZWZ0XG4gICAgICAgICAgICAgICAgeSA9IEBjbGlwQ29vcmRpbmF0ZSB5LCBzY2FsZSwgcGFnZVNwcmVhZEJvdW5kcy5oZWlnaHQsIHBhZ2VTcHJlYWRCb3VuZHMudG9wXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHggPSAwXG4gICAgICAgICAgICB5ID0gMFxuXG4gICAgICAgICMgQWNjb3VudCBmb3IgdGhlIHBhZ2Ugc3ByZWFkcyBsZWZ0IG9mIHRoZSBhY3RpdmUgb25lLlxuICAgICAgICB4IC09IGNhcm91c2VsT2Zmc2V0ICogc2NhbGVcblxuICAgICAgICBAdHJhbnNmb3JtLmxlZnQgPSB4XG4gICAgICAgIEB0cmFuc2Zvcm0udG9wID0geVxuICAgICAgICBAdHJhbnNmb3JtLnNjYWxlID0gc2NhbGVcblxuICAgICAgICBAYW5pbWF0aW9uLmFuaW1hdGVcbiAgICAgICAgICAgIHg6IFwiI3t4fSVcIlxuICAgICAgICAgICAgeTogXCIje3l9JVwiXG4gICAgICAgICAgICBzY2FsZTogc2NhbGVcbiAgICAgICAgICAgIGVhc2luZzogb3B0aW9ucy5lYXNpbmdcbiAgICAgICAgICAgIGR1cmF0aW9uOiBvcHRpb25zLmR1cmF0aW9uXG4gICAgICAgICwgY2FsbGJhY2tcblxuICAgICAgICByZXR1cm5cblxuICAgIHJlZnJlc2g6IC0+XG4gICAgICAgIEBwYWdlU3ByZWFkRWxzID0gQGVsLnF1ZXJ5U2VsZWN0b3JBbGwgJy52ZXJzb19fcGFnZS1zcHJlYWQnXG4gICAgICAgIEBwYWdlU3ByZWFkcyA9IEB0cmF2ZXJzZVBhZ2VTcHJlYWRzIEBwYWdlU3ByZWFkRWxzXG4gICAgICAgIEBwYWdlSWRzID0gQGJ1aWxkUGFnZUlkcyBAcGFnZVNwcmVhZHNcblxuICAgICAgICBAXG4gICAgXG4gICAgZ2V0SGFtbWVySW5wdXRDbGFzczogLT5cbiAgICAgICAgbW9iaWxlUmVnZXggPSAvbW9iaWxlfHRhYmxldHxpcChhZHxob25lfG9kKXxhbmRyb2lkL2lcbiAgICAgICAgc3VwcG9ydFRvdWNoID0gJ29udG91Y2hzdGFydCcgb2Ygd2luZG93XG5cbiAgICAgICAgaWYgc3VwcG9ydFRvdWNoIGFuZCBtb2JpbGVSZWdleC50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpIHRoZW4gSGFtbWVyLlRvdWNoSW5wdXQgZWxzZSBudWxsXG5cbiAgICAjIyMjIyMjIyMjIyMjI1xuICAgICMjIyBFdmVudHMgIyMjXG4gICAgIyMjIyMjIyMjIyMjIyNcblxuICAgIG9uUGFuU3RhcnQ6IChlKSAtPlxuICAgICAgICAjIE9ubHkgYWxsb3cgcGFubmluZyBpZiB6b29tZWQgaW4gb3IgZG9pbmcgYSBob3Jpem9udGFsIHBhbi5cbiAgICAgICAgIyBUaGlzIGVuc3VyZXMgdmVydGljYWwgc2Nyb2xsaW5nIHdvcmtzIGZvciBzY3JvbGxhYmxlIHBhZ2Ugc3ByZWFkcy5cbiAgICAgICAgaWYgQHRyYW5zZm9ybS5zY2FsZSA+IDEgb3IgKGUuZGlyZWN0aW9uIGlzIEhhbW1lci5ESVJFQ1RJT05fTEVGVCBvciBlLmRpcmVjdGlvbiBpcyBIYW1tZXIuRElSRUNUSU9OX1JJR0hUKVxuICAgICAgICAgICAgeCA9IGUuY2VudGVyLnhcbiAgICAgICAgICAgIGVkZ2VUaHJlc2hvbGQgPSAzMFxuICAgICAgICAgICAgd2lkdGggPSBAc2Nyb2xsZXJFbC5vZmZzZXRXaWR0aFxuXG4gICAgICAgICAgICAjIFByZXZlbnQgcGFubmluZyB3aGVuIGVkZ2Utc3dpcGluZyBvbiBpT1MuXG4gICAgICAgICAgICBpZiB4ID4gZWRnZVRocmVzaG9sZCBhbmQgeCA8IHdpZHRoIC0gZWRnZVRocmVzaG9sZFxuICAgICAgICAgICAgICAgIEBzdGFydFRyYW5zZm9ybS5sZWZ0ID0gQHRyYW5zZm9ybS5sZWZ0XG4gICAgICAgICAgICAgICAgQHN0YXJ0VHJhbnNmb3JtLnRvcCA9IEB0cmFuc2Zvcm0udG9wXG5cbiAgICAgICAgICAgICAgICBAcGFubmluZyA9IHRydWVcblxuICAgICAgICAgICAgICAgIEB0cmlnZ2VyICdwYW5TdGFydCdcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uUGFuTW92ZTogKGUpIC0+XG4gICAgICAgIHJldHVybiBpZiBAcGluY2hpbmcgaXMgdHJ1ZSBvciBAcGFubmluZyBpcyBmYWxzZVxuXG4gICAgICAgIGlmIEB0cmFuc2Zvcm0uc2NhbGUgPiAxXG4gICAgICAgICAgICBhY3RpdmVQYWdlU3ByZWFkID0gQGdldEFjdGl2ZVBhZ2VTcHJlYWQoKVxuICAgICAgICAgICAgY2Fyb3VzZWxPZmZzZXQgPSBhY3RpdmVQYWdlU3ByZWFkLmdldExlZnQoKVxuICAgICAgICAgICAgY2Fyb3VzZWxTY2FsZWRPZmZzZXQgPSBjYXJvdXNlbE9mZnNldCAqIEB0cmFuc2Zvcm0uc2NhbGVcbiAgICAgICAgICAgIHBhZ2VTcHJlYWRCb3VuZHMgPSBAZ2V0UGFnZVNwcmVhZEJvdW5kcyBhY3RpdmVQYWdlU3ByZWFkXG4gICAgICAgICAgICBzY2FsZSA9IEB0cmFuc2Zvcm0uc2NhbGVcbiAgICAgICAgICAgIHggPSBAc3RhcnRUcmFuc2Zvcm0ubGVmdCArIGNhcm91c2VsU2NhbGVkT2Zmc2V0ICsgZS5kZWx0YVggLyBAc2Nyb2xsZXJFbC5vZmZzZXRXaWR0aCAqIDEwMFxuICAgICAgICAgICAgeSA9IEBzdGFydFRyYW5zZm9ybS50b3AgKyBlLmRlbHRhWSAvIEBzY3JvbGxlckVsLm9mZnNldEhlaWdodCAqIDEwMFxuICAgICAgICAgICAgeCA9IEBjbGlwQ29vcmRpbmF0ZSB4LCBzY2FsZSwgcGFnZVNwcmVhZEJvdW5kcy53aWR0aCwgcGFnZVNwcmVhZEJvdW5kcy5sZWZ0XG4gICAgICAgICAgICB5ID0gQGNsaXBDb29yZGluYXRlIHksIHNjYWxlLCBwYWdlU3ByZWFkQm91bmRzLmhlaWdodCwgcGFnZVNwcmVhZEJvdW5kcy50b3BcbiAgICAgICAgICAgIHggLT0gY2Fyb3VzZWxTY2FsZWRPZmZzZXRcblxuICAgICAgICAgICAgQHRyYW5zZm9ybS5sZWZ0ID0geFxuICAgICAgICAgICAgQHRyYW5zZm9ybS50b3AgPSB5XG5cbiAgICAgICAgICAgIEBhbmltYXRpb24uYW5pbWF0ZVxuICAgICAgICAgICAgICAgIHg6IFwiI3t4fSVcIlxuICAgICAgICAgICAgICAgIHk6IFwiI3t5fSVcIlxuICAgICAgICAgICAgICAgIHNjYWxlOiBzY2FsZVxuICAgICAgICAgICAgICAgIGVhc2luZzogJ2xpbmVhcidcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgeCA9IEB0cmFuc2Zvcm0ubGVmdCArIGUuZGVsdGFYIC8gQHNjcm9sbGVyRWwub2Zmc2V0V2lkdGggKiAxMDBcblxuICAgICAgICAgICAgQGFuaW1hdGlvbi5hbmltYXRlXG4gICAgICAgICAgICAgICAgeDogXCIje3h9JVwiXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJ1xuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25QYW5FbmQ6IChlKSAtPlxuICAgICAgICByZXR1cm4gaWYgQHBhbm5pbmcgaXMgZmFsc2VcblxuICAgICAgICBAcGFubmluZyA9IGZhbHNlXG4gICAgICAgIEB0cmlnZ2VyICdwYW5FbmQnXG5cbiAgICAgICAgaWYgQHRyYW5zZm9ybS5zY2FsZSBpcyAxIGFuZCBAcGluY2hpbmcgaXMgZmFsc2VcbiAgICAgICAgICAgIHBvc2l0aW9uID0gQGdldFBvc2l0aW9uKClcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gZS5vdmVyYWxsVmVsb2NpdHlYXG5cbiAgICAgICAgICAgIGlmIE1hdGguYWJzKHZlbG9jaXR5KSA+PSBAc3dpcGVWZWxvY2l0eVxuICAgICAgICAgICAgICAgIGlmIE1hdGguYWJzKGUuZGVsdGFYKSA+PSBAc3dpcGVUaHJlc2hvbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgZS5vZmZzZXREaXJlY3Rpb24gaXMgSGFtbWVyLkRJUkVDVElPTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgICAgICBAbmV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBAbmF2aWdhdGlvblBhbkR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgZS5vZmZzZXREaXJlY3Rpb24gaXMgSGFtbWVyLkRJUkVDVElPTl9SSUdIVFxuICAgICAgICAgICAgICAgICAgICAgICAgQHByZXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eTogdmVsb2NpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogQG5hdmlnYXRpb25QYW5EdXJhdGlvblxuXG4gICAgICAgICAgICBpZiBwb3NpdGlvbiBpcyBAZ2V0UG9zaXRpb24oKVxuICAgICAgICAgICAgICAgIEBhbmltYXRpb24uYW5pbWF0ZVxuICAgICAgICAgICAgICAgICAgICB4OiBcIiN7QHRyYW5zZm9ybS5sZWZ0fSVcIlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogQG5hdmlnYXRpb25QYW5EdXJhdGlvblxuXG4gICAgICAgICAgICAgICAgQHRyaWdnZXIgJ2F0dGVtcHRlZE5hdmlnYXRpb24nLCBwb3NpdGlvbjogQGdldFBvc2l0aW9uKClcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uUGluY2hTdGFydDogKGUpIC0+XG4gICAgICAgIHJldHVybiBpZiBub3QgQGdldEFjdGl2ZVBhZ2VTcHJlYWQoKS5pc1pvb21hYmxlKClcblxuICAgICAgICBAcGluY2hpbmcgPSB0cnVlXG4gICAgICAgIEBlbC5zZXRBdHRyaWJ1dGUgJ2RhdGEtcGluY2hpbmcnLCB0cnVlXG4gICAgICAgIEBzdGFydFRyYW5zZm9ybS5zY2FsZSA9IEB0cmFuc2Zvcm0uc2NhbGVcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uUGluY2hNb3ZlOiAoZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIEBwaW5jaGluZyBpcyBmYWxzZVxuXG4gICAgICAgIEB6b29tVG9cbiAgICAgICAgICAgIHg6IGUuY2VudGVyLnhcbiAgICAgICAgICAgIHk6IGUuY2VudGVyLnlcbiAgICAgICAgICAgIHNjYWxlOiBAc3RhcnRUcmFuc2Zvcm0uc2NhbGUgKiBlLnNjYWxlXG4gICAgICAgICAgICBib3VuZHM6IGZhbHNlXG4gICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXInXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvblBpbmNoRW5kOiAoZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIEBwaW5jaGluZyBpcyBmYWxzZVxuXG4gICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQgPSBAZ2V0QWN0aXZlUGFnZVNwcmVhZCgpXG4gICAgICAgIG1heFpvb21TY2FsZSA9IGFjdGl2ZVBhZ2VTcHJlYWQuZ2V0TWF4Wm9vbVNjYWxlKClcbiAgICAgICAgc2NhbGUgPSBNYXRoLm1heCAxLCBNYXRoLm1pbihAdHJhbnNmb3JtLnNjYWxlLCBtYXhab29tU2NhbGUpXG4gICAgICAgIHBvc2l0aW9uID0gQGdldFBvc2l0aW9uKClcblxuICAgICAgICBpZiBAc3RhcnRUcmFuc2Zvcm0uc2NhbGUgaXMgMSBhbmQgc2NhbGUgPiAxXG4gICAgICAgICAgICBAdHJpZ2dlciAnem9vbWVkSW4nLCBwb3NpdGlvbjogcG9zaXRpb25cbiAgICAgICAgZWxzZSBpZiBAc3RhcnRUcmFuc2Zvcm0uc2NhbGUgPiAxIGFuZCBzY2FsZSBpcyAxXG4gICAgICAgICAgICBAdHJpZ2dlciAnem9vbWVkT3V0JywgcG9zaXRpb246IHBvc2l0aW9uXG5cbiAgICAgICAgQHpvb21Ub1xuICAgICAgICAgICAgeDogZS5jZW50ZXIueFxuICAgICAgICAgICAgeTogZS5jZW50ZXIueVxuICAgICAgICAgICAgc2NhbGU6IHNjYWxlXG4gICAgICAgICAgICBkdXJhdGlvbjogQHpvb21EdXJhdGlvblxuICAgICAgICAsID0+XG4gICAgICAgICAgICBAcGluY2hpbmcgPSBmYWxzZVxuICAgICAgICAgICAgQGVsLnNldEF0dHJpYnV0ZSAnZGF0YS1waW5jaGluZycsIGZhbHNlXG5cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25QcmVzczogKGUpIC0+XG4gICAgICAgIEB0cmlnZ2VyICdwcmVzc2VkJywgQGdldENvb3JkaW5hdGVJbmZvKGUuY2VudGVyLngsIGUuY2VudGVyLnksIEBnZXRBY3RpdmVQYWdlU3ByZWFkKCkpXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICBvbkNvbnRleHRtZW51OiAoZSkgLT5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgQHRyaWdnZXIgJ2NvbnRleHRtZW51JywgQGdldENvb3JkaW5hdGVJbmZvKGUuY2xpZW50WCwgZS5jbGllbnRZLCBAZ2V0QWN0aXZlUGFnZVNwcmVhZCgpKVxuXG4gICAgICAgIGZhbHNlXG5cbiAgICBvblNpbmdsZXRhcDogKGUpIC0+XG4gICAgICAgIGFjdGl2ZVBhZ2VTcHJlYWQgPSBAZ2V0QWN0aXZlUGFnZVNwcmVhZCgpXG4gICAgICAgIGNvb3JkaW5hdGVJbmZvID0gQGdldENvb3JkaW5hdGVJbmZvIGUuY2VudGVyLngsIGUuY2VudGVyLnksIGFjdGl2ZVBhZ2VTcHJlYWRcblxuICAgICAgICBjbGVhclRpbWVvdXQgQHRhcC50aW1lb3V0XG5cbiAgICAgICAgaWYgQHRhcC5jb3VudCBpcyAxXG4gICAgICAgICAgICBAdGFwLmNvdW50ID0gMFxuXG4gICAgICAgICAgICBAdHJpZ2dlciAnZG91YmxlQ2xpY2tlZCcsIGNvb3JkaW5hdGVJbmZvXG5cbiAgICAgICAgICAgIGlmIGFjdGl2ZVBhZ2VTcHJlYWQuaXNab29tYWJsZSgpXG4gICAgICAgICAgICAgICAgbWF4Wm9vbVNjYWxlID0gYWN0aXZlUGFnZVNwcmVhZC5nZXRNYXhab29tU2NhbGUoKVxuICAgICAgICAgICAgICAgIHpvb21lZEluID0gQHRyYW5zZm9ybS5zY2FsZSA+IDFcbiAgICAgICAgICAgICAgICBzY2FsZSA9IGlmIHpvb21lZEluIHRoZW4gMSBlbHNlIG1heFpvb21TY2FsZVxuICAgICAgICAgICAgICAgIHpvb21FdmVudCA9IGlmIHpvb21lZEluIHRoZW4gJ3pvb21lZE91dCcgZWxzZSAnem9vbWVkSW4nXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBAZ2V0UG9zaXRpb24oKVxuXG4gICAgICAgICAgICAgICAgQHpvb21Ub1xuICAgICAgICAgICAgICAgICAgICB4OiBlLmNlbnRlci54XG4gICAgICAgICAgICAgICAgICAgIHk6IGUuY2VudGVyLnlcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IHNjYWxlXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBAem9vbUR1cmF0aW9uXG4gICAgICAgICAgICAgICAgLCA9PlxuICAgICAgICAgICAgICAgICAgICBAdHJpZ2dlciB6b29tRXZlbnQsIHBvc2l0aW9uOiBwb3NpdGlvblxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdGFwLmNvdW50KytcbiAgICAgICAgICAgIEB0YXAudGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgICAgICBAdGFwLmNvdW50ID0gMFxuXG4gICAgICAgICAgICAgICAgQHRyaWdnZXIgJ2NsaWNrZWQnLCBjb29yZGluYXRlSW5mb1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAsIEB0YXAuZGVsYXlcblxuICAgICAgICByZXR1cm5cblxuICAgIG9uVG91Y2hTdGFydDogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKSBpZiBub3QgQGdldEFjdGl2ZVBhZ2VTcHJlYWQoKS5pc1Njcm9sbGFibGUoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25Ub3VjaEVuZDogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKSBpZiBub3QgQGdldEFjdGl2ZVBhZ2VTcHJlYWQoKS5pc1Njcm9sbGFibGUoKVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgb25SZXNpemU6IC0+XG4gICAgICAgIGlmIEB0cmFuc2Zvcm0uc2NhbGUgPiAxXG4gICAgICAgICAgICBwb3NpdGlvbiA9IEBnZXRQb3NpdGlvbigpXG4gICAgICAgICAgICBhY3RpdmVQYWdlU3ByZWFkID0gQGdldEFjdGl2ZVBhZ2VTcHJlYWQoKVxuXG4gICAgICAgICAgICBAdHJhbnNmb3JtLmxlZnQgPSBAZ2V0TGVmdFRyYW5zZm9ybUZyb21QYWdlU3ByZWFkIHBvc2l0aW9uLCBhY3RpdmVQYWdlU3ByZWFkXG4gICAgICAgICAgICBAdHJhbnNmb3JtLnRvcCA9IDBcbiAgICAgICAgICAgIEB0cmFuc2Zvcm0uc2NhbGUgPSAxXG5cbiAgICAgICAgICAgIEB6b29tVG9cbiAgICAgICAgICAgICAgICB4OiBAdHJhbnNmb3JtLmxlZnRcbiAgICAgICAgICAgICAgICB5OiBAdHJhbnNmb3JtLnRvcFxuICAgICAgICAgICAgICAgIHNjYWxlOiBAdHJhbnNmb3JtLnNjYWxlXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDBcblxuICAgICAgICAgICAgQHRyaWdnZXIgJ3pvb21lZE91dCcsIHBvc2l0aW9uOiBwb3NpdGlvblxuXG4gICAgICAgIHJldHVyblxuXG5NaWNyb0V2ZW50Lm1peGluIFZlcnNvXG5cbm1vZHVsZS5leHBvcnRzID0gVmVyc29cbiIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjcgLSAyMDE2LTA0LTIyXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBleHBvcnROYW1lLCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG52YXIgVkVORE9SX1BSRUZJWEVTID0gWycnLCAnd2Via2l0JywgJ01veicsICdNUycsICdtcycsICdvJ107XG52YXIgVEVTVF9FTEVNRU5UID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbnZhciBUWVBFX0ZVTkNUSU9OID0gJ2Z1bmN0aW9uJztcblxudmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbnZhciBhYnMgPSBNYXRoLmFicztcbnZhciBub3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBzZXQgYSB0aW1lb3V0IHdpdGggYSBnaXZlbiBzY29wZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0XG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gc2V0VGltZW91dENvbnRleHQoZm4sIHRpbWVvdXQsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChiaW5kRm4oZm4sIGNvbnRleHQpLCB0aW1lb3V0KTtcbn1cblxuLyoqXG4gKiBpZiB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXksIHdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgZm4gb24gZWFjaCBlbnRyeVxuICogaWYgaXQgYWludCBhbiBhcnJheSB3ZSBkb24ndCB3YW50IHRvIGRvIGEgdGhpbmcuXG4gKiB0aGlzIGlzIHVzZWQgYnkgYWxsIHRoZSBtZXRob2RzIHRoYXQgYWNjZXB0IGEgc2luZ2xlIGFuZCBhcnJheSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7KnxBcnJheX0gYXJnXG4gKiBAcGFyYW0ge1N0cmluZ30gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF1cbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpbnZva2VBcnJheUFyZyhhcmcsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICBlYWNoKGFyZywgY29udGV4dFtmbl0sIGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHdhbGsgb2JqZWN0cyBhbmQgYXJyYXlzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqL1xuZnVuY3Rpb24gZWFjaChvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiB3cmFwIGEgbWV0aG9kIHdpdGggYSBkZXByZWNhdGlvbiB3YXJuaW5nIGFuZCBzdGFjayB0cmFjZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIHN1cHBsaWVkIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gZGVwcmVjYXRlKG1ldGhvZCwgbmFtZSwgbWVzc2FnZSkge1xuICAgIHZhciBkZXByZWNhdGlvbk1lc3NhZ2UgPSAnREVQUkVDQVRFRCBNRVRIT0Q6ICcgKyBuYW1lICsgJ1xcbicgKyBtZXNzYWdlICsgJyBBVCBcXG4nO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ2dldC1zdGFjay10cmFjZScpO1xuICAgICAgICB2YXIgc3RhY2sgPSBlICYmIGUuc3RhY2sgPyBlLnN0YWNrLnJlcGxhY2UoL15bXlxcKF0rP1tcXG4kXS9nbSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXlxccythdFxccysvZ20sICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLCAne2Fub255bW91c30oKUAnKSA6ICdVbmtub3duIFN0YWNrIFRyYWNlJztcblxuICAgICAgICB2YXIgbG9nID0gd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLndhcm4gfHwgd2luZG93LmNvbnNvbGUubG9nKTtcbiAgICAgICAgaWYgKGxvZykge1xuICAgICAgICAgICAgbG9nLmNhbGwod2luZG93LmNvbnNvbGUsIGRlcHJlY2F0aW9uTWVzc2FnZSwgc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG4vKipcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmplY3RzX3RvX2Fzc2lnblxuICogQHJldHVybnMge09iamVjdH0gdGFyZ2V0XG4gKi9cbnZhciBhc3NpZ247XG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT09ICdmdW5jdGlvbicpIHtcbiAgICBhc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XG4gICAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcbn1cblxuLyoqXG4gKiBleHRlbmQgb2JqZWN0LlxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIGluIGRlc3Qgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSB0aGUgb25lcyBpbiBzcmMuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHBhcmFtIHtCb29sZWFufSBbbWVyZ2U9ZmFsc2VdXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XG4gKi9cbnZhciBleHRlbmQgPSBkZXByZWNhdGUoZnVuY3Rpb24gZXh0ZW5kKGRlc3QsIHNyYywgbWVyZ2UpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNyYyk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFtZXJnZSB8fCAobWVyZ2UgJiYgZGVzdFtrZXlzW2ldXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgZGVzdFtrZXlzW2ldXSA9IHNyY1trZXlzW2ldXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBkZXN0O1xufSwgJ2V4dGVuZCcsICdVc2UgYGFzc2lnbmAuJyk7XG5cbi8qKlxuICogbWVyZ2UgdGhlIHZhbHVlcyBmcm9tIHNyYyBpbiB0aGUgZGVzdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyB0aGF0IGV4aXN0IGluIGRlc3Qgd2lsbCBub3QgYmUgb3ZlcndyaXR0ZW4gYnkgc3JjXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHJldHVybnMge09iamVjdH0gZGVzdFxuICovXG52YXIgbWVyZ2UgPSBkZXByZWNhdGUoZnVuY3Rpb24gbWVyZ2UoZGVzdCwgc3JjKSB7XG4gICAgcmV0dXJuIGV4dGVuZChkZXN0LCBzcmMsIHRydWUpO1xufSwgJ21lcmdlJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBzaW1wbGUgY2xhc3MgaW5oZXJpdGFuY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNoaWxkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXQoY2hpbGQsIGJhc2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgYmFzZVAgPSBiYXNlLnByb3RvdHlwZSxcbiAgICAgICAgY2hpbGRQO1xuXG4gICAgY2hpbGRQID0gY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlUCk7XG4gICAgY2hpbGRQLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG4gICAgY2hpbGRQLl9zdXBlciA9IGJhc2VQO1xuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgYXNzaWduKGNoaWxkUCwgcHJvcGVydGllcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIHNpbXBsZSBmdW5jdGlvbiBiaW5kXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gYmluZEZuKGZuLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kRm4oKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogbGV0IGEgYm9vbGVhbiB2YWx1ZSBhbHNvIGJlIGEgZnVuY3Rpb24gdGhhdCBtdXN0IHJldHVybiBhIGJvb2xlYW5cbiAqIHRoaXMgZmlyc3QgaXRlbSBpbiBhcmdzIHdpbGwgYmUgdXNlZCBhcyB0aGUgY29udGV4dFxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSB2YWxcbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdzXVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGJvb2xPckZuKHZhbCwgYXJncykge1xuICAgIGlmICh0eXBlb2YgdmFsID09IFRZUEVfRlVOQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIHZhbC5hcHBseShhcmdzID8gYXJnc1swXSB8fCB1bmRlZmluZWQgOiB1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuXG4vKipcbiAqIHVzZSB0aGUgdmFsMiB3aGVuIHZhbDEgaXMgdW5kZWZpbmVkXG4gKiBAcGFyYW0geyp9IHZhbDFcbiAqIEBwYXJhbSB7Kn0gdmFsMlxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGlmVW5kZWZpbmVkKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKHZhbDEgPT09IHVuZGVmaW5lZCkgPyB2YWwyIDogdmFsMTtcbn1cblxuLyoqXG4gKiBhZGRFdmVudExpc3RlbmVyIHdpdGggbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2VcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcbiAgICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogcmVtb3ZlRXZlbnRMaXN0ZW5lciB3aXRoIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycyh0YXJnZXQsIHR5cGVzLCBoYW5kbGVyKSB7XG4gICAgZWFjaChzcGxpdFN0cih0eXBlcyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGZpbmQgaWYgYSBub2RlIGlzIGluIHRoZSBnaXZlbiBwYXJlbnRcbiAqIEBtZXRob2QgaGFzUGFyZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGhhc1BhcmVudChub2RlLCBwYXJlbnQpIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBpZiAobm9kZSA9PSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBzbWFsbCBpbmRleE9mIHdyYXBwZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gZm91bmRcbiAqL1xuZnVuY3Rpb24gaW5TdHIoc3RyLCBmaW5kKSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKGZpbmQpID4gLTE7XG59XG5cbi8qKlxuICogc3BsaXQgc3RyaW5nIG9uIHdoaXRlc3BhY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtBcnJheX0gd29yZHNcbiAqL1xuZnVuY3Rpb24gc3BsaXRTdHIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkuc3BsaXQoL1xccysvZyk7XG59XG5cbi8qKlxuICogZmluZCBpZiBhIGFycmF5IGNvbnRhaW5zIHRoZSBvYmplY3QgdXNpbmcgaW5kZXhPZiBvciBhIHNpbXBsZSBwb2x5RmlsbFxuICogQHBhcmFtIHtBcnJheX0gc3JjXG4gKiBAcGFyYW0ge1N0cmluZ30gZmluZFxuICogQHBhcmFtIHtTdHJpbmd9IFtmaW5kQnlLZXldXG4gKiBAcmV0dXJuIHtCb29sZWFufE51bWJlcn0gZmFsc2Ugd2hlbiBub3QgZm91bmQsIG9yIHRoZSBpbmRleFxuICovXG5mdW5jdGlvbiBpbkFycmF5KHNyYywgZmluZCwgZmluZEJ5S2V5KSB7XG4gICAgaWYgKHNyYy5pbmRleE9mICYmICFmaW5kQnlLZXkpIHtcbiAgICAgICAgcmV0dXJuIHNyYy5pbmRleE9mKGZpbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoKGZpbmRCeUtleSAmJiBzcmNbaV1bZmluZEJ5S2V5XSA9PSBmaW5kKSB8fCAoIWZpbmRCeUtleSAmJiBzcmNbaV0gPT09IGZpbmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGFycmF5LWxpa2Ugb2JqZWN0cyB0byByZWFsIGFycmF5c1xuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiB0b0FycmF5KG9iaikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChvYmosIDApO1xufVxuXG4vKipcbiAqIHVuaXF1ZSBhcnJheSB3aXRoIG9iamVjdHMgYmFzZWQgb24gYSBrZXkgKGxpa2UgJ2lkJykgb3IganVzdCBieSB0aGUgYXJyYXkncyB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gc3JjIFt7aWQ6MX0se2lkOjJ9LHtpZDoxfV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICogQHBhcmFtIHtCb29sZWFufSBbc29ydD1GYWxzZV1cbiAqIEByZXR1cm5zIHtBcnJheX0gW3tpZDoxfSx7aWQ6Mn1dXG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUFycmF5KHNyYywga2V5LCBzb3J0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWwgPSBrZXkgPyBzcmNbaV1ba2V5XSA6IHNyY1tpXTtcbiAgICAgICAgaWYgKGluQXJyYXkodmFsdWVzLCB2YWwpIDwgMCkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNyY1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2ldID0gdmFsO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKHNvcnQpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoZnVuY3Rpb24gc29ydFVuaXF1ZUFycmF5KGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtrZXldID4gYltrZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyoqXG4gKiBnZXQgdGhlIHByZWZpeGVkIHByb3BlcnR5XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcbiAqIEByZXR1cm5zIHtTdHJpbmd8VW5kZWZpbmVkfSBwcmVmaXhlZFxuICovXG5mdW5jdGlvbiBwcmVmaXhlZChvYmosIHByb3BlcnR5KSB7XG4gICAgdmFyIHByZWZpeCwgcHJvcDtcbiAgICB2YXIgY2FtZWxQcm9wID0gcHJvcGVydHlbMF0udG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgVkVORE9SX1BSRUZJWEVTLmxlbmd0aCkge1xuICAgICAgICBwcmVmaXggPSBWRU5ET1JfUFJFRklYRVNbaV07XG4gICAgICAgIHByb3AgPSAocHJlZml4KSA/IHByZWZpeCArIGNhbWVsUHJvcCA6IHByb3BlcnR5O1xuXG4gICAgICAgIGlmIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHByb3A7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIGdldCBhIHVuaXF1ZSBpZFxuICogQHJldHVybnMge251bWJlcn0gdW5pcXVlSWRcbiAqL1xudmFyIF91bmlxdWVJZCA9IDE7XG5mdW5jdGlvbiB1bmlxdWVJZCgpIHtcbiAgICByZXR1cm4gX3VuaXF1ZUlkKys7XG59XG5cbi8qKlxuICogZ2V0IHRoZSB3aW5kb3cgb2JqZWN0IG9mIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtEb2N1bWVudFZpZXd8V2luZG93fVxuICovXG5mdW5jdGlvbiBnZXRXaW5kb3dGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgICB2YXIgZG9jID0gZWxlbWVudC5vd25lckRvY3VtZW50IHx8IGVsZW1lbnQ7XG4gICAgcmV0dXJuIChkb2MuZGVmYXVsdFZpZXcgfHwgZG9jLnBhcmVudFdpbmRvdyB8fCB3aW5kb3cpO1xufVxuXG52YXIgTU9CSUxFX1JFR0VYID0gL21vYmlsZXx0YWJsZXR8aXAoYWR8aG9uZXxvZCl8YW5kcm9pZC9pO1xuXG52YXIgU1VQUE9SVF9UT1VDSCA9ICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpO1xudmFyIFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSBwcmVmaXhlZCh3aW5kb3csICdQb2ludGVyRXZlbnQnKSAhPT0gdW5kZWZpbmVkO1xudmFyIFNVUFBPUlRfT05MWV9UT1VDSCA9IFNVUFBPUlRfVE9VQ0ggJiYgTU9CSUxFX1JFR0VYLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbnZhciBJTlBVVF9UWVBFX1RPVUNIID0gJ3RvdWNoJztcbnZhciBJTlBVVF9UWVBFX1BFTiA9ICdwZW4nO1xudmFyIElOUFVUX1RZUEVfTU9VU0UgPSAnbW91c2UnO1xudmFyIElOUFVUX1RZUEVfS0lORUNUID0gJ2tpbmVjdCc7XG5cbnZhciBDT01QVVRFX0lOVEVSVkFMID0gMjU7XG5cbnZhciBJTlBVVF9TVEFSVCA9IDE7XG52YXIgSU5QVVRfTU9WRSA9IDI7XG52YXIgSU5QVVRfRU5EID0gNDtcbnZhciBJTlBVVF9DQU5DRUwgPSA4O1xuXG52YXIgRElSRUNUSU9OX05PTkUgPSAxO1xudmFyIERJUkVDVElPTl9MRUZUID0gMjtcbnZhciBESVJFQ1RJT05fUklHSFQgPSA0O1xudmFyIERJUkVDVElPTl9VUCA9IDg7XG52YXIgRElSRUNUSU9OX0RPV04gPSAxNjtcblxudmFyIERJUkVDVElPTl9IT1JJWk9OVEFMID0gRElSRUNUSU9OX0xFRlQgfCBESVJFQ1RJT05fUklHSFQ7XG52YXIgRElSRUNUSU9OX1ZFUlRJQ0FMID0gRElSRUNUSU9OX1VQIHwgRElSRUNUSU9OX0RPV047XG52YXIgRElSRUNUSU9OX0FMTCA9IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMO1xuXG52YXIgUFJPUFNfWFkgPSBbJ3gnLCAneSddO1xudmFyIFBST1BTX0NMSUVOVF9YWSA9IFsnY2xpZW50WCcsICdjbGllbnRZJ107XG5cbi8qKlxuICogY3JlYXRlIG5ldyBpbnB1dCB0eXBlIG1hbmFnZXJcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtJbnB1dH1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBJbnB1dChtYW5hZ2VyLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLmVsZW1lbnQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgdGhpcy50YXJnZXQgPSBtYW5hZ2VyLm9wdGlvbnMuaW5wdXRUYXJnZXQ7XG5cbiAgICAvLyBzbWFsbGVyIHdyYXBwZXIgYXJvdW5kIHRoZSBoYW5kbGVyLCBmb3IgdGhlIHNjb3BlIGFuZCB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgbWFuYWdlcixcbiAgICAvLyBzbyB3aGVuIGRpc2FibGVkIHRoZSBpbnB1dCBldmVudHMgYXJlIGNvbXBsZXRlbHkgYnlwYXNzZWQuXG4gICAgdGhpcy5kb21IYW5kbGVyID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgaWYgKGJvb2xPckZuKG1hbmFnZXIub3B0aW9ucy5lbmFibGUsIFttYW5hZ2VyXSkpIHtcbiAgICAgICAgICAgIHNlbGYuaGFuZGxlcihldik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbn1cblxuSW5wdXQucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNob3VsZCBoYW5kbGUgdGhlIGlucHV0RXZlbnQgZGF0YSBhbmQgdHJpZ2dlciB0aGUgY2FsbGJhY2tcbiAgICAgKiBAdmlydHVhbFxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiBhZGRFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVuYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiByZW1vdmVFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfVxufTtcblxuLyoqXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxuICogY2FsbGVkIGJ5IHRoZSBNYW5hZ2VyIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hhbW1lcn0gbWFuYWdlclxuICogQHJldHVybnMge0lucHV0fVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dEluc3RhbmNlKG1hbmFnZXIpIHtcbiAgICB2YXIgVHlwZTtcbiAgICB2YXIgaW5wdXRDbGFzcyA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dENsYXNzO1xuXG4gICAgaWYgKGlucHV0Q2xhc3MpIHtcbiAgICAgICAgVHlwZSA9IGlucHV0Q2xhc3M7XG4gICAgfSBlbHNlIGlmIChTVVBQT1JUX1BPSU5URVJfRVZFTlRTKSB7XG4gICAgICAgIFR5cGUgPSBQb2ludGVyRXZlbnRJbnB1dDtcbiAgICB9IGVsc2UgaWYgKFNVUFBPUlRfT05MWV9UT1VDSCkge1xuICAgICAgICBUeXBlID0gVG91Y2hJbnB1dDtcbiAgICB9IGVsc2UgaWYgKCFTVVBQT1JUX1RPVUNIKSB7XG4gICAgICAgIFR5cGUgPSBNb3VzZUlucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFR5cGUgPSBUb3VjaE1vdXNlSW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiBuZXcgKFR5cGUpKG1hbmFnZXIsIGlucHV0SGFuZGxlcik7XG59XG5cbi8qKlxuICogaGFuZGxlIGlucHV0IGV2ZW50c1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gaW5wdXRIYW5kbGVyKG1hbmFnZXIsIGV2ZW50VHlwZSwgaW5wdXQpIHtcbiAgICB2YXIgcG9pbnRlcnNMZW4gPSBpbnB1dC5wb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGNoYW5nZWRQb2ludGVyc0xlbiA9IGlucHV0LmNoYW5nZWRQb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGlzRmlyc3QgPSAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG4gICAgdmFyIGlzRmluYWwgPSAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG5cbiAgICBpbnB1dC5pc0ZpcnN0ID0gISFpc0ZpcnN0O1xuICAgIGlucHV0LmlzRmluYWwgPSAhIWlzRmluYWw7XG5cbiAgICBpZiAoaXNGaXJzdCkge1xuICAgICAgICBtYW5hZ2VyLnNlc3Npb24gPSB7fTtcbiAgICB9XG5cbiAgICAvLyBzb3VyY2UgZXZlbnQgaXMgdGhlIG5vcm1hbGl6ZWQgdmFsdWUgb2YgdGhlIGRvbUV2ZW50c1xuICAgIC8vIGxpa2UgJ3RvdWNoc3RhcnQsIG1vdXNldXAsIHBvaW50ZXJkb3duJ1xuICAgIGlucHV0LmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcblxuICAgIC8vIGNvbXB1dGUgc2NhbGUsIHJvdGF0aW9uIGV0Y1xuICAgIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpO1xuXG4gICAgLy8gZW1pdCBzZWNyZXQgZXZlbnRcbiAgICBtYW5hZ2VyLmVtaXQoJ2hhbW1lci5pbnB1dCcsIGlucHV0KTtcblxuICAgIG1hbmFnZXIucmVjb2duaXplKGlucHV0KTtcbiAgICBtYW5hZ2VyLnNlc3Npb24ucHJldklucHV0ID0gaW5wdXQ7XG59XG5cbi8qKlxuICogZXh0ZW5kIHRoZSBkYXRhIHdpdGggc29tZSB1c2FibGUgcHJvcGVydGllcyBsaWtlIHNjYWxlLCByb3RhdGUsIHZlbG9jaXR5IGV0Y1xuICogQHBhcmFtIHtPYmplY3R9IG1hbmFnZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBjb21wdXRlSW5wdXREYXRhKG1hbmFnZXIsIGlucHV0KSB7XG4gICAgdmFyIHNlc3Npb24gPSBtYW5hZ2VyLnNlc3Npb247XG4gICAgdmFyIHBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnM7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gc3RvcmUgdGhlIGZpcnN0IGlucHV0IHRvIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYW5kIGRpcmVjdGlvblxuICAgIGlmICghc2Vzc2lvbi5maXJzdElucHV0KSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RJbnB1dCA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9XG5cbiAgICAvLyB0byBjb21wdXRlIHNjYWxlIGFuZCByb3RhdGlvbiB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBtdWx0aXBsZSB0b3VjaGVzXG4gICAgaWYgKHBvaW50ZXJzTGVuZ3RoID4gMSAmJiAhc2Vzc2lvbi5maXJzdE11bHRpcGxlKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9IGVsc2UgaWYgKHBvaW50ZXJzTGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBmaXJzdElucHV0ID0gc2Vzc2lvbi5maXJzdElucHV0O1xuICAgIHZhciBmaXJzdE11bHRpcGxlID0gc2Vzc2lvbi5maXJzdE11bHRpcGxlO1xuICAgIHZhciBvZmZzZXRDZW50ZXIgPSBmaXJzdE11bHRpcGxlID8gZmlyc3RNdWx0aXBsZS5jZW50ZXIgOiBmaXJzdElucHV0LmNlbnRlcjtcblxuICAgIHZhciBjZW50ZXIgPSBpbnB1dC5jZW50ZXIgPSBnZXRDZW50ZXIocG9pbnRlcnMpO1xuICAgIGlucHV0LnRpbWVTdGFtcCA9IG5vdygpO1xuICAgIGlucHV0LmRlbHRhVGltZSA9IGlucHV0LnRpbWVTdGFtcCAtIGZpcnN0SW5wdXQudGltZVN0YW1wO1xuXG4gICAgaW5wdXQuYW5nbGUgPSBnZXRBbmdsZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG4gICAgaW5wdXQuZGlzdGFuY2UgPSBnZXREaXN0YW5jZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG5cbiAgICBjb21wdXRlRGVsdGFYWShzZXNzaW9uLCBpbnB1dCk7XG4gICAgaW5wdXQub2Zmc2V0RGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcblxuICAgIHZhciBvdmVyYWxsVmVsb2NpdHkgPSBnZXRWZWxvY2l0eShpbnB1dC5kZWx0YVRpbWUsIGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcbiAgICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYID0gb3ZlcmFsbFZlbG9jaXR5Lng7XG4gICAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5WSA9IG92ZXJhbGxWZWxvY2l0eS55O1xuICAgIGlucHV0Lm92ZXJhbGxWZWxvY2l0eSA9IChhYnMob3ZlcmFsbFZlbG9jaXR5LngpID4gYWJzKG92ZXJhbGxWZWxvY2l0eS55KSkgPyBvdmVyYWxsVmVsb2NpdHkueCA6IG92ZXJhbGxWZWxvY2l0eS55O1xuXG4gICAgaW5wdXQuc2NhbGUgPSBmaXJzdE11bHRpcGxlID8gZ2V0U2NhbGUoZmlyc3RNdWx0aXBsZS5wb2ludGVycywgcG9pbnRlcnMpIDogMTtcbiAgICBpbnB1dC5yb3RhdGlvbiA9IGZpcnN0TXVsdGlwbGUgPyBnZXRSb3RhdGlvbihmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAwO1xuXG4gICAgaW5wdXQubWF4UG9pbnRlcnMgPSAhc2Vzc2lvbi5wcmV2SW5wdXQgPyBpbnB1dC5wb2ludGVycy5sZW5ndGggOiAoKGlucHV0LnBvaW50ZXJzLmxlbmd0aCA+XG4gICAgICAgIHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKSA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6IHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKTtcblxuICAgIGNvbXB1dGVJbnRlcnZhbElucHV0RGF0YShzZXNzaW9uLCBpbnB1dCk7XG5cbiAgICAvLyBmaW5kIHRoZSBjb3JyZWN0IHRhcmdldFxuICAgIHZhciB0YXJnZXQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgaWYgKGhhc1BhcmVudChpbnB1dC5zcmNFdmVudC50YXJnZXQsIHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0ID0gaW5wdXQuc3JjRXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBpbnB1dC50YXJnZXQgPSB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlcjtcbiAgICB2YXIgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSB8fCB7fTtcbiAgICB2YXIgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgfHwge307XG4gICAgdmFyIHByZXZJbnB1dCA9IHNlc3Npb24ucHJldklucHV0IHx8IHt9O1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfU1RBUlQgfHwgcHJldklucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfRU5EKSB7XG4gICAgICAgIHByZXZEZWx0YSA9IHNlc3Npb24ucHJldkRlbHRhID0ge1xuICAgICAgICAgICAgeDogcHJldklucHV0LmRlbHRhWCB8fCAwLFxuICAgICAgICAgICAgeTogcHJldklucHV0LmRlbHRhWSB8fCAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSA9IHtcbiAgICAgICAgICAgIHg6IGNlbnRlci54LFxuICAgICAgICAgICAgeTogY2VudGVyLnlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpbnB1dC5kZWx0YVggPSBwcmV2RGVsdGEueCArIChjZW50ZXIueCAtIG9mZnNldC54KTtcbiAgICBpbnB1dC5kZWx0YVkgPSBwcmV2RGVsdGEueSArIChjZW50ZXIueSAtIG9mZnNldC55KTtcbn1cblxuLyoqXG4gKiB2ZWxvY2l0eSBpcyBjYWxjdWxhdGVkIGV2ZXJ5IHggbXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXNzaW9uXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGxhc3QgPSBzZXNzaW9uLmxhc3RJbnRlcnZhbCB8fCBpbnB1dCxcbiAgICAgICAgZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gbGFzdC50aW1lU3RhbXAsXG4gICAgICAgIHZlbG9jaXR5LCB2ZWxvY2l0eVgsIHZlbG9jaXR5WSwgZGlyZWN0aW9uO1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9DQU5DRUwgJiYgKGRlbHRhVGltZSA+IENPTVBVVEVfSU5URVJWQUwgfHwgbGFzdC52ZWxvY2l0eSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICB2YXIgZGVsdGFYID0gaW5wdXQuZGVsdGFYIC0gbGFzdC5kZWx0YVg7XG4gICAgICAgIHZhciBkZWx0YVkgPSBpbnB1dC5kZWx0YVkgLSBsYXN0LmRlbHRhWTtcblxuICAgICAgICB2YXIgdiA9IGdldFZlbG9jaXR5KGRlbHRhVGltZSwgZGVsdGFYLCBkZWx0YVkpO1xuICAgICAgICB2ZWxvY2l0eVggPSB2Lng7XG4gICAgICAgIHZlbG9jaXR5WSA9IHYueTtcbiAgICAgICAgdmVsb2NpdHkgPSAoYWJzKHYueCkgPiBhYnModi55KSkgPyB2LnggOiB2Lnk7XG4gICAgICAgIGRpcmVjdGlvbiA9IGdldERpcmVjdGlvbihkZWx0YVgsIGRlbHRhWSk7XG5cbiAgICAgICAgc2Vzc2lvbi5sYXN0SW50ZXJ2YWwgPSBpbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2UgbGF0ZXN0IHZlbG9jaXR5IGluZm8gaWYgaXQgZG9lc24ndCBvdmVydGFrZSBhIG1pbmltdW0gcGVyaW9kXG4gICAgICAgIHZlbG9jaXR5ID0gbGFzdC52ZWxvY2l0eTtcbiAgICAgICAgdmVsb2NpdHlYID0gbGFzdC52ZWxvY2l0eVg7XG4gICAgICAgIHZlbG9jaXR5WSA9IGxhc3QudmVsb2NpdHlZO1xuICAgICAgICBkaXJlY3Rpb24gPSBsYXN0LmRpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBpbnB1dC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICAgIGlucHV0LnZlbG9jaXR5WCA9IHZlbG9jaXR5WDtcbiAgICBpbnB1dC52ZWxvY2l0eVkgPSB2ZWxvY2l0eVk7XG4gICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIGNyZWF0ZSBhIHNpbXBsZSBjbG9uZSBmcm9tIHRoZSBpbnB1dCB1c2VkIGZvciBzdG9yYWdlIG9mIGZpcnN0SW5wdXQgYW5kIGZpcnN0TXVsdGlwbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICogQHJldHVybnMge09iamVjdH0gY2xvbmVkSW5wdXREYXRhXG4gKi9cbmZ1bmN0aW9uIHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KSB7XG4gICAgLy8gbWFrZSBhIHNpbXBsZSBjb3B5IG9mIHRoZSBwb2ludGVycyBiZWNhdXNlIHdlIHdpbGwgZ2V0IGEgcmVmZXJlbmNlIGlmIHdlIGRvbid0XG4gICAgLy8gd2Ugb25seSBuZWVkIGNsaWVudFhZIGZvciB0aGUgY2FsY3VsYXRpb25zXG4gICAgdmFyIHBvaW50ZXJzID0gW107XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgaW5wdXQucG9pbnRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHBvaW50ZXJzW2ldID0ge1xuICAgICAgICAgICAgY2xpZW50WDogcm91bmQoaW5wdXQucG9pbnRlcnNbaV0uY2xpZW50WCksXG4gICAgICAgICAgICBjbGllbnRZOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRZKVxuICAgICAgICB9O1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGltZVN0YW1wOiBub3coKSxcbiAgICAgICAgcG9pbnRlcnM6IHBvaW50ZXJzLFxuICAgICAgICBjZW50ZXI6IGdldENlbnRlcihwb2ludGVycyksXG4gICAgICAgIGRlbHRhWDogaW5wdXQuZGVsdGFYLFxuICAgICAgICBkZWx0YVk6IGlucHV0LmRlbHRhWVxuICAgIH07XG59XG5cbi8qKlxuICogZ2V0IHRoZSBjZW50ZXIgb2YgYWxsIHRoZSBwb2ludGVyc1xuICogQHBhcmFtIHtBcnJheX0gcG9pbnRlcnNcbiAqIEByZXR1cm4ge09iamVjdH0gY2VudGVyIGNvbnRhaW5zIGB4YCBhbmQgYHlgIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gZ2V0Q2VudGVyKHBvaW50ZXJzKSB7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gbm8gbmVlZCB0byBsb29wIHdoZW4gb25seSBvbmUgdG91Y2hcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHJvdW5kKHBvaW50ZXJzWzBdLmNsaWVudFgpLFxuICAgICAgICAgICAgeTogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgeCA9IDAsIHkgPSAwLCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHBvaW50ZXJzTGVuZ3RoKSB7XG4gICAgICAgIHggKz0gcG9pbnRlcnNbaV0uY2xpZW50WDtcbiAgICAgICAgeSArPSBwb2ludGVyc1tpXS5jbGllbnRZO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogcm91bmQoeCAvIHBvaW50ZXJzTGVuZ3RoKSxcbiAgICAgICAgeTogcm91bmQoeSAvIHBvaW50ZXJzTGVuZ3RoKVxuICAgIH07XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSB2ZWxvY2l0eSBiZXR3ZWVuIHR3byBwb2ludHMuIHVuaXQgaXMgaW4gcHggcGVyIG1zLlxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhVGltZVxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcmV0dXJuIHtPYmplY3R9IHZlbG9jaXR5IGB4YCBhbmQgYHlgXG4gKi9cbmZ1bmN0aW9uIGdldFZlbG9jaXR5KGRlbHRhVGltZSwgeCwgeSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHggLyBkZWx0YVRpbWUgfHwgMCxcbiAgICAgICAgeTogeSAvIGRlbHRhVGltZSB8fCAwXG4gICAgfTtcbn1cblxuLyoqXG4gKiBnZXQgdGhlIGRpcmVjdGlvbiBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHJldHVybiB7TnVtYmVyfSBkaXJlY3Rpb25cbiAqL1xuZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKHgsIHkpIHtcbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgICByZXR1cm4gRElSRUNUSU9OX05PTkU7XG4gICAgfVxuXG4gICAgaWYgKGFicyh4KSA+PSBhYnMoeSkpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFQ7XG4gICAgfVxuICAgIHJldHVybiB5IDwgMCA/IERJUkVDVElPTl9VUCA6IERJUkVDVElPTl9ET1dOO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG4gKiBAcGFyYW0ge09iamVjdH0gcDEge3gsIHl9XG4gKiBAcGFyYW0ge09iamVjdH0gcDIge3gsIHl9XG4gKiBAcGFyYW0ge0FycmF5fSBbcHJvcHNdIGNvbnRhaW5pbmcgeCBhbmQgeSBrZXlzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAxLCBwMiwgcHJvcHMpIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgIHByb3BzID0gUFJPUFNfWFk7XG4gICAgfVxuICAgIHZhciB4ID0gcDJbcHJvcHNbMF1dIC0gcDFbcHJvcHNbMF1dLFxuICAgICAgICB5ID0gcDJbcHJvcHNbMV1dIC0gcDFbcHJvcHNbMV1dO1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeCAqIHgpICsgKHkgKiB5KSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBhbmdsZSBiZXR3ZWVuIHR3byBjb29yZGluYXRlc1xuICogQHBhcmFtIHtPYmplY3R9IHAxXG4gKiBAcGFyYW0ge09iamVjdH0gcDJcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZ2V0QW5nbGUocDEsIHAyLCBwcm9wcykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgICB9XG4gICAgdmFyIHggPSBwMltwcm9wc1swXV0gLSBwMVtwcm9wc1swXV0sXG4gICAgICAgIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAxODAgLyBNYXRoLlBJO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gZGVncmVlcyBiZXR3ZWVuIHR3byBwb2ludGVyc2V0c1xuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSByb3RhdGlvblxuICovXG5mdW5jdGlvbiBnZXRSb3RhdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGdldEFuZ2xlKGVuZFsxXSwgZW5kWzBdLCBQUk9QU19DTElFTlRfWFkpICsgZ2V0QW5nbGUoc3RhcnRbMV0sIHN0YXJ0WzBdLCBQUk9QU19DTElFTlRfWFkpO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgc2NhbGUgZmFjdG9yIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBubyBzY2FsZSBpcyAxLCBhbmQgZ29lcyBkb3duIHRvIDAgd2hlbiBwaW5jaGVkIHRvZ2V0aGVyLCBhbmQgYmlnZ2VyIHdoZW4gcGluY2hlZCBvdXRcbiAqIEBwYXJhbSB7QXJyYXl9IHN0YXJ0IGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBlbmQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEByZXR1cm4ge051bWJlcn0gc2NhbGVcbiAqL1xuZnVuY3Rpb24gZ2V0U2NhbGUoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBnZXREaXN0YW5jZShlbmRbMF0sIGVuZFsxXSwgUFJPUFNfQ0xJRU5UX1hZKSAvIGdldERpc3RhbmNlKHN0YXJ0WzBdLCBzdGFydFsxXSwgUFJPUFNfQ0xJRU5UX1hZKTtcbn1cblxudmFyIE1PVVNFX0lOUFVUX01BUCA9IHtcbiAgICBtb3VzZWRvd246IElOUFVUX1NUQVJULFxuICAgIG1vdXNlbW92ZTogSU5QVVRfTU9WRSxcbiAgICBtb3VzZXVwOiBJTlBVVF9FTkRcbn07XG5cbnZhciBNT1VTRV9FTEVNRU5UX0VWRU5UUyA9ICdtb3VzZWRvd24nO1xudmFyIE1PVVNFX1dJTkRPV19FVkVOVFMgPSAnbW91c2Vtb3ZlIG1vdXNldXAnO1xuXG4vKipcbiAqIE1vdXNlIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBNb3VzZUlucHV0KCkge1xuICAgIHRoaXMuZXZFbCA9IE1PVVNFX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBNT1VTRV9XSU5ET1dfRVZFTlRTO1xuXG4gICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7IC8vIG1vdXNlZG93biBzdGF0ZVxuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChNb3VzZUlucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBNRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IE1PVVNFX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBvbiBzdGFydCB3ZSB3YW50IHRvIGhhdmUgdGhlIGxlZnQgbW91c2UgYnV0dG9uIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIGV2LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9NT1ZFICYmIGV2LndoaWNoICE9PSAxKSB7XG4gICAgICAgICAgICBldmVudFR5cGUgPSBJTlBVVF9FTkQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKCF0aGlzLnByZXNzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9NT1VTRSxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxudmFyIFBPSU5URVJfSU5QVVRfTUFQID0ge1xuICAgIHBvaW50ZXJkb3duOiBJTlBVVF9TVEFSVCxcbiAgICBwb2ludGVybW92ZTogSU5QVVRfTU9WRSxcbiAgICBwb2ludGVydXA6IElOUFVUX0VORCxcbiAgICBwb2ludGVyY2FuY2VsOiBJTlBVVF9DQU5DRUwsXG4gICAgcG9pbnRlcm91dDogSU5QVVRfQ0FOQ0VMXG59O1xuXG4vLyBpbiBJRTEwIHRoZSBwb2ludGVyIHR5cGVzIGlzIGRlZmluZWQgYXMgYW4gZW51bVxudmFyIElFMTBfUE9JTlRFUl9UWVBFX0VOVU0gPSB7XG4gICAgMjogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAzOiBJTlBVVF9UWVBFX1BFTixcbiAgICA0OiBJTlBVVF9UWVBFX01PVVNFLFxuICAgIDU6IElOUFVUX1RZUEVfS0lORUNUIC8vIHNlZSBodHRwczovL3R3aXR0ZXIuY29tL2phY29icm9zc2kvc3RhdHVzLzQ4MDU5NjQzODQ4OTg5MDgxNlxufTtcblxudmFyIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAncG9pbnRlcmRvd24nO1xudmFyIFBPSU5URVJfV0lORE9XX0VWRU5UUyA9ICdwb2ludGVybW92ZSBwb2ludGVydXAgcG9pbnRlcmNhbmNlbCc7XG5cbi8vIElFMTAgaGFzIHByZWZpeGVkIHN1cHBvcnQsIGFuZCBjYXNlLXNlbnNpdGl2ZVxuaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCAmJiAhd2luZG93LlBvaW50ZXJFdmVudCkge1xuICAgIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAnTVNQb2ludGVyRG93bic7XG4gICAgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ01TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsJztcbn1cblxuLyoqXG4gKiBQb2ludGVyIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBQb2ludGVyRXZlbnRJbnB1dCgpIHtcbiAgICB0aGlzLmV2RWwgPSBQT0lOVEVSX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBQT0lOVEVSX1dJTkRPV19FVkVOVFM7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zdG9yZSA9ICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzID0gW10pO1xufVxuXG5pbmhlcml0KFBvaW50ZXJFdmVudElucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBQRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHN0b3JlID0gdGhpcy5zdG9yZTtcbiAgICAgICAgdmFyIHJlbW92ZVBvaW50ZXIgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZXZlbnRUeXBlTm9ybWFsaXplZCA9IGV2LnR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdtcycsICcnKTtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IFBPSU5URVJfSU5QVVRfTUFQW2V2ZW50VHlwZU5vcm1hbGl6ZWRdO1xuICAgICAgICB2YXIgcG9pbnRlclR5cGUgPSBJRTEwX1BPSU5URVJfVFlQRV9FTlVNW2V2LnBvaW50ZXJUeXBlXSB8fCBldi5wb2ludGVyVHlwZTtcblxuICAgICAgICB2YXIgaXNUb3VjaCA9IChwb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX1RPVUNIKTtcblxuICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGV2ZW50IGluIHRoZSBzdG9yZVxuICAgICAgICB2YXIgc3RvcmVJbmRleCA9IGluQXJyYXkoc3RvcmUsIGV2LnBvaW50ZXJJZCwgJ3BvaW50ZXJJZCcpO1xuXG4gICAgICAgIC8vIHN0YXJ0IGFuZCBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIChldi5idXR0b24gPT09IDAgfHwgaXNUb3VjaCkpIHtcbiAgICAgICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHN0b3JlLnB1c2goZXYpO1xuICAgICAgICAgICAgICAgIHN0b3JlSW5kZXggPSBzdG9yZS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgICAgICByZW1vdmVQb2ludGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0IG5vdCBmb3VuZCwgc28gdGhlIHBvaW50ZXIgaGFzbid0IGJlZW4gZG93biAoc28gaXQncyBwcm9iYWJseSBhIGhvdmVyKVxuICAgICAgICBpZiAoc3RvcmVJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICAgIHN0b3JlW3N0b3JlSW5kZXhdID0gZXY7XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHN0b3JlLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiBbZXZdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IHBvaW50ZXJUeXBlLFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZW1vdmVQb2ludGVyKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgc3RvcmVcbiAgICAgICAgICAgIHN0b3JlLnNwbGljZShzdG9yZUluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG52YXIgU0lOR0xFX1RPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgU0lOR0xFX1RPVUNIX1RBUkdFVF9FVkVOVFMgPSAndG91Y2hzdGFydCc7XG52YXIgU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFMgPSAndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwnO1xuXG4vKipcbiAqIFRvdWNoIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBTaW5nbGVUb3VjaElucHV0KCkge1xuICAgIHRoaXMuZXZUYXJnZXQgPSBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLmV2V2luID0gU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFM7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFNpbmdsZVRvdWNoSW5wdXQsIElucHV0LCB7XG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVEVoYW5kbGVyKGV2KSB7XG4gICAgICAgIHZhciB0eXBlID0gU0lOR0xFX1RPVUNIX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBzaG91bGQgd2UgaGFuZGxlIHRoZSB0b3VjaCBldmVudHM/XG4gICAgICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG91Y2hlcyA9IG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMuY2FsbCh0aGlzLCBldiwgdHlwZSk7XG5cbiAgICAgICAgLy8gd2hlbiBkb25lLCByZXNldCB0aGUgc3RhcnRlZCBzdGF0ZVxuICAgICAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmIHRvdWNoZXNbMF0ubGVuZ3RoIC0gdG91Y2hlc1sxXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHR5cGUsIHtcbiAgICAgICAgICAgIHBvaW50ZXJzOiB0b3VjaGVzWzBdLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiB0b3VjaGVzWzFdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IElOUFVUX1RZUEVfVE9VQ0gsXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQHRoaXMge1RvdWNoSW5wdXR9XG4gKiBAcGFyYW0ge09iamVjdH0gZXZcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlIGZsYWdcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR8QXJyYXl9IFthbGwsIGNoYW5nZWRdXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMoZXYsIHR5cGUpIHtcbiAgICB2YXIgYWxsID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgY2hhbmdlZCA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpO1xuXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICBhbGwgPSB1bmlxdWVBcnJheShhbGwuY29uY2F0KGNoYW5nZWQpLCAnaWRlbnRpZmllcicsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBbYWxsLCBjaGFuZ2VkXTtcbn1cblxudmFyIFRPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogTXVsdGktdXNlciB0b3VjaCBldmVudHMgaW5wdXRcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgSW5wdXRcbiAqL1xuZnVuY3Rpb24gVG91Y2hJbnB1dCgpIHtcbiAgICB0aGlzLmV2VGFyZ2V0ID0gVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLnRhcmdldElkcyA9IHt9O1xuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChUb3VjaElucHV0LCBJbnB1dCwge1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1URWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBUT1VDSF9JTlBVVF9NQVBbZXYudHlwZV07XG4gICAgICAgIHZhciB0b3VjaGVzID0gZ2V0VG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcbiAgICAgICAgaWYgKCF0b3VjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IHRvdWNoZXNbMV0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cbiAqL1xuZnVuY3Rpb24gZ2V0VG91Y2hlcyhldiwgdHlwZSkge1xuICAgIHZhciBhbGxUb3VjaGVzID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgdGFyZ2V0SWRzID0gdGhpcy50YXJnZXRJZHM7XG5cbiAgICAvLyB3aGVuIHRoZXJlIGlzIG9ubHkgb25lIHRvdWNoLCB0aGUgcHJvY2VzcyBjYW4gYmUgc2ltcGxpZmllZFxuICAgIGlmICh0eXBlICYgKElOUFVUX1NUQVJUIHwgSU5QVVRfTU9WRSkgJiYgYWxsVG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGFyZ2V0SWRzW2FsbFRvdWNoZXNbMF0uaWRlbnRpZmllcl0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gW2FsbFRvdWNoZXMsIGFsbFRvdWNoZXNdO1xuICAgIH1cblxuICAgIHZhciBpLFxuICAgICAgICB0YXJnZXRUb3VjaGVzLFxuICAgICAgICBjaGFuZ2VkVG91Y2hlcyA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyA9IFtdLFxuICAgICAgICB0YXJnZXQgPSB0aGlzLnRhcmdldDtcblxuICAgIC8vIGdldCB0YXJnZXQgdG91Y2hlcyBmcm9tIHRvdWNoZXNcbiAgICB0YXJnZXRUb3VjaGVzID0gYWxsVG91Y2hlcy5maWx0ZXIoZnVuY3Rpb24odG91Y2gpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhcmVudCh0b3VjaC50YXJnZXQsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICAvLyBjb2xsZWN0IHRvdWNoZXNcbiAgICBpZiAodHlwZSA9PT0gSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhcmdldElkc1t0YXJnZXRUb3VjaGVzW2ldLmlkZW50aWZpZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZpbHRlciBjaGFuZ2VkIHRvdWNoZXMgdG8gb25seSBjb250YWluIHRvdWNoZXMgdGhhdCBleGlzdCBpbiB0aGUgY29sbGVjdGVkIHRhcmdldCBpZHNcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGNoYW5nZWRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAodGFyZ2V0SWRzW2NoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXJdKSB7XG4gICAgICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5wdXNoKGNoYW5nZWRUb3VjaGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFudXAgcmVtb3ZlZCB0b3VjaGVzXG4gICAgICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl07XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmICghY2hhbmdlZFRhcmdldFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgICAvLyBtZXJnZSB0YXJnZXRUb3VjaGVzIHdpdGggY2hhbmdlZFRhcmdldFRvdWNoZXMgc28gaXQgY29udGFpbnMgQUxMIHRvdWNoZXMsIGluY2x1ZGluZyAnZW5kJyBhbmQgJ2NhbmNlbCdcbiAgICAgICAgdW5pcXVlQXJyYXkodGFyZ2V0VG91Y2hlcy5jb25jYXQoY2hhbmdlZFRhcmdldFRvdWNoZXMpLCAnaWRlbnRpZmllcicsIHRydWUpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlc1xuICAgIF07XG59XG5cbi8qKlxuICogQ29tYmluZWQgdG91Y2ggYW5kIG1vdXNlIGlucHV0XG4gKlxuICogVG91Y2ggaGFzIGEgaGlnaGVyIHByaW9yaXR5IHRoZW4gbW91c2UsIGFuZCB3aGlsZSB0b3VjaGluZyBubyBtb3VzZSBldmVudHMgYXJlIGFsbG93ZWQuXG4gKiBUaGlzIGJlY2F1c2UgdG91Y2ggZGV2aWNlcyBhbHNvIGVtaXQgbW91c2UgZXZlbnRzIHdoaWxlIGRvaW5nIGEgdG91Y2guXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5cbnZhciBERURVUF9USU1FT1VUID0gMjUwMDtcbnZhciBERURVUF9ESVNUQU5DRSA9IDI1O1xuXG5mdW5jdGlvbiBUb3VjaE1vdXNlSW5wdXQoKSB7XG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBoYW5kbGVyID0gYmluZEZuKHRoaXMuaGFuZGxlciwgdGhpcyk7XG4gICAgdGhpcy50b3VjaCA9IG5ldyBUb3VjaElucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZUlucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG5cbiAgICB0aGlzLnByaW1hcnlUb3VjaCA9IG51bGw7XG4gICAgdGhpcy5sYXN0VG91Y2hlcyA9IFtdO1xufVxuXG5pbmhlcml0KFRvdWNoTW91c2VJbnB1dCwgSW5wdXQsIHtcbiAgICAvKipcbiAgICAgKiBoYW5kbGUgbW91c2UgYW5kIHRvdWNoIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0RXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXREYXRhXG4gICAgICovXG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVE1FaGFuZGxlcihtYW5hZ2VyLCBpbnB1dEV2ZW50LCBpbnB1dERhdGEpIHtcbiAgICAgICAgdmFyIGlzVG91Y2ggPSAoaW5wdXREYXRhLnBvaW50ZXJUeXBlID09IElOUFVUX1RZUEVfVE9VQ0gpLFxuICAgICAgICAgICAgaXNNb3VzZSA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9NT1VTRSk7XG5cbiAgICAgICAgaWYgKGlzTW91c2UgJiYgaW5wdXREYXRhLnNvdXJjZUNhcGFiaWxpdGllcyAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzLmZpcmVzVG91Y2hFdmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdoZW4gd2UncmUgaW4gYSB0b3VjaCBldmVudCwgcmVjb3JkIHRvdWNoZXMgdG8gIGRlLWR1cGUgc3ludGhldGljIG1vdXNlIGV2ZW50XG4gICAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgICAgICByZWNvcmRUb3VjaGVzLmNhbGwodGhpcywgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc01vdXNlICYmIGlzU3ludGhldGljRXZlbnQuY2FsbCh0aGlzLCBpbnB1dERhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy50b3VjaC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMubW91c2UuZGVzdHJveSgpO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiByZWNvcmRUb3VjaGVzKGV2ZW50VHlwZSwgZXZlbnREYXRhKSB7XG4gICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgIHRoaXMucHJpbWFyeVRvdWNoID0gZXZlbnREYXRhLmNoYW5nZWRQb2ludGVyc1swXS5pZGVudGlmaWVyO1xuICAgICAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgc2V0TGFzdFRvdWNoLmNhbGwodGhpcywgZXZlbnREYXRhKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldExhc3RUb3VjaChldmVudERhdGEpIHtcbiAgICB2YXIgdG91Y2ggPSBldmVudERhdGEuY2hhbmdlZFBvaW50ZXJzWzBdO1xuXG4gICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMucHJpbWFyeVRvdWNoKSB7XG4gICAgICAgIHZhciBsYXN0VG91Y2ggPSB7eDogdG91Y2guY2xpZW50WCwgeTogdG91Y2guY2xpZW50WX07XG4gICAgICAgIHRoaXMubGFzdFRvdWNoZXMucHVzaChsYXN0VG91Y2gpO1xuICAgICAgICB2YXIgbHRzID0gdGhpcy5sYXN0VG91Y2hlcztcbiAgICAgICAgdmFyIHJlbW92ZUxhc3RUb3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBsdHMuaW5kZXhPZihsYXN0VG91Y2gpO1xuICAgICAgICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGx0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNldFRpbWVvdXQocmVtb3ZlTGFzdFRvdWNoLCBERURVUF9USU1FT1VUKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzU3ludGhldGljRXZlbnQoZXZlbnREYXRhKSB7XG4gICAgdmFyIHggPSBldmVudERhdGEuc3JjRXZlbnQuY2xpZW50WCwgeSA9IGV2ZW50RGF0YS5zcmNFdmVudC5jbGllbnRZO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sYXN0VG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdCA9IHRoaXMubGFzdFRvdWNoZXNbaV07XG4gICAgICAgIHZhciBkeCA9IE1hdGguYWJzKHggLSB0LngpLCBkeSA9IE1hdGguYWJzKHkgLSB0LnkpO1xuICAgICAgICBpZiAoZHggPD0gREVEVVBfRElTVEFOQ0UgJiYgZHkgPD0gREVEVVBfRElTVEFOQ0UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxudmFyIFBSRUZJWEVEX1RPVUNIX0FDVElPTiA9IHByZWZpeGVkKFRFU1RfRUxFTUVOVC5zdHlsZSwgJ3RvdWNoQWN0aW9uJyk7XG52YXIgTkFUSVZFX1RPVUNIX0FDVElPTiA9IFBSRUZJWEVEX1RPVUNIX0FDVElPTiAhPT0gdW5kZWZpbmVkO1xuXG4vLyBtYWdpY2FsIHRvdWNoQWN0aW9uIHZhbHVlXG52YXIgVE9VQ0hfQUNUSU9OX0NPTVBVVEUgPSAnY29tcHV0ZSc7XG52YXIgVE9VQ0hfQUNUSU9OX0FVVE8gPSAnYXV0byc7XG52YXIgVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTiA9ICdtYW5pcHVsYXRpb24nOyAvLyBub3QgaW1wbGVtZW50ZWRcbnZhciBUT1VDSF9BQ1RJT05fTk9ORSA9ICdub25lJztcbnZhciBUT1VDSF9BQ1RJT05fUEFOX1ggPSAncGFuLXgnO1xudmFyIFRPVUNIX0FDVElPTl9QQU5fWSA9ICdwYW4teSc7XG52YXIgVE9VQ0hfQUNUSU9OX01BUCA9IGdldFRvdWNoQWN0aW9uUHJvcHMoKTtcblxuLyoqXG4gKiBUb3VjaCBBY3Rpb25cbiAqIHNldHMgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IG9yIHVzZXMgdGhlIGpzIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRvdWNoQWN0aW9uKG1hbmFnZXIsIHZhbHVlKSB7XG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLnNldCh2YWx1ZSk7XG59XG5cblRvdWNoQWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIHRvdWNoQWN0aW9uIHZhbHVlIG9uIHRoZSBlbGVtZW50IG9yIGVuYWJsZSB0aGUgcG9seWZpbGxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIGZpbmQgb3V0IHRoZSB0b3VjaC1hY3Rpb24gYnkgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIGlmICh2YWx1ZSA9PSBUT1VDSF9BQ1RJT05fQ09NUFVURSkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbXB1dGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOQVRJVkVfVE9VQ0hfQUNUSU9OICYmIHRoaXMubWFuYWdlci5lbGVtZW50LnN0eWxlICYmIFRPVUNIX0FDVElPTl9NQVBbdmFsdWVdKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZWxlbWVudC5zdHlsZVtQUkVGSVhFRF9UT1VDSF9BQ1RJT05dID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3Rpb25zID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGp1c3QgcmUtc2V0IHRoZSB0b3VjaEFjdGlvbiB2YWx1ZVxuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KHRoaXMubWFuYWdlci5vcHRpb25zLnRvdWNoQWN0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY29tcHV0ZSB0aGUgdmFsdWUgZm9yIHRoZSB0b3VjaEFjdGlvbiBwcm9wZXJ0eSBiYXNlZCBvbiB0aGUgcmVjb2duaXplcidzIHNldHRpbmdzXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBjb21wdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgZWFjaCh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsIGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgIGlmIChib29sT3JGbihyZWNvZ25pemVyLm9wdGlvbnMuZW5hYmxlLCBbcmVjb2duaXplcl0pKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGFjdGlvbnMuY29uY2F0KHJlY29nbml6ZXIuZ2V0VG91Y2hBY3Rpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucy5qb2luKCcgJykpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb24gZWFjaCBpbnB1dCBjeWNsZSBhbmQgcHJvdmlkZXMgdGhlIHByZXZlbnRpbmcgb2YgdGhlIGJyb3dzZXIgYmVoYXZpb3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBwcmV2ZW50RGVmYXVsdHM6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzcmNFdmVudCA9IGlucHV0LnNyY0V2ZW50O1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQub2Zmc2V0RGlyZWN0aW9uO1xuXG4gICAgICAgIC8vIGlmIHRoZSB0b3VjaCBhY3Rpb24gZGlkIHByZXZlbnRlZCBvbmNlIHRoaXMgc2Vzc2lvblxuICAgICAgICBpZiAodGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkKSB7XG4gICAgICAgICAgICBzcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGlvbnMgPSB0aGlzLmFjdGlvbnM7XG4gICAgICAgIHZhciBoYXNOb25lID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICAgICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWV07XG4gICAgICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKSAmJiAhVE9VQ0hfQUNUSU9OX01BUFtUT1VDSF9BQ1RJT05fUEFOX1hdO1xuXG4gICAgICAgIGlmIChoYXNOb25lKSB7XG4gICAgICAgICAgICAvL2RvIG5vdCBwcmV2ZW50IGRlZmF1bHRzIGlmIHRoaXMgaXMgYSB0YXAgZ2VzdHVyZVxuXG4gICAgICAgICAgICB2YXIgaXNUYXBQb2ludGVyID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSAxO1xuICAgICAgICAgICAgdmFyIGlzVGFwTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IDI7XG4gICAgICAgICAgICB2YXIgaXNUYXBUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCAyNTA7XG5cbiAgICAgICAgICAgIGlmIChpc1RhcFBvaW50ZXIgJiYgaXNUYXBNb3ZlbWVudCAmJiBpc1RhcFRvdWNoVGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgICAgIC8vIGBwYW4teCBwYW4teWAgbWVhbnMgYnJvd3NlciBoYW5kbGVzIGFsbCBzY3JvbGxpbmcvcGFubmluZywgZG8gbm90IHByZXZlbnRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNOb25lIHx8XG4gICAgICAgICAgICAoaGFzUGFuWSAmJiBkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkgfHxcbiAgICAgICAgICAgIChoYXNQYW5YICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZlbnRTcmMoc3JjRXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbGwgcHJldmVudERlZmF1bHQgdG8gcHJldmVudCB0aGUgYnJvd3NlcidzIGRlZmF1bHQgYmVoYXZpb3IgKHNjcm9sbGluZyBpbiBtb3N0IGNhc2VzKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNFdmVudFxuICAgICAqL1xuICAgIHByZXZlbnRTcmM6IGZ1bmN0aW9uKHNyY0V2ZW50KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZCA9IHRydWU7XG4gICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiB3aGVuIHRoZSB0b3VjaEFjdGlvbnMgYXJlIGNvbGxlY3RlZCB0aGV5IGFyZSBub3QgYSB2YWxpZCB2YWx1ZSwgc28gd2UgbmVlZCB0byBjbGVhbiB0aGluZ3MgdXAuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucykge1xuICAgIC8vIG5vbmVcbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICB2YXIgaGFzUGFuWCA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpO1xuXG4gICAgLy8gaWYgYm90aCBwYW4teCBhbmQgcGFuLXkgYXJlIHNldCAoZGlmZmVyZW50IHJlY29nbml6ZXJzXG4gICAgLy8gZm9yIGRpZmZlcmVudCBkaXJlY3Rpb25zLCBlLmcuIGhvcml6b250YWwgcGFuIGJ1dCB2ZXJ0aWNhbCBzd2lwZT8pXG4gICAgLy8gd2UgbmVlZCBub25lIChhcyBvdGhlcndpc2Ugd2l0aCBwYW4teCBwYW4teSBjb21iaW5lZCBub25lIG9mIHRoZXNlXG4gICAgLy8gcmVjb2duaXplcnMgd2lsbCB3b3JrLCBzaW5jZSB0aGUgYnJvd3NlciB3b3VsZCBoYW5kbGUgYWxsIHBhbm5pbmdcbiAgICBpZiAoaGFzUGFuWCAmJiBoYXNQYW5ZKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICAvLyBwYW4teCBPUiBwYW4teVxuICAgIGlmIChoYXNQYW5YIHx8IGhhc1BhblkpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhblggPyBUT1VDSF9BQ1RJT05fUEFOX1ggOiBUT1VDSF9BQ1RJT05fUEFOX1k7XG4gICAgfVxuXG4gICAgLy8gbWFuaXB1bGF0aW9uXG4gICAgaWYgKGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04pKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTUFOSVBVTEFUSU9OO1xuICAgIH1cblxuICAgIHJldHVybiBUT1VDSF9BQ1RJT05fQVVUTztcbn1cblxuZnVuY3Rpb24gZ2V0VG91Y2hBY3Rpb25Qcm9wcygpIHtcbiAgICBpZiAoIU5BVElWRV9UT1VDSF9BQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdG91Y2hNYXAgPSB7fTtcbiAgICB2YXIgY3NzU3VwcG9ydHMgPSB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1Muc3VwcG9ydHM7XG4gICAgWydhdXRvJywgJ21hbmlwdWxhdGlvbicsICdwYW4teScsICdwYW4teCcsICdwYW4teCBwYW4teScsICdub25lJ10uZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblxuICAgICAgICAvLyBJZiBjc3Muc3VwcG9ydHMgaXMgbm90IHN1cHBvcnRlZCBidXQgdGhlcmUgaXMgbmF0aXZlIHRvdWNoLWFjdGlvbiBhc3N1bWUgaXQgc3VwcG9ydHNcbiAgICAgICAgLy8gYWxsIHZhbHVlcy4gVGhpcyBpcyB0aGUgY2FzZSBmb3IgSUUgMTAgYW5kIDExLlxuICAgICAgICB0b3VjaE1hcFt2YWxdID0gY3NzU3VwcG9ydHMgPyB3aW5kb3cuQ1NTLnN1cHBvcnRzKCd0b3VjaC1hY3Rpb24nLCB2YWwpIDogdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdG91Y2hNYXA7XG59XG5cbi8qKlxuICogUmVjb2duaXplciBmbG93IGV4cGxhaW5lZDsgKlxuICogQWxsIHJlY29nbml6ZXJzIGhhdmUgdGhlIGluaXRpYWwgc3RhdGUgb2YgUE9TU0lCTEUgd2hlbiBhIGlucHV0IHNlc3Npb24gc3RhcnRzLlxuICogVGhlIGRlZmluaXRpb24gb2YgYSBpbnB1dCBzZXNzaW9uIGlzIGZyb20gdGhlIGZpcnN0IGlucHV0IHVudGlsIHRoZSBsYXN0IGlucHV0LCB3aXRoIGFsbCBpdCdzIG1vdmVtZW50IGluIGl0LiAqXG4gKiBFeGFtcGxlIHNlc3Npb24gZm9yIG1vdXNlLWlucHV0OiBtb3VzZWRvd24gLT4gbW91c2Vtb3ZlIC0+IG1vdXNldXBcbiAqXG4gKiBPbiBlYWNoIHJlY29nbml6aW5nIGN5Y2xlIChzZWUgTWFuYWdlci5yZWNvZ25pemUpIHRoZSAucmVjb2duaXplKCkgbWV0aG9kIGlzIGV4ZWN1dGVkXG4gKiB3aGljaCBkZXRlcm1pbmVzIHdpdGggc3RhdGUgaXQgc2hvdWxkIGJlLlxuICpcbiAqIElmIHRoZSByZWNvZ25pemVyIGhhcyB0aGUgc3RhdGUgRkFJTEVELCBDQU5DRUxMRUQgb3IgUkVDT0dOSVpFRCAoZXF1YWxzIEVOREVEKSwgaXQgaXMgcmVzZXQgdG9cbiAqIFBPU1NJQkxFIHRvIGdpdmUgaXQgYW5vdGhlciBjaGFuZ2Ugb24gdGhlIG5leHQgY3ljbGUuXG4gKlxuICogICAgICAgICAgICAgICBQb3NzaWJsZVxuICogICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICstLS0tLSstLS0tLS0tLS0tLS0tLS0rXG4gKiAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICstLS0tLSstLS0tLSsgICAgICAgICAgICAgICB8XG4gKiAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICB8XG4gKiAgIEZhaWxlZCAgICAgIENhbmNlbGxlZCAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0rLS0tLS0tK1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgIFJlY29nbml6ZWQgICAgICAgQmVnYW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZGVkL1JlY29nbml6ZWRcbiAqL1xudmFyIFNUQVRFX1BPU1NJQkxFID0gMTtcbnZhciBTVEFURV9CRUdBTiA9IDI7XG52YXIgU1RBVEVfQ0hBTkdFRCA9IDQ7XG52YXIgU1RBVEVfRU5ERUQgPSA4O1xudmFyIFNUQVRFX1JFQ09HTklaRUQgPSBTVEFURV9FTkRFRDtcbnZhciBTVEFURV9DQU5DRUxMRUQgPSAxNjtcbnZhciBTVEFURV9GQUlMRUQgPSAzMjtcblxuLyoqXG4gKiBSZWNvZ25pemVyXG4gKiBFdmVyeSByZWNvZ25pemVyIG5lZWRzIHRvIGV4dGVuZCBmcm9tIHRoaXMgY2xhc3MuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIFJlY29nbml6ZXIob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLmlkID0gdW5pcXVlSWQoKTtcblxuICAgIHRoaXMubWFuYWdlciA9IG51bGw7XG5cbiAgICAvLyBkZWZhdWx0IGlzIGVuYWJsZSB0cnVlXG4gICAgdGhpcy5vcHRpb25zLmVuYWJsZSA9IGlmVW5kZWZpbmVkKHRoaXMub3B0aW9ucy5lbmFibGUsIHRydWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuXG4gICAgdGhpcy5zaW11bHRhbmVvdXMgPSB7fTtcbiAgICB0aGlzLnJlcXVpcmVGYWlsID0gW107XG59XG5cblJlY29nbml6ZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEB2aXJ0dWFsXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBkZWZhdWx0czoge30sXG5cbiAgICAvKipcbiAgICAgKiBzZXQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybiB7UmVjb2duaXplcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gYWxzbyB1cGRhdGUgdGhlIHRvdWNoQWN0aW9uLCBpbiBjYXNlIHNvbWV0aGluZyBjaGFuZ2VkIGFib3V0IHRoZSBkaXJlY3Rpb25zL2VuYWJsZWQgc3RhdGVcbiAgICAgICAgdGhpcy5tYW5hZ2VyICYmIHRoaXMubWFuYWdlci50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyLlxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2ltdWx0YW5lb3VzID0gdGhpcy5zaW11bHRhbmVvdXM7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKCFzaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXSkge1xuICAgICAgICAgICAgc2ltdWx0YW5lb3VzW290aGVyUmVjb2duaXplci5pZF0gPSBvdGhlclJlY29nbml6ZXI7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVjb2duaXplV2l0aCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZHJvcCB0aGUgc2ltdWx0YW5lb3VzIGxpbmsuIGl0IGRvZXNudCByZW1vdmUgdGhlIGxpbmsgb24gdGhlIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIGRyb3BSZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZWNvZ25pemVXaXRoJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBkZWxldGUgdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZXIgY2FuIG9ubHkgcnVuIHdoZW4gYW4gb3RoZXIgaXMgZmFpbGluZ1xuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZXF1aXJlRmFpbHVyZTogZnVuY3Rpb24ob3RoZXJSZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhvdGhlclJlY29nbml6ZXIsICdyZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXF1aXJlRmFpbCA9IHRoaXMucmVxdWlyZUZhaWw7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKGluQXJyYXkocmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcikgPT09IC0xKSB7XG4gICAgICAgICAgICByZXF1aXJlRmFpbC5wdXNoKG90aGVyUmVjb2duaXplcik7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRyb3AgdGhlIHJlcXVpcmVGYWlsdXJlIGxpbmsuIGl0IGRvZXMgbm90IHJlbW92ZSB0aGUgbGluayBvbiB0aGUgb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG4gICAgZHJvcFJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheSh0aGlzLnJlcXVpcmVGYWlsLCBvdGhlclJlY29nbml6ZXIpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5yZXF1aXJlRmFpbC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBoYXMgcmVxdWlyZSBmYWlsdXJlcyBib29sZWFuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzUmVxdWlyZUZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIHJlY29nbml6ZXIgY2FuIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5SZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogWW91IHNob3VsZCB1c2UgYHRyeUVtaXRgIGluc3RlYWQgb2YgYGVtaXRgIGRpcmVjdGx5IHRvIGNoZWNrXG4gICAgICogdGhhdCBhbGwgdGhlIG5lZWRlZCByZWNvZ25pemVycyBoYXMgZmFpbGVkIGJlZm9yZSBlbWl0dGluZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5tYW5hZ2VyLmVtaXQoZXZlbnQsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdwYW5zdGFydCcgYW5kICdwYW5tb3ZlJ1xuICAgICAgICBpZiAoc3RhdGUgPCBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQpOyAvLyBzaW1wbGUgJ2V2ZW50TmFtZScgZXZlbnRzXG5cbiAgICAgICAgaWYgKGlucHV0LmFkZGl0aW9uYWxFdmVudCkgeyAvLyBhZGRpdGlvbmFsIGV2ZW50KHBhbmxlZnQsIHBhbnJpZ2h0LCBwaW5jaGluLCBwaW5jaG91dC4uLilcbiAgICAgICAgICAgIGVtaXQoaW5wdXQuYWRkaXRpb25hbEV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBhbmVuZCBhbmQgcGFuY2FuY2VsXG4gICAgICAgIGlmIChzdGF0ZSA+PSBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHRoYXQgYWxsIHRoZSByZXF1aXJlIGZhaWx1cmUgcmVjb2duaXplcnMgaGFzIGZhaWxlZCxcbiAgICAgKiBpZiB0cnVlLCBpdCBlbWl0cyBhIGdlc3R1cmUgZXZlbnQsXG4gICAgICogb3RoZXJ3aXNlLCBzZXR1cCB0aGUgc3RhdGUgdG8gRkFJTEVELlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIHRyeUVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhbkVtaXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaXQncyBmYWlsaW5nIGFueXdheVxuICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjYW4gd2UgZW1pdD9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5FbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoISh0aGlzLnJlcXVpcmVGYWlsW2ldLnN0YXRlICYgKFNUQVRFX0ZBSUxFRCB8IFNUQVRFX1BPU1NJQkxFKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSB0aGUgcmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICAvLyBtYWtlIGEgbmV3IGNvcHkgb2YgdGhlIGlucHV0RGF0YVxuICAgICAgICAvLyBzbyB3ZSBjYW4gY2hhbmdlIHRoZSBpbnB1dERhdGEgd2l0aG91dCBtZXNzaW5nIHVwIHRoZSBvdGhlciByZWNvZ25pemVyc1xuICAgICAgICB2YXIgaW5wdXREYXRhQ2xvbmUgPSBhc3NpZ24oe30sIGlucHV0RGF0YSk7XG5cbiAgICAgICAgLy8gaXMgaXMgZW5hYmxlZCBhbmQgYWxsb3cgcmVjb2duaXppbmc/XG4gICAgICAgIGlmICghYm9vbE9yRm4odGhpcy5vcHRpb25zLmVuYWJsZSwgW3RoaXMsIGlucHV0RGF0YUNsb25lXSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNldCB3aGVuIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZFxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9SRUNPR05JWkVEIHwgU1RBVEVfQ0FOQ0VMTEVEIHwgU1RBVEVfRkFJTEVEKSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMucHJvY2VzcyhpbnB1dERhdGFDbG9uZSk7XG5cbiAgICAgICAgLy8gdGhlIHJlY29nbml6ZXIgaGFzIHJlY29nbml6ZWQgYSBnZXN0dXJlXG4gICAgICAgIC8vIHNvIHRyaWdnZXIgYW4gZXZlbnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQgfCBTVEFURV9DQU5DRUxMRUQpKSB7XG4gICAgICAgICAgICB0aGlzLnRyeUVtaXQoaW5wdXREYXRhQ2xvbmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgc3RhdGUgb2YgdGhlIHJlY29nbml6ZXJcbiAgICAgKiB0aGUgYWN0dWFsIHJlY29nbml6aW5nIGhhcHBlbnMgaW4gdGhpcyBtZXRob2RcbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29uc3R9IFNUQVRFXG4gICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXREYXRhKSB7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBwcmVmZXJyZWQgdG91Y2gtYWN0aW9uXG4gICAgICogQHZpcnR1YWxcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogY2FsbGVkIHdoZW4gdGhlIGdlc3R1cmUgaXNuJ3QgYWxsb3dlZCB0byByZWNvZ25pemVcbiAgICAgKiBsaWtlIHdoZW4gYW5vdGhlciBpcyBiZWluZyByZWNvZ25pemVkIG9yIGl0IGlzIGRpc2FibGVkXG4gICAgICogQHZpcnR1YWxcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oKSB7IH1cbn07XG5cbi8qKlxuICogZ2V0IGEgdXNhYmxlIHN0cmluZywgdXNlZCBhcyBldmVudCBwb3N0Zml4XG4gKiBAcGFyYW0ge0NvbnN0fSBzdGF0ZVxuICogQHJldHVybnMge1N0cmluZ30gc3RhdGVcbiAqL1xuZnVuY3Rpb24gc3RhdGVTdHIoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgJiBTVEFURV9DQU5DRUxMRUQpIHtcbiAgICAgICAgcmV0dXJuICdjYW5jZWwnO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9FTkRFRCkge1xuICAgICAgICByZXR1cm4gJ2VuZCc7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0NIQU5HRUQpIHtcbiAgICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQkVHQU4pIHtcbiAgICAgICAgcmV0dXJuICdzdGFydCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBkaXJlY3Rpb24gY29ucyB0byBzdHJpbmdcbiAqIEBwYXJhbSB7Q29uc3R9IGRpcmVjdGlvblxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZGlyZWN0aW9uU3RyKGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0RPV04pIHtcbiAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fVVApIHtcbiAgICAgICAgcmV0dXJuICd1cCc7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0xFRlQpIHtcbiAgICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fUklHSFQpIHtcbiAgICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBnZXQgYSByZWNvZ25pemVyIGJ5IG5hbWUgaWYgaXQgaXMgYm91bmQgdG8gYSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSBvdGhlclJlY29nbml6ZXJcbiAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICogQHJldHVybnMge1JlY29nbml6ZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCByZWNvZ25pemVyKSB7XG4gICAgdmFyIG1hbmFnZXIgPSByZWNvZ25pemVyLm1hbmFnZXI7XG4gICAgaWYgKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hbmFnZXIuZ2V0KG90aGVyUmVjb2duaXplcik7XG4gICAgfVxuICAgIHJldHVybiBvdGhlclJlY29nbml6ZXI7XG59XG5cbi8qKlxuICogVGhpcyByZWNvZ25pemVyIGlzIGp1c3QgdXNlZCBhcyBhIGJhc2UgZm9yIHRoZSBzaW1wbGUgYXR0cmlidXRlIHJlY29nbml6ZXJzLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIEF0dHJSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChBdHRyUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgQXR0clJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgcG9pbnRlcnM6IDFcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXNlZCB0byBjaGVjayBpZiBpdCB0aGUgcmVjb2duaXplciByZWNlaXZlcyB2YWxpZCBpbnB1dCwgbGlrZSBpbnB1dC5kaXN0YW5jZSA+IDEwLlxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSByZWNvZ25pemVkXG4gICAgICovXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25Qb2ludGVycyA9IHRoaXMub3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgcmV0dXJuIG9wdGlvblBvaW50ZXJzID09PSAwIHx8IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9uUG9pbnRlcnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgdGhlIGlucHV0IGFuZCByZXR1cm4gdGhlIHN0YXRlIGZvciB0aGUgcmVjb2duaXplclxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHsqfSBTdGF0ZVxuICAgICAqL1xuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciBldmVudFR5cGUgPSBpbnB1dC5ldmVudFR5cGU7XG5cbiAgICAgICAgdmFyIGlzUmVjb2duaXplZCA9IHN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCk7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdGhpcy5hdHRyVGVzdChpbnB1dCk7XG5cbiAgICAgICAgLy8gb24gY2FuY2VsIGlucHV0IGFuZCB3ZSd2ZSByZWNvZ25pemVkIGJlZm9yZSwgcmV0dXJuIFNUQVRFX0NBTkNFTExFRFxuICAgICAgICBpZiAoaXNSZWNvZ25pemVkICYmIChldmVudFR5cGUgJiBJTlBVVF9DQU5DRUwgfHwgIWlzVmFsaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9DQU5DRUxMRUQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNSZWNvZ25pemVkIHx8IGlzVmFsaWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9FTkRFRDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIShzdGF0ZSAmIFNUQVRFX0JFR0FOKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9CRUdBTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NIQU5HRUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBQYW5cbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGFuZCBtb3ZlZCBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBhblJlY29nbml6ZXIoKSB7XG4gICAgQXR0clJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMucFggPSBudWxsO1xuICAgIHRoaXMucFkgPSBudWxsO1xufVxuXG5pbmhlcml0KFBhblJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBQYW5SZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwYW4nLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgZGlyZWN0aW9uOiBESVJFQ1RJT05fQUxMXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgfSxcblxuICAgIGRpcmVjdGlvblRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBpbnB1dC5kaXN0YW5jZTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGlucHV0LmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIHggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHZhciB5ID0gaW5wdXQuZGVsdGFZO1xuXG4gICAgICAgIC8vIGxvY2sgdG8gYXhpcz9cbiAgICAgICAgaWYgKCEoZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9ICh4ID09PSAwKSA/IERJUkVDVElPTl9OT05FIDogKHggPCAwKSA/IERJUkVDVElPTl9MRUZUIDogRElSRUNUSU9OX1JJR0hUO1xuICAgICAgICAgICAgICAgIGhhc01vdmVkID0geCAhPSB0aGlzLnBYO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoaW5wdXQuZGVsdGFYKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHkgPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeSA8IDApID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG4gICAgICAgICAgICAgICAgaGFzTW92ZWQgPSB5ICE9IHRoaXMucFk7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlucHV0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgcmV0dXJuIGhhc01vdmVkICYmIGRpc3RhbmNlID4gb3B0aW9ucy50aHJlc2hvbGQgJiYgZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gQXR0clJlY29nbml6ZXIucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXG4gICAgICAgICAgICAodGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOIHx8ICghKHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTikgJiYgdGhpcy5kaXJlY3Rpb25UZXN0KGlucHV0KSkpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuXG4gICAgICAgIHRoaXMucFggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHRoaXMucFkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvblN0cihpbnB1dC5kaXJlY3Rpb24pO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGRpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlci5lbWl0LmNhbGwodGhpcywgaW5wdXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFBpbmNoXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlcnMgYXJlIG1vdmluZyB0b3dhcmQgKHpvb20taW4pIG9yIGF3YXkgZnJvbSBlYWNoIG90aGVyICh6b29tLW91dCkuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBpbmNoUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFBpbmNoUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAncGluY2gnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5zY2FsZSAtIDEpID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCB8fCB0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4pO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIHZhciBpbk91dCA9IGlucHV0LnNjYWxlIDwgMSA/ICdpbicgOiAnb3V0JztcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGluT3V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogUHJlc3NcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGZvciB4IG1zIHdpdGhvdXQgYW55IG1vdmVtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFByZXNzUmVjb2duaXplcigpIHtcbiAgICBSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xufVxuXG5pbmhlcml0KFByZXNzUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUHJlc3NSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwcmVzcycsXG4gICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICB0aW1lOiAyNTEsIC8vIG1pbmltYWwgdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBwcmVzc2VkXG4gICAgICAgIHRocmVzaG9sZDogOSAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX0FVVE9dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgdmFyIHZhbGlkUG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IG9wdGlvbnMucG9pbnRlcnM7XG4gICAgICAgIHZhciB2YWxpZE1vdmVtZW50ID0gaW5wdXQuZGlzdGFuY2UgPCBvcHRpb25zLnRocmVzaG9sZDtcbiAgICAgICAgdmFyIHZhbGlkVGltZSA9IGlucHV0LmRlbHRhVGltZSA+IG9wdGlvbnMudGltZTtcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKCF2YWxpZE1vdmVtZW50IHx8ICF2YWxpZFBvaW50ZXJzIHx8IChpbnB1dC5ldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiAhdmFsaWRUaW1lKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXRDb250ZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgfSwgb3B0aW9ucy50aW1lLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnB1dCAmJiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EKSkge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgJ3VwJywgaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFJvdGF0ZVxuICogUmVjb2duaXplZCB3aGVuIHR3byBvciBtb3JlIHBvaW50ZXIgYXJlIG1vdmluZyBpbiBhIGNpcmN1bGFyIG1vdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUm90YXRlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFJvdGF0ZVJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBSb3RhdGVSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdyb3RhdGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5yb3RhdGlvbikgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfVxufSk7XG5cbi8qKlxuICogU3dpcGVcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBtb3ZpbmcgZmFzdCAodmVsb2NpdHkpLCB3aXRoIGVub3VnaCBkaXN0YW5jZSBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFN3aXBlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFN3aXBlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFN3aXBlUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAnc3dpcGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICB2ZWxvY2l0eTogMC4zLFxuICAgICAgICBkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgICAgICBwb2ludGVyczogMVxuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBQYW5SZWNvZ25pemVyLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciB2ZWxvY2l0eTtcblxuICAgICAgICBpZiAoZGlyZWN0aW9uICYgKERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMKSkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uICYgRElSRUNUSU9OX0hPUklaT05UQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WDtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fVkVSVElDQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgZGlyZWN0aW9uICYgaW5wdXQub2Zmc2V0RGlyZWN0aW9uICYmXG4gICAgICAgICAgICBpbnB1dC5kaXN0YW5jZSA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgJiZcbiAgICAgICAgICAgIGlucHV0Lm1heFBvaW50ZXJzID09IHRoaXMub3B0aW9ucy5wb2ludGVycyAmJlxuICAgICAgICAgICAgYWJzKHZlbG9jaXR5KSA+IHRoaXMub3B0aW9ucy52ZWxvY2l0eSAmJiBpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQ7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQub2Zmc2V0RGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uLCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIGlucHV0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBIHRhcCBpcyBlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb2luZyBhIHNtYWxsIHRhcC9jbGljay4gTXVsdGlwbGUgdGFwcyBhcmUgcmVjb2duaXplZCBpZiB0aGV5IG9jY3VyXG4gKiBiZXR3ZWVuIHRoZSBnaXZlbiBpbnRlcnZhbCBhbmQgcG9zaXRpb24uIFRoZSBkZWxheSBvcHRpb24gY2FuIGJlIHVzZWQgdG8gcmVjb2duaXplIG11bHRpLXRhcHMgd2l0aG91dCBmaXJpbmdcbiAqIGEgc2luZ2xlIHRhcC5cbiAqXG4gKiBUaGUgZXZlbnREYXRhIGZyb20gdGhlIGVtaXR0ZWQgZXZlbnQgY29udGFpbnMgdGhlIHByb3BlcnR5IGB0YXBDb3VudGAsIHdoaWNoIGNvbnRhaW5zIHRoZSBhbW91bnQgb2ZcbiAqIG11bHRpLXRhcHMgYmVpbmcgcmVjb2duaXplZC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgUmVjb2duaXplclxuICovXG5mdW5jdGlvbiBUYXBSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIC8vIHByZXZpb3VzIHRpbWUgYW5kIGNlbnRlcixcbiAgICAvLyB1c2VkIGZvciB0YXAgY291bnRpbmdcbiAgICB0aGlzLnBUaW1lID0gZmFsc2U7XG4gICAgdGhpcy5wQ2VudGVyID0gZmFsc2U7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xuICAgIHRoaXMuY291bnQgPSAwO1xufVxuXG5pbmhlcml0KFRhcFJlY29nbml6ZXIsIFJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAndGFwJyxcbiAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgIHRhcHM6IDEsXG4gICAgICAgIGludGVydmFsOiAzMDAsIC8vIG1heCB0aW1lIGJldHdlZW4gdGhlIG11bHRpLXRhcCB0YXBzXG4gICAgICAgIHRpbWU6IDI1MCwgLy8gbWF4IHRpbWUgb2YgdGhlIHBvaW50ZXIgdG8gYmUgZG93biAobGlrZSBmaW5nZXIgb24gdGhlIHNjcmVlbilcbiAgICAgICAgdGhyZXNob2xkOiA5LCAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgICAgICBwb3NUaHJlc2hvbGQ6IDEwIC8vIGEgbXVsdGktdGFwIGNhbiBiZSBhIGJpdCBvZmYgdGhlIGluaXRpYWwgcG9zaXRpb25cbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9NQU5JUFVMQVRJT05dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgdmFyIHZhbGlkTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IG9wdGlvbnMudGhyZXNob2xkO1xuICAgICAgICB2YXIgdmFsaWRUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCBvcHRpb25zLnRpbWU7XG5cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICAgIGlmICgoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpICYmICh0aGlzLmNvdW50ID09PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKHZhbGlkTW92ZW1lbnQgJiYgdmFsaWRUb3VjaFRpbWUgJiYgdmFsaWRQb2ludGVycykge1xuICAgICAgICAgICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWRJbnRlcnZhbCA9IHRoaXMucFRpbWUgPyAoaW5wdXQudGltZVN0YW1wIC0gdGhpcy5wVGltZSA8IG9wdGlvbnMuaW50ZXJ2YWwpIDogdHJ1ZTtcbiAgICAgICAgICAgIHZhciB2YWxpZE11bHRpVGFwID0gIXRoaXMucENlbnRlciB8fCBnZXREaXN0YW5jZSh0aGlzLnBDZW50ZXIsIGlucHV0LmNlbnRlcikgPCBvcHRpb25zLnBvc1RocmVzaG9sZDtcblxuICAgICAgICAgICAgdGhpcy5wVGltZSA9IGlucHV0LnRpbWVTdGFtcDtcbiAgICAgICAgICAgIHRoaXMucENlbnRlciA9IGlucHV0LmNlbnRlcjtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZE11bHRpVGFwIHx8ICF2YWxpZEludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcblxuICAgICAgICAgICAgLy8gaWYgdGFwIGNvdW50IG1hdGNoZXMgd2UgaGF2ZSByZWNvZ25pemVkIGl0LFxuICAgICAgICAgICAgLy8gZWxzZSBpdCBoYXMgYmVnYW4gcmVjb2duaXppbmcuLi5cbiAgICAgICAgICAgIHZhciB0YXBDb3VudCA9IHRoaXMuY291bnQgJSBvcHRpb25zLnRhcHM7XG4gICAgICAgICAgICBpZiAodGFwQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBubyBmYWlsaW5nIHJlcXVpcmVtZW50cywgaW1tZWRpYXRlbHkgdHJpZ2dlciB0aGUgdGFwIGV2ZW50XG4gICAgICAgICAgICAgICAgLy8gb3Igd2FpdCBhcyBsb25nIGFzIHRoZSBtdWx0aXRhcCBpbnRlcnZhbCB0byB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1JlcXVpcmVGYWlsdXJlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUkVDT0dOSVpFRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCBvcHRpb25zLmludGVydmFsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX0JFR0FOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICBmYWlsVGltZW91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgICAgICB9LCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSBTVEFURV9SRUNPR05JWkVEKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50YXBDb3VudCA9IHRoaXMuY291bnQ7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFNpbXBsZSB3YXkgdG8gY3JlYXRlIGEgbWFuYWdlciB3aXRoIGEgZGVmYXVsdCBzZXQgb2YgcmVjb2duaXplcnMuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSGFtbWVyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLnJlY29nbml6ZXJzID0gaWZVbmRlZmluZWQob3B0aW9ucy5yZWNvZ25pemVycywgSGFtbWVyLmRlZmF1bHRzLnByZXNldCk7XG4gICAgcmV0dXJuIG5ldyBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEBjb25zdCB7c3RyaW5nfVxuICovXG5IYW1tZXIuVkVSU0lPTiA9ICcyLjAuNyc7XG5cbi8qKlxuICogZGVmYXVsdCBzZXR0aW5nc1xuICogQG5hbWVzcGFjZVxuICovXG5IYW1tZXIuZGVmYXVsdHMgPSB7XG4gICAgLyoqXG4gICAgICogc2V0IGlmIERPTSBldmVudHMgYXJlIGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBCdXQgdGhpcyBpcyBzbG93ZXIgYW5kIHVudXNlZCBieSBzaW1wbGUgaW1wbGVtZW50YXRpb25zLCBzbyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZG9tRXZlbnRzOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5L2ZhbGxiYWNrLlxuICAgICAqIFdoZW4gc2V0IHRvIGBjb21wdXRlYCBpdCB3aWxsIG1hZ2ljYWxseSBzZXQgdGhlIGNvcnJlY3QgdmFsdWUgYmFzZWQgb24gdGhlIGFkZGVkIHJlY29nbml6ZXJzLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgY29tcHV0ZVxuICAgICAqL1xuICAgIHRvdWNoQWN0aW9uOiBUT1VDSF9BQ1RJT05fQ09NUFVURSxcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBlbmFibGU6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiBFWFBFUklNRU5UQUwgRkVBVFVSRSAtLSBjYW4gYmUgcmVtb3ZlZC9jaGFuZ2VkXG4gICAgICogQ2hhbmdlIHRoZSBwYXJlbnQgaW5wdXQgdGFyZ2V0IGVsZW1lbnQuXG4gICAgICogSWYgTnVsbCwgdGhlbiBpdCBpcyBiZWluZyBzZXQgdGhlIHRvIG1haW4gZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVsbHxFdmVudFRhcmdldH1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgaW5wdXRUYXJnZXQ6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBmb3JjZSBhbiBpbnB1dCBjbGFzc1xuICAgICAqIEB0eXBlIHtOdWxsfEZ1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBpbnB1dENsYXNzOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogRGVmYXVsdCByZWNvZ25pemVyIHNldHVwIHdoZW4gY2FsbGluZyBgSGFtbWVyKClgXG4gICAgICogV2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyIHRoZXNlIHdpbGwgYmUgc2tpcHBlZC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgcHJlc2V0OiBbXG4gICAgICAgIC8vIFJlY29nbml6ZXJDbGFzcywgb3B0aW9ucywgW3JlY29nbml6ZVdpdGgsIC4uLl0sIFtyZXF1aXJlRmFpbHVyZSwgLi4uXVxuICAgICAgICBbUm90YXRlUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9XSxcbiAgICAgICAgW1BpbmNoUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9LCBbJ3JvdGF0ZSddXSxcbiAgICAgICAgW1N3aXBlUmVjb2duaXplciwge2RpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUx9XSxcbiAgICAgICAgW1BhblJlY29nbml6ZXIsIHtkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMfSwgWydzd2lwZSddXSxcbiAgICAgICAgW1RhcFJlY29nbml6ZXJdLFxuICAgICAgICBbVGFwUmVjb2duaXplciwge2V2ZW50OiAnZG91YmxldGFwJywgdGFwczogMn0sIFsndGFwJ11dLFxuICAgICAgICBbUHJlc3NSZWNvZ25pemVyXVxuICAgIF0sXG5cbiAgICAvKipcbiAgICAgKiBTb21lIENTUyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvIGltcHJvdmUgdGhlIHdvcmtpbmcgb2YgSGFtbWVyLlxuICAgICAqIEFkZCB0aGVtIHRvIHRoaXMgbWV0aG9kIGFuZCB0aGV5IHdpbGwgYmUgc2V0IHdoZW4gY3JlYXRpbmcgYSBuZXcgTWFuYWdlci5cbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICovXG4gICAgY3NzUHJvcHM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRleHQgc2VsZWN0aW9uIHRvIGltcHJvdmUgdGhlIGRyYWdnaW5nIGdlc3R1cmUuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGUgdGhlIFdpbmRvd3MgUGhvbmUgZ3JpcHBlcnMgd2hlbiBwcmVzc2luZyBhbiBlbGVtZW50LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRoZSBkZWZhdWx0IGNhbGxvdXQgc2hvd24gd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQuXG4gICAgICAgICAqIE9uIGlPUywgd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQgc3VjaCBhcyBhIGxpbmssIFNhZmFyaSBkaXNwbGF5c1xuICAgICAgICAgKiBhIGNhbGxvdXQgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbGluay4gVGhpcyBwcm9wZXJ0eSBhbGxvd3MgeW91IHRvIGRpc2FibGUgdGhhdCBjYWxsb3V0LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoQ2FsbG91dDogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgd2hldGhlciB6b29taW5nIGlzIGVuYWJsZWQuIFVzZWQgYnkgSUUxMD5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICBjb250ZW50Wm9vbWluZzogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgdGhhdCBhbiBlbnRpcmUgZWxlbWVudCBzaG91bGQgYmUgZHJhZ2dhYmxlIGluc3RlYWQgb2YgaXRzIGNvbnRlbnRzLiBNYWlubHkgZm9yIGRlc2t0b3AgYnJvd3NlcnMuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdXNlckRyYWc6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3ZlcnJpZGVzIHRoZSBoaWdobGlnaHQgY29sb3Igc2hvd24gd2hlbiB0aGUgdXNlciB0YXBzIGEgbGluayBvciBhIEphdmFTY3JpcHRcbiAgICAgICAgICogY2xpY2thYmxlIGVsZW1lbnQgaW4gaU9TLiBUaGlzIHByb3BlcnR5IG9iZXlzIHRoZSBhbHBoYSB2YWx1ZSwgaWYgc3BlY2lmaWVkLlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAncmdiYSgwLDAsMCwwKSdcbiAgICAgICAgICovXG4gICAgICAgIHRhcEhpZ2hsaWdodENvbG9yOiAncmdiYSgwLDAsMCwwKSdcbiAgICB9XG59O1xuXG52YXIgU1RPUCA9IDE7XG52YXIgRk9SQ0VEX1NUT1AgPSAyO1xuXG4vKipcbiAqIE1hbmFnZXJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBhc3NpZ24oe30sIEhhbW1lci5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgPSB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICB0aGlzLnJlY29nbml6ZXJzID0gW107XG4gICAgdGhpcy5vbGRDc3NQcm9wcyA9IHt9O1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLmlucHV0ID0gY3JlYXRlSW5wdXRJbnN0YW5jZSh0aGlzKTtcbiAgICB0aGlzLnRvdWNoQWN0aW9uID0gbmV3IFRvdWNoQWN0aW9uKHRoaXMsIHRoaXMub3B0aW9ucy50b3VjaEFjdGlvbik7XG5cbiAgICB0b2dnbGVDc3NQcm9wcyh0aGlzLCB0cnVlKTtcblxuICAgIGVhY2godGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciByZWNvZ25pemVyID0gdGhpcy5hZGQobmV3IChpdGVtWzBdKShpdGVtWzFdKSk7XG4gICAgICAgIGl0ZW1bMl0gJiYgcmVjb2duaXplci5yZWNvZ25pemVXaXRoKGl0ZW1bMl0pO1xuICAgICAgICBpdGVtWzNdICYmIHJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUoaXRlbVszXSk7XG4gICAgfSwgdGhpcyk7XG59XG5cbk1hbmFnZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7TWFuYWdlcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gT3B0aW9ucyB0aGF0IG5lZWQgYSBsaXR0bGUgbW9yZSBzZXR1cFxuICAgICAgICBpZiAob3B0aW9ucy50b3VjaEFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnB1dFRhcmdldCkge1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZXhpc3RpbmcgZXZlbnQgbGlzdGVuZXJzIGFuZCByZWluaXRpYWxpemVcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC50YXJnZXQgPSBvcHRpb25zLmlucHV0VGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5pbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHN0b3AgcmVjb2duaXppbmcgZm9yIHRoaXMgc2Vzc2lvbi5cbiAgICAgKiBUaGlzIHNlc3Npb24gd2lsbCBiZSBkaXNjYXJkZWQsIHdoZW4gYSBuZXcgW2lucHV0XXN0YXJ0IGV2ZW50IGlzIGZpcmVkLlxuICAgICAqIFdoZW4gZm9yY2VkLCB0aGUgcmVjb2duaXplciBjeWNsZSBpcyBzdG9wcGVkIGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ZvcmNlXVxuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zdG9wcGVkID0gZm9yY2UgPyBGT1JDRURfU1RPUCA6IFNUT1A7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJ1biB0aGUgcmVjb2duaXplcnMhXG4gICAgICogY2FsbGVkIGJ5IHRoZSBpbnB1dEhhbmRsZXIgZnVuY3Rpb24gb24gZXZlcnkgbW92ZW1lbnQgb2YgdGhlIHBvaW50ZXJzICh0b3VjaGVzKVxuICAgICAqIGl0IHdhbGtzIHRocm91Z2ggYWxsIHRoZSByZWNvZ25pemVycyBhbmQgdHJpZXMgdG8gZGV0ZWN0IHRoZSBnZXN0dXJlIHRoYXQgaXMgYmVpbmcgbWFkZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICB2YXIgc2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbjtcbiAgICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcnVuIHRoZSB0b3VjaC1hY3Rpb24gcG9seWZpbGxcbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi5wcmV2ZW50RGVmYXVsdHMoaW5wdXREYXRhKTtcblxuICAgICAgICB2YXIgcmVjb2duaXplcjtcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcblxuICAgICAgICAvLyB0aGlzIGhvbGRzIHRoZSByZWNvZ25pemVyIHRoYXQgaXMgYmVpbmcgcmVjb2duaXplZC5cbiAgICAgICAgLy8gc28gdGhlIHJlY29nbml6ZXIncyBzdGF0ZSBuZWVkcyB0byBiZSBCRUdBTiwgQ0hBTkdFRCwgRU5ERUQgb3IgUkVDT0dOSVpFRFxuICAgICAgICAvLyBpZiBubyByZWNvZ25pemVyIGlzIGRldGVjdGluZyBhIHRoaW5nLCBpdCBpcyBzZXQgdG8gYG51bGxgXG4gICAgICAgIHZhciBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyO1xuXG4gICAgICAgIC8vIHJlc2V0IHdoZW4gdGhlIGxhc3QgcmVjb2duaXplciBpcyByZWNvZ25pemVkXG4gICAgICAgIC8vIG9yIHdoZW4gd2UncmUgaW4gYSBuZXcgc2Vzc2lvblxuICAgICAgICBpZiAoIWN1clJlY29nbml6ZXIgfHwgKGN1clJlY29nbml6ZXIgJiYgY3VyUmVjb2duaXplci5zdGF0ZSAmIFNUQVRFX1JFQ09HTklaRUQpKSB7XG4gICAgICAgICAgICBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCByZWNvZ25pemVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlY29nbml6ZXIgPSByZWNvZ25pemVyc1tpXTtcblxuICAgICAgICAgICAgLy8gZmluZCBvdXQgaWYgd2UgYXJlIGFsbG93ZWQgdHJ5IHRvIHJlY29nbml6ZSB0aGUgaW5wdXQgZm9yIHRoaXMgb25lLlxuICAgICAgICAgICAgLy8gMS4gICBhbGxvdyBpZiB0aGUgc2Vzc2lvbiBpcyBOT1QgZm9yY2VkIHN0b3BwZWQgKHNlZSB0aGUgLnN0b3AoKSBtZXRob2QpXG4gICAgICAgICAgICAvLyAyLiAgIGFsbG93IGlmIHdlIHN0aWxsIGhhdmVuJ3QgcmVjb2duaXplZCBhIGdlc3R1cmUgaW4gdGhpcyBzZXNzaW9uLCBvciB0aGUgdGhpcyByZWNvZ25pemVyIGlzIHRoZSBvbmVcbiAgICAgICAgICAgIC8vICAgICAgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgICAgICAgLy8gMy4gICBhbGxvdyBpZiB0aGUgcmVjb2duaXplciBpcyBhbGxvd2VkIHRvIHJ1biBzaW11bHRhbmVvdXMgd2l0aCB0aGUgY3VycmVudCByZWNvZ25pemVkIHJlY29nbml6ZXIuXG4gICAgICAgICAgICAvLyAgICAgIHRoaXMgY2FuIGJlIHNldHVwIHdpdGggdGhlIGByZWNvZ25pemVXaXRoKClgIG1ldGhvZCBvbiB0aGUgcmVjb2duaXplci5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uLnN0b3BwZWQgIT09IEZPUkNFRF9TVE9QICYmICggLy8gMVxuICAgICAgICAgICAgICAgICAgICAhY3VyUmVjb2duaXplciB8fCByZWNvZ25pemVyID09IGN1clJlY29nbml6ZXIgfHwgLy8gMlxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pemVyLmNhblJlY29nbml6ZVdpdGgoY3VyUmVjb2duaXplcikpKSB7IC8vIDNcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlY29nbml6ZShpbnB1dERhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWNvZ25pemVyIGhhcyBiZWVuIHJlY29nbml6aW5nIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGdlc3R1cmUsIHdlIHdhbnQgdG8gc3RvcmUgdGhpcyBvbmUgYXMgdGhlXG4gICAgICAgICAgICAvLyBjdXJyZW50IGFjdGl2ZSByZWNvZ25pemVyLiBidXQgb25seSBpZiB3ZSBkb24ndCBhbHJlYWR5IGhhdmUgYW4gYWN0aXZlIHJlY29nbml6ZXJcbiAgICAgICAgICAgIGlmICghY3VyUmVjb2duaXplciAmJiByZWNvZ25pemVyLnN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCB8IFNUQVRFX0VOREVEKSkge1xuICAgICAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSByZWNvZ25pemVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGdldCBhIHJlY29nbml6ZXIgYnkgaXRzIGV2ZW50IG5hbWUuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfFN0cmluZ30gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE51bGx9XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChyZWNvZ25pemVyIGluc3RhbmNlb2YgUmVjb2duaXplcikge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlY29nbml6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVjb2duaXplcnNbaV0ub3B0aW9ucy5ldmVudCA9PSByZWNvZ25pemVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBhZGQgYSByZWNvZ25pemVyIHRvIHRoZSBtYW5hZ2VyXG4gICAgICogZXhpc3RpbmcgcmVjb2duaXplcnMgd2l0aCB0aGUgc2FtZSBldmVudCBuYW1lIHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE1hbmFnZXJ9XG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAnYWRkJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXG4gICAgICAgIHZhciBleGlzdGluZyA9IHRoaXMuZ2V0KHJlY29nbml6ZXIub3B0aW9ucy5ldmVudCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoZXhpc3RpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvZ25pemVycy5wdXNoKHJlY29nbml6ZXIpO1xuICAgICAgICByZWNvZ25pemVyLm1hbmFnZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgIHJldHVybiByZWNvZ25pemVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYSByZWNvZ25pemVyIGJ5IG5hbWUgb3IgaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge01hbmFnZXJ9XG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAncmVtb3ZlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb2duaXplciA9IHRoaXMuZ2V0KHJlY29nbml6ZXIpO1xuXG4gICAgICAgIC8vIGxldCdzIG1ha2Ugc3VyZSB0aGlzIHJlY29nbml6ZXIgZXhpc3RzXG4gICAgICAgIGlmIChyZWNvZ25pemVyKSB7XG4gICAgICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheShyZWNvZ25pemVycywgcmVjb2duaXplcik7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdID0gaGFuZGxlcnNbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdW5iaW5kIGV2ZW50LCBsZWF2ZSBlbWl0IGJsYW5rIHRvIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2hhbmRsZXJdXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24oZXZlbnRzLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGhhbmRsZXJzW2V2ZW50XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdICYmIGhhbmRsZXJzW2V2ZW50XS5zcGxpY2UoaW5BcnJheShoYW5kbGVyc1tldmVudF0sIGhhbmRsZXIpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBlbWl0IGV2ZW50IHRvIHRoZSBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIC8vIHdlIGFsc28gd2FudCB0byB0cmlnZ2VyIGRvbSBldmVudHNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kb21FdmVudHMpIHtcbiAgICAgICAgICAgIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyBoYW5kbGVycywgc28gc2tpcCBpdCBhbGxcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF0gJiYgdGhpcy5oYW5kbGVyc1tldmVudF0uc2xpY2UoKTtcbiAgICAgICAgaWYgKCFoYW5kbGVycyB8fCAhaGFuZGxlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLnR5cGUgPSBldmVudDtcbiAgICAgICAgZGF0YS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGF0YS5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhhbmRsZXJzW2ldKGRhdGEpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRlc3Ryb3kgdGhlIG1hbmFnZXIgYW5kIHVuYmluZHMgYWxsIGV2ZW50c1xuICAgICAqIGl0IGRvZXNuJ3QgdW5iaW5kIGRvbSBldmVudHMsIHRoYXQgaXMgdGhlIHVzZXIgb3duIHJlc3BvbnNpYmlsaXR5XG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCAmJiB0b2dnbGVDc3NQcm9wcyh0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICAgICAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBhZGQvcmVtb3ZlIHRoZSBjc3MgcHJvcGVydGllcyBhcyBkZWZpbmVkIGluIG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wc1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFkZFxuICovXG5mdW5jdGlvbiB0b2dnbGVDc3NQcm9wcyhtYW5hZ2VyLCBhZGQpIHtcbiAgICB2YXIgZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICBpZiAoIWVsZW1lbnQuc3R5bGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcHJvcDtcbiAgICBlYWNoKG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wcywgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgcHJvcCA9IHByZWZpeGVkKGVsZW1lbnQuc3R5bGUsIG5hbWUpO1xuICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdID0gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdIHx8ICcnO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFhZGQpIHtcbiAgICAgICAgbWFuYWdlci5vbGRDc3NQcm9wcyA9IHt9O1xuICAgIH1cbn1cblxuLyoqXG4gKiB0cmlnZ2VyIGRvbSBldmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICovXG5mdW5jdGlvbiB0cmlnZ2VyRG9tRXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgICB2YXIgZ2VzdHVyZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZ2VzdHVyZUV2ZW50LmluaXRFdmVudChldmVudCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgZ2VzdHVyZUV2ZW50Lmdlc3R1cmUgPSBkYXRhO1xuICAgIGRhdGEudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZ2VzdHVyZUV2ZW50KTtcbn1cblxuYXNzaWduKEhhbW1lciwge1xuICAgIElOUFVUX1NUQVJUOiBJTlBVVF9TVEFSVCxcbiAgICBJTlBVVF9NT1ZFOiBJTlBVVF9NT1ZFLFxuICAgIElOUFVUX0VORDogSU5QVVRfRU5ELFxuICAgIElOUFVUX0NBTkNFTDogSU5QVVRfQ0FOQ0VMLFxuXG4gICAgU1RBVEVfUE9TU0lCTEU6IFNUQVRFX1BPU1NJQkxFLFxuICAgIFNUQVRFX0JFR0FOOiBTVEFURV9CRUdBTixcbiAgICBTVEFURV9DSEFOR0VEOiBTVEFURV9DSEFOR0VELFxuICAgIFNUQVRFX0VOREVEOiBTVEFURV9FTkRFRCxcbiAgICBTVEFURV9SRUNPR05JWkVEOiBTVEFURV9SRUNPR05JWkVELFxuICAgIFNUQVRFX0NBTkNFTExFRDogU1RBVEVfQ0FOQ0VMTEVELFxuICAgIFNUQVRFX0ZBSUxFRDogU1RBVEVfRkFJTEVELFxuXG4gICAgRElSRUNUSU9OX05PTkU6IERJUkVDVElPTl9OT05FLFxuICAgIERJUkVDVElPTl9MRUZUOiBESVJFQ1RJT05fTEVGVCxcbiAgICBESVJFQ1RJT05fUklHSFQ6IERJUkVDVElPTl9SSUdIVCxcbiAgICBESVJFQ1RJT05fVVA6IERJUkVDVElPTl9VUCxcbiAgICBESVJFQ1RJT05fRE9XTjogRElSRUNUSU9OX0RPV04sXG4gICAgRElSRUNUSU9OX0hPUklaT05UQUw6IERJUkVDVElPTl9IT1JJWk9OVEFMLFxuICAgIERJUkVDVElPTl9WRVJUSUNBTDogRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgIERJUkVDVElPTl9BTEw6IERJUkVDVElPTl9BTEwsXG5cbiAgICBNYW5hZ2VyOiBNYW5hZ2VyLFxuICAgIElucHV0OiBJbnB1dCxcbiAgICBUb3VjaEFjdGlvbjogVG91Y2hBY3Rpb24sXG5cbiAgICBUb3VjaElucHV0OiBUb3VjaElucHV0LFxuICAgIE1vdXNlSW5wdXQ6IE1vdXNlSW5wdXQsXG4gICAgUG9pbnRlckV2ZW50SW5wdXQ6IFBvaW50ZXJFdmVudElucHV0LFxuICAgIFRvdWNoTW91c2VJbnB1dDogVG91Y2hNb3VzZUlucHV0LFxuICAgIFNpbmdsZVRvdWNoSW5wdXQ6IFNpbmdsZVRvdWNoSW5wdXQsXG5cbiAgICBSZWNvZ25pemVyOiBSZWNvZ25pemVyLFxuICAgIEF0dHJSZWNvZ25pemVyOiBBdHRyUmVjb2duaXplcixcbiAgICBUYXA6IFRhcFJlY29nbml6ZXIsXG4gICAgUGFuOiBQYW5SZWNvZ25pemVyLFxuICAgIFN3aXBlOiBTd2lwZVJlY29nbml6ZXIsXG4gICAgUGluY2g6IFBpbmNoUmVjb2duaXplcixcbiAgICBSb3RhdGU6IFJvdGF0ZVJlY29nbml6ZXIsXG4gICAgUHJlc3M6IFByZXNzUmVjb2duaXplcixcblxuICAgIG9uOiBhZGRFdmVudExpc3RlbmVycyxcbiAgICBvZmY6IHJlbW92ZUV2ZW50TGlzdGVuZXJzLFxuICAgIGVhY2g6IGVhY2gsXG4gICAgbWVyZ2U6IG1lcmdlLFxuICAgIGV4dGVuZDogZXh0ZW5kLFxuICAgIGFzc2lnbjogYXNzaWduLFxuICAgIGluaGVyaXQ6IGluaGVyaXQsXG4gICAgYmluZEZuOiBiaW5kRm4sXG4gICAgcHJlZml4ZWQ6IHByZWZpeGVkXG59KTtcblxuLy8gdGhpcyBwcmV2ZW50cyBlcnJvcnMgd2hlbiBIYW1tZXIgaXMgbG9hZGVkIGluIHRoZSBwcmVzZW5jZSBvZiBhbiBBTURcbi8vICBzdHlsZSBsb2FkZXIgYnV0IGJ5IHNjcmlwdCB0YWcsIG5vdCBieSB0aGUgbG9hZGVyLlxudmFyIGZyZWVHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHt9KSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuZnJlZUdsb2JhbC5IYW1tZXIgPSBIYW1tZXI7XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBIYW1tZXI7XG4gICAgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEhhbW1lcjtcbn0gZWxzZSB7XG4gICAgd2luZG93W2V4cG9ydE5hbWVdID0gSGFtbWVyO1xufVxuXG59KSh3aW5kb3csIGRvY3VtZW50LCAnSGFtbWVyJyk7XG4iLCIvKipcbiAqIE1pY3JvRXZlbnQgLSB0byBtYWtlIGFueSBqcyBvYmplY3QgYW4gZXZlbnQgZW1pdHRlciAoc2VydmVyIG9yIGJyb3dzZXIpXG4gKiBcbiAqIC0gcHVyZSBqYXZhc2NyaXB0IC0gc2VydmVyIGNvbXBhdGlibGUsIGJyb3dzZXIgY29tcGF0aWJsZVxuICogLSBkb250IHJlbHkgb24gdGhlIGJyb3dzZXIgZG9tc1xuICogLSBzdXBlciBzaW1wbGUgLSB5b3UgZ2V0IGl0IGltbWVkaWF0bHksIG5vIG1pc3RlcnksIG5vIG1hZ2ljIGludm9sdmVkXG4gKlxuICogLSBjcmVhdGUgYSBNaWNyb0V2ZW50RGVidWcgd2l0aCBnb29kaWVzIHRvIGRlYnVnXG4gKiAgIC0gbWFrZSBpdCBzYWZlciB0byB1c2VcbiovXG5cbnZhciBNaWNyb0V2ZW50XHQ9IGZ1bmN0aW9uKCl7fVxuTWljcm9FdmVudC5wcm90b3R5cGVcdD0ge1xuXHRiaW5kXHQ6IGZ1bmN0aW9uKGV2ZW50LCBmY3Qpe1xuXHRcdHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcblx0XHR0aGlzLl9ldmVudHNbZXZlbnRdID0gdGhpcy5fZXZlbnRzW2V2ZW50XVx0fHwgW107XG5cdFx0dGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGZjdCk7XG5cdH0sXG5cdHVuYmluZFx0OiBmdW5jdGlvbihldmVudCwgZmN0KXtcblx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0aWYoIGV2ZW50IGluIHRoaXMuX2V2ZW50cyA9PT0gZmFsc2UgIClcdHJldHVybjtcblx0XHR0aGlzLl9ldmVudHNbZXZlbnRdLnNwbGljZSh0aGlzLl9ldmVudHNbZXZlbnRdLmluZGV4T2YoZmN0KSwgMSk7XG5cdH0sXG5cdHRyaWdnZXJcdDogZnVuY3Rpb24oZXZlbnQgLyogLCBhcmdzLi4uICovKXtcblx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0aWYoIGV2ZW50IGluIHRoaXMuX2V2ZW50cyA9PT0gZmFsc2UgIClcdHJldHVybjtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fZXZlbnRzW2V2ZW50XS5sZW5ndGg7IGkrKyl7XG5cdFx0XHR0aGlzLl9ldmVudHNbZXZlbnRdW2ldLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIG1peGluIHdpbGwgZGVsZWdhdGUgYWxsIE1pY3JvRXZlbnQuanMgZnVuY3Rpb24gaW4gdGhlIGRlc3RpbmF0aW9uIG9iamVjdFxuICpcbiAqIC0gcmVxdWlyZSgnTWljcm9FdmVudCcpLm1peGluKEZvb2Jhcikgd2lsbCBtYWtlIEZvb2JhciBhYmxlIHRvIHVzZSBNaWNyb0V2ZW50XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRoZSBvYmplY3Qgd2hpY2ggd2lsbCBzdXBwb3J0IE1pY3JvRXZlbnRcbiovXG5NaWNyb0V2ZW50Lm1peGluXHQ9IGZ1bmN0aW9uKGRlc3RPYmplY3Qpe1xuXHR2YXIgcHJvcHNcdD0gWydiaW5kJywgJ3VuYmluZCcsICd0cmlnZ2VyJ107XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkgKyspe1xuXHRcdGRlc3RPYmplY3QucHJvdG90eXBlW3Byb3BzW2ldXVx0PSBNaWNyb0V2ZW50LnByb3RvdHlwZVtwcm9wc1tpXV07XG5cdH1cbn1cblxuLy8gZXhwb3J0IGluIGNvbW1vbiBqc1xuaWYoIHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgKCdleHBvcnRzJyBpbiBtb2R1bGUpKXtcblx0bW9kdWxlLmV4cG9ydHNcdD0gTWljcm9FdmVudFxufVxuIl19
});

var MicroEvent$2, PagedPublicationPageSpread, SGN$11;

MicroEvent$2 = microevent;

SGN$11 = sgn;

PagedPublicationPageSpread = function () {
  function PagedPublicationPageSpread() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, PagedPublicationPageSpread);

    this.options = options;
    this.contentsRendered = false;
    this.hotspotsRendered = false;
    this.el = this.renderEl();
    return;
  }

  createClass(PagedPublicationPageSpread, [{
    key: 'getId',
    value: function getId() {
      return this.options.id;
    }
  }, {
    key: 'getEl',
    value: function getEl() {
      return this.el;
    }
  }, {
    key: 'getPages',
    value: function getPages() {
      return this.options.pages;
    }
  }, {
    key: 'renderEl',
    value: function renderEl() {
      var el, pageIds;
      el = document.createElement('div');
      pageIds = this.getPages().map(function (page) {
        return page.id;
      });
      el.className = 'verso__page-spread sgn-pp__page-spread';
      el.setAttribute('data-id', this.getId());
      el.setAttribute('data-type', 'page');
      el.setAttribute('data-width', this.options.width);
      el.setAttribute('data-page-ids', pageIds.join(','));
      el.setAttribute('data-max-zoom-scale', this.options.maxZoomScale);
      el.setAttribute('data-zoomable', false);
      return el;
    }
  }, {
    key: 'renderContents',
    value: function renderContents() {
      var _this = this;

      var el, id, imageLoads, pageCount, pages;
      id = this.getId();
      el = this.getEl();
      pages = this.getPages();
      pageCount = pages.length;
      imageLoads = 0;
      pages.forEach(function (page, i) {
        var image, loaderEl, pageEl;
        image = page.images.medium;
        pageEl = document.createElement('div');
        loaderEl = document.createElement('div');
        pageEl.className = 'sgn-pp__page verso__page';
        if (page.id != null) {
          pageEl.setAttribute('data-id', page.id);
        }
        if (pageCount === 2) {
          pageEl.className += i === 0 ? ' verso-page--verso' : ' verso-page--recto';
        }
        pageEl.appendChild(loaderEl);
        el.appendChild(pageEl);
        loaderEl.className = 'sgn-pp-page__loader';
        loaderEl.innerHTML = '<span>' + page.label + '</span>';
        SGN$11.util.loadImage(image, function (err, width, height) {
          var isComplete;
          if (err == null) {
            isComplete = ++imageLoads === pageCount;
            pageEl.style.backgroundImage = 'url(' + image + ')';
            pageEl.setAttribute('data-width', width);
            pageEl.setAttribute('data-height', height);
            pageEl.innerHTML = '&nbsp;';
            if (isComplete) {
              el.setAttribute('data-zoomable', true);
            }
            _this.trigger('pageLoaded', {
              pageSpreadId: id,
              page: page
            });
            if (isComplete) {
              _this.trigger('pagesLoaded', {
                pageSpreadId: id,
                pages: pages
              });
            }
          } else {
            loaderEl.innerHTML = '<span>!</span>';
          }
        });
      });
      this.contentsRendered = true;
      return this;
    }
  }, {
    key: 'clearContents',
    value: function clearContents(pageSpread, versoPageSpread) {
      this.el.innerHTML = '';
      this.contentsRendered = false;
      return this;
    }
  }, {
    key: 'zoomIn',
    value: function zoomIn() {
      var _this2 = this;

      var pageEls, pages;
      pageEls = [].slice.call(this.el.querySelectorAll('.sgn-pp__page'));
      pages = this.getPages();
      pageEls.forEach(function (pageEl) {
        var id, image, page;
        id = pageEl.getAttribute('data-id');
        page = SGN$11.util.find(pages, function (page) {
          return page.id === id;
        });
        image = page.images.large;
        SGN$11.util.loadImage(image, function (err) {
          if (err == null && _this2.el.getAttribute('data-active') === 'true') {
            pageEl.setAttribute('data-image', pageEl.style.backgroundImage);
            pageEl.style.backgroundImage = 'url(' + image + ')';
          }
        });
      });
    }
  }, {
    key: 'zoomOut',
    value: function zoomOut() {
      var pageEls;
      pageEls = [].slice.call(this.el.querySelectorAll('.sgn-pp__page[data-image]'));
      pageEls.forEach(function (pageEl) {
        pageEl.style.backgroundImage = pageEl.getAttribute('data-image');
        pageEl.removeAttribute('data-image');
      });
    }
  }]);
  return PagedPublicationPageSpread;
}();

MicroEvent$2.mixin(PagedPublicationPageSpread);

var pageSpread = PagedPublicationPageSpread;

var MicroEvent$3, PageSpread, PagedPublicationPageSpreads, SGN$12;

MicroEvent$3 = microevent;

PageSpread = pageSpread;

SGN$12 = sgn;

PagedPublicationPageSpreads = function () {
  function PagedPublicationPageSpreads(options) {
    classCallCheck(this, PagedPublicationPageSpreads);

    this.options = options;
    this.collection = [];
    this.ids = {};
    return;
  }

  createClass(PagedPublicationPageSpreads, [{
    key: 'get',
    value: function get$$1(id) {
      return this.ids[id];
    }
  }, {
    key: 'getFrag',
    value: function getFrag() {
      var frag;
      frag = document.createDocumentFragment();
      this.collection.forEach(function (pageSpread$$1) {
        return frag.appendChild(pageSpread$$1.el);
      });
      return frag;
    }
  }, {
    key: 'update',
    value: function update() {
      var _this = this;

      var pageMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'single';

      var firstPage, ids, lastPage, maxZoomScale, midstPageSpreads, pageSpreads, pages, width;
      pageSpreads = [];
      ids = {};
      pages = this.options.pages.slice();
      width = this.options.width;
      maxZoomScale = this.options.maxZoomScale;
      if (pageMode === 'single') {
        pages.forEach(function (page) {
          return pageSpreads.push([page]);
        });
      } else {
        firstPage = pages.shift();
        lastPage = pages.length % 2 === 1 ? pages.pop() : null;
        midstPageSpreads = SGN$12.util.chunk(pages, 2);
        if (firstPage != null) {
          pageSpreads.push([firstPage]);
        }
        midstPageSpreads.forEach(function (midstPages) {
          return pageSpreads.push(midstPages.map(function (page) {
            return page;
          }));
        });
        if (lastPage != null) {
          pageSpreads.push([lastPage]);
        }
      }
      this.collection = pageSpreads.map(function (pages, i) {
        var id, pageSpread$$1;
        id = pageMode + '-' + i;
        pageSpread$$1 = new PageSpread({
          width: width,
          maxZoomScale: maxZoomScale,
          pages: pages,
          id: id
        });
        pageSpread$$1.bind('pageLoaded', function (e) {
          return _this.trigger('pageLoaded', e);
        });
        pageSpread$$1.bind('pagesLoaded', function (e) {
          return _this.trigger('pagesLoaded', e);
        });
        ids[id] = pageSpread$$1;
        return pageSpread$$1;
      });
      this.ids = ids;
      return this;
    }
  }]);
  return PagedPublicationPageSpreads;
}();

MicroEvent$3.mixin(PagedPublicationPageSpreads);

var pageSpreads = PagedPublicationPageSpreads;

var MicroEvent$4, PageSpreads, PagedPublicationCore, SGN$13, Verso;

MicroEvent$4 = microevent;

Verso = verso;

PageSpreads = pageSpreads;

SGN$13 = sgn;

PagedPublicationCore = function () {
  var PagedPublicationCore = function () {
    function PagedPublicationCore(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, PagedPublicationCore);

      this.options = this.makeOptions(options, this.defaults);
      this.pageId = this.getOption('pageId');
      this.els = {
        root: el,
        pages: el.querySelector('.sgn-pp__pages'),
        verso: el.querySelector('.verso')
      };
      this.pageMode = this.getPageMode();
      this.pageSpreads = new PageSpreads({
        pages: this.getOption('pages'),
        maxZoomScale: this.getOption('pageSpreadMaxZoomScale'),
        width: this.getOption('pageSpreadWidth')
      });
      this.pageSpreads.bind('pageLoaded', this.pageLoaded.bind(this));
      this.pageSpreads.bind('pagesLoaded', this.pagesLoaded.bind(this));
      this.setColor(this.getOption('color'));
      // It's important to insert the page spreads before instantiating Verso.
      this.els.pages.parentNode.insertBefore(this.pageSpreads.update(this.pageMode).getFrag(), this.els.pages);
      this.verso = this.createVerso();
      this.bind('started', this.start.bind(this));
      this.bind('destroyed', this.destroy.bind(this));
      return;
    }

    createClass(PagedPublicationCore, [{
      key: 'start',
      value: function start() {
        this.getVerso().start();
        this.visibilityChangeListener = this.visibilityChange.bind(this);
        this.resizeListener = SGN$13.util.throttle(this.resize, this.getOption('resizeDelay'), this);
        this.unloadListener = this.unload.bind(this);
        document.addEventListener('visibilitychange', this.visibilityChangeListener, false);
        window.addEventListener('resize', this.resizeListener, false);
        window.addEventListener('beforeunload', this.unloadListener, false);
        this.els.root.setAttribute('data-started', '');
        this.els.root.setAttribute('tabindex', '-1');
        this.els.root.focus();
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        var i, len, pageSpreadEl, pageSpreadEls, verso$$1;
        verso$$1 = this.getVerso();
        pageSpreadEls = verso$$1.el.querySelectorAll('.sgn-pp__page-spread');
        this.els.root.removeAttribute('data-started');
        this.els.root.removeAttribute('data-idle');
        this.els.root.removeAttribute('data-navigating');
        this.els.root.removeAttribute('data-color-brightness');
        this.els.root.removeAttribute('data-zoomed-in');
        this.els.root.style.backgroundColor = '#ffffff';
        for (i = 0, len = pageSpreadEls.length; i < len; i++) {
          pageSpreadEl = pageSpreadEls[i];
          pageSpreadEl.parentNode.removeChild(pageSpreadEl);
        }
        verso$$1.destroy();
        document.removeEventListener('visibilitychange', this.visibilityChangeListener, false);
        window.removeEventListener('resize', this.resizeListener, false);
        window.removeEventListener('beforeunload', this.unloadListener, false);
      }
    }, {
      key: 'makeOptions',
      value: function makeOptions(options, defaults$$1) {
        var key, opts, ref, value;
        opts = {};
        for (key in options) {
          value = options[key];
          opts[key] = (ref = options[key]) != null ? ref : defaults$$1[key];
        }
        return opts;
      }
    }, {
      key: 'getOption',
      value: function getOption(key) {
        return this.options[key];
      }
    }, {
      key: 'setColor',
      value: function setColor(color) {
        this.els.root.setAttribute('data-color-brightness', SGN$13.util.getColorBrightness(color));
        this.els.root.style.backgroundColor = color;
      }
    }, {
      key: 'createVerso',
      value: function createVerso() {
        var verso$$1;
        verso$$1 = new Verso(this.els.verso, {
          pageId: this.pageId
        });
        verso$$1.pageSpreads.forEach(this.overridePageSpreadContentRect.bind(this));
        verso$$1.bind('beforeNavigation', this.beforeNavigation.bind(this));
        verso$$1.bind('afterNavigation', this.afterNavigation.bind(this));
        verso$$1.bind('attemptedNavigation', this.attemptedNavigation.bind(this));
        verso$$1.bind('clicked', this.clicked.bind(this));
        verso$$1.bind('doubleClicked', this.doubleClicked.bind(this));
        verso$$1.bind('pressed', this.pressed.bind(this));
        verso$$1.bind('contextmenu', this.contextmenu.bind(this));
        verso$$1.bind('panStart', this.panStart.bind(this));
        verso$$1.bind('panEnd', this.panEnd.bind(this));
        verso$$1.bind('zoomedIn', this.zoomedIn.bind(this));
        verso$$1.bind('zoomedOut', this.zoomedOut.bind(this));
        return verso$$1;
      }
    }, {
      key: 'getVerso',
      value: function getVerso() {
        return this.verso;
      }
    }, {
      key: 'getContentRect',
      value: function getContentRect(pageSpread) {
        var actualHeight, actualWidth, clientRect, imageRatio, pageCount, pageEl, pageEls, pageHeight, pageWidth, rect, scale;
        rect = {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0
        };
        pageEls = pageSpread.getPageEls();
        pageEl = pageEls[0];
        pageCount = pageEls.length;
        if (!pageCount) {
          return rect;
        }
        scale = this.getVerso().transform.scale;
        pageWidth = pageEl.offsetWidth * pageCount * scale;
        pageHeight = pageEl.offsetHeight * scale;
        imageRatio = +pageEl.getAttribute('data-height') / (+pageEl.getAttribute('data-width') * pageCount);
        actualHeight = pageHeight;
        actualWidth = actualHeight / imageRatio;
        actualWidth = Math.min(pageWidth, actualWidth);
        actualHeight = actualWidth * imageRatio;
        clientRect = pageEl.getBoundingClientRect();
        rect.width = actualWidth;
        rect.height = actualHeight;
        rect.top = clientRect.top + (pageHeight - actualHeight) / 2;
        rect.left = clientRect.left + (pageWidth - actualWidth) / 2;
        rect.right = rect.width + rect.left;
        rect.bottom = rect.height + rect.top;
        return rect;
      }
    }, {
      key: 'formatProgressLabel',
      value: function formatProgressLabel(pageSpread) {
        var label, pageCount, pageIds, pageLabels, pages, ref;
        pages = (ref = pageSpread != null ? pageSpread.options.pages : void 0) != null ? ref : [];
        pageIds = pages.map(function (page) {
          return page.id;
        });
        pageLabels = pages.map(function (page) {
          return page.label;
        });
        pageCount = this.getOption('pages').length;
        label = pageIds.length > 0 ? pageLabels.join('-') + ' / ' + pageCount : null;
        return label;
      }
    }, {
      key: 'renderPageSpreads',
      value: function renderPageSpreads() {
        var _this = this;

        this.getVerso().pageSpreads.forEach(function (pageSpread) {
          var match, visibility;
          visibility = pageSpread.getVisibility();
          match = _this.pageSpreads.get(pageSpread.getId());
          if (match != null) {
            if (visibility === 'visible' && match.contentsRendered === false) {
              setTimeout(match.renderContents.bind(match), 0);
            }
            if (visibility === 'gone' && match.contentsRendered === true) {
              setTimeout(match.clearContents.bind(match), 0);
            }
          }
        });
        return this;
      }
    }, {
      key: 'findPage',
      value: function findPage(pageId) {
        return SGN$13.util.find(this.getOption('pages'), function (page) {
          return page.id === pageId;
        });
      }
    }, {
      key: 'pageLoaded',
      value: function pageLoaded(e) {
        this.trigger('pageLoaded', e);
      }
    }, {
      key: 'pagesLoaded',
      value: function pagesLoaded(e) {
        this.trigger('pagesLoaded', e);
      }
    }, {
      key: 'beforeNavigation',
      value: function beforeNavigation(e) {
        var newSpreadEl, pageSpread, pageSpreadCount, position, progress, progressLabel, theVerso, versoPageSpread;
        position = e.newPosition;
        theVerso = this.getVerso();
        versoPageSpread = theVerso.getPageSpreadFromPosition(position);
        pageSpread = this.pageSpreads.get(versoPageSpread.getId());
        pageSpreadCount = theVerso.getPageSpreadCount();
        newSpreadEl = theVerso.pageSpreadEls[e.newPosition];
        progress = position / (pageSpreadCount - 1) * 100;
        progressLabel = this.formatProgressLabel(pageSpread);
        this.els.root.setAttribute('data-navigating', true);
        this.renderPageSpreads();
        this.resetIdleTimer();
        this.startIdleTimer();
        this.trigger('beforeNavigation', {
          verso: e,
          pageSpread: pageSpread,
          newSpreadEl: newSpreadEl,
          progress: progress,
          progressLabel: progressLabel,
          pageSpreadCount: pageSpreadCount,
          newPositionIsEnd: e.newPosition + 1 === pageSpreadCount
        });
      }
    }, {
      key: 'afterNavigation',
      value: function afterNavigation(e) {
        var newSpreadEl, pageSpread, pageSpreadCount, position, theVerso, versoPageSpread;
        position = e.newPosition;
        theVerso = this.getVerso();
        versoPageSpread = theVerso.getPageSpreadFromPosition(position);
        pageSpread = this.pageSpreads.get(versoPageSpread.getId());
        pageSpreadCount = theVerso.getPageSpreadCount();
        newSpreadEl = theVerso.pageSpreadEls[e.newPosition];
        this.els.root.setAttribute('data-navigating', false);
        this.trigger('afterNavigation', {
          verso: e,
          pageSpread: pageSpread,
          pageSpreadCount: pageSpreadCount,
          newSpreadEl: newSpreadEl,
          newPositionIsEnd: e.newPosition + 1 === pageSpreadCount
        });
      }
    }, {
      key: 'attemptedNavigation',
      value: function attemptedNavigation(e) {
        this.trigger('attemptedNavigation', {
          verso: e
        });
      }
    }, {
      key: 'clicked',
      value: function clicked(e) {
        var page, pageId;
        if (e.isInsideContent) {
          pageId = e.pageEl.getAttribute('data-id');
          page = this.findPage(pageId);
          this.trigger('clicked', {
            verso: e,
            page: page
          });
        }
      }
    }, {
      key: 'doubleClicked',
      value: function doubleClicked(e) {
        var page, pageId;
        if (e.isInsideContent) {
          pageId = e.pageEl.getAttribute('data-id');
          page = this.findPage(pageId);
          this.trigger('doubleClicked', {
            verso: e,
            page: page
          });
        }
      }
    }, {
      key: 'pressed',
      value: function pressed(e) {
        var page, pageId;
        if (e.isInsideContent) {
          pageId = e.pageEl.getAttribute('data-id');
          page = this.findPage(pageId);
          this.trigger('pressed', {
            verso: e,
            page: page
          });
        }
      }
    }, {
      key: 'contextmenu',
      value: function contextmenu(e) {
        var page, pageId;
        if (e.isInsideContent) {
          pageId = e.pageEl.getAttribute('data-id');
          page = this.findPage(pageId);
          this.trigger('contextmenu', {
            verso: e,
            page: page
          });
        }
      }
    }, {
      key: 'panStart',
      value: function panStart() {
        this.resetIdleTimer();
        this.trigger('panStart', {
          scale: this.getVerso().transform.scale
        });
      }
    }, {
      key: 'panEnd',
      value: function panEnd() {
        this.startIdleTimer();
        this.trigger('panEnd');
      }
    }, {
      key: 'zoomedIn',
      value: function zoomedIn(e) {
        var pageSpread, position, versoPageSpread;
        position = e.position;
        versoPageSpread = this.getVerso().getPageSpreadFromPosition(position);
        pageSpread = this.pageSpreads.get(versoPageSpread.getId());
        if (pageSpread != null) {
          pageSpread.zoomIn();
        }
        this.els.root.setAttribute('data-zoomed-in', true);
        this.trigger('zoomedIn', {
          verso: e,
          pageSpread: pageSpread
        });
      }
    }, {
      key: 'zoomedOut',
      value: function zoomedOut(e) {
        var pageSpread, position, versoPageSpread;
        position = e.position;
        versoPageSpread = this.getVerso().getPageSpreadFromPosition(position);
        pageSpread = this.pageSpreads.get(versoPageSpread.getId());
        if (pageSpread != null) {
          pageSpread.zoomOut();
        }
        this.els.root.setAttribute('data-zoomed-in', false);
        this.trigger('zoomedOut', {
          verso: e,
          pageSpread: pageSpread
        });
      }
    }, {
      key: 'getPageMode',
      value: function getPageMode() {
        var height, pageMode, width;
        pageMode = this.getOption('pageMode');
        if (pageMode == null) {
          width = this.els.root.offsetWidth;
          height = this.els.root.offsetHeight;
          pageMode = height / width < 0.8 ? 'double' : 'single';
        }
        return pageMode;
      }
    }, {
      key: 'resetIdleTimer',
      value: function resetIdleTimer() {
        clearTimeout(this.idleTimeout);
        this.els.root.setAttribute('data-idle', false);
        return this;
      }
    }, {
      key: 'startIdleTimer',
      value: function startIdleTimer() {
        var _this2 = this;

        this.idleTimeout = setTimeout(function () {
          _this2.els.root.setAttribute('data-idle', true);
        }, this.getOption('idleDelay'));
        return this;
      }
    }, {
      key: 'switchPageMode',
      value: function switchPageMode(pageMode) {
        var i, len, pageIds, pageSpreadEl, pageSpreadEls, verso$$1;
        if (this.pageMode === pageMode) {
          return this;
        }
        verso$$1 = this.getVerso();
        pageIds = verso$$1.getPageSpreadFromPosition(verso$$1.getPosition()).getPageIds();
        pageSpreadEls = this.getVerso().el.querySelectorAll('.sgn-pp__page-spread');
        this.pageMode = pageMode;
        this.pageSpreads.update(this.pageMode);
        for (i = 0, len = pageSpreadEls.length; i < len; i++) {
          pageSpreadEl = pageSpreadEls[i];
          pageSpreadEl.parentNode.removeChild(pageSpreadEl);
        }
        this.els.pages.parentNode.insertBefore(this.pageSpreads.getFrag(), this.els.pages);
        verso$$1.refresh();
        verso$$1.navigateTo(verso$$1.getPageSpreadPositionFromPageId(pageIds[0]), {
          duration: 0
        });
        verso$$1.pageSpreads.forEach(this.overridePageSpreadContentRect.bind(this));
        return this;
      }
    }, {
      key: 'overridePageSpreadContentRect',
      value: function overridePageSpreadContentRect(pageSpread) {
        var _this3 = this;

        if (pageSpread.getType() === 'page') {
          return pageSpread.getContentRect = function () {
            return _this3.getContentRect(pageSpread);
          };
        }
      }
    }, {
      key: 'visibilityChange',
      value: function visibilityChange() {
        var eventName, pageSpread;
        pageSpread = this.getVerso().getPageSpreadFromPosition(this.getVerso().getPosition());
        eventName = document.hidden === true ? 'disappeared' : 'appeared';
        this.trigger(eventName, {
          pageSpread: this.pageSpreads.get(pageSpread.id)
        });
      }
    }, {
      key: 'resize',
      value: function resize() {
        var pageMode;
        pageMode = this.getPageMode();
        if (this.getOption('pageMode') == null && pageMode !== this.pageMode) {
          this.switchPageMode(pageMode);
        } else {
          this.trigger('resized');
        }
      }
    }, {
      key: 'unload',
      value: function unload() {
        this.trigger('disappeared');
      }
    }]);
    return PagedPublicationCore;
  }();

  PagedPublicationCore.prototype.defaults = {
    pages: [],
    pageSpreadWidth: 100,
    pageSpreadMaxZoomScale: 2.3,
    idleDelay: 1000,
    resizeDelay: 400,
    color: '#ffffff'
  };

  return PagedPublicationCore;
}.call(commonjsGlobal);

MicroEvent$4.mixin(PagedPublicationCore);

var core$2 = PagedPublicationCore;

var MicroEvent$5, Mustache$1, PagedPublicationHotspots;

MicroEvent$5 = microevent;

Mustache$1 = mustache;

PagedPublicationHotspots = function () {
  function PagedPublicationHotspots() {
    classCallCheck(this, PagedPublicationHotspots);

    this.currentPageSpreadId = null;
    this.pageSpreadsLoaded = {};
    this.cache = {};
    this.bind('hotspotsReceived', this.hotspotsReceived.bind(this));
    this.bind('afterNavigation', this.afterNavigation.bind(this));
    this.bind('pagesLoaded', this.pagesLoaded.bind(this));
    this.bind('resized', this.resized.bind(this));
    return;
  }

  createClass(PagedPublicationHotspots, [{
    key: 'renderHotspots',
    value: function renderHotspots(data) {
      var boundingRect, contentRect, el, frag, hotspot, hotspotEl, hotspotEls, i, id, len, pageSpreadEl, position, ref;
      frag = document.createDocumentFragment();
      contentRect = data.versoPageSpread.getContentRect();
      pageSpreadEl = data.pageSpread.getEl();
      hotspotEls = pageSpreadEl.querySelectorAll('.sgn-pp__hotspot');
      boundingRect = pageSpreadEl.getBoundingClientRect();
      for (i = 0, len = hotspotEls.length; i < len; i++) {
        hotspotEl = hotspotEls[i];
        hotspotEl.parentNode.removeChild(hotspotEl);
      }
      ref = data.hotspots;
      for (id in ref) {
        hotspot = ref[id];
        position = this.getPosition(data.pages, data.ratio, hotspot);
        el = this.renderHotspot(hotspot, position, contentRect, boundingRect);
        frag.appendChild(el);
      }
      pageSpreadEl.appendChild(frag);
      return this;
    }
  }, {
    key: 'renderHotspot',
    value: function renderHotspot(hotspot, position, contentRect, boundingRect) {
      var el, height, left, ref, top, width;
      el = document.createElement('div');
      top = Math.round(contentRect.height / 100 * position.top);
      left = Math.round(contentRect.width / 100 * position.left);
      width = Math.round(contentRect.width / 100 * position.width);
      height = Math.round(contentRect.height / 100 * position.height);
      top += Math.round(contentRect.top);
      left += Math.round(contentRect.left);
      top -= boundingRect.top;
      left -= boundingRect.left;
      el.className = 'sgn-pp__hotspot verso__overlay';
      if (hotspot.id != null) {
        el.setAttribute('data-id', hotspot.id);
      }
      if (hotspot.type != null) {
        el.setAttribute('data-type', hotspot.type);
      }
      el.innerHTML = Mustache$1.render((ref = hotspot.template) != null ? ref : '', hotspot);
      el.style.top = top + 'px';
      el.style.left = left + 'px';
      el.style.width = width + 'px';
      el.style.height = height + 'px';
      return el;
    }
  }, {
    key: 'getPosition',
    value: function getPosition(pages, ratio, hotspot) {
      var height, maxX, maxY, minX, minY, pageNumber, pageNumbers, width;
      minX = null;
      minY = null;
      maxX = null;
      maxY = null;
      pageNumbers = pages.map(function (page) {
        return page.pageNumber;
      });
      for (pageNumber in hotspot.locations) {
        if (pageNumbers.indexOf(+pageNumber) === -1) {
          continue;
        }
        hotspot.locations[pageNumber].forEach(function (coords) {
          var x, y;
          x = coords[0];
          y = coords[1];
          if (pages[1] && pageNumbers[1] === +pageNumber) {
            x += 1;
          }
          x /= pages.length;
          if (minX == null) {
            minX = maxX = x;
            minY = maxY = y;
          }
          if (x < minX) {
            minX = x;
          }
          if (x > maxX) {
            maxX = x;
          }
          if (y < minY) {
            minY = y;
          }
          if (y > maxY) {
            return maxY = y;
          }
        });
      }
      width = maxX - minX;
      height = maxY - minY;
      return {
        top: minY / ratio * 100,
        left: minX * 100,
        width: width * 100,
        height: height / ratio * 100
      };
    }
  }, {
    key: 'requestHotspots',
    value: function requestHotspots(pageSpreadId, pages) {
      this.trigger('hotspotsRequested', {
        id: pageSpreadId,
        pages: pages
      });
    }
  }, {
    key: 'hotspotsReceived',
    value: function hotspotsReceived(e) {
      var pageSpreadId;
      pageSpreadId = e.pageSpread.getId();
      this.setCache(pageSpreadId, e);
      this.renderHotspots(e);
    }
  }, {
    key: 'getCache',
    value: function getCache(pageSpreadId) {
      return this.cache[pageSpreadId];
    }
  }, {
    key: 'setCache',
    value: function setCache(pageSpreadId, data) {
      this.cache[pageSpreadId] = data;
      return this;
    }
  }, {
    key: 'afterNavigation',
    value: function afterNavigation(e) {
      var id;
      if (e.pageSpread == null) {
        return;
      }
      id = e.pageSpread.getId();
      this.currentPageSpreadId = id;
      if (this.pageSpreadsLoaded[id]) {
        this.requestHotspots(id, e.pageSpread.getPages());
      }
    }
  }, {
    key: 'pagesLoaded',
    value: function pagesLoaded(e) {
      this.pageSpreadsLoaded[e.pageSpreadId] = true;
      if (this.currentPageSpreadId === e.pageSpreadId) {
        this.requestHotspots(e.pageSpreadId, e.pages);
      }
    }
  }, {
    key: 'resized',
    value: function resized(e) {
      var data;
      data = this.getCache(this.currentPageSpreadId);
      if (data != null) {
        this.renderHotspots(data);
      }
    }
  }]);
  return PagedPublicationHotspots;
}();

MicroEvent$5.mixin(PagedPublicationHotspots);

var hotspots = PagedPublicationHotspots;

var keyCodes = {
  ESC: 27,
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
  SPACE: 32,
  NUMBER_ONE: 49
};

var MicroEvent$6, PagedPublicationControls, SGN$14, keyCodes$1;

MicroEvent$6 = microevent;

SGN$14 = sgn;

keyCodes$1 = keyCodes;

PagedPublicationControls = function () {
  function PagedPublicationControls(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, PagedPublicationControls);

    this.options = options;
    this.els = {
      root: el,
      progress: el.querySelector('.sgn-pp__progress'),
      progressBar: el.querySelector('.sgn-pp-progress__bar'),
      progressLabel: el.querySelector('.sgn-pp__progress-label'),
      prevControl: el.querySelector('.sgn-pp__control[data-direction=prev]'),
      nextControl: el.querySelector('.sgn-pp__control[data-direction=next]'),
      close: el.querySelector('.sgn-pp--close')
    };
    this.keyDownListener = SGN$14.util.throttle(this.keyDown, 150, this);
    if (this.options.keyboard === true) {
      this.els.root.addEventListener('keydown', this.keyDownListener, false);
    }
    if (this.els.prevControl != null) {
      this.els.prevControl.addEventListener('click', this.prevClicked.bind(this), false);
    }
    if (this.els.nextControl != null) {
      this.els.nextControl.addEventListener('click', this.nextClicked.bind(this), false);
    }
    if (this.els.close != null) {
      this.els.close.addEventListener('click', this.closeClicked.bind(this), false);
    }
    this.bind('beforeNavigation', this.beforeNavigation.bind(this));
    return;
  }

  createClass(PagedPublicationControls, [{
    key: 'destroy',
    value: function destroy() {
      this.els.root.removeEventListener('keydown', this.keyDownListener);
    }
  }, {
    key: 'beforeNavigation',
    value: function beforeNavigation(e) {
      var showProgress, visibilityClassName;
      showProgress = typeof e.progressLabel === 'string' && e.progressLabel.length > 0;
      visibilityClassName = 'sgn-pp--hidden';
      if (this.els.progress != null && this.els.progressBar != null) {
        this.els.progressBar.style.width = e.progress + '%';
        if (showProgress === true) {
          this.els.progress.classList.remove(visibilityClassName);
        } else {
          this.els.progress.classList.add(visibilityClassName);
        }
      }
      if (this.els.progressLabel != null) {
        if (showProgress === true) {
          this.els.progressLabel.textContent = e.progressLabel;
          this.els.progressLabel.classList.remove(visibilityClassName);
        } else {
          this.els.progressLabel.classList.add(visibilityClassName);
        }
      }
      if (this.els.prevControl != null) {
        if (e.verso.newPosition === 0) {
          this.els.prevControl.classList.add(visibilityClassName);
        } else {
          this.els.prevControl.classList.remove(visibilityClassName);
        }
      }
      if (this.els.nextControl != null) {
        if (e.verso.newPosition === e.pageSpreadCount - 1) {
          this.els.nextControl.classList.add(visibilityClassName);
        } else {
          this.els.nextControl.classList.remove(visibilityClassName);
        }
      }
    }
  }, {
    key: 'prevClicked',
    value: function prevClicked(e) {
      e.preventDefault();
      this.trigger('prev');
    }
  }, {
    key: 'nextClicked',
    value: function nextClicked(e) {
      e.preventDefault();
      this.trigger('next');
    }
  }, {
    key: 'closeClicked',
    value: function closeClicked(e) {
      e.preventDefault();
      this.trigger('close');
    }
  }, {
    key: 'keyDown',
    value: function keyDown(e) {
      var keyCode;
      keyCode = e.keyCode;
      if (keyCodes$1.ARROW_LEFT === keyCode) {
        this.trigger('prev', {
          duration: 0
        });
      } else if (keyCodes$1.ARROW_RIGHT === keyCode || keyCodes$1.SPACE === keyCode) {
        this.trigger('next', {
          duration: 0
        });
      } else if (keyCodes$1.NUMBER_ONE === keyCode) {
        this.trigger('first', {
          duration: 0
        });
      }
    }
  }]);
  return PagedPublicationControls;
}();

MicroEvent$6.mixin(PagedPublicationControls);

var controls = PagedPublicationControls;

var MicroEvent$7, PagedPublicationEventTracking;

MicroEvent$7 = microevent;

PagedPublicationEventTracking = function () {
  function PagedPublicationEventTracking() {
    classCallCheck(this, PagedPublicationEventTracking);

    this.doubleClicked = this.doubleClicked.bind(this);
    this.hidden = true;
    this.pageSpread = null;
    this.bind('appeared', this.appeared.bind(this));
    this.bind('disappeared', this.disappeared.bind(this));
    this.bind('beforeNavigation', this.beforeNavigation.bind(this));
    this.bind('afterNavigation', this.afterNavigation.bind(this));
    this.bind('attemptedNavigation', this.attemptedNavigation.bind(this));
    this.bind('clicked', this.clicked.bind(this));
    this.bind('doubleClicked', this.doubleClicked.bind(this));
    this.bind('pressed', this.pressed.bind(this));
    this.bind('panStart', this.panStart.bind(this));
    this.bind('zoomedIn', this.zoomedIn.bind(this));
    this.bind('zoomedOut', this.zoomedOut.bind(this));
    this.bind('destroyed', this.destroy.bind(this));
    return;
  }

  createClass(PagedPublicationEventTracking, [{
    key: 'destroy',
    value: function destroy() {
      this.pageSpreadDisappeared();
    }
  }, {
    key: 'trackEvent',
    value: function trackEvent(type) {
      var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.trigger('trackEvent', {
        type: type,
        properties: properties
      });
    }
  }, {
    key: 'trackOpened',
    value: function trackOpened(properties) {
      this.trackEvent('paged-publication-opened', properties);
      return this;
    }
  }, {
    key: 'trackPageClicked',
    value: function trackPageClicked(properties) {
      this.trackEvent('paged-publication-page-clicked', properties);
      return this;
    }
  }, {
    key: 'trackPageDoubleClicked',
    value: function trackPageDoubleClicked(properties) {
      this.trackEvent('paged-publication-page-double-clicked', properties);
      return this;
    }
  }, {
    key: 'trackPageLongPressed',
    value: function trackPageLongPressed(properties) {
      this.trackEvent('paged-publication-page-long-pressed', properties);
      return this;
    }
  }, {
    key: 'trackPageHotspotsClicked',
    value: function trackPageHotspotsClicked(properties) {
      this.trackEvent('paged-publication-page-hotspots-clicked', properties);
      return this;
    }
  }, {
    key: 'trackPageSpreadAppeared',
    value: function trackPageSpreadAppeared(properties) {
      this.trackEvent('paged-publication-page-spread-appeared', properties);
      return this;
    }
  }, {
    key: 'trackPageSpreadDisappeared',
    value: function trackPageSpreadDisappeared(properties) {
      this.trackEvent('paged-publication-page-spread-disappeared', properties);
      return this;
    }
  }, {
    key: 'trackPageSpreadZoomedIn',
    value: function trackPageSpreadZoomedIn(properties) {
      this.trackEvent('paged-publication-page-spread-zoomed-in', properties);
      return this;
    }
  }, {
    key: 'trackPageSpreadZoomedOut',
    value: function trackPageSpreadZoomedOut(properties) {
      this.trackEvent('paged-publication-page-spread-zoomed-out', properties);
      return this;
    }
  }, {
    key: 'appeared',
    value: function appeared(e) {
      this.pageSpreadAppeared(e.pageSpread);
    }
  }, {
    key: 'disappeared',
    value: function disappeared() {
      this.pageSpreadDisappeared();
    }
  }, {
    key: 'beforeNavigation',
    value: function beforeNavigation() {
      this.pageSpreadDisappeared();
    }
  }, {
    key: 'afterNavigation',
    value: function afterNavigation(e) {
      this.pageSpreadAppeared(e.pageSpread);
    }
  }, {
    key: 'attemptedNavigation',
    value: function attemptedNavigation(e) {
      this.pageSpreadAppeared(e.pageSpread);
    }
  }, {
    key: 'clicked',
    value: function clicked(e) {
      var properties;
      if (e.page != null) {
        properties = {
          pageNumber: e.page.pageNumber,
          x: e.verso.pageX,
          y: e.verso.pageY
        };
        this.trackPageClicked({
          pagedPublicationPage: properties
        });
        if (e.verso.overlayEls.length > 0) {
          this.trackPageHotspotsClicked({
            pagedPublicationPage: properties
          });
        }
      }
    }
  }, {
    key: 'doubleClicked',
    value: function doubleClicked(e) {
      if (e.page != null) {
        this.trackPageDoubleClicked({
          pagedPublicationPage: {
            pageNumber: e.page.pageNumber,
            x: e.verso.pageX,
            y: e.verso.pageY
          }
        });
      }
    }
  }, {
    key: 'pressed',
    value: function pressed(e) {
      if (e.page != null) {
        this.trackPageLongPressed({
          pagedPublicationPage: {
            pageNumber: e.page.pageNumber,
            x: e.verso.pageX,
            y: e.verso.pageY
          }
        });
      }
    }
  }, {
    key: 'panStart',
    value: function panStart(e) {
      if (e.scale === 1) {
        this.pageSpreadDisappeared();
      }
    }
  }, {
    key: 'zoomedIn',
    value: function zoomedIn(e) {
      if (e.pageSpread != null) {
        this.trackPageSpreadZoomedIn({
          pagedPublicationPageSpread: {
            pageNumbers: e.pageSpread.getPages().map(function (page) {
              return page.pageNumber;
            })
          }
        });
      }
    }
  }, {
    key: 'zoomedOut',
    value: function zoomedOut(e) {
      if (e.pageSpread != null) {
        this.trackPageSpreadZoomedOut({
          pagedPublicationPageSpread: {
            pageNumbers: e.pageSpread.getPages().map(function (page) {
              return page.pageNumber;
            })
          }
        });
      }
    }
  }, {
    key: 'pageSpreadAppeared',
    value: function pageSpreadAppeared(pageSpread) {
      if (pageSpread != null && this.hidden === true) {
        this.pageSpread = pageSpread;
        this.trackPageSpreadAppeared({
          pagedPublicationPageSpread: {
            pageNumbers: pageSpread.getPages().map(function (page) {
              return page.pageNumber;
            })
          }
        });
        this.hidden = false;
      }
    }
  }, {
    key: 'pageSpreadDisappeared',
    value: function pageSpreadDisappeared() {
      if (this.pageSpread != null && this.hidden === false) {
        this.trackPageSpreadDisappeared({
          pagedPublicationPageSpread: {
            pageNumbers: this.pageSpread.getPages().map(function (page) {
              return page.pageNumber;
            })
          }
        });
        this.hidden = true;
        this.pageSpread = null;
      }
    }
  }]);
  return PagedPublicationEventTracking;
}();

MicroEvent$7.mixin(PagedPublicationEventTracking);

var eventTracking = PagedPublicationEventTracking;

var Controls, Core, EventTracking, Hotspots, MicroEvent$8, SGN$15, Viewer;

MicroEvent$8 = microevent;

SGN$15 = sgn;

Core = core$2;

Hotspots = hotspots;

Controls = controls;

EventTracking = eventTracking;

Viewer = function () {
  function Viewer(el) {
    var options1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Viewer);

    this.el = el;
    this.options = options1;
    this._core = new Core(this.el, {
      id: this.options.id,
      pages: this.options.pages,
      pageSpreadWidth: this.options.pageSpreadWidth,
      pageSpreadMaxZoomScale: this.options.pageSpreadMaxZoomScale,
      pageId: this.options.pageId,
      idleDelay: this.options.idleDelay,
      resizeDelay: this.options.resizeDelay,
      color: this.options.color
    });
    this._hotspots = new Hotspots();
    this._controls = new Controls(this.el, {
      keyboard: this.options.keyboard
    });
    this._eventTracking = new EventTracking();
    this.viewSession = SGN$15.util.uuid();
    this.hotspots = null;
    this.hotspotQueue = [];
    this.popover = null;
    this._setupEventListeners();
    return;
    return;
  }

  createClass(Viewer, [{
    key: 'start',
    value: function start() {
      this._eventTracking.trackOpened();
      this._core.trigger('started');
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._core.trigger('destroyed');
      this._hotspots.trigger('destroyed');
      this._controls.trigger('destroyed');
      this._eventTracking.trigger('destroyed');
      this.trigger('destroyed');
      return this;
    }
  }, {
    key: 'navigateTo',
    value: function navigateTo(position, options) {
      this.navigateToIndex(position, options);
      return this;
    }
  }, {
    key: 'navigateToIndex',
    value: function navigateToIndex(position, options) {
      this._core.getVerso().navigateTo(position, options);
      return this;
    }
  }, {
    key: 'navigateToPageId',
    value: function navigateToPageId(pageId, options) {
      var position;
      position = this._core.getVerso().getPageSpreadPositionFromPageId(pageId);
      return this._core.getVerso().navigateTo(position, options);
    }
  }, {
    key: 'first',
    value: function first(options) {
      this._core.getVerso().first(options);
      return this;
    }
  }, {
    key: 'prev',
    value: function prev(options) {
      this._core.getVerso().prev(options);
      return this;
    }
  }, {
    key: 'next',
    value: function next(options) {
      this._core.getVerso().next(options);
      return this;
    }
  }, {
    key: 'last',
    value: function last(options) {
      this._core.getVerso().last(options);
      return this;
    }
  }, {
    key: '_trackEvent',
    value: function _trackEvent(e) {
      var eventTracker, idType, key, properties, ref, type, value;
      type = e.type;
      idType = 'legacy';
      properties = {
        pagedPublication: {
          id: [idType, this.options.id],
          ownedBy: [idType, this.options.ownedBy]
        }
      };
      eventTracker = this.options.eventTracker;
      ref = e.properties;
      for (key in ref) {
        value = ref[key];
        properties[key] = value;
      }
      if (eventTracker != null) {
        eventTracker.trackEvent(type, properties);
      }
    }
  }, {
    key: '_setupEventListeners',
    value: function _setupEventListeners() {
      var _this = this;

      this._eventTracking.bind('trackEvent', function (e) {
        _this._trackEvent(e);
      });
      this._controls.bind('prev', function (e) {
        _this.prev(e);
      });
      this._controls.bind('next', function (e) {
        _this.next(e);
      });
      this._controls.bind('first', function (e) {
        _this.first(e);
      });
      this._controls.bind('last', function (e) {
        _this.last(e);
      });
      this._controls.bind('close', function (e) {
        _this.destroy(e);
      });
      this._hotspots.bind('hotspotsRequested', function (e) {
        _this.trigger('hotspotsRequested', e);
      });
      this._core.bind('appeared', function (e) {
        _this._eventTracking.trigger('appeared', e);
        _this.trigger('appeared', e);
      });
      this._core.bind('disappeared', function (e) {
        _this._eventTracking.trigger('disappeared', e);
        _this.trigger('disappeared', e);
      });
      this._core.bind('beforeNavigation', function (e) {
        _this._eventTracking.trigger('beforeNavigation', e);
        _this._controls.trigger('beforeNavigation', e);
        _this.trigger('beforeNavigation', e);
      });
      this._core.bind('afterNavigation', function (e) {
        _this._eventTracking.trigger('afterNavigation', e);
        _this._hotspots.trigger('afterNavigation', e);
        _this.trigger('afterNavigation', e);
      });
      this._core.bind('attemptedNavigation', function (e) {
        _this._eventTracking.trigger('attemptedNavigation', e);
        _this.trigger('attemptedNavigation', e);
      });
      this._core.bind('clicked', function (e) {
        _this._eventTracking.trigger('clicked', e);
        _this.trigger('clicked', e);
      });
      this._core.bind('doubleClicked', function (e) {
        _this._eventTracking.trigger('doubleClicked', e);
        _this.trigger('doubleClicked', e);
      });
      this._core.bind('contextmenu', function (e) {
        _this.trigger('contextmenu', e);
      });
      this._core.bind('pressed', function (e) {
        _this._eventTracking.trigger('pressed', e);
        _this.trigger('pressed', e);
      });
      this._core.bind('panStart', function (e) {
        _this._eventTracking.trigger('panStart', e);
        _this.trigger('panStart', e);
      });
      this._core.bind('zoomedIn', function (e) {
        _this._eventTracking.trigger('zoomedIn', e);
        _this.trigger('zoomedIn', e);
      });
      this._core.bind('zoomedOut', function (e) {
        _this._eventTracking.trigger('zoomedOut', e);
        _this.trigger('zoomedOut', e);
      });
      this._core.bind('pageLoaded', function (e) {
        _this._eventTracking.trigger('pageLoaded', e);
        _this.trigger('pageLoaded', e);
      });
      this._core.bind('pagesLoaded', function (e) {
        _this._hotspots.trigger('pagesLoaded', e);
        _this.trigger('pagesLoaded', e);
      });
      this._core.bind('resized', function (e) {
        _this._hotspots.trigger('resized');
        _this.trigger('resized', e);
      });
      this.bind('hotspotsRequested', this.hotspotsRequested.bind(this));
      this.bind('beforeNavigation', this.beforeNavigation.bind(this));
      this.bind('clicked', this.clicked.bind(this));
      this.bind('contextmenu', this.contextmenu.bind(this));
      this.bind('pressed', this.pressed.bind(this));
    }
  }, {
    key: 'pickHotspot',
    value: function pickHotspot(e, callback) {
      var _this2 = this;

      var hotspots$$1;
      if (this.hotspots == null) {
        return;
      }
      if (this.popover != null) {
        this.popover.destroy();
        this.popover = null;
      }
      hotspots$$1 = e.verso.overlayEls.map(function (overlayEl) {
        return _this2.hotspots[overlayEl.getAttribute('data-id')];
      });
      if (hotspots$$1.length === 1) {
        callback(hotspots$$1[0]);
      } else if (hotspots$$1.length > 1) {
        this.popover = SGN$15.CoreUIKit.singleChoicePopover({
          el: this.el,
          header: SGN$15.translations.t('paged_publication.hotspot_picker.header'),
          x: e.verso.x,
          y: e.verso.y,
          items: hotspots$$1.filter(function (hotspot) {
            return hotspot.type === 'offer';
          }).map(function (hotspot) {
            return {
              id: hotspot.id,
              title: hotspot.offer.heading,
              subtitle: hotspot.offer.pricing.currency + '' + hotspot.offer.pricing.price
            };
          })
        }, callback);
      }
    }
  }, {
    key: 'processHotspotQueue',
    value: function processHotspotQueue() {
      var _this3 = this;

      if (this.hotspots == null) {
        return;
      }
      this.hotspotQueue = this.hotspotQueue.filter(function (hotspotRequest) {
        var hotspot, hotspots$$1, i, id, len, page, ref, ref1, versoPageSpread;
        hotspots$$1 = {};
        versoPageSpread = SGN$15.util.find(_this3._core.getVerso().pageSpreads, function (pageSpread) {
          return pageSpread.getId() === hotspotRequest.id;
        });
        ref = _this3.hotspots;
        for (id in ref) {
          hotspot = ref[id];
          if (hotspots$$1[id] != null) {
            continue;
          }
          ref1 = hotspotRequest.pages;
          for (i = 0, len = ref1.length; i < len; i++) {
            page = ref1[i];
            if (hotspot.locations[page.pageNumber] != null) {
              hotspots$$1[id] = {
                type: hotspot.type,
                id: hotspot.id,
                locations: hotspot.locations
              };
              break;
            }
          }
        }
        _this3._hotspots.trigger('hotspotsReceived', {
          pageSpread: _this3._core.pageSpreads.get(hotspotRequest.id),
          versoPageSpread: versoPageSpread,
          ratio: _this3.options.hotspotRatio,
          pages: hotspotRequest.pages,
          hotspots: hotspots$$1
        });
        return false;
      });
    }
  }, {
    key: 'hotspotsRequested',
    value: function hotspotsRequested(e) {
      this.hotspotQueue.push(e);
      this.processHotspotQueue();
    }
  }, {
    key: 'applyHotspots',
    value: function applyHotspots() {
      var hotspots$$1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.hotspots = hotspots$$1;
      this.processHotspotQueue();
    }
  }, {
    key: 'beforeNavigation',
    value: function beforeNavigation() {
      if (this.popover != null) {
        this.popover.destroy();
      }
    }
  }, {
    key: 'clicked',
    value: function clicked(e) {
      var _this4 = this;

      this.pickHotspot(e, function (hotspot) {
        _this4.trigger('hotspotClicked', hotspot);
      });
    }
  }, {
    key: 'contextmenu',
    value: function contextmenu(e) {
      var _this5 = this;

      this.pickHotspot(e, function (hotspot) {
        _this5.trigger('hotspotContextmenu', hotspot);
      });
    }
  }, {
    key: 'pressed',
    value: function pressed(e) {
      var _this6 = this;

      this.pickHotspot(e, function (hotspot) {
        _this6.trigger('hotspotPressed', hotspot);
      });
    }
  }]);
  return Viewer;
}();

MicroEvent$8.mixin(Viewer);

var viewer = Viewer;

var Bootstrapper, SGN$16;

SGN$16 = core;

var bootstrapper = Bootstrapper = function () {
  function Bootstrapper() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Bootstrapper);

    this.options = options;
    return;
  }

  createClass(Bootstrapper, [{
    key: 'createViewer',
    value: function createViewer(data) {
      return new SGN$16.PagedPublicationKit.Viewer(this.options.el, {
        id: this.options.id,
        ownedBy: data.details.dealer_id,
        color: '#' + data.details.branding.pageflip.color,
        hotspotRatio: data.details.dimensions.height,
        keyboard: true,
        pageId: this.options.pageId,
        eventTracker: this.options.eventTracker,
        pages: this.transformPages(data.pages)
      });
    }
  }, {
    key: 'transformPages',
    value: function transformPages(pages) {
      return pages.map(function (page, i) {
        var pageNumber;
        pageNumber = i + 1;
        return {
          id: 'page' + pageNumber,
          label: pageNumber + '',
          pageNumber: pageNumber,
          images: {
            medium: page.view,
            large: page.zoom
          }
        };
      });
    }
  }, {
    key: 'applyHotspots',
    value: function applyHotspots(viewer, hotspots) {
      var obj;
      obj = {};
      hotspots.forEach(function (hotspot) {
        return obj[hotspot.id] = hotspot;
      });
      viewer.applyHotspots(obj);
    }
  }, {
    key: 'fetch',
    value: function fetch(callback) {
      SGN$16.util.async.parallel([this.fetchDetails.bind(this), this.fetchPages.bind(this)], function (result) {
        var data;
        data = {
          details: result[0][1],
          pages: result[1][1]
        };
        if (data.details != null && data.pages != null) {
          callback(null, data);
        } else {
          callback(new Error());
        }
      });
    }
  }, {
    key: 'fetchDetails',
    value: function fetchDetails(callback) {
      SGN$16.CoreKit.request({
        url: '/v2/catalogs/' + this.options.id
      }, callback);
    }
  }, {
    key: 'fetchPages',
    value: function fetchPages(callback) {
      SGN$16.CoreKit.request({
        url: '/v2/catalogs/' + this.options.id + '/pages'
      }, callback);
    }
  }, {
    key: 'fetchHotspots',
    value: function fetchHotspots(callback) {
      SGN$16.CoreKit.request({
        url: '/v2/catalogs/' + this.options.id + '/hotspots'
      }, callback);
    }
  }]);
  return Bootstrapper;
}();

var pagedPublication = {
  Viewer: viewer,
  Bootstrapper: bootstrapper
};

var incito = createCommonjsModule(function (module, exports) {
(function(f){{module.exports=f();}})(function(){var define;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND", f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbsoluteLayout, FlexLayout, FragView, ImageView, Incito, LazyLoad, LinearLayout, MicroEvent, TextView, VideoEmbedView, VideoView, View, utils;

LazyLoad = _dereq_('vanilla-lazyload');

MicroEvent = _dereq_('microevent');

utils = _dereq_('./utils');

View = _dereq_('./views/view');

FragView = _dereq_('./views/frag');

ImageView = _dereq_('./views/image');

TextView = _dereq_('./views/text');

VideoEmbedView = _dereq_('./views/video-embed');

VideoView = _dereq_('./views/video');

LinearLayout = _dereq_('./views/linear-layout');

AbsoluteLayout = _dereq_('./views/absolute-layout');

FlexLayout = _dereq_('./views/flex-layout');

Incito = function () {
  function Incito(containerEl) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Incito);

    this.containerEl = containerEl;
    this.options = options;
    this.el = document.createElement('div');
    return;
  }

  _createClass(Incito, [{
    key: 'start',
    value: function start() {
      var frag, incito;
      incito = this.options.incito || {};
      frag = document.createDocumentFragment();
      this.loadFonts(incito.font_assets);
      this.applyTheme(incito.theme);
      this.render(frag, incito.root_view);
      this.el.className = 'incito';
      if (incito.locale != null) {
        this.el.setAttribute('lang', incito.locale);
      }
      if (incito.debug === true) {
        this.el.setAttribute('data-debug', true);
      }
      this.el.appendChild(frag);
      this.containerEl.appendChild(this.el);
      this.lazyload = new LazyLoad({
        elements_selector: '.incito--lazyload',
        threshold: 800,
        callback_enter: function callback_enter(el) {
          if (el.nodeName.toLowerCase() === 'video' && el.getAttribute('data-autoplay')) {
            el.play();
          }
        }
      });
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.containerEl.removeChild(this.el);
      if (this.lazyload != null) {
        this.lazyload.destroy();
      }
      this.trigger('destroyed');
    }
  }, {
    key: 'render',
    value: function render(el) {
      var _this = this;

      var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var match, ref, trigger, view, viewName, views;
      match = null;
      viewName = attrs.view_name;
      views = {
        View: View,
        FragView: FragView,
        ImageView: ImageView,
        TextView: TextView,
        VideoEmbedView: VideoEmbedView,
        VideoView: VideoView,
        LinearLayout: LinearLayout,
        AbsoluteLayout: AbsoluteLayout,
        FlexLayout: FlexLayout
      };
      match = (ref = views[viewName]) != null ? ref : View;
      view = new match(attrs);
      trigger = view.trigger;
      view.trigger = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        trigger.apply(view, args);
        _this.trigger.apply(_this, args);
      };
      view.render();
      if (Array.isArray(attrs.child_views)) {
        attrs.child_views.forEach(function (childView) {
          var childEl;
          childEl = _this.render(view.el, childView);
          if (childEl != null) {
            view.el.appendChild(childEl);
          }
        });
      }
      el.appendChild(view.el);
      return view.el;
    }
  }, {
    key: 'applyTheme',
    value: function applyTheme() {
      var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (theme.font_family != null) {
        this.el.style.fontFamily = theme.font_family.join(', ');
      }
      if (theme.background_color != null) {
        this.el.style.backgroundColor = theme.background_color;
      }
      if (theme.line_spacing_multiplier != null) {
        this.el.style.lineHeight = theme.line_spacing_multiplier;
      }
    }
  }, {
    key: 'loadFonts',
    value: function loadFonts() {
      var fontAssets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var font, key, ref, ref1, styleEl, text, urls, value;
      if ('FontFace' in window) {
        for (key in fontAssets) {
          value = fontAssets[key];
          urls = value.src.map(function (src) {
            return 'url(' + src[1] + ')';
          }).join(', ');
          font = new FontFace(key, urls, {
            style: (ref = value.style) != null ? ref : 'normal',
            weight: (ref1 = value.weight) != null ? ref1 : 'normal'
          });
          document.fonts.add(font);
          font.load();
        }
      } else {
        styleEl = document.createElement('style');
        for (key in fontAssets) {
          value = fontAssets[key];
          urls = value.src.map(function (src) {
            return 'url(\'' + src[1] + '\') format(\'' + src[0] + '\')';
          }).join(', ');
          text = '@font-face {\n    font-family: \'' + key + '\';\n    src: ' + urls + ';\n}';
          styleEl.appendChild(document.createTextNode(text));
        }
        document.head.appendChild(styleEl);
      }
    }
  }]);

  return Incito;
}();

MicroEvent.mixin(Incito);

module.exports = Incito;

},{"./utils":2,"./views/absolute-layout":3,"./views/flex-layout":4,"./views/frag":5,"./views/image":6,"./views/linear-layout":7,"./views/text":8,"./views/video":10,"./views/video-embed":9,"./views/view":11,"microevent":12,"vanilla-lazyload":13}],2:[function(_dereq_,module,exports){

var utils;

utils = {
  formatUnit: function formatUnit(unit) {
    if (typeof unit === 'number') {
      return unit + 'px';
    } else if (typeof unit === 'string') {
      return unit.replace('dp', 'px');
    } else {
      return 0;
    }
  },
  isDefinedStr: function isDefinedStr(value) {
    return typeof value === 'string' && value.length > 0;
  },
  escapeHTML: function escapeHTML() {
    var unsafe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
};

module.exports = utils;

},{}],3:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbsoluteLayout, View;

View = _dereq_('./view');

module.exports = AbsoluteLayout = function () {
  var AbsoluteLayout = function (_View) {
    _inherits(AbsoluteLayout, _View);

    function AbsoluteLayout() {
      _classCallCheck(this, AbsoluteLayout);

      return _possibleConstructorReturn(this, (AbsoluteLayout.__proto__ || Object.getPrototypeOf(AbsoluteLayout)).apply(this, arguments));
    }

    _createClass(AbsoluteLayout, [{
      key: 'render',
      value: function render() {
        return this;
      }
    }]);

    return AbsoluteLayout;
  }(View);

  AbsoluteLayout.prototype.className = 'incito__absolute-layout-view';

  return AbsoluteLayout;
}.call(undefined);

},{"./view":11}],4:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlexLayout,
    View,
    alignContentModes,
    alignItemModes,
    flexDirectionModes,
    flexJustifyModes,
    utils,
    indexOf = [].indexOf;

View = _dereq_('./view');

utils = _dereq_('../utils');

alignItemModes = ['stretch', 'center', 'flex-start', 'flex-end', 'baseline'];

alignContentModes = ['stretch', 'center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'initial', 'inherit'];

flexJustifyModes = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'];

flexDirectionModes = ['row', 'column'];

module.exports = FlexLayout = function () {
  var FlexLayout = function (_View) {
    _inherits(FlexLayout, _View);

    function FlexLayout() {
      _classCallCheck(this, FlexLayout);

      return _possibleConstructorReturn(this, (FlexLayout.__proto__ || Object.getPrototypeOf(FlexLayout)).apply(this, arguments));
    }

    _createClass(FlexLayout, [{
      key: 'render',
      value: function render() {
        var ref, ref1, ref2, ref3;
        if (ref = this.attrs.layout_flex_align_items, indexOf.call(alignItemModes, ref) >= 0) {
          this.el.style.alignItems = this.attrs.layout_flex_align_items;
          this.el.style.msAlignItems = this.attrs.layout_flex_align_items;
        }
        if (ref1 = this.attrs.layout_flex_align_content, indexOf.call(alignContentModes, ref1) >= 0) {
          this.el.style.alignContent = this.attrs.layout_flex_align_content;
          this.el.style.msAlignContent = this.attrs.layout_flex_align_content;
        }
        if (ref2 = this.attrs.layout_flex_justify_content, indexOf.call(flexJustifyModes, ref2) >= 0) {
          this.el.style.justifyContent = this.attrs.layout_flex_justify_content;
          this.el.style.msFlexPack = this.attrs.layout_flex_justify_content;
        }
        if (ref3 = this.attrs.layout_flex_direction, indexOf.call(flexDirectionModes, ref3) >= 0) {
          this.el.style.flexDirection = this.attrs.layout_flex_direction;
          this.el.style.msFlexDirection = this.attrs.layout_flex_direction;
        }
        if (typeof this.attrs.layout_flex_shrink === 'number') {
          this.el.style.flexShrink = this.attrs.layout_flex_shrink;
          this.el.style.msFlexShrink = this.attrs.layout_flex_shrink;
        }
        if (typeof this.attrs.layout_flex_grow === 'number') {
          this.el.style.flexGrow = this.attrs.layout_flex_grow;
          this.el.style.msFlexGrow = this.attrs.layout_flex_grow;
        }
        if (this.attrs.layout_flex_basis != null) {
          this.el.style.flexBasis = utils.parseUnit(this.attrs.layout_flex_basis);
          this.el.style.msFlexBasis = utils.parseUnit(this.attrs.layout_flex_basis);
        }
        return this;
      }
    }]);

    return FlexLayout;
  }(View);

  FlexLayout.prototype.className = 'incito__flex-layout-view';

  return FlexLayout;
}.call(undefined);

},{"../utils":2,"./view":11}],5:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FragView;

module.exports = FragView = function () {
  function FragView() {
    _classCallCheck(this, FragView);
  }

  _createClass(FragView, [{
    key: "render",
    value: function render() {
      this.el = document.createDocumentFragment();
      return this;
    }
  }]);

  return FragView;
}();

},{}],6:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Image, View, utils;

View = _dereq_('./view');

utils = _dereq_('../utils');

module.exports = Image = function () {
  var Image = function (_View) {
    _inherits(Image, _View);

    function Image() {
      _classCallCheck(this, Image);

      return _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).apply(this, arguments));
    }

    _createClass(Image, [{
      key: 'render',
      value: function render() {
        if (utils.isDefinedStr(this.attrs.src)) {
          this.el.setAttribute('data-src', this.attrs.src);
        }
        if (utils.isDefinedStr(this.attrs.label)) {
          this.el.setAttribute('alt', this.attrs.label);
        }
        return this;
      }
    }]);

    return Image;
  }(View);

  Image.prototype.tagName = 'img';

  Image.prototype.className = 'incito__image-view incito--lazyload';

  return Image;
}.call(undefined);

},{"../utils":2,"./view":11}],7:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LinearLayout, View;

View = _dereq_('./view');

module.exports = LinearLayout = function () {
  var LinearLayout = function (_View) {
    _inherits(LinearLayout, _View);

    function LinearLayout() {
      _classCallCheck(this, LinearLayout);

      return _possibleConstructorReturn(this, (LinearLayout.__proto__ || Object.getPrototypeOf(LinearLayout)).apply(this, arguments));
    }

    _createClass(LinearLayout, [{
      key: 'render',
      value: function render() {
        return this;
      }
    }]);

    return LinearLayout;
  }(View);

  LinearLayout.prototype.className = 'incito__linear-layout-view';

  return LinearLayout;
}.call(undefined);

},{"./view":11}],8:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextView,
    View,
    utils,
    indexOf = [].indexOf;

View = _dereq_('./view');

utils = _dereq_('../utils');

module.exports = TextView = function () {
  var TextView = function (_View) {
    _inherits(TextView, _View);

    function TextView() {
      _classCallCheck(this, TextView);

      return _possibleConstructorReturn(this, (TextView.__proto__ || Object.getPrototypeOf(TextView)).apply(this, arguments));
    }

    _createClass(TextView, [{
      key: 'render',
      value: function render() {
        var parsedText, ref, text, textShadow, textStyles;
        textStyles = (this.attrs.text_style || '').split('|');
        text = this.attrs.text;
        if (Array.isArray(this.attrs.spans) && this.attrs.spans.length > 0) {
          parsedText = this.parseSpans(text, this.attrs.spans);
          text = parsedText.map(function (item) {
            var escapedText, spanName;
            escapedText = utils.escapeHTML(item.text || '');
            if (item.span != null && item.span.name === 'link' && item.span.url != null) {
              return '<a href="' + encodeURI(item.span.url) + '" rel="external" target="_blank">' + escapedText + '</a>';
            } else if (item.span != null && item.span.name != null) {
              spanName = item.span.name;
              return '<span data-name="' + spanName + '">' + escapedText + '</span>';
            } else {
              return escapedText;
            }
          });
          text = text.join('');
        } else {
          text = utils.escapeHTML(text);
        }
        if (this.attrs.text_prevent_widow) {
          this.el.innerHTML = text.replace(/\&nbsp;([^\s]+)$/, ' $1').replace(/\s([^\s]+)\s*$/, '&nbsp;$1');
        } else {
          this.el.innerHTML = text;
        }
        // Font family.
        if (Array.isArray(this.attrs.font_family) && this.attrs.font_family.length > 0) {
          this.el.style.fontFamily = this.attrs.font_family.join(', ');
        }
        // Text size.
        if (this.attrs.text_size != null) {
          this.el.style.fontSize = this.attrs.text_size + 'px';
        }

        // Line height.
        if (this.attrs.line_spacing_multiplier != null) {
          this.el.style.lineHeight = this.attrs.line_spacing_multiplier;
        }

        // Text color.
        if (this.attrs.text_color != null) {
          this.el.style.color = this.attrs.text_color;
        }

        // Text styles.
        if (indexOf.call(textStyles, 'bold') >= 0) {
          this.el.style.fontWeight = 'bold';
        }
        if (indexOf.call(textStyles, 'italic') >= 0) {
          this.el.style.fontStyle = 'italic';
        }

        // Text shadow.
        textShadow = this.getTextShadow();
        if (textShadow != null) {
          this.el.style.textShadow = textShadow.dx + 'px ' + textShadow.dy + 'px ' + textShadow.radius + 'px ' + textShadow.color;
        }

        // Text alignment.
        if (this.attrs.text_alignment === 'left') {
          this.el.style.textAlign = 'left';
        } else if (this.attrs.text_alignment === 'center') {
          this.el.style.textAlign = 'center';
        } else if (this.attrs.text_alignment === 'right') {
          this.el.style.textAlign = 'right';
        }

        // Font stretch.
        if ((ref = this.attrs.font_stretch) === 'condensed' || ref === 'normal' || ref === 'expanded') {
          this.el.style.fontStretch = this.attrs.font_stretch;
        }

        // Single line.
        if (this.attrs.single_line === true) {
          this.el.setAttribute('data-single-line', true);
        }

        // All caps.
        if (this.attrs.text_all_caps === true) {
          this.el.style.textTransform = 'uppercase';
        }
        return this;
      }
    }, {
      key: 'parseSpans',
      value: function parseSpans(text) {
        var spans = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var result;
        result = [];
        if (spans.length === 0) {
          result.push({
            text: text
          });
        } else if (spans[0].start > 0) {
          result.push({
            text: text.slice(0, spans[0].start)
          });
        }
        spans.forEach(function (span, i) {
          var endIndex, startIndex;
          startIndex = span.start;
          endIndex = span.end;
          result.push({
            text: text.slice(startIndex, endIndex),
            span: span
          });
          if (i === spans.length - 1) {
            if (endIndex < text.length) {
              result.push({
                text: text.slice(endIndex, text.length)
              });
            }
          } else if (endIndex < spans[i + 1].start) {
            result.push({
              text: text.slice(endIndex, spans[i + 1].start)
            });
          }
        });
        return result;
      }
    }, {
      key: 'getTextShadow',
      value: function getTextShadow() {
        var color, dx, dy, radius;
        if (utils.isDefinedStr(this.attrs.text_shadow_color)) {
          dx = typeof this.attrs.text_shadow_dx === 'number' ? this.attrs.text_shadow_dx : 0;
          dy = typeof this.attrs.text_shadow_dy === 'number' ? this.attrs.text_shadow_dy : 0;
          radius = typeof this.attrs.text_shadow_radius === 'number' ? this.attrs.text_shadow_radius : 0;
          color = this.attrs.text_shadow_color;
          return {
            dx: dx,
            dy: dy,
            radius: radius,
            color: color
          };
        }
      }
    }]);

    return TextView;
  }(View);

  TextView.prototype.tagName = 'p';

  TextView.prototype.className = 'incito__text-view';

  return TextView;
}.call(undefined);

},{"../utils":2,"./view":11}],9:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlexLayout,
    View,
    allowedHostnames,
    utils,
    indexOf = [].indexOf;

View = _dereq_('./view');

utils = _dereq_('../utils');

allowedHostnames = ['www.youtube.com', 'www.vimeo.com', 'video.twentythree.net'];

module.exports = FlexLayout = function () {
  var FlexLayout = function (_View) {
    _inherits(FlexLayout, _View);

    function FlexLayout() {
      _classCallCheck(this, FlexLayout);

      return _possibleConstructorReturn(this, (FlexLayout.__proto__ || Object.getPrototypeOf(FlexLayout)).apply(this, arguments));
    }

    _createClass(FlexLayout, [{
      key: 'render',
      value: function render() {
        var linkEl, ref;
        linkEl = document.createElement('a');
        if (utils.isDefinedStr(this.attrs.src)) {
          linkEl.setAttribute('href', this.attrs.src);
          if (ref = linkEl.hostname, indexOf.call(allowedHostnames, ref) >= 0) {
            this.el.setAttribute('data-src', this.attrs.src);
          }
        }
        return this;
      }
    }]);

    return FlexLayout;
  }(View);

  FlexLayout.prototype.className = 'incito__video-embed-view incito--lazyload';

  FlexLayout.prototype.tagName = 'iframe';

  return FlexLayout;
}.call(undefined);

},{"../utils":2,"./view":11}],10:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Video, View, utils;

View = _dereq_('./view');

utils = _dereq_('../utils');

module.exports = Video = function () {
  var Video = function (_View) {
    _inherits(Video, _View);

    function Video() {
      _classCallCheck(this, Video);

      return _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).apply(this, arguments));
    }

    _createClass(Video, [{
      key: 'render',
      value: function render() {
        var sourceEl;
        if (this.attrs.autoplay === true) {
          this.el.setAttribute('data-autoplay', 'true');
        }
        if (this.attrs.loop === true) {
          this.el.setAttribute('loop', '');
        }
        if (this.attrs.controls === true) {
          this.el.setAttribute('controls', '');
        }
        this.el.setAttribute('muted', 'true');
        this.el.setAttribute('preload', 'metadata');
        this.el.setAttribute('playsinline', '');
        if (utils.isDefinedStr(this.attrs.src)) {
          sourceEl = document.createElement('source');
          sourceEl.setAttribute('src', this.attrs.src);
          sourceEl.setAttribute('type', this.attrs.mime);
          this.el.appendChild(sourceEl);
        }
        return this;
      }
    }]);

    return Video;
  }(View);

  Video.prototype.className = 'incito__video-view incito--lazyload';

  Video.prototype.tagName = 'video';

  return Video;
}.call(undefined);

},{"../utils":2,"./view":11}],11:[function(_dereq_,module,exports){

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MicroEvent,
    View,
    utils,
    indexOf = [].indexOf;

MicroEvent = _dereq_('microevent');

utils = _dereq_('../utils');

module.exports = View = function () {
  var View = function () {
    function View() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, View);

      this.attrs = attrs;
      this.el = this.createElement();
      this.setAttributes();
      this.initialize();
    }

    _createClass(View, [{
      key: 'initialize',
      value: function initialize() {}
    }, {
      key: 'render',
      value: function render() {
        return this;
      }
    }, {
      key: 'createElement',
      value: function createElement() {
        var el;
        el = document.createElement(this.tagName);
        el.className = 'incito__view';
        if (this.className != null) {
          el.className += ' ' + this.className;
        }
        return el;
      }
    }, {
      key: 'setAttributes',
      value: function setAttributes() {
        var ref, ref1, ref2, ref3, ref4, ref5, shadow, strokeStyles, transforms;
        // Identifier.
        if (utils.isDefinedStr(this.attrs.id)) {
          this.el.setAttribute('data-id', this.attrs.id);
        }

        // Role.
        if (utils.isDefinedStr(this.attrs.role)) {
          this.el.setAttribute('role', this.attrs.role);
        }

        // Accessibility label.
        if (utils.isDefinedStr(this.attrs.accessibility_label)) {
          this.el.setAttribute('aria-label', this.attrs.accessibility_label);
        }
        // Title.
        if (utils.isDefinedStr(this.attrs.title)) {
          this.el.setAttribute('title', this.attrs.title);
        }
        // Gravity.
        if (utils.isDefinedStr(this.attrs.gravity)) {
          this.el.setAttribute('data-gravity', this.attrs.gravity);
        }

        // Link or callbacks.
        if (utils.isDefinedStr(this.attrs.link)) {
          this.el.setAttribute('data-link', '');
          this.setupCallbacks();
        } else if (this.hasCallback()) {
          this.el.setAttribute('data-callback', '');
          this.setupCallbacks();
        }
        // Width.
        if (this.attrs.layout_width === 'match_parent') {
          this.el.style.width = '100%';
        } else if (this.attrs.layout_width === 'wrap_content') {
          this.el.style.display = 'inline-block';
        } else if (this.attrs.layout_width != null) {
          this.el.style.width = utils.formatUnit(this.attrs.layout_width);
        }
        // Height.
        if (this.attrs.layout_height === 'match_parent') {
          this.el.style.height = '100%';
        } else if (this.attrs.layout_height === 'wrap_content') {
          this.el.style.height = 'auto';
        } else if (this.attrs.layout_height != null) {
          this.el.style.height = utils.formatUnit(this.attrs.layout_height);
        }
        // Min width.
        if (this.attrs.min_width != null) {
          this.el.style.minWidth = utils.formatUnit(this.attrs.min_width);
        }

        // Max width.
        if (this.attrs.max_width != null) {
          this.el.style.maxWidth = utils.formatUnit(this.attrs.max_width);
        }
        // Min height.
        if (this.attrs.min_height != null) {
          this.el.style.minHeight = utils.formatUnit(this.attrs.min_height);
        }
        // Max height.
        if (this.attrs.max_height != null) {
          this.el.style.maxHeight = utils.formatUnit(this.attrs.max_height);
        }

        // Position in relation to parent.
        if (this.attrs.layout_top != null) {
          this.el.style.top = utils.formatUnit(this.attrs.layout_top);
        }
        if (this.attrs.layout_left != null) {
          this.el.style.left = utils.formatUnit(this.attrs.layout_left);
        }
        if (this.attrs.layout_right != null) {
          this.el.style.right = utils.formatUnit(this.attrs.layout_right);
        }
        if (this.attrs.layout_bottom != null) {
          this.el.style.bottom = utils.formatUnit(this.attrs.layout_bottom);
        }

        // Background.
        if (utils.isDefinedStr(this.attrs.background_color)) {
          this.el.style.backgroundColor = this.attrs.background_color;
        }
        if (utils.isDefinedStr(this.attrs.background_image)) {
          this.el.setAttribute('data-src', this.attrs.background_image);
          this.el.className += ' incito--lazyload';
        }
        if ((ref = this.attrs.background_tile_mode) === 'repeat_x' || ref === 'repeat_y' || ref === 'repeat') {
          this.el.style.backgroundRepeat = this.attrs.background_tile_mode.replace('_', '-');
        }
        if (utils.isDefinedStr(this.attrs.background_image_position)) {
          this.el.style.backgroundPosition = this.attrs.background_image_position.replace('_', ' ');
        }
        if (this.attrs.background_image_scale_type === 'center_crop') {
          this.el.style.backgroundSize = 'cover';
        } else if (this.attrs.background_image_scale_type === 'center_inside') {
          this.el.style.backgroundSize = 'contain';
        }
        // Margin.
        if (this.attrs.layout_margin != null) {
          this.el.style.margin = utils.formatUnit(this.attrs.layout_margin);
        } else {
          if (this.attrs.layout_margin_top != null) {
            this.el.style.marginTop = utils.formatUnit(this.attrs.layout_margin_top);
          }
          if (this.attrs.layout_margin_left != null) {
            this.el.style.marginLeft = utils.formatUnit(this.attrs.layout_margin_left);
          }
          if (this.attrs.layout_margin_right != null) {
            this.el.style.marginRight = utils.formatUnit(this.attrs.layout_margin_right);
          }
          if (this.attrs.layout_margin_bottom != null) {
            this.el.style.marginBottom = utils.formatUnit(this.attrs.layout_margin_bottom);
          }
        }
        // Padding.
        if (this.attrs.padding != null) {
          this.el.style.padding = utils.formatUnit(this.attrs.padding);
        } else {
          if (this.attrs.padding_top != null) {
            this.el.style.paddingTop = utils.formatUnit(this.attrs.padding_top);
          }
          if (this.attrs.padding_left != null) {
            this.el.style.paddingLeft = utils.formatUnit(this.attrs.padding_left);
          }
          if (this.attrs.padding_right != null) {
            this.el.style.paddingRight = utils.formatUnit(this.attrs.padding_right);
          }
          if (this.attrs.padding_bottom != null) {
            this.el.style.paddingBottom = utils.formatUnit(this.attrs.padding_bottom);
          }
        }

        // Corner radius.
        if (this.attrs.corner_radius != null) {
          this.el.style.borderRadius = utils.formatUnit(this.attrs.corner_radius);
        } else {
          if (this.attrs.corner_top_left_radius != null) {
            this.el.style.borderTopLeftRadius = utils.formatUnit(this.attrs.corner_top_left_radius);
          }
          if (this.attrs.corner_top_right_radius != null) {
            this.el.style.borderTopRightRadius = utils.formatUnit(this.attrs.corner_top_right_radius);
          }
          if (this.attrs.corner_bottom_left_radius != null) {
            this.el.style.borderBottomLeftRadius = utils.formatUnit(this.attrs.corner_bottom_left_radius);
          }
          if (this.attrs.corner_bottom_right_radius != null) {
            this.el.style.borderBottomRightRadius = utils.formatUnit(this.attrs.corner_bottom_right_radius);
          }
        }

        // Clip children.
        if (this.attrs.clip_children === false) {
          this.el.style.overflow = 'visible';
        }
        // Shadow.
        shadow = this.getShadow();
        if (shadow != null) {
          this.el.style.boxShadow = shadow.dx + 'px ' + shadow.dy + 'px ' + shadow.radius + 'px ' + shadow.color;
        }

        // Stroke.
        strokeStyles = ['solid', 'dotted', 'dashed'];
        if (this.attrs.stroke_width != null) {
          this.el.style.borderWidth = utils.formatUnit(this.attrs.stroke_width);
        }
        if (this.attrs.stroke_color != null) {
          this.el.style.borderColor = this.attrs.stroke_color;
        }
        if (ref1 = this.attrs.stroke_style, indexOf.call(strokeStyles, ref1) >= 0) {
          this.el.style.borderStyle = this.attrs.stroke_style;
        }
        if (this.attrs.stroke_top_width != null) {
          this.el.style.borderTopWidth = utils.formatUnit(this.attrs.stroke_top_width);
        }
        if (this.attrs.stroke_top_color != null) {
          this.el.style.borderTopColor = this.attrs.stroke_top_color;
        }
        if (ref2 = this.attrs.stroke_top_style, indexOf.call(strokeStyles, ref2) >= 0) {
          this.el.style.borderTopStyle = this.attrs.stroke_top_style;
        }
        if (this.attrs.stroke_left_width != null) {
          this.el.style.borderLeftWidth = utils.formatUnit(this.attrs.stroke_left_width);
        }
        if (this.attrs.stroke_left_color != null) {
          this.el.style.borderLeftColor = this.attrs.stroke_left_color;
        }
        if (ref3 = this.attrs.stroke_left_style, indexOf.call(strokeStyles, ref3) >= 0) {
          this.el.style.borderLeftStyle = this.attrs.stroke_left_style;
        }
        if (this.attrs.stroke_right_width != null) {
          this.el.style.borderRightWidth = utils.formatUnit(this.attrs.stroke_right_width);
        }
        if (this.attrs.stroke_right_color != null) {
          this.el.style.borderRightColor = this.attrs.stroke_right_color;
        }
        if (ref4 = this.attrs.stroke_right_style, indexOf.call(strokeStyles, ref4) >= 0) {
          this.el.style.borderRightStyle = this.attrs.stroke_right_style;
        }
        if (this.attrs.stroke_bottom_width != null) {
          this.el.style.borderBottomWidth = utils.formatUnit(this.attrs.stroke_bottom_width);
        }
        if (this.attrs.stroke_bottom_color != null) {
          this.el.style.borderBottomColor = this.attrs.stroke_bottom_color;
        }
        if (ref5 = this.attrs.stroke_bottom_style, indexOf.call(strokeStyles, ref5) >= 0) {
          this.el.style.borderBottomStyle = this.attrs.stroke_bottom_style;
        }

        // Transforms.
        transforms = this.getTransforms();
        if (transforms.length > 0) {
          this.el.style.transform = transforms.join(' ');
        }

        // Transform origin.
        if (Array.isArray(this.attrs.transform_origin) && this.attrs.transform_origin.length === 2) {
          this.el.style.transformOrigin = [utils.formatUnit(this.attrs.transform_origin[0]), utils.formatUnit(this.attrs.transform_origin[1])].join(' ');
        }
      }
    }, {
      key: 'getTransforms',
      value: function getTransforms() {
        var transforms, translateX, translateY;
        transforms = [];
        translateX = utils.formatUnit(this.attrs.transform_translate_x);
        translateY = utils.formatUnit(this.attrs.transform_translate_y);
        if (translateX !== 0) {
          transforms.push('translateX(' + translateX + ')');
        }
        if (translateY !== 0) {
          transforms.push('translateY(' + translateY + ')');
        }
        if (typeof this.attrs.transform_rotate === 'number' && this.attrs.transform_rotate !== 0) {
          transforms.push('rotate(' + this.attrs.transform_rotate + 'deg)');
        }
        if (typeof this.attrs.transform_scale === 'number' && this.attrs.transform_scale !== 1) {
          transforms.push('scale(' + this.attrs.transform_scale + ')');
        }
        return transforms;
      }
    }, {
      key: 'hasCallback',
      value: function hasCallback() {
        if (utils.isDefinedStr(this.attrs.onlongclick)) {
          return true;
        } else if (utils.isDefinedStr(this.attrs.onclick)) {
          return true;
        } else if (utils.isDefinedStr(this.attrs.oncontextclick)) {
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: 'setupCallbacks',
      value: function setupCallbacks() {
        var _this = this;

        var clickDelay, down, downTimeout, endTime, isMouseSupported, isTouchSupported, longclickDelay, move, startPos, startTime, threshold, trigger, up, useTouch;
        startPos = {
          x: null,
          y: null
        };
        startTime = null;
        endTime = null;
        longclickDelay = 500;
        clickDelay = 300;
        threshold = 20;
        downTimeout = null;
        isTouchSupported = 'ontouchend' in document;
        isMouseSupported = window.matchMedia('(pointer: fine)').matches;
        useTouch = isTouchSupported && !isMouseSupported;
        trigger = function trigger(eventName, e) {
          _this.trigger(eventName, {
            originalEvent: e,
            el: _this.el,
            incito: _this.attrs
          });
        };
        down = function down(e) {
          e.stopPropagation();
          startPos.x = e.clientX || e.touches[0].clientX;
          startPos.y = e.clientY || e.touches[0].clientY;
          startTime = new Date().getTime();
          if (e.which !== 3 && e.button !== 2 && utils.isDefinedStr(_this.attrs.onlongclick)) {
            downTimeout = setTimeout(function () {
              trigger(_this.attrs.onlongclick, e);
            }, longclickDelay);
          }
        };
        move = function move(e) {
          clearTimeout(downTimeout);
        };
        up = function up(e) {
          var delta, deltaX, deltaY, x, y;
          e.stopPropagation();
          x = e.clientX || e.changedTouches[0].clientX;
          y = e.clientY || e.changedTouches[0].clientY;
          deltaX = Math.abs(x - startPos.x);
          deltaY = Math.abs(y - startPos.y);
          endTime = new Date().getTime();
          delta = endTime - startTime;
          clearTimeout(downTimeout);
          if (e.which !== 3 && e.button !== 2 && delta < clickDelay) {
            if (deltaX < threshold && deltaY < threshold) {
              if (utils.isDefinedStr(_this.attrs.onclick)) {
                trigger(_this.attrs.onclick, e);
              } else if (utils.isDefinedStr(_this.attrs.link)) {
                window.open(_this.attrs.link, '_blank');
              }
            }
          }
        };
        if (useTouch) {
          this.el.setAttribute('data-disable-user-select', '');
          this.el.ontouchstart = down;
          this.el.ontouchmove = move;
          this.el.ontouchend = up;
          this.el.ontouchcancel = up;
        } else {
          this.el.onmousedown = down;
          this.el.onmouseup = up;
        }
        if (utils.isDefinedStr(this.attrs.oncontextclick)) {
          this.el.oncontextmenu = function (e) {
            trigger(_this.attrs.oncontextclick, e);
            return false;
          };
        }
      }
    }, {
      key: 'getShadow',
      value: function getShadow() {
        var color, dx, dy, radius;
        if (utils.isDefinedStr(this.attrs.shadow_color)) {
          dx = typeof this.attrs.shadow_dx === 'number' ? this.attrs.shadow_dx : 0;
          dy = typeof this.attrs.shadow_dy === 'number' ? this.attrs.shadow_dy : 0;
          radius = typeof this.attrs.shadow_radius === 'number' ? this.attrs.shadow_radius : 0;
          color = this.attrs.shadow_color;
          return {
            dx: dx,
            dy: dy,
            radius: radius,
            color: color
          };
        }
      }
    }]);

    return View;
  }();

  View.prototype.tagName = 'div';

  View.prototype.className = null;

  return View;
}.call(undefined);

MicroEvent.mixin(View);

module.exports = View;

},{"../utils":2,"microevent":12}],12:[function(_dereq_,module,exports){
/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 * 
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent	= function(){};
MicroEvent.prototype	= {
	bind	: function(event, fct){
		this._events = this._events || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	unbind	: function(event, fct){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger	: function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
	}
};

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent;
}

},{}],13:[function(_dereq_,module,exports){
var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);}return e},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.LazyLoad=t();}(this,function(){var e={elements_selector:"img",container:window,threshold:300,throttle:150,data_src:"src",data_srcset:"srcset",class_loading:"loading",class_loaded:"loaded",class_error:"error",class_initial:"initial",skip_invisible:!0,callback_load:null,callback_error:null,callback_set:null,callback_processed:null,callback_enter:null},t=!("onscroll"in window)||/glebot/.test(navigator.userAgent),n=function(e,t){e&&e(t);},o=function(e){return e.getBoundingClientRect().top+window.pageYOffset-e.ownerDocument.documentElement.clientTop},i=function(e,t,n){return(t===window?window.innerHeight+window.pageYOffset:o(t)+t.offsetHeight)<=o(e)-n},s=function(e){return e.getBoundingClientRect().left+window.pageXOffset-e.ownerDocument.documentElement.clientLeft},r=function(e,t,n){var o=window.innerWidth;return(t===window?o+window.pageXOffset:s(t)+o)<=s(e)-n},l=function(e,t,n){return(t===window?window.pageYOffset:o(t))>=o(e)+n+e.offsetHeight},a=function(e,t,n){return(t===window?window.pageXOffset:s(t))>=s(e)+n+e.offsetWidth},c=function(e,t,n){return!(i(e,t,n)||l(e,t,n)||r(e,t,n)||a(e,t,n))},u=function(e,t){var n,o=new e(t);try{n=new CustomEvent("LazyLoad::Initialized",{detail:{instance:o}});}catch(e){(n=document.createEvent("CustomEvent")).initCustomEvent("LazyLoad::Initialized",!1,!1,{instance:o});}window.dispatchEvent(n);},d=function(e,t){return e.getAttribute("data-"+t)},h=function(e,t,n){return e.setAttribute("data-"+t,n)},_=function(e,t){var n=e.parentNode;if("PICTURE"===n.tagName)for(var o=0;o<n.children.length;o++){var i=n.children[o];if("SOURCE"===i.tagName){var s=d(i,t);s&&i.setAttribute("srcset",s);}}},f=function(e,t,n){var o=e.tagName,i=d(e,n);if("IMG"===o){_(e,t);var s=d(e,t);return s&&e.setAttribute("srcset",s), void(i&&e.setAttribute("src",i))}"IFRAME"!==o?i&&(e.style.backgroundImage='url("'+i+'")'):i&&e.setAttribute("src",i);},p="classList"in document.createElement("p"),m=function(e,t){p?e.classList.add(t):e.className+=(e.className?" ":"")+t;},g=function(e,t){p?e.classList.remove(t):e.className=e.className.replace(new RegExp("(^|\\s+)"+t+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"");},v=function(t){this._settings=_extends({},e,t), this._queryOriginNode=this._settings.container===window?document:this._settings.container, this._previousLoopTime=0, this._loopTimeout=null, this._boundHandleScroll=this.handleScroll.bind(this), this._isFirstLoop=!0, window.addEventListener("resize",this._boundHandleScroll), this.update();};v.prototype={_reveal:function(e){var t=this._settings,o=function o(){t&&(e.removeEventListener("load",i), e.removeEventListener("error",o), g(e,t.class_loading), m(e,t.class_error), n(t.callback_error,e));},i=function i(){t&&(g(e,t.class_loading), m(e,t.class_loaded), e.removeEventListener("load",i), e.removeEventListener("error",o), n(t.callback_load,e));};n(t.callback_enter,e), "IMG"!==e.tagName&&"IFRAME"!==e.tagName||(e.addEventListener("load",i), e.addEventListener("error",o), m(e,t.class_loading)), f(e,t.data_srcset,t.data_src), n(t.callback_set,e);},_loopThroughElements:function(){var e=this._settings,o=this._elements,i=o?o.length:0,s=void 0,r=[],l=this._isFirstLoop;for(s=0;s<i;s++){var a=o[s];e.skip_invisible&&null===a.offsetParent||(t||c(a,e.container,e.threshold))&&(l&&m(a,e.class_initial), this._reveal(a), r.push(s), h(a,"was-processed",!0));}for(;r.length;)o.splice(r.pop(),1), n(e.callback_processed,o.length);0===i&&this._stopScrollHandler(), l&&(this._isFirstLoop=!1);},_purgeElements:function(){var e=this._elements,t=e.length,n=void 0,o=[];for(n=0;n<t;n++){var i=e[n];d(i,"was-processed")&&o.push(n);}for(;o.length>0;)e.splice(o.pop(),1);},_startScrollHandler:function(){this._isHandlingScroll||(this._isHandlingScroll=!0, this._settings.container.addEventListener("scroll",this._boundHandleScroll));},_stopScrollHandler:function(){this._isHandlingScroll&&(this._isHandlingScroll=!1, this._settings.container.removeEventListener("scroll",this._boundHandleScroll));},handleScroll:function(){var e=this._settings.throttle;if(0!==e){var t=Date.now(),n=e-(t-this._previousLoopTime);n<=0||n>e?(this._loopTimeout&&(clearTimeout(this._loopTimeout), this._loopTimeout=null), this._previousLoopTime=t, this._loopThroughElements()):this._loopTimeout||(this._loopTimeout=setTimeout(function(){this._previousLoopTime=Date.now(), this._loopTimeout=null, this._loopThroughElements();}.bind(this),n));}else this._loopThroughElements();},update:function(){this._elements=Array.prototype.slice.call(this._queryOriginNode.querySelectorAll(this._settings.elements_selector)), this._purgeElements(), this._loopThroughElements(), this._startScrollHandler();},destroy:function(){window.removeEventListener("resize",this._boundHandleScroll), this._loopTimeout&&(clearTimeout(this._loopTimeout), this._loopTimeout=null), this._stopScrollHandler(), this._elements=null, this._queryOriginNode=null, this._settings=null;}};var w=window.lazyLoadOptions;return w&&function(e,t){var n=t.length;if(n)for(var o=0;o<n;o++)u(e,t[o]);else u(e,t);}(v,w), v});
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvY29mZmVlc2NyaXB0L2luY2l0by5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L3V0aWxzLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvdmlld3MvYWJzb2x1dGUtbGF5b3V0LmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvdmlld3MvZmxleC1sYXlvdXQuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC92aWV3cy9mcmFnLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvdmlld3MvaW1hZ2UuY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC92aWV3cy9saW5lYXItbGF5b3V0LmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvdmlld3MvdGV4dC5jb2ZmZWUiLCJsaWIvY29mZmVlc2NyaXB0L3ZpZXdzL3ZpZGVvLWVtYmVkLmNvZmZlZSIsImxpYi9jb2ZmZWVzY3JpcHQvdmlld3MvdmlkZW8uY29mZmVlIiwibGliL2NvZmZlZXNjcmlwdC92aWV3cy92aWV3LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9taWNyb2V2ZW50L21pY3JvZXZlbnQuanMiLCJub2RlX21vZHVsZXMvdmFuaWxsYS1sYXp5bG9hZC9kaXN0L2xhenlsb2FkLm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQUEsZ0JBQUEsWUFBQSxVQUFBLFdBQUEsUUFBQSxVQUFBLGNBQUEsWUFBQSxVQUFBLGdCQUFBLFdBQUEsTUFBQTs7QUFBQSxXQUFXLFFBQUEsQUFBUTs7QUFDbkIsYUFBYSxRQUFBLEFBQVE7O0FBQ3JCLFFBQVEsUUFBQSxBQUFROztBQUNoQixPQUFPLFFBQUEsQUFBUTs7QUFDZixXQUFXLFFBQUEsQUFBUTs7QUFDbkIsWUFBWSxRQUFBLEFBQVE7O0FBQ3BCLFdBQVcsUUFBQSxBQUFROztBQUNuQixpQkFBaUIsUUFBQSxBQUFROztBQUN6QixZQUFZLFFBQUEsQUFBUTs7QUFD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akIsQUFBa0MsV0FBYyxBQUFDLEtBQUEsQUFBSyxNQUF0RCxBQUF1RCxnQkFBbUI7QUFDbkYsa0JBQVEsQUFBQyxLQUFBLEFBQUssTUFBQzs7QUFFZixnQkFBQSxBQUFJO0FBQ0osZ0JBREEsQUFDSTtBQUNKLG9CQUZBLEFBRVE7QUFDUixtQkFUSixBQU1JLEFBR087QUFIUDtBQVBHO0FBaFVFOzs7Ozs7OztpQkFDYixVQUFTOztpQkFFVCxZQUFXOzs7OztBQXlVZixBQUFVLFdBQVYsQUFBVyxNQUFYLEFBQWlCOztBQUVqQixBQUFNLE9BQU4sQUFBTyxVQUFVOzs7QUNqVmpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIkxhenlMb2FkID0gcmVxdWlyZSAndmFuaWxsYS1sYXp5bG9hZCdcbk1pY3JvRXZlbnQgPSByZXF1aXJlICdtaWNyb2V2ZW50J1xudXRpbHMgPSByZXF1aXJlICcuL3V0aWxzJ1xuVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvdmlldydcbkZyYWdWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9mcmFnJ1xuSW1hZ2VWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9pbWFnZSdcblRleHRWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy90ZXh0J1xuVmlkZW9FbWJlZFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3ZpZGVvLWVtYmVkJ1xuVmlkZW9WaWV3ID0gcmVxdWlyZSAnLi92aWV3cy92aWRlbydcbkxpbmVhckxheW91dCA9IHJlcXVpcmUgJy4vdmlld3MvbGluZWFyLWxheW91dCdcbkFic29sdXRlTGF5b3V0ID0gcmVxdWlyZSAnLi92aWV3cy9hYnNvbHV0ZS1sYXlvdXQnXG5GbGV4TGF5b3V0ID0gcmVxdWlyZSAnLi92aWV3cy9mbGV4LWxheW91dCdcblxuY2xhc3MgSW5jaXRvXG4gICAgY29uc3RydWN0b3I6IChAY29udGFpbmVyRWwsIEBvcHRpb25zID0ge30pIC0+XG4gICAgICAgIEBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcblxuICAgICAgICByZXR1cm5cblxuICAgIHN0YXJ0OiAtPlxuICAgICAgICBpbmNpdG8gPSBAb3B0aW9ucy5pbmNpdG8gb3Ige31cbiAgICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXG4gICAgICAgIEBsb2FkRm9udHMgaW5jaXRvLmZvbnRfYXNzZXRzXG4gICAgICAgIEBhcHBseVRoZW1lIGluY2l0by50aGVtZVxuICAgICAgICBAcmVuZGVyIGZyYWcsIGluY2l0by5yb290X3ZpZXdcblxuICAgICAgICBAZWwuY2xhc3NOYW1lID0gJ2luY2l0bydcbiAgICAgICAgQGVsLnNldEF0dHJpYnV0ZSAnbGFuZycsIGluY2l0by5sb2NhbGUgaWYgaW5jaXRvLmxvY2FsZT9cbiAgICAgICAgQGVsLnNldEF0dHJpYnV0ZSAnZGF0YS1kZWJ1ZycsIHRydWUgaWYgaW5jaXRvLmRlYnVnIGlzIHRydWVcbiAgICAgICAgQGVsLmFwcGVuZENoaWxkIGZyYWdcbiAgICAgICAgQGNvbnRhaW5lckVsLmFwcGVuZENoaWxkIEBlbFxuXG4gICAgICAgIEBsYXp5bG9hZCA9IG5ldyBMYXp5TG9hZFxuICAgICAgICAgICAgZWxlbWVudHNfc2VsZWN0b3I6ICcuaW5jaXRvLS1sYXp5bG9hZCdcbiAgICAgICAgICAgIHRocmVzaG9sZDogODAwXG4gICAgICAgICAgICBjYWxsYmFja19lbnRlcjogKGVsKSAtPlxuICAgICAgICAgICAgICAgIGlmIGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgaXMgJ3ZpZGVvJyBhbmQgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWF1dG9wbGF5JylcbiAgICAgICAgICAgICAgICAgICAgZWwucGxheSgpXG5cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBcbiAgICBcbiAgICBkZXN0cm95OiAtPlxuICAgICAgICBAY29udGFpbmVyRWwucmVtb3ZlQ2hpbGQgQGVsXG4gICAgICAgIEBsYXp5bG9hZC5kZXN0cm95KCkgaWYgQGxhenlsb2FkP1xuXG4gICAgICAgIEB0cmlnZ2VyICdkZXN0cm95ZWQnXG4gICAgICAgIFxuICAgICAgICByZXR1cm5cblxuICAgIHJlbmRlcjogKGVsLCBhdHRycyA9IHt9KSAtPlxuICAgICAgICBtYXRjaCA9IG51bGxcbiAgICAgICAgdmlld05hbWUgPSBhdHRycy52aWV3X25hbWVcbiAgICAgICAgdmlld3MgPVxuICAgICAgICAgICAgVmlldzogVmlld1xuICAgICAgICAgICAgRnJhZ1ZpZXc6IEZyYWdWaWV3XG4gICAgICAgICAgICBJbWFnZVZpZXc6IEltYWdlVmlld1xuICAgICAgICAgICAgVGV4dFZpZXc6IFRleHRWaWV3XG4gICAgICAgICAgICBWaWRlb0VtYmVkVmlldzogVmlkZW9FbWJlZFZpZXdcbiAgICAgICAgICAgIFZpZGVvVmlldzogVmlkZW9WaWV3XG4gICAgICAgICAgICBMaW5lYXJMYXlvdXQ6IExpbmVhckxheW91dFxuICAgICAgICAgICAgQWJzb2x1dGVMYXlvdXQ6IEFic29sdXRlTGF5b3V0XG4gICAgICAgICAgICBGbGV4TGF5b3V0OiBGbGV4TGF5b3V0XG4gICAgICAgIG1hdGNoID0gdmlld3Nbdmlld05hbWVdID8gVmlld1xuICAgICAgICB2aWV3ID0gbmV3IG1hdGNoIGF0dHJzXG4gICAgICAgIHRyaWdnZXIgPSB2aWV3LnRyaWdnZXJcblxuICAgICAgICB2aWV3LnRyaWdnZXIgPSAoYXJncy4uLikgPT5cbiAgICAgICAgICAgIHRyaWdnZXIuYXBwbHkgdmlldywgYXJnc1xuICAgICAgICAgICAgQHRyaWdnZXIuYXBwbHkgQCwgYXJnc1xuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgdmlldy5yZW5kZXIoKVxuXG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkoYXR0cnMuY2hpbGRfdmlld3MpXG4gICAgICAgICAgICBhdHRycy5jaGlsZF92aWV3cy5mb3JFYWNoIChjaGlsZFZpZXcpID0+XG4gICAgICAgICAgICAgICAgY2hpbGRFbCA9IEByZW5kZXIodmlldy5lbCwgY2hpbGRWaWV3KVxuXG4gICAgICAgICAgICAgICAgdmlldy5lbC5hcHBlbmRDaGlsZCBjaGlsZEVsIGlmIGNoaWxkRWw/XG5cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGVsLmFwcGVuZENoaWxkIHZpZXcuZWxcbiAgICBcbiAgICAgICAgdmlldy5lbFxuICAgIFxuICAgIGFwcGx5VGhlbWU6ICh0aGVtZSA9IHt9KSAtPlxuICAgICAgICBpZiB0aGVtZS5mb250X2ZhbWlseT9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5mb250RmFtaWx5ID0gdGhlbWUuZm9udF9mYW1pbHkuam9pbignLCAnKVxuICAgICAgICBcbiAgICAgICAgaWYgdGhlbWUuYmFja2dyb3VuZF9jb2xvcj9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGVtZS5iYWNrZ3JvdW5kX2NvbG9yXG4gICAgICAgIFxuICAgICAgICBpZiB0aGVtZS5saW5lX3NwYWNpbmdfbXVsdGlwbGllcj9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5saW5lSGVpZ2h0ID0gdGhlbWUubGluZV9zcGFjaW5nX211bHRpcGxpZXJcbiAgICAgICAgXG4gICAgICAgIHJldHVyblxuXG4gICAgbG9hZEZvbnRzOiAoZm9udEFzc2V0cyA9IHt9KSAtPlxuICAgICAgICBpZiAnRm9udEZhY2UnIG9mIHdpbmRvd1xuICAgICAgICAgICAgZm9yIGtleSwgdmFsdWUgb2YgZm9udEFzc2V0c1xuICAgICAgICAgICAgICAgIHVybHMgPSB2YWx1ZS5zcmMubWFwKChzcmMpIC0+IFwidXJsKCN7c3JjWzFdfSlcIikuam9pbiAnLCAnXG4gICAgICAgICAgICAgICAgZm9udCA9IG5ldyBGb250RmFjZSBrZXksIHVybHMsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB2YWx1ZS5zdHlsZSA/ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodDogdmFsdWUud2VpZ2h0ID8gJ25vcm1hbCdcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmZvbnRzLmFkZCBmb250XG5cbiAgICAgICAgICAgICAgICBmb250LmxvYWQoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnc3R5bGUnXG5cbiAgICAgICAgICAgIGZvciBrZXksIHZhbHVlIG9mIGZvbnRBc3NldHNcbiAgICAgICAgICAgICAgICB1cmxzID0gdmFsdWUuc3JjLm1hcCgoc3JjKSAtPiBcInVybCgnI3tzcmNbMV19JykgZm9ybWF0KCcje3NyY1swXX0nKVwiKS5qb2luICcsICdcbiAgICAgICAgICAgICAgICB0ZXh0ID0gXCJcIlwiXG4gICAgICAgICAgICAgICAgICAgIEBmb250LWZhY2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6ICcje2tleX0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAje3VybHN9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3R5bGVFbC5hcHBlbmRDaGlsZCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KVxuXG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkIHN0eWxlRWxcbiAgICAgICAgXG4gICAgICAgIHJldHVyblxuXG5NaWNyb0V2ZW50Lm1peGluIEluY2l0b1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluY2l0byIsInV0aWxzID1cbiAgICBmb3JtYXRVbml0OiAodW5pdCkgLT5cbiAgICAgICAgaWYgdHlwZW9mIHVuaXQgaXMgJ251bWJlcidcbiAgICAgICAgICAgIHJldHVybiBcIiN7dW5pdH1weFwiXG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIHVuaXQgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIHJldHVybiB1bml0LnJlcGxhY2UgJ2RwJywgJ3B4J1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gMFxuICAgIFxuICAgIGlzRGVmaW5lZFN0cjogKHZhbHVlKSAtPlxuICAgICAgICB0eXBlb2YgdmFsdWUgaXMgJ3N0cmluZycgYW5kIHZhbHVlLmxlbmd0aCA+IDBcblxuICAgIGVzY2FwZUhUTUw6ICh1bnNhZmUgPSAnJykgLT5cbiAgICAgICAgdW5zYWZlXG4gICAgICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgICAgICAgLnJlcGxhY2UgLycvZywgJyYjMDM5OydcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscyIsIlZpZXcgPSByZXF1aXJlICcuL3ZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQWJzb2x1dGVMYXlvdXQgZXh0ZW5kcyBWaWV3XG4gICAgY2xhc3NOYW1lOiAnaW5jaXRvX19hYnNvbHV0ZS1sYXlvdXQtdmlldydcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgQCIsIlZpZXcgPSByZXF1aXJlICcuL3ZpZXcnXG51dGlscyA9IHJlcXVpcmUgJy4uL3V0aWxzJ1xuXG5hbGlnbkl0ZW1Nb2RlcyA9IFsnc3RyZXRjaCcsICdjZW50ZXInLCAnZmxleC1zdGFydCcsICdmbGV4LWVuZCcsICdiYXNlbGluZSddXG5hbGlnbkNvbnRlbnRNb2RlcyA9IFsnc3RyZXRjaCcsICdjZW50ZXInLCAnZmxleC1zdGFydCcsICdmbGV4LWVuZCcsICdzcGFjZS1iZXR3ZWVuJywgJ3NwYWNlLWFyb3VuZCcsICdpbml0aWFsJywgJ2luaGVyaXQnXVxuZmxleEp1c3RpZnlNb2RlcyA9IFsnZmxleC1zdGFydCcsICdmbGV4LWVuZCcsICdjZW50ZXInLCAnc3BhY2UtYmV0d2VlbicsICdzcGFjZS1hcm91bmQnXVxuZmxleERpcmVjdGlvbk1vZGVzID0gWydyb3cnLCAnY29sdW1uJ11cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGbGV4TGF5b3V0IGV4dGVuZHMgVmlld1xuICAgIGNsYXNzTmFtZTogJ2luY2l0b19fZmxleC1sYXlvdXQtdmlldydcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgaWYgQGF0dHJzLmxheW91dF9mbGV4X2FsaWduX2l0ZW1zIGluIGFsaWduSXRlbU1vZGVzXG4gICAgICAgICAgICBAZWwuc3R5bGUuYWxpZ25JdGVtcyA9IEBhdHRycy5sYXlvdXRfZmxleF9hbGlnbl9pdGVtc1xuICAgICAgICAgICAgQGVsLnN0eWxlLm1zQWxpZ25JdGVtcyA9IEBhdHRycy5sYXlvdXRfZmxleF9hbGlnbl9pdGVtc1xuXG4gICAgICAgIGlmIEBhdHRycy5sYXlvdXRfZmxleF9hbGlnbl9jb250ZW50IGluIGFsaWduQ29udGVudE1vZGVzXG4gICAgICAgICAgICBAZWwuc3R5bGUuYWxpZ25Db250ZW50ID0gQGF0dHJzLmxheW91dF9mbGV4X2FsaWduX2NvbnRlbnRcbiAgICAgICAgICAgIEBlbC5zdHlsZS5tc0FsaWduQ29udGVudCA9IEBhdHRycy5sYXlvdXRfZmxleF9hbGlnbl9jb250ZW50XG5cbiAgICAgICAgaWYgQGF0dHJzLmxheW91dF9mbGV4X2p1c3RpZnlfY29udGVudCBpbiBmbGV4SnVzdGlmeU1vZGVzXG4gICAgICAgICAgICBAZWwuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBAYXR0cnMubGF5b3V0X2ZsZXhfanVzdGlmeV9jb250ZW50XG4gICAgICAgICAgICBAZWwuc3R5bGUubXNGbGV4UGFjayA9IEBhdHRycy5sYXlvdXRfZmxleF9qdXN0aWZ5X2NvbnRlbnRcblxuICAgICAgICBpZiBAYXR0cnMubGF5b3V0X2ZsZXhfZGlyZWN0aW9uIGluIGZsZXhEaXJlY3Rpb25Nb2Rlc1xuICAgICAgICAgICAgQGVsLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBAYXR0cnMubGF5b3V0X2ZsZXhfZGlyZWN0aW9uXG4gICAgICAgICAgICBAZWwuc3R5bGUubXNGbGV4RGlyZWN0aW9uID0gQGF0dHJzLmxheW91dF9mbGV4X2RpcmVjdGlvblxuXG4gICAgICAgIGlmIHR5cGVvZiBAYXR0cnMubGF5b3V0X2ZsZXhfc2hyaW5rIGlzICdudW1iZXInXG4gICAgICAgICAgICBAZWwuc3R5bGUuZmxleFNocmluayA9IEBhdHRycy5sYXlvdXRfZmxleF9zaHJpbmtcbiAgICAgICAgICAgIEBlbC5zdHlsZS5tc0ZsZXhTaHJpbmsgPSBAYXR0cnMubGF5b3V0X2ZsZXhfc2hyaW5rXG4gICAgICAgIFxuICAgICAgICBpZiB0eXBlb2YgQGF0dHJzLmxheW91dF9mbGV4X2dyb3cgaXMgJ251bWJlcidcbiAgICAgICAgICAgIEBlbC5zdHlsZS5mbGV4R3JvdyA9IEBhdHRycy5sYXlvdXRfZmxleF9ncm93XG4gICAgICAgICAgICBAZWwuc3R5bGUubXNGbGV4R3JvdyA9IEBhdHRycy5sYXlvdXRfZmxleF9ncm93XG4gICAgICAgIFxuICAgICAgICBpZiBAYXR0cnMubGF5b3V0X2ZsZXhfYmFzaXM/XG4gICAgICAgICAgICBAZWwuc3R5bGUuZmxleEJhc2lzID0gdXRpbHMucGFyc2VVbml0IEBhdHRycy5sYXlvdXRfZmxleF9iYXNpc1xuICAgICAgICAgICAgQGVsLnN0eWxlLm1zRmxleEJhc2lzID0gdXRpbHMucGFyc2VVbml0IEBhdHRycy5sYXlvdXRfZmxleF9iYXNpc1xuXG4gICAgICAgIEAiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEZyYWdWaWV3XG4gICAgcmVuZGVyOiAtPlxuICAgICAgICBAZWwgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuICAgICAgICBAIiwiVmlldyA9IHJlcXVpcmUgJy4vdmlldydcbnV0aWxzID0gcmVxdWlyZSAnLi4vdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSW1hZ2UgZXh0ZW5kcyBWaWV3XG4gICAgdGFnTmFtZTogJ2ltZydcblxuICAgIGNsYXNzTmFtZTogJ2luY2l0b19faW1hZ2UtdmlldyBpbmNpdG8tLWxhenlsb2FkJ1xuICAgIFxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5zcmNcbiAgICAgICAgICAgIEBlbC5zZXRBdHRyaWJ1dGUgJ2RhdGEtc3JjJywgQGF0dHJzLnNyY1xuICAgICAgICBcbiAgICAgICAgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5sYWJlbFxuICAgICAgICAgICAgQGVsLnNldEF0dHJpYnV0ZSAnYWx0JywgQGF0dHJzLmxhYmVsXG5cbiAgICAgICAgQCIsIlZpZXcgPSByZXF1aXJlICcuL3ZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTGluZWFyTGF5b3V0IGV4dGVuZHMgVmlld1xuICAgIGNsYXNzTmFtZTogJ2luY2l0b19fbGluZWFyLWxheW91dC12aWV3J1xuXG4gICAgcmVuZGVyOiAtPlxuICAgICAgICBAIiwiVmlldyA9IHJlcXVpcmUgJy4vdmlldydcbnV0aWxzID0gcmVxdWlyZSAnLi4vdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVGV4dFZpZXcgZXh0ZW5kcyBWaWV3XG4gICAgdGFnTmFtZTogJ3AnXG5cbiAgICBjbGFzc05hbWU6ICdpbmNpdG9fX3RleHQtdmlldydcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgdGV4dFN0eWxlcyA9IChAYXR0cnMudGV4dF9zdHlsZSB8fCAnJykuc3BsaXQgJ3wnXG4gICAgICAgIHRleHQgPSBAYXR0cnMudGV4dFxuXG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkoQGF0dHJzLnNwYW5zKSBhbmQgQGF0dHJzLnNwYW5zLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHBhcnNlZFRleHQgPSBAcGFyc2VTcGFucyB0ZXh0LCBAYXR0cnMuc3BhbnNcbiAgICAgICAgICAgIHRleHQgPSBwYXJzZWRUZXh0Lm1hcCAoaXRlbSkgLT5cbiAgICAgICAgICAgICAgICBlc2NhcGVkVGV4dCA9IHV0aWxzLmVzY2FwZUhUTUwgaXRlbS50ZXh0IG9yICcnXG5cbiAgICAgICAgICAgICAgICBpZiBpdGVtLnNwYW4/IGFuZCBpdGVtLnNwYW4ubmFtZSBpcyAnbGluaycgYW5kIGl0ZW0uc3Bhbi51cmw/XG4gICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiJyArIGVuY29kZVVSSShpdGVtLnNwYW4udXJsKSArICdcIiByZWw9XCJleHRlcm5hbFwiIHRhcmdldD1cIl9ibGFua1wiPicgKyBlc2NhcGVkVGV4dCArICc8L2E+J1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgaXRlbS5zcGFuPyBhbmQgaXRlbS5zcGFuLm5hbWU/XG4gICAgICAgICAgICAgICAgICAgIHNwYW5OYW1lID0gaXRlbS5zcGFuLm5hbWVcblxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gZGF0YS1uYW1lPVwiJyArIHNwYW5OYW1lICsgJ1wiPicgKyBlc2NhcGVkVGV4dCArICc8L3NwYW4+J1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZXNjYXBlZFRleHRcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LmpvaW4gJydcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGV4dCA9IHV0aWxzLmVzY2FwZUhUTUwgdGV4dFxuXG4gICAgICAgIGlmIEBhdHRycy50ZXh0X3ByZXZlbnRfd2lkb3dcbiAgICAgICAgICAgIEBlbC5pbm5lckhUTUwgPSB0ZXh0LnJlcGxhY2UoL1xcJm5ic3A7KFteXFxzXSspJC8sJyAkMScpLnJlcGxhY2UoL1xccyhbXlxcc10rKVxccyokLywnJm5ic3A7JDEnKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZWwuaW5uZXJIVE1MID0gdGV4dFxuXG4gICAgICAgICMgRm9udCBmYW1pbHkuXG4gICAgICAgIGlmIEFycmF5LmlzQXJyYXkoQGF0dHJzLmZvbnRfZmFtaWx5KSBhbmQgQGF0dHJzLmZvbnRfZmFtaWx5Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgIEBlbC5zdHlsZS5mb250RmFtaWx5ID0gQGF0dHJzLmZvbnRfZmFtaWx5LmpvaW4gJywgJ1xuXG4gICAgICAgICMgVGV4dCBzaXplLlxuICAgICAgICBpZiBAYXR0cnMudGV4dF9zaXplP1xuICAgICAgICAgICAgQGVsLnN0eWxlLmZvbnRTaXplID0gXCIje0BhdHRycy50ZXh0X3NpemV9cHhcIlxuICAgICAgICBcbiAgICAgICAgIyBMaW5lIGhlaWdodC5cbiAgICAgICAgaWYgQGF0dHJzLmxpbmVfc3BhY2luZ19tdWx0aXBsaWVyP1xuICAgICAgICAgICAgQGVsLnN0eWxlLmxpbmVIZWlnaHQgPSBAYXR0cnMubGluZV9zcGFjaW5nX211bHRpcGxpZXJcbiAgICAgICAgXG4gICAgICAgICMgVGV4dCBjb2xvci5cbiAgICAgICAgaWYgQGF0dHJzLnRleHRfY29sb3I/XG4gICAgICAgICAgICBAZWwuc3R5bGUuY29sb3IgPSBAYXR0cnMudGV4dF9jb2xvclxuICAgICAgICBcbiAgICAgICAgIyBUZXh0IHN0eWxlcy5cbiAgICAgICAgaWYgJ2JvbGQnIGluIHRleHRTdHlsZXNcbiAgICAgICAgICAgIEBlbC5zdHlsZS5mb250V2VpZ2h0ID0gJ2JvbGQnXG4gICAgICAgIGlmICdpdGFsaWMnIGluIHRleHRTdHlsZXNcbiAgICAgICAgICAgIEBlbC5zdHlsZS5mb250U3R5bGUgPSAnaXRhbGljJ1xuICAgICAgICBcbiAgICAgICAgIyBUZXh0IHNoYWRvdy5cbiAgICAgICAgdGV4dFNoYWRvdyA9IEBnZXRUZXh0U2hhZG93KClcblxuICAgICAgICBpZiB0ZXh0U2hhZG93P1xuICAgICAgICAgICAgQGVsLnN0eWxlLnRleHRTaGFkb3cgPSBcIiN7dGV4dFNoYWRvdy5keH1weCAje3RleHRTaGFkb3cuZHl9cHggI3t0ZXh0U2hhZG93LnJhZGl1c31weCAje3RleHRTaGFkb3cuY29sb3J9XCJcbiAgICAgICAgXG4gICAgICAgICMgVGV4dCBhbGlnbm1lbnQuXG4gICAgICAgIGlmIEBhdHRycy50ZXh0X2FsaWdubWVudCBpcyAnbGVmdCdcbiAgICAgICAgICAgIEBlbC5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCdcbiAgICAgICAgZWxzZSBpZiBAYXR0cnMudGV4dF9hbGlnbm1lbnQgaXMgJ2NlbnRlcidcbiAgICAgICAgICAgIEBlbC5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJ1xuICAgICAgICBlbHNlIGlmIEBhdHRycy50ZXh0X2FsaWdubWVudCBpcyAncmlnaHQnXG4gICAgICAgICAgICBAZWwuc3R5bGUudGV4dEFsaWduID0gJ3JpZ2h0J1xuICAgICAgICBcbiAgICAgICAgIyBGb250IHN0cmV0Y2guXG4gICAgICAgIGlmIEBhdHRycy5mb250X3N0cmV0Y2ggaW4gWydjb25kZW5zZWQnLCAnbm9ybWFsJywgJ2V4cGFuZGVkJ11cbiAgICAgICAgICAgIEBlbC5zdHlsZS5mb250U3RyZXRjaCA9IEBhdHRycy5mb250X3N0cmV0Y2hcbiAgICAgICAgXG4gICAgICAgICMgU2luZ2xlIGxpbmUuXG4gICAgICAgIGlmIEBhdHRycy5zaW5nbGVfbGluZSBpcyB0cnVlXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdkYXRhLXNpbmdsZS1saW5lJywgdHJ1ZVxuICAgICAgICBcbiAgICAgICAgIyBBbGwgY2Fwcy5cbiAgICAgICAgaWYgQGF0dHJzLnRleHRfYWxsX2NhcHMgaXMgdHJ1ZVxuICAgICAgICAgICAgQGVsLnN0eWxlLnRleHRUcmFuc2Zvcm0gPSAndXBwZXJjYXNlJ1xuICAgICAgICAgICAgXG4gICAgICAgIEBcbiAgICBcbiAgICBwYXJzZVNwYW5zOiAodGV4dCwgc3BhbnMgPSBbXSkgLT5cbiAgICAgICAgcmVzdWx0ID0gW11cblxuICAgICAgICBpZiBzcGFucy5sZW5ndGggaXMgMFxuICAgICAgICAgICAgcmVzdWx0LnB1c2hcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIGVsc2UgaWYgc3BhbnNbMF0uc3RhcnQgPiAwXG4gICAgICAgICAgICByZXN1bHQucHVzaFxuICAgICAgICAgICAgICAgIHRleHQ6IHRleHQuc2xpY2UoMCwgc3BhbnNbMF0uc3RhcnQpXG5cbiAgICAgICAgc3BhbnMuZm9yRWFjaCAoc3BhbiwgaSkgLT5cbiAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBzcGFuLnN0YXJ0XG4gICAgICAgICAgICBlbmRJbmRleCA9IHNwYW4uZW5kXG5cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dC5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleClcbiAgICAgICAgICAgICAgICBzcGFuOiBzcGFuXG5cbiAgICAgICAgICAgIGlmIGkgaXMgc3BhbnMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICAgIGlmIGVuZEluZGV4IDwgdGV4dC5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2hcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQuc2xpY2UoZW5kSW5kZXgsIHRleHQubGVuZ3RoKVxuICAgICAgICAgICAgZWxzZSBpZiBlbmRJbmRleCA8IHNwYW5zW2kgKyAxXS5zdGFydFxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQuc2xpY2UoZW5kSW5kZXgsIHNwYW5zW2kgKyAxXS5zdGFydClcblxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmVzdWx0XG4gICAgXG4gICAgZ2V0VGV4dFNoYWRvdzogLT5cbiAgICAgICAgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy50ZXh0X3NoYWRvd19jb2xvclxuICAgICAgICAgICAgZHggPSBpZiB0eXBlb2YgQGF0dHJzLnRleHRfc2hhZG93X2R4IGlzICdudW1iZXInIHRoZW4gQGF0dHJzLnRleHRfc2hhZG93X2R4IGVsc2UgMFxuICAgICAgICAgICAgZHkgPSBpZiB0eXBlb2YgQGF0dHJzLnRleHRfc2hhZG93X2R5IGlzICdudW1iZXInIHRoZW4gQGF0dHJzLnRleHRfc2hhZG93X2R5IGVsc2UgMFxuICAgICAgICAgICAgcmFkaXVzID0gaWYgdHlwZW9mIEBhdHRycy50ZXh0X3NoYWRvd19yYWRpdXMgaXMgJ251bWJlcicgdGhlbiBAYXR0cnMudGV4dF9zaGFkb3dfcmFkaXVzIGVsc2UgMFxuICAgICAgICAgICAgY29sb3IgPSBAYXR0cnMudGV4dF9zaGFkb3dfY29sb3JcblxuICAgICAgICAgICAgZHg6IGR4XG4gICAgICAgICAgICBkeTogZHlcbiAgICAgICAgICAgIHJhZGl1czogcmFkaXVzXG4gICAgICAgICAgICBjb2xvcjogY29sb3IiLCJWaWV3ID0gcmVxdWlyZSAnLi92aWV3J1xudXRpbHMgPSByZXF1aXJlICcuLi91dGlscydcblxuYWxsb3dlZEhvc3RuYW1lcyA9IFsnd3d3LnlvdXR1YmUuY29tJywgJ3d3dy52aW1lby5jb20nLCAndmlkZW8udHdlbnR5dGhyZWUubmV0J11cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGbGV4TGF5b3V0IGV4dGVuZHMgVmlld1xuICAgIGNsYXNzTmFtZTogJ2luY2l0b19fdmlkZW8tZW1iZWQtdmlldyBpbmNpdG8tLWxhenlsb2FkJ1xuXG4gICAgdGFnTmFtZTogJ2lmcmFtZSdcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgbGlua0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnYSdcblxuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLnNyY1xuICAgICAgICAgICAgbGlua0VsLnNldEF0dHJpYnV0ZSAnaHJlZicsIEBhdHRycy5zcmNcblxuICAgICAgICAgICAgaWYgbGlua0VsLmhvc3RuYW1lIGluIGFsbG93ZWRIb3N0bmFtZXNcbiAgICAgICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdkYXRhLXNyYycsIEBhdHRycy5zcmNcblxuICAgICAgICBAIiwiVmlldyA9IHJlcXVpcmUgJy4vdmlldydcbnV0aWxzID0gcmVxdWlyZSAnLi4vdXRpbHMnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVmlkZW8gZXh0ZW5kcyBWaWV3XG4gICAgY2xhc3NOYW1lOiAnaW5jaXRvX192aWRlby12aWV3IGluY2l0by0tbGF6eWxvYWQnXG5cbiAgICB0YWdOYW1lOiAndmlkZW8nXG5cbiAgICByZW5kZXI6IC0+XG4gICAgICAgIGlmIEBhdHRycy5hdXRvcGxheSBpcyB0cnVlXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdkYXRhLWF1dG9wbGF5JywgJ3RydWUnXG4gICAgICAgIFxuICAgICAgICBpZiBAYXR0cnMubG9vcCBpcyB0cnVlXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdsb29wJywgJydcbiAgICAgICAgXG4gICAgICAgIGlmIEBhdHRycy5jb250cm9scyBpcyB0cnVlXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdjb250cm9scycsICcnXG4gICAgICAgIFxuICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdtdXRlZCcsICd0cnVlJ1xuICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdwcmVsb2FkJywgJ21ldGFkYXRhJ1xuICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdwbGF5c2lubGluZScsICcnXG4gICAgICAgIFxuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLnNyY1xuICAgICAgICAgICAgc291cmNlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdzb3VyY2UnXG5cbiAgICAgICAgICAgIHNvdXJjZUVsLnNldEF0dHJpYnV0ZSAnc3JjJywgQGF0dHJzLnNyY1xuICAgICAgICAgICAgc291cmNlRWwuc2V0QXR0cmlidXRlICd0eXBlJywgQGF0dHJzLm1pbWVcblxuICAgICAgICAgICAgQGVsLmFwcGVuZENoaWxkIHNvdXJjZUVsXG5cbiAgICAgICAgQCIsIk1pY3JvRXZlbnQgPSByZXF1aXJlICdtaWNyb2V2ZW50J1xudXRpbHMgPSByZXF1aXJlICcuLi91dGlscydcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWaWV3XG4gICAgdGFnTmFtZTogJ2RpdidcblxuICAgIGNsYXNzTmFtZTogbnVsbFxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAoQGF0dHJzID0ge30pIC0+XG4gICAgICAgIEBlbCA9IEBjcmVhdGVFbGVtZW50KClcblxuICAgICAgICBAc2V0QXR0cmlidXRlcygpXG4gICAgICAgIEBpbml0aWFsaXplKClcbiAgICBcbiAgICBpbml0aWFsaXplOiAtPlxuICAgICAgICByZXR1cm5cbiAgICBcbiAgICByZW5kZXI6IC0+XG4gICAgICAgIEBcblxuICAgIGNyZWF0ZUVsZW1lbnQ6IC0+XG4gICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBAdGFnTmFtZVxuXG4gICAgICAgIGVsLmNsYXNzTmFtZSA9ICdpbmNpdG9fX3ZpZXcnXG4gICAgICAgIGVsLmNsYXNzTmFtZSArPSAnICcgKyBAY2xhc3NOYW1lIGlmIEBjbGFzc05hbWU/XG5cbiAgICAgICAgZWxcbiAgICBcbiAgICBzZXRBdHRyaWJ1dGVzOiAtPlxuICAgICAgICAjIElkZW50aWZpZXIuXG4gICAgICAgIGlmIHV0aWxzLmlzRGVmaW5lZFN0ciBAYXR0cnMuaWRcbiAgICAgICAgICAgIEBlbC5zZXRBdHRyaWJ1dGUgJ2RhdGEtaWQnLCBAYXR0cnMuaWRcbiAgICAgICAgXG4gICAgICAgICMgUm9sZS5cbiAgICAgICAgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5yb2xlXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdyb2xlJywgQGF0dHJzLnJvbGVcbiAgICAgICAgXG4gICAgICAgICMgQWNjZXNzaWJpbGl0eSBsYWJlbC5cbiAgICAgICAgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5hY2Nlc3NpYmlsaXR5X2xhYmVsXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdhcmlhLWxhYmVsJywgQGF0dHJzLmFjY2Vzc2liaWxpdHlfbGFiZWxcblxuICAgICAgICAjIFRpdGxlLlxuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLnRpdGxlXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICd0aXRsZScsIEBhdHRycy50aXRsZVxuXG4gICAgICAgICMgR3Jhdml0eS5cbiAgICAgICAgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5ncmF2aXR5XG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdkYXRhLWdyYXZpdHknLCBAYXR0cnMuZ3Jhdml0eVxuICAgICAgICBcbiAgICAgICAgIyBMaW5rIG9yIGNhbGxiYWNrcy5cbiAgICAgICAgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5saW5rXG4gICAgICAgICAgICBAZWwuc2V0QXR0cmlidXRlICdkYXRhLWxpbmsnLCAnJ1xuICAgICAgICAgICAgQHNldHVwQ2FsbGJhY2tzKClcbiAgICAgICAgZWxzZSBpZiBAaGFzQ2FsbGJhY2soKVxuICAgICAgICAgICAgQGVsLnNldEF0dHJpYnV0ZSAnZGF0YS1jYWxsYmFjaycsICcnXG4gICAgICAgICAgICBAc2V0dXBDYWxsYmFja3MoKVxuXG4gICAgICAgICMgV2lkdGguXG4gICAgICAgIGlmIEBhdHRycy5sYXlvdXRfd2lkdGggaXMgJ21hdGNoX3BhcmVudCdcbiAgICAgICAgICAgIEBlbC5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgICAgICBlbHNlIGlmIEBhdHRycy5sYXlvdXRfd2lkdGggaXMgJ3dyYXBfY29udGVudCdcbiAgICAgICAgICAgIEBlbC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcbiAgICAgICAgZWxzZSBpZiBAYXR0cnMubGF5b3V0X3dpZHRoP1xuICAgICAgICAgICAgQGVsLnN0eWxlLndpZHRoID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMubGF5b3V0X3dpZHRoXG5cbiAgICAgICAgIyBIZWlnaHQuXG4gICAgICAgIGlmIEBhdHRycy5sYXlvdXRfaGVpZ2h0IGlzICdtYXRjaF9wYXJlbnQnXG4gICAgICAgICAgICBAZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnXG4gICAgICAgIGVsc2UgaWYgQGF0dHJzLmxheW91dF9oZWlnaHQgaXMgJ3dyYXBfY29udGVudCdcbiAgICAgICAgICAgIEBlbC5zdHlsZS5oZWlnaHQgPSAnYXV0bydcbiAgICAgICAgZWxzZSBpZiBAYXR0cnMubGF5b3V0X2hlaWdodD9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5oZWlnaHQgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5sYXlvdXRfaGVpZ2h0XG5cbiAgICAgICAgIyBNaW4gd2lkdGguXG4gICAgICAgIGlmIEBhdHRycy5taW5fd2lkdGg/XG4gICAgICAgICAgICBAZWwuc3R5bGUubWluV2lkdGggPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5taW5fd2lkdGhcbiAgICAgICAgXG4gICAgICAgICMgTWF4IHdpZHRoLlxuICAgICAgICBpZiBAYXR0cnMubWF4X3dpZHRoP1xuICAgICAgICAgICAgQGVsLnN0eWxlLm1heFdpZHRoID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMubWF4X3dpZHRoXG5cbiAgICAgICAgIyBNaW4gaGVpZ2h0LlxuICAgICAgICBpZiBAYXR0cnMubWluX2hlaWdodD9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5taW5IZWlnaHQgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5taW5faGVpZ2h0XG5cbiAgICAgICAgIyBNYXggaGVpZ2h0LlxuICAgICAgICBpZiBAYXR0cnMubWF4X2hlaWdodD9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5tYXhIZWlnaHQgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5tYXhfaGVpZ2h0XG4gICAgICAgIFxuICAgICAgICAjIFBvc2l0aW9uIGluIHJlbGF0aW9uIHRvIHBhcmVudC5cbiAgICAgICAgaWYgQGF0dHJzLmxheW91dF90b3A/XG4gICAgICAgICAgICBAZWwuc3R5bGUudG9wID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMubGF5b3V0X3RvcFxuICAgICAgICBpZiBAYXR0cnMubGF5b3V0X2xlZnQ/XG4gICAgICAgICAgICBAZWwuc3R5bGUubGVmdCA9IHV0aWxzLmZvcm1hdFVuaXQgQGF0dHJzLmxheW91dF9sZWZ0XG4gICAgICAgIGlmIEBhdHRycy5sYXlvdXRfcmlnaHQ/XG4gICAgICAgICAgICBAZWwuc3R5bGUucmlnaHQgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5sYXlvdXRfcmlnaHRcbiAgICAgICAgaWYgQGF0dHJzLmxheW91dF9ib3R0b20/XG4gICAgICAgICAgICBAZWwuc3R5bGUuYm90dG9tID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMubGF5b3V0X2JvdHRvbVxuICAgICAgICBcbiAgICAgICAgIyBCYWNrZ3JvdW5kLlxuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLmJhY2tncm91bmRfY29sb3JcbiAgICAgICAgICAgIEBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBAYXR0cnMuYmFja2dyb3VuZF9jb2xvclxuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLmJhY2tncm91bmRfaW1hZ2VcbiAgICAgICAgICAgIEBlbC5zZXRBdHRyaWJ1dGUgJ2RhdGEtc3JjJywgQGF0dHJzLmJhY2tncm91bmRfaW1hZ2VcbiAgICAgICAgICAgIEBlbC5jbGFzc05hbWUgKz0gJyBpbmNpdG8tLWxhenlsb2FkJ1xuICAgICAgICBpZiBAYXR0cnMuYmFja2dyb3VuZF90aWxlX21vZGUgaW4gWydyZXBlYXRfeCcsICdyZXBlYXRfeScsICdyZXBlYXQnXVxuICAgICAgICAgICAgQGVsLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSBAYXR0cnMuYmFja2dyb3VuZF90aWxlX21vZGUucmVwbGFjZSAnXycsICctJ1xuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLmJhY2tncm91bmRfaW1hZ2VfcG9zaXRpb25cbiAgICAgICAgICAgIEBlbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBAYXR0cnMuYmFja2dyb3VuZF9pbWFnZV9wb3NpdGlvbi5yZXBsYWNlICdfJywgJyAnXG4gICAgICAgIGlmIEBhdHRycy5iYWNrZ3JvdW5kX2ltYWdlX3NjYWxlX3R5cGUgaXMgJ2NlbnRlcl9jcm9wJ1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvdmVyJ1xuICAgICAgICBlbHNlIGlmIEBhdHRycy5iYWNrZ3JvdW5kX2ltYWdlX3NjYWxlX3R5cGUgaXMgJ2NlbnRlcl9pbnNpZGUnXG4gICAgICAgICAgICBAZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbidcblxuICAgICAgICAjIE1hcmdpbi5cbiAgICAgICAgaWYgQGF0dHJzLmxheW91dF9tYXJnaW4/XG4gICAgICAgICAgICBAZWwuc3R5bGUubWFyZ2luID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMubGF5b3V0X21hcmdpblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBAYXR0cnMubGF5b3V0X21hcmdpbl90b3A/XG4gICAgICAgICAgICAgICAgQGVsLnN0eWxlLm1hcmdpblRvcCA9IHV0aWxzLmZvcm1hdFVuaXQgQGF0dHJzLmxheW91dF9tYXJnaW5fdG9wXG4gICAgICAgICAgICBpZiBAYXR0cnMubGF5b3V0X21hcmdpbl9sZWZ0P1xuICAgICAgICAgICAgICAgIEBlbC5zdHlsZS5tYXJnaW5MZWZ0ID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMubGF5b3V0X21hcmdpbl9sZWZ0XG4gICAgICAgICAgICBpZiBAYXR0cnMubGF5b3V0X21hcmdpbl9yaWdodD9cbiAgICAgICAgICAgICAgICBAZWwuc3R5bGUubWFyZ2luUmlnaHQgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5sYXlvdXRfbWFyZ2luX3JpZ2h0XG4gICAgICAgICAgICBpZiBAYXR0cnMubGF5b3V0X21hcmdpbl9ib3R0b20/XG4gICAgICAgICAgICAgICAgQGVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9IHV0aWxzLmZvcm1hdFVuaXQgQGF0dHJzLmxheW91dF9tYXJnaW5fYm90dG9tXG5cbiAgICAgICAgIyBQYWRkaW5nLlxuICAgICAgICBpZiBAYXR0cnMucGFkZGluZz9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5wYWRkaW5nID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMucGFkZGluZ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBAYXR0cnMucGFkZGluZ190b3A/XG4gICAgICAgICAgICAgICAgQGVsLnN0eWxlLnBhZGRpbmdUb3AgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5wYWRkaW5nX3RvcFxuICAgICAgICAgICAgaWYgQGF0dHJzLnBhZGRpbmdfbGVmdD9cbiAgICAgICAgICAgICAgICBAZWwuc3R5bGUucGFkZGluZ0xlZnQgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5wYWRkaW5nX2xlZnRcbiAgICAgICAgICAgIGlmIEBhdHRycy5wYWRkaW5nX3JpZ2h0P1xuICAgICAgICAgICAgICAgIEBlbC5zdHlsZS5wYWRkaW5nUmlnaHQgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5wYWRkaW5nX3JpZ2h0XG4gICAgICAgICAgICBpZiBAYXR0cnMucGFkZGluZ19ib3R0b20/XG4gICAgICAgICAgICAgICAgQGVsLnN0eWxlLnBhZGRpbmdCb3R0b20gPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5wYWRkaW5nX2JvdHRvbVxuICAgICAgICBcbiAgICAgICAgIyBDb3JuZXIgcmFkaXVzLlxuICAgICAgICBpZiBAYXR0cnMuY29ybmVyX3JhZGl1cz9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJSYWRpdXMgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5jb3JuZXJfcmFkaXVzXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGlmIEBhdHRycy5jb3JuZXJfdG9wX2xlZnRfcmFkaXVzP1xuICAgICAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMuY29ybmVyX3RvcF9sZWZ0X3JhZGl1c1xuICAgICAgICAgICAgaWYgQGF0dHJzLmNvcm5lcl90b3BfcmlnaHRfcmFkaXVzP1xuICAgICAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyA9IHV0aWxzLmZvcm1hdFVuaXQgQGF0dHJzLmNvcm5lcl90b3BfcmlnaHRfcmFkaXVzXG4gICAgICAgICAgICBpZiBAYXR0cnMuY29ybmVyX2JvdHRvbV9sZWZ0X3JhZGl1cz9cbiAgICAgICAgICAgICAgICBAZWwuc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyA9IHV0aWxzLmZvcm1hdFVuaXQgQGF0dHJzLmNvcm5lcl9ib3R0b21fbGVmdF9yYWRpdXNcbiAgICAgICAgICAgIGlmIEBhdHRycy5jb3JuZXJfYm90dG9tX3JpZ2h0X3JhZGl1cz9cbiAgICAgICAgICAgICAgICBAZWwuc3R5bGUuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy5jb3JuZXJfYm90dG9tX3JpZ2h0X3JhZGl1c1xuICAgICAgICBcbiAgICAgICAgIyBDbGlwIGNoaWxkcmVuLlxuICAgICAgICBpZiBAYXR0cnMuY2xpcF9jaGlsZHJlbiBpcyBmYWxzZVxuICAgICAgICAgICAgQGVsLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnXG5cbiAgICAgICAgIyBTaGFkb3cuXG4gICAgICAgIHNoYWRvdyA9IEBnZXRTaGFkb3coKVxuXG4gICAgICAgIGlmIHNoYWRvdz9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5ib3hTaGFkb3cgPSBcIiN7c2hhZG93LmR4fXB4ICN7c2hhZG93LmR5fXB4ICN7c2hhZG93LnJhZGl1c31weCAje3NoYWRvdy5jb2xvcn1cIlxuICAgICAgICBcbiAgICAgICAgIyBTdHJva2UuXG4gICAgICAgIHN0cm9rZVN0eWxlcyA9IFsnc29saWQnLCAnZG90dGVkJywgJ2Rhc2hlZCddXG5cbiAgICAgICAgaWYgQGF0dHJzLnN0cm9rZV93aWR0aD9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJXaWR0aCA9IHV0aWxzLmZvcm1hdFVuaXQgQGF0dHJzLnN0cm9rZV93aWR0aFxuICAgICAgICBpZiBAYXR0cnMuc3Ryb2tlX2NvbG9yP1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJvcmRlckNvbG9yID0gQGF0dHJzLnN0cm9rZV9jb2xvclxuICAgICAgICBpZiBAYXR0cnMuc3Ryb2tlX3N0eWxlIGluIHN0cm9rZVN0eWxlc1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJvcmRlclN0eWxlID0gQGF0dHJzLnN0cm9rZV9zdHlsZVxuXG4gICAgICAgIGlmIEBhdHRycy5zdHJva2VfdG9wX3dpZHRoP1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJvcmRlclRvcFdpZHRoID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMuc3Ryb2tlX3RvcF93aWR0aFxuICAgICAgICBpZiBAYXR0cnMuc3Ryb2tlX3RvcF9jb2xvcj9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJUb3BDb2xvciA9IEBhdHRycy5zdHJva2VfdG9wX2NvbG9yXG4gICAgICAgIGlmIEBhdHRycy5zdHJva2VfdG9wX3N0eWxlIGluIHN0cm9rZVN0eWxlc1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJvcmRlclRvcFN0eWxlID0gQGF0dHJzLnN0cm9rZV90b3Bfc3R5bGVcblxuICAgICAgICBpZiBAYXR0cnMuc3Ryb2tlX2xlZnRfd2lkdGg/XG4gICAgICAgICAgICBAZWwuc3R5bGUuYm9yZGVyTGVmdFdpZHRoID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMuc3Ryb2tlX2xlZnRfd2lkdGhcbiAgICAgICAgaWYgQGF0dHJzLnN0cm9rZV9sZWZ0X2NvbG9yP1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJvcmRlckxlZnRDb2xvciA9IEBhdHRycy5zdHJva2VfbGVmdF9jb2xvclxuICAgICAgICBpZiBAYXR0cnMuc3Ryb2tlX2xlZnRfc3R5bGUgaW4gc3Ryb2tlU3R5bGVzXG4gICAgICAgICAgICBAZWwuc3R5bGUuYm9yZGVyTGVmdFN0eWxlID0gQGF0dHJzLnN0cm9rZV9sZWZ0X3N0eWxlXG5cbiAgICAgICAgaWYgQGF0dHJzLnN0cm9rZV9yaWdodF93aWR0aD9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJSaWdodFdpZHRoID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMuc3Ryb2tlX3JpZ2h0X3dpZHRoXG4gICAgICAgIGlmIEBhdHRycy5zdHJva2VfcmlnaHRfY29sb3I/XG4gICAgICAgICAgICBAZWwuc3R5bGUuYm9yZGVyUmlnaHRDb2xvciA9IEBhdHRycy5zdHJva2VfcmlnaHRfY29sb3JcbiAgICAgICAgaWYgQGF0dHJzLnN0cm9rZV9yaWdodF9zdHlsZSBpbiBzdHJva2VTdHlsZXNcbiAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJSaWdodFN0eWxlID0gQGF0dHJzLnN0cm9rZV9yaWdodF9zdHlsZVxuXG4gICAgICAgIGlmIEBhdHRycy5zdHJva2VfYm90dG9tX3dpZHRoP1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoID0gdXRpbHMuZm9ybWF0VW5pdCBAYXR0cnMuc3Ryb2tlX2JvdHRvbV93aWR0aFxuICAgICAgICBpZiBAYXR0cnMuc3Ryb2tlX2JvdHRvbV9jb2xvcj9cbiAgICAgICAgICAgIEBlbC5zdHlsZS5ib3JkZXJCb3R0b21Db2xvciA9IEBhdHRycy5zdHJva2VfYm90dG9tX2NvbG9yXG4gICAgICAgIGlmIEBhdHRycy5zdHJva2VfYm90dG9tX3N0eWxlIGluIHN0cm9rZVN0eWxlc1xuICAgICAgICAgICAgQGVsLnN0eWxlLmJvcmRlckJvdHRvbVN0eWxlID0gQGF0dHJzLnN0cm9rZV9ib3R0b21fc3R5bGVcbiAgICAgICAgXG4gICAgICAgICMgVHJhbnNmb3Jtcy5cbiAgICAgICAgdHJhbnNmb3JtcyA9IEBnZXRUcmFuc2Zvcm1zKClcbiAgICAgICAgXG4gICAgICAgIGlmIHRyYW5zZm9ybXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgQGVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybXMuam9pbiAnICdcbiAgICAgICAgXG4gICAgICAgICMgVHJhbnNmb3JtIG9yaWdpbi5cbiAgICAgICAgaWYgQXJyYXkuaXNBcnJheShAYXR0cnMudHJhbnNmb3JtX29yaWdpbikgYW5kIEBhdHRycy50cmFuc2Zvcm1fb3JpZ2luLmxlbmd0aCBpcyAyXG4gICAgICAgICAgICBAZWwuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gW1xuICAgICAgICAgICAgICAgIHV0aWxzLmZvcm1hdFVuaXQoQGF0dHJzLnRyYW5zZm9ybV9vcmlnaW5bMF0pLFxuICAgICAgICAgICAgICAgIHV0aWxzLmZvcm1hdFVuaXQoQGF0dHJzLnRyYW5zZm9ybV9vcmlnaW5bMV0pXG4gICAgICAgICAgICBdLmpvaW4gJyAnXG5cbiAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgZ2V0VHJhbnNmb3JtczogLT5cbiAgICAgICAgdHJhbnNmb3JtcyA9IFtdXG4gICAgICAgIHRyYW5zbGF0ZVggPSB1dGlscy5mb3JtYXRVbml0IEBhdHRycy50cmFuc2Zvcm1fdHJhbnNsYXRlX3hcbiAgICAgICAgdHJhbnNsYXRlWSA9IHV0aWxzLmZvcm1hdFVuaXQgQGF0dHJzLnRyYW5zZm9ybV90cmFuc2xhdGVfeVxuXG4gICAgICAgIGlmIHRyYW5zbGF0ZVggaXNudCAwXG4gICAgICAgICAgICB0cmFuc2Zvcm1zLnB1c2ggXCJ0cmFuc2xhdGVYKCN7dHJhbnNsYXRlWH0pXCJcbiAgICAgICAgXG4gICAgICAgIGlmICB0cmFuc2xhdGVZIGlzbnQgMFxuICAgICAgICAgICAgdHJhbnNmb3Jtcy5wdXNoIFwidHJhbnNsYXRlWSgje3RyYW5zbGF0ZVl9KVwiXG5cbiAgICAgICAgaWYgdHlwZW9mIEBhdHRycy50cmFuc2Zvcm1fcm90YXRlIGlzICdudW1iZXInIGFuZCBAYXR0cnMudHJhbnNmb3JtX3JvdGF0ZSBpc250IDBcbiAgICAgICAgICAgIHRyYW5zZm9ybXMucHVzaCBcInJvdGF0ZSgje0BhdHRycy50cmFuc2Zvcm1fcm90YXRlfWRlZylcIlxuXG4gICAgICAgIGlmIHR5cGVvZiBAYXR0cnMudHJhbnNmb3JtX3NjYWxlIGlzICdudW1iZXInIGFuZCBAYXR0cnMudHJhbnNmb3JtX3NjYWxlIGlzbnQgMVxuICAgICAgICAgICAgdHJhbnNmb3Jtcy5wdXNoIFwic2NhbGUoI3tAYXR0cnMudHJhbnNmb3JtX3NjYWxlfSlcIlxuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3Jtc1xuICAgIFxuICAgIGhhc0NhbGxiYWNrOiAtPlxuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLm9ubG9uZ2NsaWNrXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgIGVsc2UgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5vbmNsaWNrXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgIGVsc2UgaWYgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5vbmNvbnRleHRjbGlja1xuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmYWxzZVxuICAgIFxuICAgIHNldHVwQ2FsbGJhY2tzOiAtPlxuICAgICAgICBzdGFydFBvcyA9XG4gICAgICAgICAgICB4OiBudWxsXG4gICAgICAgICAgICB5OiBudWxsXG4gICAgICAgIHN0YXJ0VGltZSA9IG51bGxcbiAgICAgICAgZW5kVGltZSA9IG51bGxcbiAgICAgICAgbG9uZ2NsaWNrRGVsYXkgPSA1MDBcbiAgICAgICAgY2xpY2tEZWxheSA9IDMwMFxuICAgICAgICB0aHJlc2hvbGQgPSAyMFxuICAgICAgICBkb3duVGltZW91dCA9IG51bGxcbiAgICAgICAgaXNUb3VjaFN1cHBvcnRlZCA9ICdvbnRvdWNoZW5kJyBvZiBkb2N1bWVudFxuICAgICAgICBpc01vdXNlU3VwcG9ydGVkID0gd2luZG93Lm1hdGNoTWVkaWEoJyhwb2ludGVyOiBmaW5lKScpLm1hdGNoZXNcbiAgICAgICAgdXNlVG91Y2ggPSBpc1RvdWNoU3VwcG9ydGVkICYmICFpc01vdXNlU3VwcG9ydGVkXG4gICAgICAgIHRyaWdnZXIgPSAoZXZlbnROYW1lLCBlKSA9PlxuICAgICAgICAgICAgQHRyaWdnZXIgZXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGVcbiAgICAgICAgICAgICAgICBlbDogQGVsXG4gICAgICAgICAgICAgICAgaW5jaXRvOiBAYXR0cnNcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGRvd24gPSAoZSkgPT5cbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgICAgc3RhcnRQb3MueCA9IGUuY2xpZW50WCBvciBlLnRvdWNoZXNbMF0uY2xpZW50WFxuICAgICAgICAgICAgc3RhcnRQb3MueSA9IGUuY2xpZW50WSBvciBlLnRvdWNoZXNbMF0uY2xpZW50WVxuICAgICAgICAgICAgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcblxuICAgICAgICAgICAgaWYgZS53aGljaCBpc250IDMgYW5kIGUuYnV0dG9uIGlzbnQgMiBhbmQgdXRpbHMuaXNEZWZpbmVkU3RyIEBhdHRycy5vbmxvbmdjbGlja1xuICAgICAgICAgICAgICAgIGRvd25UaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyIEBhdHRycy5vbmxvbmdjbGljaywgZVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICwgbG9uZ2NsaWNrRGVsYXlcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIG1vdmUgPSAoZSkgLT5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCBkb3duVGltZW91dFxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgdXAgPSAoZSkgPT5cbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgICAgeCA9IGUuY2xpZW50WCBvciBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFhcbiAgICAgICAgICAgIHkgPSBlLmNsaWVudFkgb3IgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZXG4gICAgICAgICAgICBkZWx0YVggPSBNYXRoLmFicyB4IC0gc3RhcnRQb3MueFxuICAgICAgICAgICAgZGVsdGFZID0gTWF0aC5hYnMgeSAtIHN0YXJ0UG9zLnlcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICAgICAgZGVsdGEgPSBlbmRUaW1lIC0gc3RhcnRUaW1lXG5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCBkb3duVGltZW91dFxuXG4gICAgICAgICAgICBpZiBlLndoaWNoIGlzbnQgMyBhbmQgZS5idXR0b24gaXNudCAyIGFuZCBkZWx0YSA8IGNsaWNrRGVsYXlcbiAgICAgICAgICAgICAgICBpZiBkZWx0YVggPCB0aHJlc2hvbGQgYW5kIGRlbHRhWSA8IHRocmVzaG9sZFxuICAgICAgICAgICAgICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLm9uY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXIgQGF0dHJzLm9uY2xpY2ssIGVcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLmxpbmtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuIEBhdHRycy5saW5rLCAnX2JsYW5rJ1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiB1c2VUb3VjaFxuICAgICAgICAgICAgQGVsLnNldEF0dHJpYnV0ZSAnZGF0YS1kaXNhYmxlLXVzZXItc2VsZWN0JywgJydcbiAgICAgICAgICAgIEBlbC5vbnRvdWNoc3RhcnQgPSBkb3duXG4gICAgICAgICAgICBAZWwub250b3VjaG1vdmUgPSBtb3ZlXG4gICAgICAgICAgICBAZWwub250b3VjaGVuZCA9IHVwXG4gICAgICAgICAgICBAZWwub250b3VjaGNhbmNlbCA9IHVwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBlbC5vbm1vdXNlZG93biA9IGRvd25cbiAgICAgICAgICAgIEBlbC5vbm1vdXNldXAgPSB1cFxuXG4gICAgICAgIGlmIHV0aWxzLmlzRGVmaW5lZFN0ciBAYXR0cnMub25jb250ZXh0Y2xpY2tcbiAgICAgICAgICAgIEBlbC5vbmNvbnRleHRtZW51ID0gKGUpID0+XG4gICAgICAgICAgICAgICAgdHJpZ2dlciBAYXR0cnMub25jb250ZXh0Y2xpY2ssIGVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmYWxzZVxuXG4gICAgICAgIHJldHVyblxuXG4gICAgZ2V0U2hhZG93OiAtPlxuICAgICAgICBpZiB1dGlscy5pc0RlZmluZWRTdHIgQGF0dHJzLnNoYWRvd19jb2xvclxuICAgICAgICAgICAgZHggPSBpZiB0eXBlb2YgQGF0dHJzLnNoYWRvd19keCBpcyAnbnVtYmVyJyB0aGVuIEBhdHRycy5zaGFkb3dfZHggZWxzZSAwXG4gICAgICAgICAgICBkeSA9IGlmIHR5cGVvZiBAYXR0cnMuc2hhZG93X2R5IGlzICdudW1iZXInIHRoZW4gQGF0dHJzLnNoYWRvd19keSBlbHNlIDBcbiAgICAgICAgICAgIHJhZGl1cyA9IGlmIHR5cGVvZiBAYXR0cnMuc2hhZG93X3JhZGl1cyBpcyAnbnVtYmVyJyB0aGVuIEBhdHRycy5zaGFkb3dfcmFkaXVzIGVsc2UgMFxuICAgICAgICAgICAgY29sb3IgPSBAYXR0cnMuc2hhZG93X2NvbG9yXG5cbiAgICAgICAgICAgIGR4OiBkeFxuICAgICAgICAgICAgZHk6IGR5XG4gICAgICAgICAgICByYWRpdXM6IHJhZGl1c1xuICAgICAgICAgICAgY29sb3I6IGNvbG9yXG5cbk1pY3JvRXZlbnQubWl4aW4gVmlld1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXciLCIvKipcbiAqIE1pY3JvRXZlbnQgLSB0byBtYWtlIGFueSBqcyBvYmplY3QgYW4gZXZlbnQgZW1pdHRlciAoc2VydmVyIG9yIGJyb3dzZXIpXG4gKiBcbiAqIC0gcHVyZSBqYXZhc2NyaXB0IC0gc2VydmVyIGNvbXBhdGlibGUsIGJyb3dzZXIgY29tcGF0aWJsZVxuICogLSBkb250IHJlbHkgb24gdGhlIGJyb3dzZXIgZG9tc1xuICogLSBzdXBlciBzaW1wbGUgLSB5b3UgZ2V0IGl0IGltbWVkaWF0bHksIG5vIG1pc3RlcnksIG5vIG1hZ2ljIGludm9sdmVkXG4gKlxuICogLSBjcmVhdGUgYSBNaWNyb0V2ZW50RGVidWcgd2l0aCBnb29kaWVzIHRvIGRlYnVnXG4gKiAgIC0gbWFrZSBpdCBzYWZlciB0byB1c2VcbiovXG5cbnZhciBNaWNyb0V2ZW50XHQ9IGZ1bmN0aW9uKCl7fVxuTWljcm9FdmVudC5wcm90b3R5cGVcdD0ge1xuXHRiaW5kXHQ6IGZ1bmN0aW9uKGV2ZW50LCBmY3Qpe1xuXHRcdHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcblx0XHR0aGlzLl9ldmVudHNbZXZlbnRdID0gdGhpcy5fZXZlbnRzW2V2ZW50XVx0fHwgW107XG5cdFx0dGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGZjdCk7XG5cdH0sXG5cdHVuYmluZFx0OiBmdW5jdGlvbihldmVudCwgZmN0KXtcblx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0aWYoIGV2ZW50IGluIHRoaXMuX2V2ZW50cyA9PT0gZmFsc2UgIClcdHJldHVybjtcblx0XHR0aGlzLl9ldmVudHNbZXZlbnRdLnNwbGljZSh0aGlzLl9ldmVudHNbZXZlbnRdLmluZGV4T2YoZmN0KSwgMSk7XG5cdH0sXG5cdHRyaWdnZXJcdDogZnVuY3Rpb24oZXZlbnQgLyogLCBhcmdzLi4uICovKXtcblx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0aWYoIGV2ZW50IGluIHRoaXMuX2V2ZW50cyA9PT0gZmFsc2UgIClcdHJldHVybjtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fZXZlbnRzW2V2ZW50XS5sZW5ndGg7IGkrKyl7XG5cdFx0XHR0aGlzLl9ldmVudHNbZXZlbnRdW2ldLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIG1peGluIHdpbGwgZGVsZWdhdGUgYWxsIE1pY3JvRXZlbnQuanMgZnVuY3Rpb24gaW4gdGhlIGRlc3RpbmF0aW9uIG9iamVjdFxuICpcbiAqIC0gcmVxdWlyZSgnTWljcm9FdmVudCcpLm1peGluKEZvb2Jhcikgd2lsbCBtYWtlIEZvb2JhciBhYmxlIHRvIHVzZSBNaWNyb0V2ZW50XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRoZSBvYmplY3Qgd2hpY2ggd2lsbCBzdXBwb3J0IE1pY3JvRXZlbnRcbiovXG5NaWNyb0V2ZW50Lm1peGluXHQ9IGZ1bmN0aW9uKGRlc3RPYmplY3Qpe1xuXHR2YXIgcHJvcHNcdD0gWydiaW5kJywgJ3VuYmluZCcsICd0cmlnZ2VyJ107XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkgKyspe1xuXHRcdGRlc3RPYmplY3QucHJvdG90eXBlW3Byb3BzW2ldXVx0PSBNaWNyb0V2ZW50LnByb3RvdHlwZVtwcm9wc1tpXV07XG5cdH1cbn1cblxuLy8gZXhwb3J0IGluIGNvbW1vbiBqc1xuaWYoIHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgKCdleHBvcnRzJyBpbiBtb2R1bGUpKXtcblx0bW9kdWxlLmV4cG9ydHNcdD0gTWljcm9FdmVudFxufVxuIiwidmFyIF9leHRlbmRzPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGUpe2Zvcih2YXIgdD0xO3Q8YXJndW1lbnRzLmxlbmd0aDt0Kyspe3ZhciBuPWFyZ3VtZW50c1t0XTtmb3IodmFyIG8gaW4gbilPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobixvKSYmKGVbb109bltvXSl9cmV0dXJuIGV9LF90eXBlb2Y9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX07IWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09PShcInVuZGVmaW5lZFwiPT10eXBlb2YgZXhwb3J0cz9cInVuZGVmaW5lZFwiOl90eXBlb2YoZXhwb3J0cykpJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPXQoKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKHQpOmUuTGF6eUxvYWQ9dCgpfSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9e2VsZW1lbnRzX3NlbGVjdG9yOlwiaW1nXCIsY29udGFpbmVyOndpbmRvdyx0aHJlc2hvbGQ6MzAwLHRocm90dGxlOjE1MCxkYXRhX3NyYzpcInNyY1wiLGRhdGFfc3Jjc2V0Olwic3Jjc2V0XCIsY2xhc3NfbG9hZGluZzpcImxvYWRpbmdcIixjbGFzc19sb2FkZWQ6XCJsb2FkZWRcIixjbGFzc19lcnJvcjpcImVycm9yXCIsY2xhc3NfaW5pdGlhbDpcImluaXRpYWxcIixza2lwX2ludmlzaWJsZTohMCxjYWxsYmFja19sb2FkOm51bGwsY2FsbGJhY2tfZXJyb3I6bnVsbCxjYWxsYmFja19zZXQ6bnVsbCxjYWxsYmFja19wcm9jZXNzZWQ6bnVsbCxjYWxsYmFja19lbnRlcjpudWxsfSx0PSEoXCJvbnNjcm9sbFwiaW4gd2luZG93KXx8L2dsZWJvdC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxuPWZ1bmN0aW9uKGUsdCl7ZSYmZSh0KX0sbz1mdW5jdGlvbihlKXtyZXR1cm4gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3Ard2luZG93LnBhZ2VZT2Zmc2V0LWUub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50VG9wfSxpPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4odD09PXdpbmRvdz93aW5kb3cuaW5uZXJIZWlnaHQrd2luZG93LnBhZ2VZT2Zmc2V0Om8odCkrdC5vZmZzZXRIZWlnaHQpPD1vKGUpLW59LHM9ZnVuY3Rpb24oZSl7cmV0dXJuIGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCt3aW5kb3cucGFnZVhPZmZzZXQtZS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRMZWZ0fSxyPWZ1bmN0aW9uKGUsdCxuKXt2YXIgbz13aW5kb3cuaW5uZXJXaWR0aDtyZXR1cm4odD09PXdpbmRvdz9vK3dpbmRvdy5wYWdlWE9mZnNldDpzKHQpK28pPD1zKGUpLW59LGw9ZnVuY3Rpb24oZSx0LG4pe3JldHVybih0PT09d2luZG93P3dpbmRvdy5wYWdlWU9mZnNldDpvKHQpKT49byhlKStuK2Uub2Zmc2V0SGVpZ2h0fSxhPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4odD09PXdpbmRvdz93aW5kb3cucGFnZVhPZmZzZXQ6cyh0KSk+PXMoZSkrbitlLm9mZnNldFdpZHRofSxjPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4hKGkoZSx0LG4pfHxsKGUsdCxuKXx8cihlLHQsbil8fGEoZSx0LG4pKX0sdT1mdW5jdGlvbihlLHQpe3ZhciBuLG89bmV3IGUodCk7dHJ5e249bmV3IEN1c3RvbUV2ZW50KFwiTGF6eUxvYWQ6OkluaXRpYWxpemVkXCIse2RldGFpbDp7aW5zdGFuY2U6b319KX1jYXRjaChlKXsobj1kb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpKS5pbml0Q3VzdG9tRXZlbnQoXCJMYXp5TG9hZDo6SW5pdGlhbGl6ZWRcIiwhMSwhMSx7aW5zdGFuY2U6b30pfXdpbmRvdy5kaXNwYXRjaEV2ZW50KG4pfSxkPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUuZ2V0QXR0cmlidXRlKFwiZGF0YS1cIit0KX0saD1mdW5jdGlvbihlLHQsbil7cmV0dXJuIGUuc2V0QXR0cmlidXRlKFwiZGF0YS1cIit0LG4pfSxfPWZ1bmN0aW9uKGUsdCl7dmFyIG49ZS5wYXJlbnROb2RlO2lmKFwiUElDVFVSRVwiPT09bi50YWdOYW1lKWZvcih2YXIgbz0wO288bi5jaGlsZHJlbi5sZW5ndGg7bysrKXt2YXIgaT1uLmNoaWxkcmVuW29dO2lmKFwiU09VUkNFXCI9PT1pLnRhZ05hbWUpe3ZhciBzPWQoaSx0KTtzJiZpLnNldEF0dHJpYnV0ZShcInNyY3NldFwiLHMpfX19LGY9ZnVuY3Rpb24oZSx0LG4pe3ZhciBvPWUudGFnTmFtZSxpPWQoZSxuKTtpZihcIklNR1wiPT09byl7XyhlLHQpO3ZhciBzPWQoZSx0KTtyZXR1cm4gcyYmZS5zZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIixzKSx2b2lkKGkmJmUuc2V0QXR0cmlidXRlKFwic3JjXCIsaSkpfVwiSUZSQU1FXCIhPT1vP2kmJihlLnN0eWxlLmJhY2tncm91bmRJbWFnZT0ndXJsKFwiJytpKydcIiknKTppJiZlLnNldEF0dHJpYnV0ZShcInNyY1wiLGkpfSxwPVwiY2xhc3NMaXN0XCJpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKSxtPWZ1bmN0aW9uKGUsdCl7cD9lLmNsYXNzTGlzdC5hZGQodCk6ZS5jbGFzc05hbWUrPShlLmNsYXNzTmFtZT9cIiBcIjpcIlwiKSt0fSxnPWZ1bmN0aW9uKGUsdCl7cD9lLmNsYXNzTGlzdC5yZW1vdmUodCk6ZS5jbGFzc05hbWU9ZS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXHMrKVwiK3QrXCIoXFxcXHMrfCQpXCIpLFwiIFwiKS5yZXBsYWNlKC9eXFxzKy8sXCJcIikucmVwbGFjZSgvXFxzKyQvLFwiXCIpfSx2PWZ1bmN0aW9uKHQpe3RoaXMuX3NldHRpbmdzPV9leHRlbmRzKHt9LGUsdCksdGhpcy5fcXVlcnlPcmlnaW5Ob2RlPXRoaXMuX3NldHRpbmdzLmNvbnRhaW5lcj09PXdpbmRvdz9kb2N1bWVudDp0aGlzLl9zZXR0aW5ncy5jb250YWluZXIsdGhpcy5fcHJldmlvdXNMb29wVGltZT0wLHRoaXMuX2xvb3BUaW1lb3V0PW51bGwsdGhpcy5fYm91bmRIYW5kbGVTY3JvbGw9dGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKSx0aGlzLl9pc0ZpcnN0TG9vcD0hMCx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHRoaXMuX2JvdW5kSGFuZGxlU2Nyb2xsKSx0aGlzLnVwZGF0ZSgpfTt2LnByb3RvdHlwZT17X3JldmVhbDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLl9zZXR0aW5ncyxvPWZ1bmN0aW9uIG8oKXt0JiYoZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLGkpLGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsbyksZyhlLHQuY2xhc3NfbG9hZGluZyksbShlLHQuY2xhc3NfZXJyb3IpLG4odC5jYWxsYmFja19lcnJvcixlKSl9LGk9ZnVuY3Rpb24gaSgpe3QmJihnKGUsdC5jbGFzc19sb2FkaW5nKSxtKGUsdC5jbGFzc19sb2FkZWQpLGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixpKSxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLG8pLG4odC5jYWxsYmFja19sb2FkLGUpKX07bih0LmNhbGxiYWNrX2VudGVyLGUpLFwiSU1HXCIhPT1lLnRhZ05hbWUmJlwiSUZSQU1FXCIhPT1lLnRhZ05hbWV8fChlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsaSksZS5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixvKSxtKGUsdC5jbGFzc19sb2FkaW5nKSksZihlLHQuZGF0YV9zcmNzZXQsdC5kYXRhX3NyYyksbih0LmNhbGxiYWNrX3NldCxlKX0sX2xvb3BUaHJvdWdoRWxlbWVudHM6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9zZXR0aW5ncyxvPXRoaXMuX2VsZW1lbnRzLGk9bz9vLmxlbmd0aDowLHM9dm9pZCAwLHI9W10sbD10aGlzLl9pc0ZpcnN0TG9vcDtmb3Iocz0wO3M8aTtzKyspe3ZhciBhPW9bc107ZS5za2lwX2ludmlzaWJsZSYmbnVsbD09PWEub2Zmc2V0UGFyZW50fHwodHx8YyhhLGUuY29udGFpbmVyLGUudGhyZXNob2xkKSkmJihsJiZtKGEsZS5jbGFzc19pbml0aWFsKSx0aGlzLl9yZXZlYWwoYSksci5wdXNoKHMpLGgoYSxcIndhcy1wcm9jZXNzZWRcIiwhMCkpfWZvcig7ci5sZW5ndGg7KW8uc3BsaWNlKHIucG9wKCksMSksbihlLmNhbGxiYWNrX3Byb2Nlc3NlZCxvLmxlbmd0aCk7MD09PWkmJnRoaXMuX3N0b3BTY3JvbGxIYW5kbGVyKCksbCYmKHRoaXMuX2lzRmlyc3RMb29wPSExKX0sX3B1cmdlRWxlbWVudHM6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl9lbGVtZW50cyx0PWUubGVuZ3RoLG49dm9pZCAwLG89W107Zm9yKG49MDtuPHQ7bisrKXt2YXIgaT1lW25dO2QoaSxcIndhcy1wcm9jZXNzZWRcIikmJm8ucHVzaChuKX1mb3IoO28ubGVuZ3RoPjA7KWUuc3BsaWNlKG8ucG9wKCksMSl9LF9zdGFydFNjcm9sbEhhbmRsZXI6ZnVuY3Rpb24oKXt0aGlzLl9pc0hhbmRsaW5nU2Nyb2xsfHwodGhpcy5faXNIYW5kbGluZ1Njcm9sbD0hMCx0aGlzLl9zZXR0aW5ncy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLHRoaXMuX2JvdW5kSGFuZGxlU2Nyb2xsKSl9LF9zdG9wU2Nyb2xsSGFuZGxlcjpmdW5jdGlvbigpe3RoaXMuX2lzSGFuZGxpbmdTY3JvbGwmJih0aGlzLl9pc0hhbmRsaW5nU2Nyb2xsPSExLHRoaXMuX3NldHRpbmdzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsdGhpcy5fYm91bmRIYW5kbGVTY3JvbGwpKX0saGFuZGxlU2Nyb2xsOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fc2V0dGluZ3MudGhyb3R0bGU7aWYoMCE9PWUpe3ZhciB0PURhdGUubm93KCksbj1lLSh0LXRoaXMuX3ByZXZpb3VzTG9vcFRpbWUpO248PTB8fG4+ZT8odGhpcy5fbG9vcFRpbWVvdXQmJihjbGVhclRpbWVvdXQodGhpcy5fbG9vcFRpbWVvdXQpLHRoaXMuX2xvb3BUaW1lb3V0PW51bGwpLHRoaXMuX3ByZXZpb3VzTG9vcFRpbWU9dCx0aGlzLl9sb29wVGhyb3VnaEVsZW1lbnRzKCkpOnRoaXMuX2xvb3BUaW1lb3V0fHwodGhpcy5fbG9vcFRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuX3ByZXZpb3VzTG9vcFRpbWU9RGF0ZS5ub3coKSx0aGlzLl9sb29wVGltZW91dD1udWxsLHRoaXMuX2xvb3BUaHJvdWdoRWxlbWVudHMoKX0uYmluZCh0aGlzKSxuKSl9ZWxzZSB0aGlzLl9sb29wVGhyb3VnaEVsZW1lbnRzKCl9LHVwZGF0ZTpmdW5jdGlvbigpe3RoaXMuX2VsZW1lbnRzPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX3F1ZXJ5T3JpZ2luTm9kZS5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuX3NldHRpbmdzLmVsZW1lbnRzX3NlbGVjdG9yKSksdGhpcy5fcHVyZ2VFbGVtZW50cygpLHRoaXMuX2xvb3BUaHJvdWdoRWxlbWVudHMoKSx0aGlzLl9zdGFydFNjcm9sbEhhbmRsZXIoKX0sZGVzdHJveTpmdW5jdGlvbigpe3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5fYm91bmRIYW5kbGVTY3JvbGwpLHRoaXMuX2xvb3BUaW1lb3V0JiYoY2xlYXJUaW1lb3V0KHRoaXMuX2xvb3BUaW1lb3V0KSx0aGlzLl9sb29wVGltZW91dD1udWxsKSx0aGlzLl9zdG9wU2Nyb2xsSGFuZGxlcigpLHRoaXMuX2VsZW1lbnRzPW51bGwsdGhpcy5fcXVlcnlPcmlnaW5Ob2RlPW51bGwsdGhpcy5fc2V0dGluZ3M9bnVsbH19O3ZhciB3PXdpbmRvdy5sYXp5TG9hZE9wdGlvbnM7cmV0dXJuIHcmJmZ1bmN0aW9uKGUsdCl7dmFyIG49dC5sZW5ndGg7aWYobilmb3IodmFyIG89MDtvPG47bysrKXUoZSx0W29dKTtlbHNlIHUoZSx0KX0odix3KSx2fSk7Il19
});

var Incito, MicroEvent$10, Viewer$1;

Incito = incito;

MicroEvent$10 = microevent;

Viewer$1 = function () {
  function Viewer(el) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Viewer);

    var trigger;
    this.el = el;
    this.options = options;
    this.incito = new Incito(this.el, {
      incito: this.options.incito
    });
    trigger = this.incito.trigger;
    this.incito.trigger = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      trigger.apply(_this.incito, args);
      _this.trigger.apply(_this, args);
    };
    return;
  }

  createClass(Viewer, [{
    key: 'start',
    value: function start() {
      this.incito.start();
      this._trackEvent({
        type: 'x-incito-publication-opened',
        properties: {}
      });
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.incito.destroy();
    }
  }, {
    key: '_trackEvent',
    value: function _trackEvent(e) {
      var eventTracker, key, properties, ref, type, value;
      type = e.type;
      properties = {
        id: this.options.id
      };
      eventTracker = this.options.eventTracker;
      ref = e.properties;
      for (key in ref) {
        value = ref[key];
        properties[key] = value;
      }
      if (eventTracker != null) {
        return eventTracker.trackEvent(type, properties);
      }
    }
  }]);
  return Viewer;
}();

MicroEvent$10.mixin(Viewer$1);

var viewer$1 = Viewer$1;

var Controls$1;

var controls$1 = Controls$1 = function () {
  function Controls(viewer) {
    var _this = this;

    classCallCheck(this, Controls);

    this.viewer = viewer;
    this.progressDelay = 1500;
    this.progressEl = this.viewer.el.querySelector('.sgn-incito__progress');
    if (this.progressEl != null) {
      this.setupProgress();
    }
    this.viewer.bind('destroyed', function () {
      clearInterval(_this.progressInterval);
    });
    return;
  }

  createClass(Controls, [{
    key: 'setupProgress',
    value: function setupProgress() {
      var _this2 = this;

      this.progressInterval = setInterval(function () {
        var docHeight, progress, scrollTop, winHeight;
        scrollTop = window.scrollY;
        winHeight = window.innerHeight;
        docHeight = document.body.clientHeight;
        progress = Math.round((scrollTop + winHeight) / docHeight * 100);
        if (scrollTop < 300) {
          _this2.progressEl.style.opacity = 0;
        } else if (scrollTop >= docHeight - winHeight) {
          _this2.progressEl.textContent = '100%';
          _this2.progressEl.style.opacity = 1;
        } else {
          _this2.progressEl.textContent = progress + '%';
          _this2.progressEl.style.opacity = 1;
        }
      }, this.progressDelay);
    }
  }]);
  return Controls;
}();

var incito$1 = "query GetIncitoPublication($id: ID!, $deviceCategory: DeviceCategory!, $orientation: Orientation!, $pixelRatio: Float!, $pointer: Pointer!, $maxWidth: Int!, $versionsSupported: [String!]!) {\n  node(id: $id) {\n    ... on IncitoPublication {\n      id\n      incito(deviceCategory: $deviceCategory, orientation: $orientation, pixelRatio: $pixelRatio, pointer: $pointer, maxWidth: $maxWidth, versionsSupported: $versionsSupported)\n    }\n  }\n}";

var incito$2 = Object.freeze({
	default: incito$1
});

var require$$3 = ( incito$2 && incito$1 ) || incito$2;

var Bootstrapper$1, Controls$2, SGN$17, schema, util$2;

util$2 = util_1;

SGN$17 = core;

Controls$2 = controls$1;

schema = require$$3;

var bootstrapper$1 = Bootstrapper$1 = function () {
  function Bootstrapper() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Bootstrapper);

    this.options = options;
    this.deviceCategory = this.getDeviceCategory();
    this.pixelRatio = this.getPixelRatio();
    this.pointer = this.getPointer();
    this.orientation = this.getOrientation();
    this.maxWidth = this.getMaxWidth();
    this.versionsSupported = ['1.0.0'];
    return;
  }

  createClass(Bootstrapper, [{
    key: 'getDeviceCategory',
    value: function getDeviceCategory() {
      return util$2.getDeviceCategory();
    }
  }, {
    key: 'getPixelRatio',
    value: function getPixelRatio() {
      return window.devicePixelRatio || 1;
    }
  }, {
    key: 'getPointer',
    value: function getPointer() {
      return util$2.getPointer();
    }
  }, {
    key: 'getOrientation',
    value: function getOrientation() {
      var orientation;
      orientation = util$2.getOrientation(window.innerWidth, window.innerHeight);
      if (orientation === 'quadratic') {
        orientation = 'horizontal';
      }
      return orientation;
    }
  }, {
    key: 'getMaxWidth',
    value: function getMaxWidth() {
      return this.options.el.offsetWidth;
    }
  }, {
    key: 'fetch',
    value: function fetch(callback) {
      var _this = this;

      var data;
      data = SGN$17.storage.session.get('incito-' + this.options.id);
      if (data != null) {
        return callback(null, data);
      }
      SGN$17.GraphKit.request({
        query: schema,
        operationName: 'GetIncitoPublication',
        variables: {
          id: this.options.id,
          deviceCategory: 'DEVICE_CATEGORY_' + this.deviceCategory.toUpperCase(),
          pixelRatio: this.pixelRatio,
          pointer: 'POINTER_' + this.pointer.toUpperCase(),
          orientation: 'ORIENTATION_' + this.orientation.toUpperCase(),
          maxWidth: this.maxWidth,
          versionsSupported: this.versionsSupported
        }
      }, function (err, data) {
        if (err != null) {
          callback(err);
        } else {
          callback(null, data);
          SGN$17.storage.session.set('incito-' + _this.options.id, data);
        }
      });
    }
  }, {
    key: 'createViewer',
    value: function createViewer(data) {
      var controls, viewer;
      if (data.incito == null) {
        throw util$2.error(new Error(), 'you need to supply valid Incito to create a viewer');
      }
      viewer = new SGN$17.IncitoPublicationKit.Viewer(this.options.el, {
        id: this.options.id,
        incito: data.incito,
        eventTracker: this.options.eventTracker
      });
      controls = new Controls$2(viewer);
      return viewer;
    }
  }]);
  return Bootstrapper;
}();

var incitoPublication = {
  Viewer: viewer$1,
  Bootstrapper: bootstrapper$1
};

var Mustache$2, OfferDetails;

Mustache$2 = mustache;

var offerDetails = OfferDetails = function () {
  function OfferDetails() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, OfferDetails);

    this.options = options;
    this.el = document.createElement('div');
    this.resizeListener = this.resize.bind(this);
    return;
  }

  createClass(OfferDetails, [{
    key: 'render',
    value: function render() {
      this.el.className = 'sgn-offer-details';
      this.el.setAttribute('tabindex', -1);
      this.el.innerHTML = Mustache$2.render(this.options.template, this.options.view);
      this.position();
      return this;
    }
  }, {
    key: 'show',
    value: function show() {
      this.el.className += ' in';
      window.addEventListener('resize', this.resizeListener, false);
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      window.removeEventListener('resize', this.resizeListener);
      this.el.parentNode.removeChild(this.el);
    }
  }, {
    key: 'position',
    value: function position() {
      var left, rect, top, width;
      rect = this.options.el.getBoundingClientRect();
      top = window.pageYOffset + rect.top + this.options.el.offsetHeight;
      left = window.pageXOffset + rect.left;
      width = this.options.el.offsetWidth;
      this.el.style.top = top + 'px';
      this.el.style.left = left + 'px';
      this.el.style.width = width + 'px';
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.position();
    }
  }]);
  return OfferDetails;
}();

var gator = createCommonjsModule(function (module) {
/**
 * Copyright 2014 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * GATOR.JS
 * Simple Event Delegation
 *
 * @version 1.2.4
 *
 * Compatible with IE 9+, FF 3.6+, Safari 5+, Chrome
 *
 * Include legacy.js for compatibility with older browsers
 *
 *             .-._   _ _ _ _ _ _ _ _
 *  .-''-.__.-'00  '-' ' ' ' ' ' ' ' '-.
 * '.___ '    .   .--_'-' '-' '-' _'-' '._
 *  V: V 'vv-'   '_   '.       .'  _..' '.'.
 *    '=.____.=_.--'   :_.__.__:_   '.   : :
 *            (((____.-'        '-.  /   : :
 *                              (((-'\ .' /
 *                            _____..'  .'
 *                           '-._____.-'
 */
(function() {
    var _matcher,
        _level = 0,
        _id = 0,
        _handlers = {},
        _gatorInstances = {};

    function _addEvent(gator, type, callback) {

        // blur and focus do not bubble up but if you use event capturing
        // then you will get them
        var useCapture = type == 'blur' || type == 'focus';
        gator.element.addEventListener(type, callback, useCapture);
    }

    function _cancel(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * returns function to use for determining if an element
     * matches a query selector
     *
     * @returns {Function}
     */
    function _getMatcher(element) {
        if (_matcher) {
            return _matcher;
        }

        if (element.matches) {
            _matcher = element.matches;
            return _matcher;
        }

        if (element.webkitMatchesSelector) {
            _matcher = element.webkitMatchesSelector;
            return _matcher;
        }

        if (element.mozMatchesSelector) {
            _matcher = element.mozMatchesSelector;
            return _matcher;
        }

        if (element.msMatchesSelector) {
            _matcher = element.msMatchesSelector;
            return _matcher;
        }

        if (element.oMatchesSelector) {
            _matcher = element.oMatchesSelector;
            return _matcher;
        }

        // if it doesn't match a native browser method
        // fall back to the gator function
        _matcher = Gator.matchesSelector;
        return _matcher;
    }

    /**
     * determines if the specified element matches a given selector
     *
     * @param {Node} element - the element to compare against the selector
     * @param {string} selector
     * @param {Node} boundElement - the element the listener was attached to
     * @returns {void|Node}
     */
    function _matchesSelector(element, selector, boundElement) {

        // no selector means this event was bound directly to this element
        if (selector == '_root') {
            return boundElement;
        }

        // if we have moved up to the element you bound the event to
        // then we have come too far
        if (element === boundElement) {
            return;
        }

        // if this is a match then we are done!
        if (_getMatcher(element).call(element, selector)) {
            return element;
        }

        // if this element did not match but has a parent we should try
        // going up the tree to see if any of the parent elements match
        // for example if you are looking for a click on an <a> tag but there
        // is a <span> inside of the a tag that it is the target,
        // it should still work
        if (element.parentNode) {
            _level++;
            return _matchesSelector(element.parentNode, selector, boundElement);
        }
    }

    function _addHandler(gator, event, selector, callback) {
        if (!_handlers[gator.id]) {
            _handlers[gator.id] = {};
        }

        if (!_handlers[gator.id][event]) {
            _handlers[gator.id][event] = {};
        }

        if (!_handlers[gator.id][event][selector]) {
            _handlers[gator.id][event][selector] = [];
        }

        _handlers[gator.id][event][selector].push(callback);
    }

    function _removeHandler(gator, event, selector, callback) {

        // if there are no events tied to this element at all
        // then don't do anything
        if (!_handlers[gator.id]) {
            return;
        }

        // if there is no event type specified then remove all events
        // example: Gator(element).off()
        if (!event) {
            for (var type in _handlers[gator.id]) {
                if (_handlers[gator.id].hasOwnProperty(type)) {
                    _handlers[gator.id][type] = {};
                }
            }
            return;
        }

        // if no callback or selector is specified remove all events of this type
        // example: Gator(element).off('click')
        if (!callback && !selector) {
            _handlers[gator.id][event] = {};
            return;
        }

        // if a selector is specified but no callback remove all events
        // for this selector
        // example: Gator(element).off('click', '.sub-element')
        if (!callback) {
            delete _handlers[gator.id][event][selector];
            return;
        }

        // if we have specified an event type, selector, and callback then we
        // need to make sure there are callbacks tied to this selector to
        // begin with.  if there aren't then we can stop here
        if (!_handlers[gator.id][event][selector]) {
            return;
        }

        // if there are then loop through all the callbacks and if we find
        // one that matches remove it from the array
        for (var i = 0; i < _handlers[gator.id][event][selector].length; i++) {
            if (_handlers[gator.id][event][selector][i] === callback) {
                _handlers[gator.id][event][selector].splice(i, 1);
                break;
            }
        }
    }

    function _handleEvent(id, e, type) {
        if (!_handlers[id][type]) {
            return;
        }

        var target = e.target || e.srcElement,
            selector,
            match,
            matches = {},
            i = 0,
            j = 0;

        // find all events that match
        _level = 0;
        for (selector in _handlers[id][type]) {
            if (_handlers[id][type].hasOwnProperty(selector)) {
                match = _matchesSelector(target, selector, _gatorInstances[id].element);

                if (match && Gator.matchesEvent(type, _gatorInstances[id].element, match, selector == '_root', e)) {
                    _level++;
                    _handlers[id][type][selector].match = match;
                    matches[_level] = _handlers[id][type][selector];
                }
            }
        }

        // stopPropagation() fails to set cancelBubble to true in Webkit
        // @see http://code.google.com/p/chromium/issues/detail?id=162270
        e.stopPropagation = function() {
            e.cancelBubble = true;
        };

        for (i = 0; i <= _level; i++) {
            if (matches[i]) {
                for (j = 0; j < matches[i].length; j++) {
                    if (matches[i][j].call(matches[i].match, e) === false) {
                        Gator.cancel(e);
                        return;
                    }

                    if (e.cancelBubble) {
                        return;
                    }
                }
            }
        }
    }

    /**
     * binds the specified events to the element
     *
     * @param {string|Array} events
     * @param {string} selector
     * @param {Function} callback
     * @param {boolean=} remove
     * @returns {Object}
     */
    function _bind(events, selector, callback, remove) {

        // fail silently if you pass null or undefined as an alement
        // in the Gator constructor
        if (!this.element) {
            return;
        }

        if (!(events instanceof Array)) {
            events = [events];
        }

        if (!callback && typeof(selector) == 'function') {
            callback = selector;
            selector = '_root';
        }

        var id = this.id,
            i;

        function _getGlobalCallback(type) {
            return function(e) {
                _handleEvent(id, e, type);
            };
        }

        for (i = 0; i < events.length; i++) {
            if (remove) {
                _removeHandler(this, events[i], selector, callback);
                continue;
            }

            if (!_handlers[id] || !_handlers[id][events[i]]) {
                Gator.addEvent(this, events[i], _getGlobalCallback(events[i]));
            }

            _addHandler(this, events[i], selector, callback);
        }

        return this;
    }

    /**
     * Gator object constructor
     *
     * @param {Node} element
     */
    function Gator(element, id) {

        // called as function
        if (!(this instanceof Gator)) {
            // only keep one Gator instance per node to make sure that
            // we don't create a ton of new objects if you want to delegate
            // multiple events from the same node
            //
            // for example: Gator(document).on(...
            for (var key in _gatorInstances) {
                if (_gatorInstances[key].element === element) {
                    return _gatorInstances[key];
                }
            }

            _id++;
            _gatorInstances[_id] = new Gator(element, _id);

            return _gatorInstances[_id];
        }

        this.element = element;
        this.id = id;
    }

    /**
     * adds an event
     *
     * @param {string|Array} events
     * @param {string} selector
     * @param {Function} callback
     * @returns {Object}
     */
    Gator.prototype.on = function(events, selector, callback) {
        return _bind.call(this, events, selector, callback);
    };

    /**
     * removes an event
     *
     * @param {string|Array} events
     * @param {string} selector
     * @param {Function} callback
     * @returns {Object}
     */
    Gator.prototype.off = function(events, selector, callback) {
        return _bind.call(this, events, selector, callback, true);
    };

    Gator.matchesSelector = function() {};
    Gator.cancel = _cancel;
    Gator.addEvent = _addEvent;
    Gator.matchesEvent = function() {
        return true;
    };

    if ('object' !== 'undefined' && module.exports) {
        module.exports = Gator;
    }

    window.Gator = Gator;
}) ();
});

var Gator, MicroEvent$11, Mustache$3, Popover, keyCodes$2, template;

MicroEvent$11 = microevent;

Gator = gator;

Mustache$3 = mustache;

keyCodes$2 = keyCodes;

template = "<div class=\"sgn-popover__background\" data-close></div>\n<div class=\"sgn-popover__menu\">\n    {{#header}}\n        <div class=\"sgn-popover__header\">{{header}}</div>\n    {{/header}}\n    <div class=\"sgn-popover__content\">\n        <ul>\n            {{#singleChoiceItems}}\n                <li data-index=\"{{index}}\">\n                    <p class=\"sgn-popover-item__title\">{{item.title}}</p>\n                    {{#item.subtitle}}\n                        <p class=\"sgn-popover-item__subtitle\">{{item.subtitle}}</p>\n                    {{/item.subtitle}}\n                </li>\n            {{/singleChoiceItems}}\n        </ul>\n    </div>\n</div>";

Popover = function () {
  function Popover() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Popover);

    this.options = options;
    this.el = document.createElement('div');
    this.backgroundEl = document.createElement('div');
    this.resizeListener = this.resize.bind(this);
    this.scrollListener = this.scroll.bind(this);
    return;
  }

  createClass(Popover, [{
    key: 'render',
    value: function render() {
      var header, ref, trigger, view, width;
      width = (ref = this.options.width) != null ? ref : 100;
      header = this.options.header;
      if (this.options.template != null) {
        template = this.options.template;
      }
      trigger = this.trigger.bind(this);
      view = {
        header: header,
        singleChoiceItems: this.options.singleChoiceItems.map(function (item, i) {
          return {
            item: item,
            index: i
          };
        })
      };
      this.el.className = 'sgn-popover';
      this.el.setAttribute('tabindex', -1);
      this.el.innerHTML = Mustache$3.render(template, view);
      this.position();
      this.addEventListeners();
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      Gator(this.el).off();
      window.removeEventListener('resize', this.resizeListener);
      window.removeEventListener('scroll', this.scrollListener);
      if (this.el.parentNode != null) {
        this.el.parentNode.removeChild(this.el);
        this.trigger('destroyed');
      }
    }
  }, {
    key: 'position',
    value: function position() {
      var boundingRect, height, left, menuEl, parentHeight, parentWidth, top, width;
      top = this.options.y;
      left = this.options.x;
      menuEl = this.el.querySelector('.sgn-popover__menu');
      width = menuEl.offsetWidth;
      height = menuEl.offsetHeight;
      parentWidth = this.el.parentNode.offsetWidth;
      parentHeight = this.el.parentNode.offsetHeight;
      boundingRect = this.el.parentNode.getBoundingClientRect();
      top -= boundingRect.top;
      left -= boundingRect.left;
      top -= window.pageYOffset;
      left -= window.pageXOffset;
      if (top + height > parentHeight) {
        menuEl.style.top = parentHeight - height + 'px';
      } else {
        menuEl.style.top = top + 'px';
      }
      if (left + width > parentWidth) {
        menuEl.style.left = parentWidth - width + 'px';
      } else {
        menuEl.style.left = left + 'px';
      }
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      var _this = this;

      var trigger;
      trigger = this.trigger.bind(this);
      this.el.addEventListener('keyup', this.keyUp.bind(this));
      Gator(this.el).on('click', '[data-index]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        trigger('selected', {
          index: +this.getAttribute('data-index')
        });
      });
      Gator(this.el).on('click', '[data-close]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _this.destroy();
      });
      Gator(this.el).on('click', '.sgn-popover__menu', function (e) {
        e.stopPropagation();
      });
      window.addEventListener('resize', this.resizeListener, false);
      window.addEventListener('scroll', this.scrollListener, false);
    }
  }, {
    key: 'keyUp',
    value: function keyUp(e) {
      if (e.keyCode === keyCodes$2.ESC) {
        this.destroy();
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.destroy();
    }
  }, {
    key: 'scroll',
    value: function scroll() {
      this.destroy();
    }
  }]);
  return Popover;
}();

MicroEvent$11.mixin(Popover);

var popover = Popover;

var Popover$1;

Popover$1 = popover;

var singleChoicePopover = function singleChoicePopover(ctx, callback) {
  var items, popover$$1;
  items = ctx.items;
  popover$$1 = null;
  if (items.length === 1) {
    callback(items[0]);
  } else if (items.length > 1) {
    popover$$1 = new Popover$1({
      header: ctx.header,
      x: ctx.x,
      y: ctx.y,
      singleChoiceItems: items
    });
    popover$$1.bind('selected', function (e) {
      callback(items[e.index]);
      popover$$1.destroy();
    });
    popover$$1.bind('destroyed', function () {
      ctx.el.focus();
    });
    ctx.el.appendChild(popover$$1.el);
    popover$$1.render().el.focus();
  }
  return {
    destroy: function destroy() {
      if (popover$$1 != null) {
        popover$$1.destroy();
      }
    }
  };
};

var coreUi = {
  OfferDetails: offerDetails,
  Popover: popover,
  singleChoicePopover: singleChoicePopover
};

var SGN$18, appKey, config$2, scriptEl, session$2, trackId;

SGN$18 = sgn;

// Expose storage backends.
SGN$18.storage = {
  local: clientLocal,
  session: clientSession,
  cookie: clientCookie
};

// Expose request handler.
SGN$18.request = browser$1;

// Expose the different kits.
SGN$18.AssetsKit = assets;

SGN$18.EventsKit = events;

SGN$18.GraphKit = graph;

SGN$18.CoreKit = core$1;

SGN$18.PagedPublicationKit = pagedPublication;

SGN$18.IncitoPublicationKit = incitoPublication;

SGN$18.CoreUIKit = coreUi;

// Set the core session from the cookie store if possible.
session$2 = SGN$18.storage.cookie.get('session');

if ((typeof session$2 === 'undefined' ? 'undefined' : _typeof(session$2)) === 'object') {
  SGN$18.config.set({
    coreSessionToken: session$2.token,
    coreSessionClientId: session$2.client_id
  });
}

SGN$18.client = function () {
  var firstOpen, id;
  id = SGN$18.storage.local.get('client-id');
  id = id != null ? id.data : void 0;
  firstOpen = id == null;
  if (firstOpen) {
    id = SGN$18.util.uuid();
    SGN$18.storage.local.set('client-id', id);
  }
  return {
    firstOpen: firstOpen,
    id: id
  };
}();

// Listen for changes in the config.
SGN$18.config.bind('change', function (changedAttributes) {
  var eventTracker;
  eventTracker = changedAttributes.eventTracker;
  if (eventTracker != null) {
    if (SGN$18.client.firstOpen === true) {
      eventTracker.trackEvent('first-client-session-opened', {}, '1.0.0');
    }
    eventTracker.trackEvent('client-session-opened', {}, '1.0.0');
  }
});

// Autoconfigure the SDK.
scriptEl = document.getElementById('sgn-sdk');

if (scriptEl != null) {
  appKey = scriptEl.getAttribute('data-app-key');
  trackId = scriptEl.getAttribute('data-track-id');
  config$2 = {};
  if (appKey != null) {
    config$2.appKey = appKey;
  }
  if (trackId != null) {
    config$2.eventTracker = new SGN$18.EventsKit.Tracker({
      trackId: trackId
    });
  }
  SGN$18.config.set(config$2);
}

var browser$2 = SGN$18;

return browser$2;

})));
//# sourceMappingURL=sgn-sdk.js.map