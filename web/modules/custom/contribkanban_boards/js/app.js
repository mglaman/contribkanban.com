/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

  var isValidElement = function isValidElement(object) {
    return (typeof object === 'undefined' ? 'undefined' : babelHelpers.typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(15)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (true) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(2);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (true) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var ApiUrl = function () {
  function ApiUrl(entityType, parameters) {
    babelHelpers.classCallCheck(this, ApiUrl);
    this.baseURL = 'https://www.drupal.org/api-d7';

    this.entityType = entityType || '';
    this.parameters = parameters || [];
  }

  babelHelpers.createClass(ApiUrl, [{
    key: 'getBaseUrl',
    value: function getBaseUrl() {
      return this.baseURL;
    }
  }, {
    key: 'setEntityEndpoint',
    value: function setEntityEndpoint(type) {
      this.entityType = type;
    }
  }, {
    key: 'addParameter',
    value: function addParameter(parameter, value) {
      this.parameters.push(parameter + '=' + value);
      return this;
    }
  }, {
    key: 'getEndpointUrl',
    value: function getEndpointUrl() {
      var builderUrl = this.baseURL;
      builderUrl += '/' + this.entityType + '.json?';
      builderUrl += this.parameters.join('&');
      return builderUrl;
    }
  }]);
  return ApiUrl;
}();

exports.default = ApiUrl;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') {
  // Browser window
  root = window;
} else if (typeof self !== 'undefined') {
  // Web Worker
  root = self;
} else {
  // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = undefined;
}

var Emitter = __webpack_require__(20);
var RequestBase = __webpack_require__(21);
var isObject = __webpack_require__(8);
var ResponseBase = __webpack_require__(22);
var Agent = __webpack_require__(24);

/**
 * Noop.
 */

function noop() {};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function (method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
};

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest && (!root.location || 'file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest();
  } else {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {}
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {}
  }
  throw Error("Browser-only version of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim ? function (s) {
  return s.trim();
} : function (s) {
  return s.replace(/(^\s*|\s*$)/g, '');
};

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function (v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for (var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

request.serializeObject = serialize;

/**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': JSON.stringify
};

/**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    if (index === -1) {
      // could be empty line, just skip it
      continue;
    }
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return (/[\/+]json($|[^-\w])/.test(mime)
  );
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD' ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function (str) {
  var parse = request.parse[this.type];
  if (this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function () {
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function () {
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch (e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
      }
    } catch (custom_err) {
      new_err = custom_err; // ok() callback can throw
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      new_err.original = err;
      new_err.response = res;
      new_err.status = res.status;
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function (type) {
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function (type) {
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function (user, pass, options) {
  if (1 === arguments.length) pass = '';
  if ((typeof pass === 'undefined' ? 'undefined' : babelHelpers.typeof(pass)) === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto'
    };
  }

  var encoder = function encoder(string) {
    if ('function' === typeof btoa) {
      return btoa(string);
    }
    throw new Error('Cannot use basic auth, btoa is not a function');
  };

  return this._auth(user, pass, options, encoder);
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function (val) {
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function () {
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function (err, res) {
  if (this._shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function () {
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function () {
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function () {
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === (typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj)) && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function (fn) {
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();

  return this._end();
};

Request.prototype._end = function () {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function () {
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try {
      status = xhr.status;
    } catch (e) {
      status = 0;
    }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function handleProgress(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch (e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field)) xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

request.agent = function () {
  return new Agent();
};

["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function (method) {
  Agent.prototype[method.toLowerCase()] = function (url, fn) {
    var req = new request.Request(method, url);
    this._setDefaults(req);
    if (fn) {
      req.end(fn);
    }
    return req;
  };
});

Agent.prototype.del = Agent.prototype['delete'];

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function (url, data, fn) {
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function (url, data, fn) {
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function (url, data, fn) {
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn) {
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
}

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function (url, data, fn) {
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function (url, data, fn) {
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function (url, data, fn) {
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === (typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj));
}

module.exports = isObject;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(25);

/**
 * superagentCache constructor
 * @constructor
 * @param {superagent} superagent
 * @param {cache module} cache (optional)
 * @param {object} defaults (optional)
 */
module.exports = function (superagent, cache, defaults) {

  if (!superagent) throw 'superagent-cache requires a superagent instance.';

  if (!superagent.patchedBySuperagentCache) {
    superagent.cache = cache && cache.get ? cache : new (__webpack_require__(26))(cache);
    superagent.defaults = defaults || {};
    superagent.pendingRequests = {};
    var Request = superagent.Request;
    var props = utils.resetProps(superagent.defaults);
    var supportedMethods = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'];
    var cacheableMethods = ['GET', 'HEAD'];
    superagent.patchedBySuperagentCache = true;

    /**
     * Whether to execute an http query if the cache does not have the generated key
     * @param {boolean} doQuery
     */
    Request.prototype.doQuery = function (doQuery) {
      props.doQuery = doQuery;
      return this;
    };

    /**
     * Remove the given params from the query object after executing an http query and before generating a cache key
     * @param {array of strings} pruneQuery
     */
    Request.prototype.pruneQuery = function (pruneQuery) {
      props.pruneQuery = pruneQuery;
      return this;
    };

    /**
     * Remove the given options from the headers object after executing an http query and before generating a cache key
     * @param {boolean} pruneHeader
     */
    Request.prototype.pruneHeader = function (pruneHeader) {
      props.pruneHeader = pruneHeader;
      return this;
    };

    /**
     * Execute some logic on superagent's http response object before caching and returning it
     * @param {function} prune
     */
    Request.prototype.prune = function (prune) {
      props.prune = prune;
      return this;
    };

    /**
     * Retrieve a top-level property from superagent's http response object before to cache and return
     * @param {string} responseProp
     */
    Request.prototype.responseProp = function (responseProp) {
      props.responseProp = responseProp;
      return this;
    };

    /**
     * Set an expiration for this key that will override the configured cache's default expiration
     * @param {integer} expiration (seconds)
     */
    Request.prototype.expiration = function (expiration) {
      props.expiration = expiration;
      return this;
    };

    /**
     * Whether to cache superagent's http response object when it "empty"--especially useful with .prune and .pruneQuery
     * @param {boolean} cacheWhenEmpty
     */
    Request.prototype.cacheWhenEmpty = function (cacheWhenEmpty) {
      props.cacheWhenEmpty = cacheWhenEmpty;
      return this;
    };

    /**
     * Whether to execute an http query regardless of whether the cache has the generated key
     * @param {boolean} forceUpdate
     */
    Request.prototype.forceUpdate = function (forceUpdate) {
      props.forceUpdate = typeof forceUpdate === 'boolean' ? forceUpdate : true;
      return this;
    };

    /**
     * Whether to execute identical network calls.
     * When used, calls made for resources that are already pending will not be made, but will
     * be responded to with the response from the already pending call.
     * @param {boolean} preventDuplicateCalls
     */
    Request.prototype.preventDuplicateCalls = function (preventDuplicateCalls) {
      props.preventDuplicateCalls = typeof preventDuplicateCalls === 'boolean' ? preventDuplicateCalls : true;
      return this;
    };

    /**
     * Initialize a background refresh for the generated key and value
     * @param {boolean | function} backgroundRefresh
     */
    Request.prototype.backgroundRefresh = function (backgroundRefresh) {
      props.backgroundRefresh = typeof backgroundRefresh !== 'undefined' ? backgroundRefresh : true;
      return this;
    };

    /**
     * An alias for the .end function
     */
    Request.prototype._superagentCache_execute = Request.prototype.end;

    /**
     * Wraps the .end function so that .resetProps gets called--callable so that no caching logic takes place
     */
    Request.prototype._superagentCache_originalEnd = function (cb) {
      props = utils.resetProps(superagent.defaults);
      this._superagentCache_execute(cb);
    };

    /**
     * Execute all caching and http logic
     * @param {function} cb
     */
    Request.prototype.end = function (cb) {
      var curProps = props;
      props = utils.resetProps(superagent.defaults);
      this.scRedirectsList = this.scRedirectsList || [];
      this.scRedirectsList = this.scRedirectsList.concat(this._redirectList);
      if (~supportedMethods.indexOf(this.method.toUpperCase())) {
        var _this = this;
        var key = utils.keygen(superagent, this, curProps);
        if (~cacheableMethods.indexOf(this.method.toUpperCase())) {
          superagent.cache.get(key, function (err, response) {
            if (!err && response && !curProps.forceUpdate) {
              utils.callbackExecutor(cb, err, response, key);
            } else {
              if (curProps.doQuery) {
                if (curProps.preventDuplicateCalls) {
                  if (!superagent.pendingRequests[key]) {
                    superagent.pendingRequests[key] = [];
                  } else {
                    return superagent.pendingRequests[key].push(cb);
                  }
                }
                _this._superagentCache_originalEnd(function (err, response) {
                  if (err) {
                    utils.handlePendingRequests(curProps, superagent, key, err, response);
                    return utils.callbackExecutor(cb, err, response, key);
                  } else if (!err && response) {
                    response.redirects = _this.scRedirectsList;
                    if (curProps.prune) {
                      response = curProps.prune(response);
                    } else if (curProps.responseProp) {
                      response = response[curProps.responseProp] || null;
                    } else {
                      response = utils.gutResponse(response);
                    }
                    if (!utils.isEmpty(response) || curProps.cacheWhenEmpty) {
                      var refresh = curProps.backgroundRefresh || null;
                      if (typeof refresh == 'boolean') {
                        refresh = utils.getBackgroundRefreshFunction(superagent, curProps);
                      }
                      superagent.cache.set(key, response, curProps.expiration, refresh, function () {
                        utils.handlePendingRequests(curProps, superagent, key, err, response);
                        return utils.callbackExecutor(cb, err, response, key);
                      });
                    } else {
                      delete superagent.pendingRequests[key];
                      return utils.callbackExecutor(cb, err, response, key);
                    }
                  }
                });
              } else {
                return utils.callbackExecutor(cb, null, null, key);
              }
            }
          });
        } else {
          this._superagentCache_originalEnd(function (err, response) {
            if (err) {
              return utils.callbackExecutor(cb, err, response, key);
            }
            if (!err && response) {
              var keyGet = key.replace('"method":"' + _this.method + '"', '"method":"GET"');
              var keyHead = key.replace('"method":"' + _this.method + '"', '"method":"HEAD"');
              superagent.cache.del([keyGet, keyHead], function () {
                utils.callbackExecutor(cb, err, response, key);
              });
            }
          });
        }
      } else {
        this._superagentCache_originalEnd(function (err, response) {
          return utils.callbackExecutor(cb, err, response, undefined);
        });
      }
    };
  }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactDom = __webpack_require__(11);

var _board = __webpack_require__(12);

var _board2 = babelHelpers.interopRequireDefault(_board);

if (document.getElementById('Board')) {
  // @todo move into component?
  var resizeTimer = void 0;
  var $banner = document.querySelector('header[role="banner"]');
  var elMain = document.querySelector('main[role="main"]');
  elMain.style.height = window.innerHeight - $banner.offsetHeight + 'px';
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      elMain.style.height = window.innerHeight - $banner.offsetHeight + 'px';
    }, 250);
  });
  (0, _reactDom.render)(_react2.default.createElement(_board2.default, null), document.getElementById('Board'));
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _filters = __webpack_require__(13);

var _filters2 = babelHelpers.interopRequireDefault(_filters);

var _list = __webpack_require__(18);

var _list2 = babelHelpers.interopRequireDefault(_list);

var Board = function (_Component) {
  babelHelpers.inherits(Board, _Component);

  function Board() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, Board);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = Board.__proto__ || Object.getPrototypeOf(Board)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false,
      board: []
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(Board, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        loaded: true,
        board: drupalSettings.board
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { style: {
            position: 'relative',
            height: '100%'
          } },
        _react2.default.createElement(_filters2.default, null),
        _react2.default.createElement(
          "div",
          { className: "board--list__scroll-fix" },
          _react2.default.createElement(
            "div",
            { className: "board--list__container" },
            this.state.loaded ? [this.state.board.map(function (list) {
              return _react2.default.createElement(_list2.default, { label: list.title, data: list });
            })] : []
          )
        )
      );
    }
  }]);
  return Board;
}(_react.Component);

exports.default = Board;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _select = __webpack_require__(14);

var _select2 = babelHelpers.interopRequireDefault(_select);

var Filters = function (_Component) {
  babelHelpers.inherits(Filters, _Component);

  function Filters() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, Filters);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = Filters.__proto__ || Object.getPrototypeOf(Filters)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      categoryOptions: [{ value: '_any', item: 'Any category' }, { value: 1, item: 'Bug report' }, { value: 2, item: 'Task' }, { value: 3, item: 'Feature request' }, { value: 4, item: 'Support request' }, { value: 5, item: 'Plan' }],
      priorityOptions: [{ value: '_any', item: 'Any priority' }, { value: 400, item: 'Critical' }, { value: 300, item: 'Major' }, { value: 200, item: 'Normal' }, { value: 100, item: 'Minor' }],
      versionOptions: [{ value: '_any', item: 'Any version' }, { value: '8.x', item: 'Drupal 8' }, { value: '7.x', item: 'Drupal 7' }]
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(Filters, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'is-flex is-clearfix board--filters' },
        _react2.default.createElement(_select2.default, { data: this.state.categoryOptions, label: 'Category', onChange: Filters.categoryChange }),
        _react2.default.createElement(_select2.default, { data: this.state.priorityOptions, label: 'Priority', onChange: Filters.priorityChange }),
        _react2.default.createElement(_select2.default, { data: this.state.versionOptions, label: 'Versions', onChange: Filters.versionChange })
      );
    }
  }], [{
    key: 'categoryChange',
    value: function categoryChange(e) {
      console.log(e.target.value);
    }
  }, {
    key: 'priorityChange',
    value: function priorityChange(e) {
      console.log(e.target.value);
    }
  }, {
    key: 'versionChange',
    value: function versionChange(e) {
      console.log(e.target.value);
    }
  }]);
  return Filters;
}(_react.Component);

exports.default = Filters;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var Select = function (_Component) {
  babelHelpers.inherits(Select, _Component);

  function Select(_ref) {
    var onChange = _ref.onChange;
    babelHelpers.classCallCheck(this, Select);

    var _this = babelHelpers.possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this));

    _this.changeHandler = function (e) {
      _this.onChange(e);
    };

    _this.onChange = onChange;
    return _this;
  }

  babelHelpers.createClass(Select, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          label = _props.label,
          data = _props.data,
          selected = _props.selected;

      return _react2.default.createElement(
        'div',
        { className: 'field' },
        _react2.default.createElement(
          'div',
          { className: 'control' },
          _react2.default.createElement(
            'div',
            { className: 'select' },
            _react2.default.createElement(
              'select',
              {
                key: 'select-' + (label || 'select'),
                onChange: this.changeHandler,
                value: selected
              },
              data.map(function (_ref2) {
                var value = _ref2.value,
                    item = _ref2.item;
                return _react2.default.createElement(
                  'option',
                  { key: item + '-' + value, value: value },
                  item
                );
              })
            )
          )
        )
      );
    }
  }]);
  return Select;
}(_react.Component);

Select.propTypes = {
  data: (0, _propTypes.arrayOf)((0, _propTypes.shape)({
    item: _propTypes.string,
    value: _propTypes.string
  })).isRequired,
  label: _propTypes.string.isRequired,
  onChange: _propTypes.func.isRequired,
  select: _propTypes.string
};
exports.default = Select;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(2);
var invariant = __webpack_require__(3);
var warning = __webpack_require__(4);
var assign = __webpack_require__(16);

var ReactPropTypesSecret = __webpack_require__(5);
var checkPropTypes = __webpack_require__(17);

module.exports = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        } else if ("development" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (!manualPropTypeCallCache[cacheKey] &&
          // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
       true ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(false, 'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue === 'undefined' ? 'undefined' : babelHelpers.typeof(propValue)) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue === 'undefined' ? 'undefined' : babelHelpers.typeof(propValue);
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  var invariant = __webpack_require__(3);
  var warning = __webpack_require__(4);
  var ReactPropTypesSecret = __webpack_require__(5);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, babelHelpers.typeof(typeSpecs[typeSpecName]));
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error === 'undefined' ? 'undefined' : babelHelpers.typeof(error));
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _url = __webpack_require__(6);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _utils = __webpack_require__(19);

var _superagent = __webpack_require__(7);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(9);

var _superagentCache2 = babelHelpers.interopRequireDefault(_superagentCache);

var _issue = __webpack_require__(27);

var _issue2 = babelHelpers.interopRequireDefault(_issue);

(0, _superagentCache2.default)(_superagent2.default);

var List = function (_Component) {
  babelHelpers.inherits(List, _Component);

  function List() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, List);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = List.__proto__ || Object.getPrototypeOf(List)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false,
      count: 0,
      issueList: []
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(List, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var data = (0, _utils.datasetToJson)(this.props.data);
      var apiUrl = new _url2.default('node').addParameter('limit', 100).addParameter('type', 'project_issue').addParameter('sort', 'field_issue_priority').addParameter('direction', 'DESC');

      (0, _utils.objectForeach)(data['projects'], function (i, v) {
        apiUrl.addParameter('field_project[target_id][]', v);
      });
      (0, _utils.objectForeach)(data['statuses'], function (i, v) {
        apiUrl.addParameter('field_issue_status[value][]', v);
      });
      if (data['category'] !== null) {
        apiUrl.addParameter('field_issue_category', data['category']);
      }
      if (data['tag'] !== null) {
        apiUrl.addParameter('taxonomy_vocabulary_9[tid][]', data['tag']);
      }
      if (data['parent'] !== null) {
        apiUrl.addParameter('field_issue_parent', data['parent']);
      }
      if (data['priority'] !== null) {
        apiUrl.addParameter('field_issue_priority', data['priority']);
      }
      (0, _utils.objectForeach)(data['version'], function (i, v) {
        apiUrl.addParameter('field_issue_version[value][]', v);
      });
      if (data['component'] !== null) {
        apiUrl.addParameter('field_issue_component', data['component']);
      }
      _superagent2.default.get(apiUrl.getEndpointUrl()).backgroundRefresh().end(function (err, _ref2) {
        var body = _ref2.body;

        _this2.setState({
          loaded: true,
          issueList: body.list,
          count: body.list.length
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var label = this.props.label;

      return _react2.default.createElement(
        'div',
        { className: 'board--list card is-flex is-vertical' },
        _react2.default.createElement(
          'h2',
          null,
          _react2.default.createElement(
            'span',
            { className: 'icon has-text-info board--list__refresh' },
            this.state.loaded ? [] : [_react2.default.createElement('i', { className: 'fa fa-circle-o-notch fa-spin fa-fw ' })]
          ),
          label,
          ' (',
          this.state.loaded ? [this.state.count] : [],
          ')'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'board--list__items' },
            this.state.issueList.map(function (issue) {
              return _react2.default.createElement(_issue2.default, { data: issue });
            })
          )
        )
      );
    }
  }]);
  return List;
}(_react.Component);

List.propTypes = {
  label: _propTypes.string.isRequired,
  data: _propTypes.object.isRequired
};
exports.default = List;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectForeach = objectForeach;
exports.datasetToJson = datasetToJson;
function objectForeach(obj, callback) {
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    callback(i, obj[i]);
  }
}
function datasetToJson(map) {
  var dataset = {};
  objectForeach(map, function (i, v) {
    try {
      dataset[i] = JSON.parse(v);
    } catch (e) {
      dataset[i] = v;
    }
  });
  return dataset;
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function (event, fn) {
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function (event) {
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1),
      callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function (event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function (event) {
  return !!this.listeners(event).length;
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module of mixed-in functions shared between node and client code
 */

var isObject = __webpack_require__(8);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout() {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn) {
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function (val) {
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn) {
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options) {
  if (!options || 'object' !== (typeof options === 'undefined' ? 'undefined' : babelHelpers.typeof(options))) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for (var option in options) {
    switch (option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count, fn) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

var ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT', 'EADDRINFO', 'ESOCKETTIMEDOUT'];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
RequestBase.prototype._shouldRetry = function (err, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      var override = this._retryCallback(err, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch (e) {
      console.error(e);
    }
  }
  if (res && res.status && res.status >= 500 && res.status != 501) return true;
  if (err) {
    if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
    // Superagent timeout
    if (err.timeout && err.code == 'ECONNABORTED') return true;
    if (err.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function () {

  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function (innerResolve, innerReject) {
      self.end(function (err, res) {
        if (err) innerReject(err);else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype.catch = function (cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function (cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, val) {
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function (name, val) {
  // name should be either a string or an object.
  if (null === name || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
      break;

    case 'auto':
      this.username = user;
      this.password = pass;
      break;

    case 'bearer':
      // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on == undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function (n) {
  if ('number' !== typeof n) {
    throw TypeError("Invalid argument");
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function (data) {
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data ? this._data + '&' + data : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function () {
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if ('function' === typeof this._sort) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = function () {
  console.trace("Unsupported");
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function () {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function () {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function () {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var utils = __webpack_require__(23);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util

  // content-type
  var ct = header['content-type'] || '';
  this.type = utils.type(ct);

  // params
  var params = utils.params(ct);
  for (var key in params) {
    this[key] = params[key];
  }this.links = {};

  // links
  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (err) {
    // ignore
  }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function (status) {
  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.redirect = 3 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = 4 == type || 5 == type ? this.toError() : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.forbidden = 403 == status;
  this.notFound = 404 == status;
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function (str) {
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function (str) {
  return str.split(/ *; */).reduce(function (obj, str) {
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function (str) {
  return str.split(/ *, */).reduce(function (obj, str) {
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function (header, changesOrigin) {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  // secuirty
  if (changesOrigin) {
    delete header['authorization'];
    delete header['cookie'];
  }
  return header;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Agent() {
  this._defaults = [];
}

["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function (fn) {
  /** Default setting for all requests from this agent */
  Agent.prototype[fn] = function () /*varargs*/{
    this._defaults.push({ fn: fn, arguments: arguments });
    return this;
  };
});

Agent.prototype._setDefaults = function (req) {
  this._defaults.forEach(function (def) {
    req[def.fn].apply(req, def.arguments);
  });
};

module.exports = Agent;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  /**
   * Generate a cache key unique to this query
   * @param {superagent} agent
   * @param {object} reg
   * @param {object} cProps
   */
  keygen: function keygen(agent, req, cProps) {
    var cleanParams = null;
    var cleanOptions = null;
    var params = this.getQueryParams(req);
    var options = this.getHeaderOptions(req);
    if (cProps.pruneQuery || cProps.pruneHeader) {
      cleanParams = cProps.pruneQuery ? this.pruneObj(this.cloneObject(params), cProps.pruneQuery) : params;
      cleanOptions = cProps.pruneHeader ? this.pruneObj(this.cloneObject(options), cProps.pruneHeader, true) : options;
    }
    return JSON.stringify({
      nameSpace: agent.cache.nameSpace,
      method: req.method,
      uri: req.url,
      params: cleanParams || params || null,
      options: cleanOptions || options || null
    });
  },

  /**
   * Find and extract query params
   * @param {object} reg
   */
  getQueryParams: function getQueryParams(req) {
    if (req && req.qs && !this.isEmpty(req.qs)) {
      return req.qs;
    } else if (req && req.qsRaw) {
      return this.arrayToObj(req.qsRaw);
    } else if (req && req.req) {
      return this.stringToObj(req.req.path);
    } else if (req && req._query) {
      return this.stringToObj(req._query.join('&'));
    }
    return null;
  },

  /**
   * Find and extract headers
   * @param {object} reg
   */
  getHeaderOptions: function getHeaderOptions(req) {
    //I have to remove the User-Agent header ever since superagent 1.7.0
    if (req && req._header) {
      return this.pruneObj(req._header, ['User-Agent', 'user-agent']);
    } else if (req && req.req && req.req._headers) {
      return this.pruneObj(req.req._headers, ['User-Agent', 'user-agent']);
    } else if (req && req.header) {
      return this.pruneObj(req.header, ['User-Agent', 'user-agent']);
    }
    return null;
  },

  /**
   * Convert an array to an object
   * @param {array} arr
   */
  arrayToObj: function arrayToObj(arr) {
    if (arr && arr.length) {
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        var kvArray = str.split('&');
        for (var j = 0; j < kvArray.length; j++) {
          var kvString = kvArray[j].split('=');
          obj[kvString[0]] = kvString[1];
        }
      }
      return obj;
    }
    return null;
  },

  /**
   * Convert a string to an object
   * @param {string} str
   */
  stringToObj: function stringToObj(str) {
    if (str) {
      var obj = {};
      if (~str.indexOf('?')) {
        var strs = str.split('?');
        str = strs[1];
      }
      var kvArray = str.split('&');
      for (var i = 0; i < kvArray.length; i++) {
        var kvString = kvArray[i].split('=');
        obj[kvString[0]] = kvString[1];
      }
      return obj;
    }
    return null;
  },

  /**
   * Remove properties from an object
   * @param {object} obj
   * @param {array} props
   * @param {boolean} isOptions
   */
  pruneObj: function pruneObj(obj, props, isOptions) {
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (isOptions) {
        delete obj[prop.toLowerCase()];
      }
      delete obj[prop];
    }
    return obj;
  },

  /**
   * Simplify superagent's http response object
   * @param {object} r
   */
  gutResponse: function gutResponse(r) {
    var newResponse = {};
    newResponse.body = r.body;
    newResponse.text = r.text;
    newResponse.headers = r.headers;
    newResponse.statusCode = r.statusCode;
    newResponse.status = r.status;
    newResponse.ok = r.ok;
    return newResponse;
  },

  /**
   * Determine whether a value is considered empty
   * @param {*} val
   */
  isEmpty: function isEmpty(val) {
    return val === false || val === null || (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) == 'object' && Object.keys(val).length == 0;
  },

  /**
   * Return a clone of an object
   * @param {object} obj
   */
  cloneObject: function cloneObject(obj) {
    var newObj = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        newObj[attr] = obj[attr];
      }
    }
    return newObj;
  },

  handlePendingRequests: function handlePendingRequests(curProps, superagent, key, err, response) {
    if (curProps.preventDuplicateCalls) {
      if (superagent.pendingRequests[key] && (!this.isEmpty(response) || curProps.cacheWhenEmpty)) {
        var self = this;
        var pendingRequests = superagent.pendingRequests[key];
        pendingRequests.forEach(function (cb) {
          self.callbackExecutor(cb, err, response, key);
        });
      }
      delete superagent.pendingRequests[key];
    }
  },

  /**
   * Reset superagent-cache's default query properties using the defaults object
   * @param {object} d
   */
  resetProps: function resetProps(d) {
    return {
      doQuery: typeof d.doQuery === 'boolean' ? d.doQuery : true,
      cacheWhenEmpty: typeof d.cacheWhenEmpty === 'boolean' ? d.cacheWhenEmpty : true,
      prune: d.prune,
      pruneQuery: d.pruneQuery,
      pruneHeader: d.pruneHeader,
      responseProp: d.responseProp,
      expiration: d.expiration,
      forceUpdate: d.forceUpdate,
      preventDuplicateCalls: d.preventDuplicateCalls,
      backgroundRefresh: d.backgroundRefresh
    };
  },

  /**
   * Generate a background refresh query identical to the current query
   * @param {superagent} agent
   * @param {object} curProps
   */
  getBackgroundRefreshFunction: function getBackgroundRefreshFunction(agent, curProps) {
    return function (key, cb) {
      key = JSON.parse(key);
      var method = key.method.toLowerCase();
      var request = agent[method](key.uri).doQuery(curProps.doQuery).pruneQuery(curProps.pruneQuery).pruneHeader(curProps.pruneHeader).prune(curProps.prune).responseProp(curProps.responseProp).expiration(curProps.expiration).cacheWhenEmpty(curProps.cacheWhenEmpty);
      if (key.params) {
        request.query(key.params);
      }
      if (key.options) {
        request.set(key.options);
      }
      request.end(cb);
    };
  },

  /**
   * Handle the varying number of callback output params
   * @param {function} cb
   * @param {object} err
   * @param {object} response
   * @param {string} key
   */
  callbackExecutor: function callbackExecutor(cb, err, response, key) {
    if (cb.length === 1) {
      cb(response);
    } else if (cb.length > 1) {
      cb(err, response, key);
    } else {
      throw new Error('UnsupportedCallbackException: Your .end() callback must pass at least one argument.');
    }
  }
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * cacheModule constructor
 * @param config: {
 *    type:                           {string  | 'cache-module'}
 *    verbose:                        {boolean | false},
 *    defaultExpiration:              {integer | 900},
 *    readOnly:                       {boolean | false},
 *    checkOnPreviousEmpty:           {boolean | true},
 *    backgroundRefreshIntervalCheck: {boolean | true},
 *    backgroundRefreshInterval:      {integer | 60000},
 *    backgroundRefreshMinTtl:        {integer | 70000},
 *    storage:                        {string  | null},
 *    storageMock:                    {object  | null}
 * }
 */
function cacheModule(config) {
  var self = this;
  config = config || {};
  self.type = config.type || 'cache-module';
  self.verbose = config.verbose || false;
  self.defaultExpiration = config.defaultExpiration || 900;
  self.readOnly = config.readOnly || false;
  self.checkOnPreviousEmpty = typeof config.checkOnPreviousEmpty === 'boolean' ? config.checkOnPreviousEmpty : true;
  self.backgroundRefreshIntervalCheck = typeof config.backgroundRefreshIntervalCheck === 'boolean' ? config.backgroundRefreshIntervalCheck : true;
  self.backgroundRefreshInterval = config.backgroundRefreshInterval || 60000;
  self.backgroundRefreshMinTtl = config.backgroundRefreshMinTtl || 70000;
  var store = null;
  var storageMock = config.storageMock || false;
  var backgroundRefreshEnabled = false;
  var browser = typeof window !== 'undefined';
  var cache = {
    db: {},
    expirations: {},
    refreshKeys: {}
  };
  var storageKey;

  setupBrowserStorage();
  log(false, 'Cache-module client created with the following defaults:', { type: self.type, defaultExpiration: self.defaultExpiration, verbose: self.verbose, readOnly: self.readOnly });

  /**
   * Get the value associated with a given key
   * @param {string} key
   * @param {function} cb
   */
  self.get = function (key, cb) {
    throwErrorIf(arguments.length < 2, 'ARGUMENT_EXCEPTION: .get() requires 2 arguments.');
    log(false, 'get() called:', { key: key });
    try {
      var now = Date.now();
      var expiration = cache.expirations[key];
      if (expiration > now) {
        cb(null, cache.db[key]);
      } else {
        expire(key);
        cb(null, null);
      }
    } catch (err) {
      cb({ name: 'GetException', message: err }, null);
    }
  };

  /**
   * Get multiple values given multiple keys
   * @param {array} keys
   * @param {function} cb
   * @param {integer} index
   */
  self.mget = function (keys, cb, index) {
    throwErrorIf(arguments.length < 2, 'ARGUMENT_EXCEPTION: .mget() requires 2 arguments.');
    log(false, '.mget() called:', { keys: keys });
    var values = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      self.get(key, function (err, response) {
        if (response !== null) {
          values[key] = response;
        }
      });
    }
    cb(null, values, index);
  };

  /**
   * Associate a key and value and optionally set an expiration
   * @param {string} key
   * @param {string | object} value
   * @param {integer} expiration
   * @param {function} refresh
   * @param {function} cb
   */
  self.set = function () {
    throwErrorIf(arguments.length < 2, 'ARGUMENT_EXCEPTION: .set() requires at least 2 arguments.');
    var key = arguments[0];
    var value = arguments[1];
    var expiration = arguments[2] || null;
    var refresh = arguments.length == 5 ? arguments[3] : null;
    var cb = arguments.length == 5 ? arguments[4] : arguments[3];
    log(false, '.set() called:', { key: key, value: value });
    if (!self.readOnly) {
      try {
        expiration = expiration ? expiration * 1000 : self.defaultExpiration * 1000;
        var exp = expiration + Date.now();
        cache.expirations[key] = exp;
        cache.db[key] = value;
        if (cb) cb();
        if (refresh) {
          cache.refreshKeys[key] = { expiration: exp, lifeSpan: expiration, refresh: refresh };
          backgroundRefreshInit();
        }
        overwriteBrowserStorage();
      } catch (err) {
        log(true, '.set() failed for cache of type ' + self.type, { name: 'CacheModuleSetException', message: err });
      }
    }
  };

  /**
   * Associate multiple keys with multiple values and optionally set expirations per function and/or key
   * @param {object} obj
   * @param {integer} expiration
   * @param {function} cb
   */
  self.mset = function (obj, expiration, cb) {
    throwErrorIf(arguments.length < 1, 'ARGUMENT_EXCEPTION: .mset() requires at least 1 argument.');
    log(false, '.mset() called:', { data: obj });
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var tempExpiration = expiration || self.defaultExpiration;
        var value = obj[key];
        if ((typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' && value.cacheValue) {
          tempExpiration = value.expiration || tempExpiration;
          value = value.cacheValue;
        }
        self.set(key, value, tempExpiration);
      }
    }
    if (cb) cb();
  };

  /**
   * Delete the provided keys and their associated values
   * @param {array} keys
   * @param {function} cb
   */
  self.del = function (keys, cb) {
    throwErrorIf(arguments.length < 1, 'ARGUMENT_EXCEPTION: .del() requires at least 1 argument.');
    log(false, '.del() called:', { keys: keys });
    if ((typeof keys === 'undefined' ? 'undefined' : babelHelpers.typeof(keys)) === 'object') {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        delete cache.db[key];
        delete cache.expirations[key];
        delete cache.refreshKeys[key];
      }
      if (cb) cb(null, keys.length);
    } else {
      delete cache.db[keys];
      delete cache.expirations[keys];
      delete cache.refreshKeys[keys];
      if (cb) cb(null, 1);
    }
    overwriteBrowserStorage();
  };

  /**
   * Flush all keys and values
   * @param {function} cb
   */
  self.flush = function (cb) {
    log(false, '.flush() called');
    cache.db = {};
    cache.expirations = {};
    cache.refreshKeys = {};
    if (cb) cb();
    overwriteBrowserStorage();
  };

  /**
   * Enable browser storage if desired and available
   */
  function setupBrowserStorage() {
    if (browser || storageMock) {
      if (storageMock) {
        store = storageMock;
        storageKey = 'cache-module-storage-mock';
      } else {
        var storageType = config.storage === 'local' || config.storage === 'session' ? config.storage : null;
        store = storageType && (typeof Storage === 'undefined' ? 'undefined' : babelHelpers.typeof(Storage)) !== void 0 ? window[storageType + 'Storage'] : false;
        storageKey = storageType ? 'cache-module-' + storageType + '-storage' : null;
      }
      if (store) {
        var db = store.getItem(storageKey);
        try {
          cache = JSON.parse(db) || cache;
        } catch (err) {/* Do nothing */}
      }
      // If storageType is set but store is not, the desired storage mechanism was not available
      else if (storageType) {
          log(true, 'Browser storage is not supported by this browser. Defaulting to an in-memory cache.');
        }
    }
  }

  /**
   * Overwrite namespaced browser storage with current cache
   */
  function overwriteBrowserStorage() {
    if (browser && store || storageMock) {
      var db = cache;
      try {
        db = JSON.stringify(db);
      } catch (err) {/* Do nothing */}
      store.setItem(storageKey, db);
    }
  }

  /**
   * Throw a given error if error is true
   * @param {boolean} error
   * @param {string} message
   */
  function throwErrorIf(error, message) {
    if (error) throw new Error(message);
  }

  /**
   * Delete a given key from cache.db and cache.expirations but not from cache.refreshKeys
   * @param {string} key
   */
  function expire(key) {
    delete cache.db[key];
    delete cache.expirations[key];
    overwriteBrowserStorage();
  }

  /**
   * Initialize background refresh
   */
  function backgroundRefreshInit() {
    if (!backgroundRefreshEnabled) {
      backgroundRefreshEnabled = true;
      if (self.backgroundRefreshIntervalCheck) {
        if (self.backgroundRefreshInterval > self.backgroundRefreshMinTtl) {
          throw new Error('BACKGROUND_REFRESH_INTERVAL_EXCEPTION: backgroundRefreshInterval cannot be greater than backgroundRefreshMinTtl.');
        }
      }
      setInterval(backgroundRefresh, self.backgroundRefreshInterval);
    }
  }

  /**
   * Handle the refresh callback from the consumer, save the data to redis.
   *
   * @param {string} key The key used to save.
   * @param {Object} data refresh keys data.
   * @param {Error|null} err consumer callback failure.
   * @param {*} response The consumer response.
   */
  function handleRefreshResponse(key, data, err, response) {
    if (!err) {
      this.set(key, response, data.lifeSpan / 1000, data.refresh, function () {});
    }
  }

  /**
   * Refreshes all keys that were set with a refresh function
   */
  function backgroundRefresh() {
    var keys = Object.keys(cache.refreshKeys);
    keys.forEach(function (key) {
      var data = cache.refreshKeys[key];
      if (data.expiration - Date.now() < this.backgroundRefreshMinTtl) {
        data.refresh(key, handleRefreshResponse.bind(this, key, data));
      }
    }, self);
  }

  /**
   * Error logging logic
   * @param {boolean} isError
   * @param {string} message
   * @param {object} data
   */
  function log(isError, message, data) {
    if (self.verbose || isError) {
      if (data) console.log(self.type + ': ' + message, data);else console.log(self.type + message);
    }
  }
}

module.exports = cacheModule;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _version = __webpack_require__(28);

var _version2 = babelHelpers.interopRequireDefault(_version);

var _priority = __webpack_require__(29);

var _priority2 = babelHelpers.interopRequireDefault(_priority);

var _category = __webpack_require__(30);

var _category2 = babelHelpers.interopRequireDefault(_category);

var _project = __webpack_require__(31);

var _project2 = babelHelpers.interopRequireDefault(_project);

var Issue = function (_Component) {
  babelHelpers.inherits(Issue, _Component);

  function Issue() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, Issue);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = Issue.__proto__ || Object.getPrototypeOf(Issue)).call.apply(_ref, [this].concat(args))), _this), _this.statusToColor = {
      1: '#fcfcfc',
      2: '#d7ffd8',
      3: '#fddddd',
      4: '#eff1f3',
      5: '#fddddd',
      6: '#fddddd',
      7: '#fddddd',
      8: '#ffffdd',
      13: '#ffece8',
      14: '#d7ffd8',
      15: '#d7ffd8',
      16: '#eff1f3',
      18: '#fddddd'
    }, _this.statusToLabel = {
      1: 'Active',
      2: 'Fixed',
      3: 'Closed (Duplicate)',
      4: 'Postponed',
      5: 'Closed (Won\'t Fix)',
      6: 'Closed (Works as designed)',
      7: 'Closed (Fixed)',
      8: 'Needs Review',
      13: 'Needs Work',
      14: 'RTBC',
      15: 'Patch (to be ported)',
      16: 'Postponed (Needs more info)',
      18: 'Closed (Cannot Reproduce)'
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(Issue, [{
    key: 'render',
    value: function render() {
      var data = this.props.data;

      return _react2.default.createElement(
        'div',
        { className: 'board--list__item card', onClick: function onClick() {
            return window.open(Issue.getLink(data.nid));
          }, style: {
            backgroundColor: this.statusToColor[parseInt(data.field_issue_status)],
            cursor: 'pointer'
          } },
        _react2.default.createElement(
          'h3',
          null,
          data.title,
          ' ',
          _react2.default.createElement(
            'a',
            { className: 'kanban-board--issue__link', href: Issue.getLink(data.nid), target: '_blank' },
            '#',
            data.nid
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'kanban-board--issue_tags' },
          _react2.default.createElement(_version2.default, { version: data.field_issue_version }),
          _react2.default.createElement(_priority2.default, { priority: data.field_issue_priority }),
          _react2.default.createElement(
            'span',
            { className: 'tag is-default' },
            data.field_issue_component
          ),
          _react2.default.createElement(_category2.default, { category: data.field_issue_category }),
          _react2.default.createElement(_project2.default, { projectNid: data.field_project.id })
        )
      );
    }
  }], [{
    key: 'getLink',
    value: function getLink(nid) {
      return 'https://www.drupal.org/node/' + nid;
    }
  }]);
  return Issue;
}(_react.Component);

Issue.propTypes = {
  data: _propTypes.object.isRequired
};
exports.default = Issue;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var IssueVersion = function (_Component) {
  babelHelpers.inherits(IssueVersion, _Component);

  function IssueVersion() {
    babelHelpers.classCallCheck(this, IssueVersion);
    return babelHelpers.possibleConstructorReturn(this, (IssueVersion.__proto__ || Object.getPrototypeOf(IssueVersion)).apply(this, arguments));
  }

  babelHelpers.createClass(IssueVersion, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'span',
        { className: 'tag bg-success' },
        this.props.version
      );
    }
  }]);
  return IssueVersion;
}(_react.Component);

IssueVersion.propTypes = {
  version: _propTypes.string.isRequired
};
exports.default = IssueVersion;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var IssuePriority = function (_Component) {
  babelHelpers.inherits(IssuePriority, _Component);

  function IssuePriority() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, IssuePriority);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = IssuePriority.__proto__ || Object.getPrototypeOf(IssuePriority)).call.apply(_ref, [this].concat(args))), _this), _this.priorityToLabel = {
      400: 'Critical',
      300: 'Major',
      200: 'Normal',
      100: 'Minor'
    }, _this.priorityToClass = {
      400: 'danger',
      300: 'warning',
      200: 'info',
      100: 'active'
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(IssuePriority, [{
    key: 'render',
    value: function render() {
      var priority = this.props.priority;

      return _react2.default.createElement(
        'span',
        { className: 'tag is-' + this.priorityToClass[priority] },
        this.priorityToLabel[priority]
      );
    }
  }]);
  return IssuePriority;
}(_react.Component);

IssuePriority.propTypes = {
  priority: _propTypes.number.isRequired
};
exports.default = IssuePriority;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var IssueCategory = function (_Component) {
  babelHelpers.inherits(IssueCategory, _Component);

  function IssueCategory() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, IssueCategory);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = IssueCategory.__proto__ || Object.getPrototypeOf(IssueCategory)).call.apply(_ref, [this].concat(args))), _this), _this.categoryToLabel = {
      1: 'Bug',
      2: 'Task',
      3: 'Feature',
      4: 'Support',
      5: 'Plan'
    }, _this.categoryToClass = {
      1: 'danger',
      2: 'info',
      3: 'info',
      4: 'active',
      5: 'active'
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(IssueCategory, [{
    key: 'render',
    value: function render() {
      var category = this.props.category;

      return _react2.default.createElement(
        'span',
        { className: 'tag is-' + this.categoryToClass[category] },
        this.categoryToLabel[category]
      );
    }
  }]);
  return IssueCategory;
}(_react.Component);

IssueCategory.propTypes = {
  category: _propTypes.number.isRequired
};
exports.default = IssueCategory;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _url = __webpack_require__(6);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _superagent = __webpack_require__(7);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(9);

var _superagentCache2 = babelHelpers.interopRequireDefault(_superagentCache);

(0, _superagentCache2.default)(_superagent2.default);

var IssueProject = function (_Component) {
  babelHelpers.inherits(IssueProject, _Component);

  function IssueProject() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, IssueProject);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = IssueProject.__proto__ || Object.getPrototypeOf(IssueProject)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false,
      label: _this.props.projectNid
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(IssueProject, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var nid = this.props.projectNid;
      if (nid === '3060') {
        this.setState({
          label: 'Drupal'
        });
      } else {
        var apiUrl = new _url2.default('node').addParameter('nid', nid);
        _superagent2.default.get(apiUrl.getEndpointUrl()).end(function (err, _ref2) {
          var body = _ref2.body;

          _this2.setState({
            loaded: true,
            label: body.list[0].title
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.loaded ? [_react2.default.createElement(
        'span',
        { className: 'tag is-default' },
        this.state.label
      )] : [];
    }
  }]);
  return IssueProject;
}(_react.Component);

IssueProject.propTypes = {
  projectNid: _propTypes.number.isRequired
};
exports.default = IssueProject;

/***/ })
/******/ ]);