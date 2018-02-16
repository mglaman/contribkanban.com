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
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
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
  module.exports = __webpack_require__(33)(isValidElement, throwOnDirectAccess);
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

var Emitter = __webpack_require__(59);
var RequestBase = __webpack_require__(60);
var isObject = __webpack_require__(26);
var ResponseBase = __webpack_require__(61);
var Agent = __webpack_require__(63);

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = exports.connectAdvanced = exports.createProvider = exports.Provider = undefined;

var _Provider = __webpack_require__(32);

var _Provider2 = babelHelpers.interopRequireDefault(_Provider);

var _connectAdvanced = __webpack_require__(16);

var _connectAdvanced2 = babelHelpers.interopRequireDefault(_connectAdvanced);

var _connect = __webpack_require__(38);

var _connect2 = babelHelpers.interopRequireDefault(_connect);

exports.Provider = _Provider2.default;
exports.createProvider = _Provider.createProvider;
exports.connectAdvanced = _connectAdvanced2.default;
exports.connect = _connect2.default;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(64);

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
    superagent.cache = cache && cache.get ? cache : new (__webpack_require__(65))(cache);
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
/* 5 */
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
      this.parameters.push(parameter + '=' + encodeURIComponent(value));
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = __webpack_require__(17);

var _createStore2 = babelHelpers.interopRequireDefault(_createStore);

var _combineReducers = __webpack_require__(52);

var _combineReducers2 = babelHelpers.interopRequireDefault(_combineReducers);

var _bindActionCreators = __webpack_require__(53);

var _bindActionCreators2 = babelHelpers.interopRequireDefault(_bindActionCreators);

var _applyMiddleware = __webpack_require__(54);

var _applyMiddleware2 = babelHelpers.interopRequireDefault(_applyMiddleware);

var _compose = __webpack_require__(21);

var _compose2 = babelHelpers.interopRequireDefault(_compose);

var _warning = __webpack_require__(20);

var _warning2 = babelHelpers.interopRequireDefault(_warning);

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if ("development" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2.default)('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2.default;
exports.combineReducers = _combineReducers2.default;
exports.bindActionCreators = _bindActionCreators2.default;
exports.applyMiddleware = _applyMiddleware2.default;
exports.compose = _compose2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseGetTag = __webpack_require__(41);

var _baseGetTag2 = babelHelpers.interopRequireDefault(_baseGetTag);

var _getPrototype = __webpack_require__(46);

var _getPrototype2 = babelHelpers.interopRequireDefault(_getPrototype);

var _isObjectLike = __webpack_require__(48);

var _isObjectLike2 = babelHelpers.interopRequireDefault(_isObjectLike);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!(0, _isObjectLike2.default)(value) || (0, _baseGetTag2.default)(value) != objectTag) {
    return false;
  }
  var proto = (0, _getPrototype2.default)(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

exports.default = isPlainObject;

/***/ }),
/* 9 */
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

var baseUrl = exports.baseUrl = "" + window.location.origin + drupalSettings.path.baseUrl;

/***/ }),
/* 10 */
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
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(10);

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
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeShape = exports.subscriptionShape = undefined;

var _propTypes = __webpack_require__(1);

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var subscriptionShape = exports.subscriptionShape = _propTypes2.default.shape({
  trySubscribe: _propTypes2.default.func.isRequired,
  tryUnsubscribe: _propTypes2.default.func.isRequired,
  notifyNestedSubs: _propTypes2.default.func.isRequired,
  isSubscribed: _propTypes2.default.func.isRequired
});

var storeShape = exports.storeShape = _propTypes2.default.shape({
  subscribe: _propTypes2.default.func.isRequired,
  dispatch: _propTypes2.default.func.isRequired,
  getState: _propTypes2.default.func.isRequired
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectAdvanced;

var _hoistNonReactStatics = __webpack_require__(35);

var _hoistNonReactStatics2 = babelHelpers.interopRequireDefault(_hoistNonReactStatics);

var _invariant = __webpack_require__(36);

var _invariant2 = babelHelpers.interopRequireDefault(_invariant);

var _react = __webpack_require__(0);

var _Subscription = __webpack_require__(37);

var _Subscription2 = babelHelpers.interopRequireDefault(_Subscription);

var _PropTypes = __webpack_require__(15);

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : babelHelpers.typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : babelHelpers.typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

var hotReloadingVersion = 0;
var dummyState = {};
function noop() {}
function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  var selector = {
    run: function runComponentSelector(props) {
      try {
        var nextProps = sourceSelector(store.getState(), props);
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true;
          selector.props = nextProps;
          selector.error = null;
        }
      } catch (error) {
        selector.shouldComponentUpdate = true;
        selector.error = error;
      }
    }
  };

  return selector;
}

function connectAdvanced(
/*
  selectorFactory is a func that is responsible for returning the selector function used to
  compute new props from state, props, and dispatch. For example:
     export default connectAdvanced((dispatch, options) => (state, props) => ({
      thing: state.things[props.thingId],
      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
    }))(YourComponent)
   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
  props. Do not use connectAdvanced directly without memoizing results between calls to your
  selector, otherwise the Connect component will re-render on every state or props change.
*/
selectorFactory) {
  var _contextTypes, _childContextTypes;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$getDisplayName = _ref.getDisplayName,
      getDisplayName = _ref$getDisplayName === undefined ? function (name) {
    return 'ConnectAdvanced(' + name + ')';
  } : _ref$getDisplayName,
      _ref$methodName = _ref.methodName,
      methodName = _ref$methodName === undefined ? 'connectAdvanced' : _ref$methodName,
      _ref$renderCountProp = _ref.renderCountProp,
      renderCountProp = _ref$renderCountProp === undefined ? undefined : _ref$renderCountProp,
      _ref$shouldHandleStat = _ref.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref$shouldHandleStat === undefined ? true : _ref$shouldHandleStat,
      _ref$storeKey = _ref.storeKey,
      storeKey = _ref$storeKey === undefined ? 'store' : _ref$storeKey,
      _ref$withRef = _ref.withRef,
      withRef = _ref$withRef === undefined ? false : _ref$withRef,
      connectOptions = _objectWithoutProperties(_ref, ['getDisplayName', 'methodName', 'renderCountProp', 'shouldHandleStateChanges', 'storeKey', 'withRef']);

  var subscriptionKey = storeKey + 'Subscription';
  var version = hotReloadingVersion++;

  var contextTypes = (_contextTypes = {}, _contextTypes[storeKey] = _PropTypes.storeShape, _contextTypes[subscriptionKey] = _PropTypes.subscriptionShape, _contextTypes);
  var childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = _PropTypes.subscriptionShape, _childContextTypes);

  return function wrapWithConnect(WrappedComponent) {
    (0, _invariant2.default)(typeof WrappedComponent == 'function', 'You must pass a component to the function returned by ' + ('connect. Instead received ' + JSON.stringify(WrappedComponent)));

    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      withRef: withRef,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent
    });

    var Connect = function (_Component) {
      _inherits(Connect, _Component);

      function Connect(props, context) {
        _classCallCheck(this, Connect);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.version = version;
        _this.state = {};
        _this.renderCount = 0;
        _this.store = props[storeKey] || context[storeKey];
        _this.propsMode = Boolean(props[storeKey]);
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);

        (0, _invariant2.default)(_this.store, 'Could not find "' + storeKey + '" in either the context or props of ' + ('"' + displayName + '". Either wrap the root component in a <Provider>, ') + ('or explicitly pass "' + storeKey + '" as a prop to "' + displayName + '".'));

        _this.initSelector();
        _this.initSubscription();
        return _this;
      }

      Connect.prototype.getChildContext = function getChildContext() {
        var _ref2;

        // If this component received store from props, its subscription should be transparent
        // to any descendants receiving store+subscription from context; it passes along
        // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
        // Connect to control ordering of notifications to flow top-down.
        var subscription = this.propsMode ? null : this.subscription;
        return _ref2 = {}, _ref2[subscriptionKey] = subscription || this.context[subscriptionKey], _ref2;
      };

      Connect.prototype.componentDidMount = function componentDidMount() {
        if (!shouldHandleStateChanges) return;

        // componentWillMount fires during server side rendering, but componentDidMount and
        // componentWillUnmount do not. Because of this, trySubscribe happens during ...didMount.
        // Otherwise, unsubscription would never take place during SSR, causing a memory leak.
        // To handle the case where a child component may have triggered a state change by
        // dispatching an action in its componentWillMount, we have to re-run the select and maybe
        // re-render.
        this.subscription.trySubscribe();
        this.selector.run(this.props);
        if (this.selector.shouldComponentUpdate) this.forceUpdate();
      };

      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps);
      };

      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return this.selector.shouldComponentUpdate;
      };

      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.subscription) this.subscription.tryUnsubscribe();
        this.subscription = null;
        this.notifyNestedSubs = noop;
        this.store = null;
        this.selector.run = noop;
        this.selector.shouldComponentUpdate = false;
      };

      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
        (0, _invariant2.default)(withRef, 'To access the wrapped instance, you need to specify ' + ('{ withRef: true } in the options argument of the ' + methodName + '() call.'));
        return this.wrappedInstance;
      };

      Connect.prototype.setWrappedInstance = function setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      };

      Connect.prototype.initSelector = function initSelector() {
        var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
        this.selector = makeSelectorStateful(sourceSelector, this.store);
        this.selector.run(this.props);
      };

      Connect.prototype.initSubscription = function initSubscription() {
        if (!shouldHandleStateChanges) return;

        // parentSub's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.
        var parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
        this.subscription = new _Subscription2.default(this.store, parentSub, this.onStateChange.bind(this));

        // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
        // the middle of the notification loop, where `this.subscription` will then be null. An
        // extra null check every change can be avoided by copying the method onto `this` and then
        // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
        // listeners logic is changed to not call listeners that have been unsubscribed in the
        // middle of the notification loop.
        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
      };

      Connect.prototype.onStateChange = function onStateChange() {
        this.selector.run(this.props);

        if (!this.selector.shouldComponentUpdate) {
          this.notifyNestedSubs();
        } else {
          this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
          this.setState(dummyState);
        }
      };

      Connect.prototype.notifyNestedSubsOnComponentDidUpdate = function notifyNestedSubsOnComponentDidUpdate() {
        // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
        // needs to notify nested subs. Once called, it unimplements itself until further state
        // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
        // a boolean check every time avoids an extra method call most of the time, resulting
        // in some perf boost.
        this.componentDidUpdate = undefined;
        this.notifyNestedSubs();
      };

      Connect.prototype.isSubscribed = function isSubscribed() {
        return Boolean(this.subscription) && this.subscription.isSubscribed();
      };

      Connect.prototype.addExtraProps = function addExtraProps(props) {
        if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props;
        // make a shallow copy so that fields added don't leak to the original selector.
        // this is especially important for 'ref' since that's a reference back to the component
        // instance. a singleton memoized selector would then be holding a reference to the
        // instance, preventing the instance from being garbage collected, and that would be bad
        var withExtras = _extends({}, props);
        if (withRef) withExtras.ref = this.setWrappedInstance;
        if (renderCountProp) withExtras[renderCountProp] = this.renderCount++;
        if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription;
        return withExtras;
      };

      Connect.prototype.render = function render() {
        var selector = this.selector;
        selector.shouldComponentUpdate = false;

        if (selector.error) {
          throw selector.error;
        } else {
          return (0, _react.createElement)(WrappedComponent, this.addExtraProps(selector.props));
        }
      };

      return Connect;
    }(_react.Component);

    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;
    Connect.childContextTypes = childContextTypes;
    Connect.contextTypes = contextTypes;
    Connect.propTypes = contextTypes;

    if (true) {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        var _this2 = this;

        // We are hot reloading!
        if (this.version !== version) {
          this.version = version;
          this.initSelector();

          // If any connected descendants don't hot reload (and resubscribe in the process), their
          // listeners will be lost when we unsubscribe. Unfortunately, by copying over all
          // listeners, this does mean that the old versions of connected descendants will still be
          // notified of state changes; however, their onStateChange function is a no-op so this
          // isn't a huge deal.
          var oldListeners = [];

          if (this.subscription) {
            oldListeners = this.subscription.listeners.get();
            this.subscription.tryUnsubscribe();
          }
          this.initSubscription();
          if (shouldHandleStateChanges) {
            this.subscription.trySubscribe();
            oldListeners.forEach(function (listener) {
              return _this2.subscription.listeners.subscribe(listener);
            });
          }
        }
      };
    }

    return (0, _hoistNonReactStatics2.default)(Connect, WrappedComponent);
  };
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTypes = undefined;
exports.default = createStore;

var _isPlainObject = __webpack_require__(8);

var _isPlainObject2 = babelHelpers.interopRequireDefault(_isPlainObject);

var _symbolObservable = __webpack_require__(49);

var _symbolObservable2 = babelHelpers.interopRequireDefault(_symbolObservable);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2.default)(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if ((typeof observer === 'undefined' ? 'undefined' : babelHelpers.typeof(observer)) !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2.default] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2.default] = observable, _ref2;
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _root = __webpack_require__(42);

var _root2 = babelHelpers.interopRequireDefault(_root);

/** Built-in value references. */
var _Symbol = _root2.default.Symbol;

exports.default = _Symbol;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : babelHelpers.typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapMapToPropsConstant = wrapMapToPropsConstant;
exports.getDependsOnOwnProps = getDependsOnOwnProps;
exports.wrapMapToPropsFunc = wrapMapToPropsFunc;

var _verifyPlainObject = __webpack_require__(23);

var _verifyPlainObject2 = babelHelpers.interopRequireDefault(_verifyPlainObject);

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }
    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
}

// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
// 
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}

// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
// 
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//    
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//    
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//    
function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    };

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (true) (0, _verifyPlainObject2.default)(props, displayName, methodName);

      return props;
    };

    return proxy;
  };
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyPlainObject;

var _isPlainObject = __webpack_require__(8);

var _isPlainObject2 = babelHelpers.interopRequireDefault(_isPlainObject);

var _warning = __webpack_require__(7);

var _warning2 = babelHelpers.interopRequireDefault(_warning);

function verifyPlainObject(value, displayName, methodName) {
  if (!(0, _isPlainObject2.default)(value)) {
    (0, _warning2.default)(methodName + '() in ' + displayName + ' must return a plain object. Instead received ' + value + '.');
  }
}

/***/ }),
/* 24 */
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
  selected: _propTypes.string
};
exports.default = Select;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.versionFilterUpdated = exports.priorityFilterUpdated = exports.categoryFilterUpdated = undefined;

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(4);

var _superagentCache2 = babelHelpers.interopRequireDefault(_superagentCache);

(0, _superagentCache2.default)(_superagent2.default);

// export const requestListIssues = (endpoint) => ({
//   type: 'REQUEST_LIST_ISSUES',
//   endpoint
// });
// export const receiveListIssues = (endpoint, list) => ({
//   type: 'RECEIVE_LIST_ISSUES',
//   endpoint,
//   list
// });
// export const getListIssues = (endpoint) => (dispatch) => {
//   return dispatch(apiFetch(endpoint));
// };
//
// const apiFetch = (endpoint) => (dispatch) => {
//   dispatch(requestListIssues(endpoint));
//   const request = superagent
//     .get(endpoint)
//     .backgroundRefresh();
//   return request
//   .end((err, { body }) => {
//     return dispatch(receiveListIssues(endpoint, body.list));
//   })
// };

var categoryFilterUpdated = exports.categoryFilterUpdated = function categoryFilterUpdated(value) {
  return {
    type: 'CATEGORY_FILTER_UPDATED',
    value: value
  };
};
var priorityFilterUpdated = exports.priorityFilterUpdated = function priorityFilterUpdated(value) {
  return {
    type: 'PRIORITY_FILTER_UPDATED',
    value: value
  };
};
var versionFilterUpdated = exports.versionFilterUpdated = function versionFilterUpdated(value) {
  return {
    type: 'VERSION_FILTER_UPDATED',
    value: value
  };
};

/***/ }),
/* 26 */
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(6);

var _filters = __webpack_require__(72);

exports.default = (0, _redux.combineReducers)({
  categoryFilterReducer: _filters.categoryFilterReducer,
  priorityFilterReducer: _filters.priorityFilterReducer,
  versionFilterReducer: _filters.versionFilterReducer
});

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactDom = __webpack_require__(29);

var _board = __webpack_require__(30);

var _board2 = babelHelpers.interopRequireDefault(_board);

var _addBoard = __webpack_require__(73);

var _addBoard2 = babelHelpers.interopRequireDefault(_addBoard);

var _addSprint = __webpack_require__(74);

var _addSprint2 = babelHelpers.interopRequireDefault(_addSprint);

var _nodeBoard = __webpack_require__(75);

var _nodeBoard2 = babelHelpers.interopRequireDefault(_nodeBoard);

var _user = __webpack_require__(83);

var _user2 = babelHelpers.interopRequireDefault(_user);

var _nodeBoardForm = __webpack_require__(89);

var _nodeBoardForm2 = babelHelpers.interopRequireDefault(_nodeBoardForm);

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
if (document.getElementById('NodeBoard')) {
  // @todo move into component?
  var _resizeTimer = void 0;
  var _$banner = document.querySelector('header[role="banner"]');
  var _elMain = document.querySelector('main[role="main"]');
  _elMain.style.height = window.innerHeight - _$banner.offsetHeight + 'px';
  window.addEventListener('resize', function () {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(function () {
      _elMain.style.height = window.innerHeight - _$banner.offsetHeight + 'px';
    }, 250);
  });
  (0, _reactDom.render)(_react2.default.createElement(_nodeBoard2.default, null), document.getElementById('NodeBoard'));
}
if (document.getElementById('AddBoard')) {
  (0, _reactDom.render)(_react2.default.createElement(_addBoard2.default, null), document.getElementById('AddBoard'));
}
if (document.getElementById('AddSprint')) {
  (0, _reactDom.render)(_react2.default.createElement(_addSprint2.default, null), document.getElementById('AddSprint'));
}
if (document.getElementById('UserProfile')) {
  (0, _reactDom.render)(_react2.default.createElement(_user2.default, null), document.getElementById('UserProfile'));
}

if (document.getElementById('NodeBoardAddForm')) {
  (0, _reactDom.render)(_react2.default.createElement(_nodeBoardForm2.default, null), document.getElementById('NodeBoardAddForm'));
}

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _filters = __webpack_require__(31);

var _filters2 = babelHelpers.interopRequireDefault(_filters);

var _list = __webpack_require__(66);

var _list2 = babelHelpers.interopRequireDefault(_list);

var _reactRedux = __webpack_require__(3);

var _redux = __webpack_require__(6);

var _reducers = __webpack_require__(27);

var _reducers2 = babelHelpers.interopRequireDefault(_reducers);

var store = (0, _redux.createStore)(_reducers2.default, {
  categoryFilterReducer: '_any',
  priorityFilterReducer: '_any',
  versionFilterReducer: '_any'
});

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
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
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
        )
      );
    }
  }]);
  return Board;
}(_react.Component);

exports.default = Board;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactRedux = __webpack_require__(3);

var _select = __webpack_require__(24);

var _select2 = babelHelpers.interopRequireDefault(_select);

var _actions = __webpack_require__(25);

var Filters = function (_Component) {
  babelHelpers.inherits(Filters, _Component);

  function Filters(props) {
    babelHelpers.classCallCheck(this, Filters);

    var _this = babelHelpers.possibleConstructorReturn(this, (Filters.__proto__ || Object.getPrototypeOf(Filters)).call(this, props));

    _this.categoryOptions = [{ value: '_any', item: 'Any category' }, { value: 1, item: 'Bug report' }, { value: 2, item: 'Task' }, { value: 3, item: 'Feature request' }, { value: 4, item: 'Support request' }, { value: 5, item: 'Plan' }];
    _this.priorityOptions = [{ value: '_any', item: 'Any priority' }, { value: 400, item: 'Critical' }, { value: 300, item: 'Major' }, { value: 200, item: 'Normal' }, { value: 100, item: 'Minor' }];
    _this.versionOptions = [{ value: '_any', item: 'Any version' }, { value: '8.x', item: 'Drupal 8' }, { value: '7.x', item: 'Drupal 7' }];
    return _this;
  }

  babelHelpers.createClass(Filters, [{
    key: 'categoryChange',
    value: function categoryChange(e) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Filters',
        eventAction: 'change',
        eventLabel: 'Category'
      });
      this.props.categoryFilterUpdated(e.target.value);
    }
  }, {
    key: 'priorityChange',
    value: function priorityChange(e) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Filters',
        eventAction: 'change',
        eventLabel: 'Priority'
      });
      this.props.priorityFilterUpdated(e.target.value);
    }
  }, {
    key: 'versionChange',
    value: function versionChange(e) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Filters',
        eventAction: 'change',
        eventLabel: 'Version'
      });
      this.props.versionFilterUpdated(e.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'is-flex is-clearfix board--filters' },
        _react2.default.createElement(_select2.default, { data: this.categoryOptions, label: 'Category', selected: this.props.categoryFilter, onChange: this.categoryChange.bind(this) }),
        _react2.default.createElement(_select2.default, { data: this.priorityOptions, label: 'Priority', selected: this.props.priorityFilter, onChange: this.priorityChange.bind(this) })
      );
    }
  }]);
  return Filters;
}(_react.Component);

var mapStateToProps = function mapStateToProps(state) {
  return {
    categoryFilter: state.categoryFilterReducer,
    priorityFilter: state.priorityFilterReducer,
    versionFilter: state.versionFilterReducer
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    categoryFilterUpdated: function categoryFilterUpdated(value) {
      return dispatch((0, _actions.categoryFilterUpdated)(value));
    },
    priorityFilterUpdated: function priorityFilterUpdated(value) {
      return dispatch((0, _actions.priorityFilterUpdated)(value));
    },
    versionFilterUpdated: function versionFilterUpdated(value) {
      return dispatch((0, _actions.versionFilterUpdated)(value));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Filters);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProvider = createProvider;

var _react = __webpack_require__(0);

var _propTypes = __webpack_require__(1);

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _PropTypes = __webpack_require__(15);

var _warning = __webpack_require__(7);

var _warning2 = babelHelpers.interopRequireDefault(_warning);

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : babelHelpers.typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : babelHelpers.typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  (0, _warning2.default)('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

function createProvider() {
  var _Provider$childContex;

  var storeKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'store';
  var subKey = arguments[1];

  var subscriptionKey = subKey || storeKey + 'Subscription';

  var Provider = function (_Component) {
    _inherits(Provider, _Component);

    Provider.prototype.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, _ref;
    };

    function Provider(props, context) {
      _classCallCheck(this, Provider);

      var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

      _this[storeKey] = props.store;
      return _this;
    }

    Provider.prototype.render = function render() {
      return _react.Children.only(this.props.children);
    };

    return Provider;
  }(_react.Component);

  if (true) {
    Provider.prototype.componentWillReceiveProps = function (nextProps) {
      if (this[storeKey] !== nextProps.store) {
        warnAboutReceivingStore();
      }
    };
  }

  Provider.propTypes = {
    store: _PropTypes.storeShape.isRequired,
    children: _propTypes2.default.element.isRequired
  };
  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = _PropTypes.storeShape.isRequired, _Provider$childContex[subscriptionKey] = _PropTypes.subscriptionShape, _Provider$childContex);

  return Provider;
}

exports.default = createProvider();

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(10);
var invariant = __webpack_require__(11);
var warning = __webpack_require__(12);
var assign = __webpack_require__(13);

var ReactPropTypesSecret = __webpack_require__(14);
var checkPropTypes = __webpack_require__(34);

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
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  var invariant = __webpack_require__(11);
  var warning = __webpack_require__(12);
  var ReactPropTypesSecret = __webpack_require__(14);
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */


var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
};

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try {
                    // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
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

var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if (true) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

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
};

module.exports = invariant;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants

var CLEARED = null;
var nullListeners = {
  notify: function notify() {}
};

function createListenerCollection() {
  // the current/next pattern is copied from redux's createStore code.
  // TODO: refactor+expose that code to be reusable here?
  var current = [];
  var next = [];

  return {
    clear: function clear() {
      next = CLEARED;
      current = CLEARED;
    },
    notify: function notify() {
      var listeners = current = next;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
    },
    get: function get() {
      return next;
    },
    subscribe: function subscribe(listener) {
      var isSubscribed = true;
      if (next === current) next = current.slice();
      next.push(listener);

      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return;
        isSubscribed = false;

        if (next === current) next = current.slice();
        next.splice(next.indexOf(listener), 1);
      };
    }
  };
}

var Subscription = function () {
  function Subscription(store, parentSub, onStateChange) {
    _classCallCheck(this, Subscription);

    this.store = store;
    this.parentSub = parentSub;
    this.onStateChange = onStateChange;
    this.unsubscribe = null;
    this.listeners = nullListeners;
  }

  Subscription.prototype.addNestedSub = function addNestedSub(listener) {
    this.trySubscribe();
    return this.listeners.subscribe(listener);
  };

  Subscription.prototype.notifyNestedSubs = function notifyNestedSubs() {
    this.listeners.notify();
  };

  Subscription.prototype.isSubscribed = function isSubscribed() {
    return Boolean(this.unsubscribe);
  };

  Subscription.prototype.trySubscribe = function trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);

      this.listeners = createListenerCollection();
    }
  };

  Subscription.prototype.tryUnsubscribe = function tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.listeners.clear();
      this.listeners = nullListeners;
    }
  };

  return Subscription;
}();

exports.default = Subscription;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConnect = createConnect;

var _connectAdvanced = __webpack_require__(16);

var _connectAdvanced2 = babelHelpers.interopRequireDefault(_connectAdvanced);

var _shallowEqual = __webpack_require__(39);

var _shallowEqual2 = babelHelpers.interopRequireDefault(_shallowEqual);

var _mapDispatchToProps = __webpack_require__(40);

var _mapDispatchToProps2 = babelHelpers.interopRequireDefault(_mapDispatchToProps);

var _mapStateToProps = __webpack_require__(55);

var _mapStateToProps2 = babelHelpers.interopRequireDefault(_mapStateToProps);

var _mergeProps = __webpack_require__(56);

var _mergeProps2 = babelHelpers.interopRequireDefault(_mergeProps);

var _selectorFactory = __webpack_require__(57);

var _selectorFactory2 = babelHelpers.interopRequireDefault(_selectorFactory);

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error('Invalid value of type ' + (typeof arg === 'undefined' ? 'undefined' : babelHelpers.typeof(arg)) + ' for ' + name + ' argument when connecting component ' + options.wrappedComponentName + '.');
  };
}

function strictEqual(a, b) {
  return a === b;
}

// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
function createConnect() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === undefined ? _connectAdvanced2.default : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === undefined ? _mapStateToProps2.default : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === undefined ? _mapDispatchToProps2.default : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === undefined ? _mergeProps2.default : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === undefined ? _selectorFactory2.default : _ref$selectorFactory;

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref2$pure = _ref2.pure,
        pure = _ref2$pure === undefined ? true : _ref2$pure,
        _ref2$areStatesEqual = _ref2.areStatesEqual,
        areStatesEqual = _ref2$areStatesEqual === undefined ? strictEqual : _ref2$areStatesEqual,
        _ref2$areOwnPropsEqua = _ref2.areOwnPropsEqual,
        areOwnPropsEqual = _ref2$areOwnPropsEqua === undefined ? _shallowEqual2.default : _ref2$areOwnPropsEqua,
        _ref2$areStatePropsEq = _ref2.areStatePropsEqual,
        areStatePropsEqual = _ref2$areStatePropsEq === undefined ? _shallowEqual2.default : _ref2$areStatePropsEq,
        _ref2$areMergedPropsE = _ref2.areMergedPropsEqual,
        areMergedPropsEqual = _ref2$areMergedPropsE === undefined ? _shallowEqual2.default : _ref2$areMergedPropsE,
        extraOptions = _objectWithoutProperties(_ref2, ['pure', 'areStatesEqual', 'areOwnPropsEqual', 'areStatePropsEqual', 'areMergedPropsEqual']);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');

    return connectHOC(selectorFactory, _extends({
      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: function getDisplayName(name) {
        return 'Connect(' + name + ')';
      },

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual

    }, extraOptions));
  };
}

exports.default = createConnect();

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shallowEqual;
var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if ((typeof objA === 'undefined' ? 'undefined' : babelHelpers.typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : babelHelpers.typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whenMapDispatchToPropsIsFunction = whenMapDispatchToPropsIsFunction;
exports.whenMapDispatchToPropsIsMissing = whenMapDispatchToPropsIsMissing;
exports.whenMapDispatchToPropsIsObject = whenMapDispatchToPropsIsObject;

var _redux = __webpack_require__(6);

var _wrapMapToProps = __webpack_require__(22);

function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? (0, _wrapMapToProps.wrapMapToPropsFunc)(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}

function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? (0, _wrapMapToProps.wrapMapToPropsConstant)(function (dispatch) {
    return { dispatch: dispatch };
  }) : undefined;
}

function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && (typeof mapDispatchToProps === 'undefined' ? 'undefined' : babelHelpers.typeof(mapDispatchToProps)) === 'object' ? (0, _wrapMapToProps.wrapMapToPropsConstant)(function (dispatch) {
    return (0, _redux.bindActionCreators)(mapDispatchToProps, dispatch);
  }) : undefined;
}

exports.default = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol2 = __webpack_require__(18);

var _Symbol3 = babelHelpers.interopRequireDefault(_Symbol2);

var _getRawTag = __webpack_require__(44);

var _getRawTag2 = babelHelpers.interopRequireDefault(_getRawTag);

var _objectToString = __webpack_require__(45);

var _objectToString2 = babelHelpers.interopRequireDefault(_objectToString);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol3.default ? _Symbol3.default.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? (0, _getRawTag2.default)(value) : (0, _objectToString2.default)(value);
}

exports.default = baseGetTag;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _freeGlobal = __webpack_require__(43);

var _freeGlobal2 = babelHelpers.interopRequireDefault(_freeGlobal);

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : babelHelpers.typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal2.default || freeSelf || Function('return this')();

exports.default = root;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : babelHelpers.typeof(global)) == 'object' && global && global.Object === Object && global;

exports.default = freeGlobal;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Symbol2 = __webpack_require__(18);

var _Symbol3 = babelHelpers.interopRequireDefault(_Symbol2);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol3.default ? _Symbol3.default.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

exports.default = getRawTag;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

exports.default = objectToString;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _overArg = __webpack_require__(47);

var _overArg2 = babelHelpers.interopRequireDefault(_overArg);

/** Built-in value references. */
var getPrototype = (0, _overArg2.default)(Object.getPrototypeOf, Object);

exports.default = getPrototype;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

exports.default = overArg;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) == 'object';
}

exports.default = isObjectLike;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(51);

var _ponyfill2 = babelHelpers.interopRequireDefault(_ponyfill);

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2.default)(root);
exports.default = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19), __webpack_require__(50)(module)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineReducers;

var _createStore = __webpack_require__(17);

var _isPlainObject = __webpack_require__(8);

var _isPlainObject2 = babelHelpers.interopRequireDefault(_isPlainObject);

var _warning = __webpack_require__(20);

var _warning2 = babelHelpers.interopRequireDefault(_warning);

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2.default)(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (true) {
      if (typeof reducers[key] === 'undefined') {
        (0, _warning2.default)('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (true) {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (true) {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        (0, _warning2.default)(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if ((typeof actionCreators === 'undefined' ? 'undefined' : babelHelpers.typeof(actionCreators)) !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators === 'undefined' ? 'undefined' : babelHelpers.typeof(actionCreators)) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyMiddleware;

var _compose = __webpack_require__(21);

var _compose2 = babelHelpers.interopRequireDefault(_compose);

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2.default.apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whenMapStateToPropsIsFunction = whenMapStateToPropsIsFunction;
exports.whenMapStateToPropsIsMissing = whenMapStateToPropsIsMissing;

var _wrapMapToProps = __webpack_require__(22);

function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? (0, _wrapMapToProps.wrapMapToPropsFunc)(mapStateToProps, 'mapStateToProps') : undefined;
}

function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? (0, _wrapMapToProps.wrapMapToPropsConstant)(function () {
    return {};
  }) : undefined;
}

exports.default = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultMergeProps = defaultMergeProps;
exports.wrapMergePropsFunc = wrapMergePropsFunc;
exports.whenMergePropsIsFunction = whenMergePropsIsFunction;
exports.whenMergePropsIsOmitted = whenMergePropsIsOmitted;

var _verifyPlainObject = __webpack_require__(23);

var _verifyPlainObject2 = babelHelpers.interopRequireDefault(_verifyPlainObject);

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, ownProps, stateProps, dispatchProps);
}

function wrapMergePropsFunc(mergeProps) {
  return function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;

    var hasRunOnce = false;
    var mergedProps = void 0;

    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;

        if (true) (0, _verifyPlainObject2.default)(mergedProps, displayName, 'mergeProps');
      }

      return mergedProps;
    };
  };
}

function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}

function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function () {
    return defaultMergeProps;
  } : undefined;
}

exports.default = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.impureFinalPropsSelectorFactory = impureFinalPropsSelectorFactory;
exports.pureFinalPropsSelectorFactory = pureFinalPropsSelectorFactory;
exports.default = finalPropsSelectorFactory;

var _verifySubselectors = __webpack_require__(58);

var _verifySubselectors2 = babelHelpers.interopRequireDefault(_verifySubselectors);

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}

function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;

  var hasRunAtLeastOnce = false;
  var state = void 0;
  var ownProps = void 0;
  var stateProps = void 0;
  var dispatchProps = void 0;
  var mergedProps = void 0;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);

    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;

    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
}

// TODO: Add more comments

// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutProperties(_ref2, ['initMapStateToProps', 'initMapDispatchToProps', 'initMergeProps']);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  if (true) {
    (0, _verifySubselectors2.default)(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
  }

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;

  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifySubselectors;

var _warning = __webpack_require__(7);

var _warning2 = babelHelpers.interopRequireDefault(_warning);

function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error('Unexpected value for ' + methodName + ' in ' + displayName + '.');
  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
    if (!selector.hasOwnProperty('dependsOnOwnProps')) {
      (0, _warning2.default)('The selector for ' + methodName + ' of ' + displayName + ' did not specify a value for dependsOnOwnProps.');
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}

/***/ }),
/* 59 */
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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module of mixed-in functions shared between node and client code
 */

var isObject = __webpack_require__(26);

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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var utils = __webpack_require__(62);

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
/* 62 */
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
/* 63 */
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
/* 64 */
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
/* 65 */
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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _url = __webpack_require__(5);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _utils = __webpack_require__(9);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(4);

var _superagentCache2 = babelHelpers.interopRequireDefault(_superagentCache);

var _issue = __webpack_require__(67);

var _issue2 = babelHelpers.interopRequireDefault(_issue);

var _reactRedux = __webpack_require__(3);

(0, _superagentCache2.default)(_superagent2.default);

var List = function (_Component) {
  babelHelpers.inherits(List, _Component);

  function List(props) {
    babelHelpers.classCallCheck(this, List);

    var _this = babelHelpers.possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _this.state = {
      loaded: false,
      count: 0,
      issueList: []
    };
    return _this;
  }

  babelHelpers.createClass(List, [{
    key: 'buildEndpointUrl',
    value: function buildEndpointUrl() {
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
      } else if (this.props.categoryFilter !== '_any') {
        apiUrl.addParameter('field_issue_category', this.props.categoryFilter);
      }
      if (data['tag'] !== null) {
        apiUrl.addParameter('taxonomy_vocabulary_9[tid][]', data['tag']);
      }
      if (data['parent'] !== null) {
        apiUrl.addParameter('field_issue_parent', data['parent']);
      }
      if (data['priority'] !== null) {
        apiUrl.addParameter('field_issue_priority', data['priority']);
      } else if (this.props.priorityFilter !== '_any') {
        apiUrl.addParameter('field_issue_priority', this.props.priorityFilter);
      }
      (0, _utils.objectForeach)(data['version'], function (i, v) {
        apiUrl.addParameter('field_issue_version[value][]', v);
      });
      if (data['component'] !== null) {
        apiUrl.addParameter('field_issue_component', data['component']);
      }
      return apiUrl;
    }
  }, {
    key: 'fetchIssues',
    value: function fetchIssues() {
      var _this2 = this;

      var apiUrl = this.buildEndpointUrl();
      _superagent2.default.get(apiUrl.getEndpointUrl()).backgroundRefresh().end(function (err, _ref) {
        var body = _ref.body;

        _this2.setState({
          loaded: true,
          issueList: body.list,
          count: body.list.length
        });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchIssues();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      // Try and see if the logic in componentDidUpdate can belong here.
      return true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // Make sure this is not the first load.
      if (prevState.loaded && this.state.loaded) {
        console.log('Checking if new API request for ' + this.props.label);

        var shouldFetchNew = prevProps.categoryFilter !== this.props.categoryFilter || prevProps.priorityFilter !== this.props.priorityFilter || prevProps.versionFilter !== this.props.versionFilter;
        if (shouldFetchNew) {
          this.fetchIssues();
        }
      }
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


var mapStateToProps = function mapStateToProps(state) {
  return {
    categoryFilter: state.categoryFilterReducer,
    priorityFilter: state.priorityFilterReducer,
    versionFilter: state.versionFilterReducer
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(List);

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _version = __webpack_require__(68);

var _version2 = babelHelpers.interopRequireDefault(_version);

var _priority = __webpack_require__(69);

var _priority2 = babelHelpers.interopRequireDefault(_priority);

var _category = __webpack_require__(70);

var _category2 = babelHelpers.interopRequireDefault(_category);

var _project = __webpack_require__(71);

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
          { id: 'issue_' + data.nid },
          data.title,
          ' ',
          _react2.default.createElement(
            'a',
            { className: 'kanban-board--issue__link', id: 'issue_link_' + data.nid, href: Issue.getLink(data.nid), target: '_blank' },
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
/* 68 */
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
/* 69 */
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
/* 70 */
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _url = __webpack_require__(5);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(4);

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

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var categoryFilterReducer = exports.categoryFilterReducer = function categoryFilterReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case 'CATEGORY_FILTER_UPDATED':
      return action.value;
    default:
      return state;
  }
};
var priorityFilterReducer = exports.priorityFilterReducer = function priorityFilterReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case 'PRIORITY_FILTER_UPDATED':
      return action.value;
    default:
      return state;
  }
};
var versionFilterReducer = exports.versionFilterReducer = function versionFilterReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case 'VERSION_FILTER_UPDATED':
      return action.value;
    default:
      return state;
  }
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _url = __webpack_require__(5);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var AddBoard = function (_Component) {
  babelHelpers.inherits(AddBoard, _Component);

  function AddBoard(props) {
    babelHelpers.classCallCheck(this, AddBoard);

    var _this = babelHelpers.possibleConstructorReturn(this, (AddBoard.__proto__ || Object.getPrototypeOf(AddBoard)).call(this, props));

    _this.state = {
      processing: false,
      error: false,
      machineName: ''
    };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  babelHelpers.createClass(AddBoard, [{
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      var _this2 = this;

      event.preventDefault();
      this.setState({
        processing: true
      }, function () {
        _this2.validateMachineName();
      });
    }
  }, {
    key: 'validateMachineName',
    value: function validateMachineName() {
      var _this3 = this;

      var machineName = this.state.machineName.toLowerCase();
      var apiUrl = new _url2.default('node').addParameter('field_project_machine_name', machineName);
      _superagent2.default.get(apiUrl.getEndpointUrl()).end(function (err, _ref) {
        var body = _ref.body;

        if (body.list.length === 0) {
          // Not found.
          _this3.setState({
            processing: false,
            error: 'Project not found'
          });
        } else {
          var baseUrl = '' + window.location.origin + drupalSettings.path.baseUrl;
          _superagent2.default.post(baseUrl + 'api/boards/add/' + machineName).end(function (err, _ref2) {
            var body = _ref2.body;

            if (err) {
              console.log(err);
              _this3.setState({
                processing: false,
                error: 'Project not found'
              });
            } else {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Add Board',
                eventAction: 'add',
                eventLabel: _this3.state.machineName
              });
              window.location.href = '' + baseUrl + body.url;
            }
          });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        'form',
        { className: 'card', onSubmit: this.handleSubmit },
        _react2.default.createElement(
          'div',
          { className: 'card-content' },
          _react2.default.createElement(
            'div',
            { className: 'columns' },
            _react2.default.createElement('input', {
              type: 'text',
              value: this.state.machineName,
              size: '60',
              maxLength: '128',
              placeholder: 'Project machine name',
              className: 'form-text required input ' + (this.state.error ? ['is-danger'] : []),
              required: 'required',
              'aria-required': 'true',
              onChange: function onChange(e) {
                return _this4.setState({ machineName: e.target.value });
              },
              disabled: this.state.processing
            }),
            _react2.default.createElement(
              'button',
              {
                type: 'submit',
                className: 'is-info button ' + (this.state.processing ? ['is-loading'] : []),
                disabled: this.state.processing
              },
              'Add a project'
            )
          ),
          this.state.error ? [_react2.default.createElement(
            'p',
            { className: 'help is-danger' },
            'This project is invalid'
          )] : []
        )
      );
    }
  }]);
  return AddBoard;
}(_react.Component);

exports.default = AddBoard;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _url = __webpack_require__(5);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var AddSprint = function (_Component) {
  babelHelpers.inherits(AddSprint, _Component);

  function AddSprint(props) {
    babelHelpers.classCallCheck(this, AddSprint);

    var _this = babelHelpers.possibleConstructorReturn(this, (AddSprint.__proto__ || Object.getPrototypeOf(AddSprint)).call(this, props));

    _this.state = {
      processing: false,
      error: false,
      tag: ''
    };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  babelHelpers.createClass(AddSprint, [{
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      var _this2 = this;

      event.preventDefault();
      this.setState({
        processing: true
      }, function () {
        _this2.validateTag();
      });
    }
  }, {
    key: 'validateTag',
    value: function validateTag() {
      var _this3 = this;

      var apiUrl = new _url2.default('taxonomy_term').addParameter('name', this.state.tag);
      _superagent2.default.get(apiUrl.getEndpointUrl()).end(function (err, _ref) {
        var body = _ref.body;

        if (body.list.length === 0) {
          // Not found.
          _this3.setState({
            processing: false,
            error: 'Tag not found'
          });
        } else {
          var baseUrl = '' + window.location.origin + drupalSettings.path.baseUrl;
          _superagent2.default.post(baseUrl + 'api/boards/add/tag/' + encodeURIComponent(_this3.state.tag)).end(function (err, _ref2) {
            var body = _ref2.body;

            if (err) {
              console.log(err);
              _this3.setState({
                processing: false,
                error: 'Tag not found'
              });
            } else {
              if (window.ga !== undefined) {
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'Add Sprint',
                  eventAction: 'add',
                  eventLabel: _this3.state.tag
                });
              }
              debugger;
              window.location.href = '' + baseUrl + body.url;
            }
          });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        'form',
        { className: 'card', onSubmit: this.handleSubmit },
        _react2.default.createElement(
          'div',
          { className: 'card-content' },
          _react2.default.createElement(
            'div',
            { className: 'columns' },
            _react2.default.createElement('input', {
              type: 'text',
              value: this.state.machineName,
              size: '60',
              maxLength: '128',
              placeholder: 'Tag name',
              className: 'form-text required input ' + (this.state.error ? ['is-danger'] : []),
              required: 'required',
              'aria-required': 'true',
              onChange: function onChange(e) {
                return _this4.setState({ tag: e.target.value });
              },
              disabled: this.state.processing
            }),
            _react2.default.createElement(
              'button',
              {
                type: 'submit',
                className: 'is-info button ' + (this.state.processing ? ['is-loading'] : []),
                disabled: this.state.processing
              },
              'Add sprint'
            )
          ),
          this.state.error ? [_react2.default.createElement(
            'p',
            { className: 'help is-danger' },
            'This tag is invalid'
          )] : []
        )
      );
    }
  }]);
  return AddSprint;
}(_react.Component);

exports.default = AddSprint;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _filters = __webpack_require__(76);

var _filters2 = babelHelpers.interopRequireDefault(_filters);

var _list = __webpack_require__(77);

var _list2 = babelHelpers.interopRequireDefault(_list);

var _reactRedux = __webpack_require__(3);

var _redux = __webpack_require__(6);

var _reducers = __webpack_require__(27);

var _reducers2 = babelHelpers.interopRequireDefault(_reducers);

var _url = __webpack_require__(5);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(4);

var _superagentCache2 = babelHelpers.interopRequireDefault(_superagentCache);

var _utils = __webpack_require__(9);

(0, _superagentCache2.default)(_superagent2.default);

var store = (0, _redux.createStore)(_reducers2.default, {
  categoryFilterReducer: '_any',
  priorityFilterReducer: '_any',
  versionFilterReducer: '_any'
});

var NodeBoard = function (_Component) {
  babelHelpers.inherits(NodeBoard, _Component);

  function NodeBoard() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, NodeBoard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = NodeBoard.__proto__ || Object.getPrototypeOf(NodeBoard)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false,
      issues: []
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(NodeBoard, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var nids = JSON.parse(drupalSettings.board.nids);
      console.log(nids);

      var apiUrl = new _url2.default('node');
      for (var i = 0; i < nids.length; i++) {
        apiUrl.addParameter('nid[]', nids[i]);
      }
      console.log(apiUrl.getEndpointUrl());
      _superagent2.default.get(apiUrl.getEndpointUrl()).backgroundRefresh().end(function (err, _ref2) {
        var body = _ref2.body;

        _this2.setState({
          loaded: true,
          issues: body.list
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var uuid = drupalSettings.board.uuid;
      return _react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          "div",
          { style: {
              position: 'relative',
              height: '100%'
            } },
          _react2.default.createElement(
            "div",
            { className: "board--filters is-pulled-right " },
            _react2.default.createElement(
              "div",
              { className: "control" },
              uuid.length > 0 ? [_react2.default.createElement(
                "a",
                { className: "button is-outlined is-info", href: _utils.baseUrl + "node-board/" + uuid + "/edit" },
                "Edit"
              )] : [_react2.default.createElement(
                "a",
                { className: "button is-outlined is-info", href: _utils.baseUrl + "user/" + drupalSettings.user.uid },
                "Back"
              )]
            )
          ),
          _react2.default.createElement(_filters2.default, null),
          _react2.default.createElement(
            "div",
            { className: "board--list__scroll-fix" },
            _react2.default.createElement(
              "div",
              { className: "board--list__container" },
              _react2.default.createElement(_list2.default, { label: "Postponed", data: this.state.issues, statuses: [4, 6] }),
              _react2.default.createElement(_list2.default, { label: "Active", data: this.state.issues, statuses: [1] }),
              _react2.default.createElement(_list2.default, { label: "Needs Work", data: this.state.issues, statuses: [13] }),
              _react2.default.createElement(_list2.default, { label: "Needs Review", data: this.state.issues, statuses: [8] }),
              _react2.default.createElement(_list2.default, { label: "Reviewed & Tested", data: this.state.issues, statuses: [14, 15] }),
              _react2.default.createElement(_list2.default, { label: "Fixed", data: this.state.issues, statuses: [2] })
            )
          )
        )
      );
    }
  }]);
  return NodeBoard;
}(_react.Component);

exports.default = NodeBoard;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactRedux = __webpack_require__(3);

var _select = __webpack_require__(24);

var _select2 = babelHelpers.interopRequireDefault(_select);

var _actions = __webpack_require__(25);

var Filters = function (_Component) {
  babelHelpers.inherits(Filters, _Component);

  function Filters(props) {
    babelHelpers.classCallCheck(this, Filters);

    var _this = babelHelpers.possibleConstructorReturn(this, (Filters.__proto__ || Object.getPrototypeOf(Filters)).call(this, props));

    _this.categoryOptions = [{ value: '_any', item: 'Any category' }, { value: 1, item: 'Bug report' }, { value: 2, item: 'Task' }, { value: 3, item: 'Feature request' }, { value: 4, item: 'Support request' }, { value: 5, item: 'Plan' }];
    _this.priorityOptions = [{ value: '_any', item: 'Any priority' }, { value: 400, item: 'Critical' }, { value: 300, item: 'Major' }, { value: 200, item: 'Normal' }, { value: 100, item: 'Minor' }];
    _this.versionOptions = [{ value: '_any', item: 'Any version' }, { value: '8.x', item: 'Drupal 8' }, { value: '7.x', item: 'Drupal 7' }];
    return _this;
  }

  babelHelpers.createClass(Filters, [{
    key: 'categoryChange',
    value: function categoryChange(e) {
      this.props.categoryFilterUpdated(e.target.value);
    }
  }, {
    key: 'priorityChange',
    value: function priorityChange(e) {
      this.props.priorityFilterUpdated(e.target.value);
    }
  }, {
    key: 'versionChange',
    value: function versionChange(e) {
      this.props.versionFilterUpdated(e.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'is-flex is-clearfix board--filters' },
        _react2.default.createElement(_select2.default, { data: this.categoryOptions, label: 'Category', selected: this.props.categoryFilter, onChange: this.categoryChange.bind(this) }),
        _react2.default.createElement(_select2.default, { data: this.priorityOptions, label: 'Priority', selected: this.props.priorityFilter, onChange: this.priorityChange.bind(this) })
      );
    }
  }]);
  return Filters;
}(_react.Component);

var mapStateToProps = function mapStateToProps(state) {
  return {
    categoryFilter: state.categoryFilterReducer,
    priorityFilter: state.priorityFilterReducer,
    versionFilter: state.versionFilterReducer
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    categoryFilterUpdated: function categoryFilterUpdated(value) {
      return dispatch((0, _actions.categoryFilterUpdated)(value));
    },
    priorityFilterUpdated: function priorityFilterUpdated(value) {
      return dispatch((0, _actions.priorityFilterUpdated)(value));
    },
    versionFilterUpdated: function versionFilterUpdated(value) {
      return dispatch((0, _actions.versionFilterUpdated)(value));
    }
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Filters);

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(4);

var _superagentCache2 = babelHelpers.interopRequireDefault(_superagentCache);

var _issue = __webpack_require__(78);

var _issue2 = babelHelpers.interopRequireDefault(_issue);

var _reactRedux = __webpack_require__(3);

(0, _superagentCache2.default)(_superagent2.default);

var List = function (_Component) {
  babelHelpers.inherits(List, _Component);

  function List(props) {
    babelHelpers.classCallCheck(this, List);

    var _this = babelHelpers.possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _this.state = {
      loaded: false,
      issues: []
    };
    return _this;
  }

  babelHelpers.createClass(List, [{
    key: 'refreshIssues',
    value: function refreshIssues() {
      var validStatuses = this.props.statuses;
      this.setState({
        loaded: true,
        issues: this.props.data.filter(function (issue) {
          return validStatuses.indexOf(parseInt(issue.field_issue_status)) > -1;
        })
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refreshIssues();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.data.length !== prevProps.data.length) {
        this.refreshIssues();
      }
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
          this.state.loaded ? [this.state.issues.length] : [],
          ')'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'board--list__items' },
            this.state.issues.map(function (issue) {
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
  data: _propTypes.array.isRequired,
  statuses: _propTypes.array.isRequired
};


var mapStateToProps = function mapStateToProps(state) {
  return {
    categoryFilter: state.categoryFilterReducer,
    priorityFilter: state.priorityFilterReducer,
    versionFilter: state.versionFilterReducer
  };
};
var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(List);

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _version = __webpack_require__(79);

var _version2 = babelHelpers.interopRequireDefault(_version);

var _priority = __webpack_require__(80);

var _priority2 = babelHelpers.interopRequireDefault(_priority);

var _category = __webpack_require__(81);

var _category2 = babelHelpers.interopRequireDefault(_category);

var _project = __webpack_require__(82);

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
/* 79 */
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
/* 80 */
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
/* 81 */
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
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _url = __webpack_require__(5);

var _url2 = babelHelpers.interopRequireDefault(_url);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _superagentCache = __webpack_require__(4);

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

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _gravatar = __webpack_require__(84);

var _gravatar2 = babelHelpers.interopRequireDefault(_gravatar);

var _myBoards = __webpack_require__(88);

var _myBoards2 = babelHelpers.interopRequireDefault(_myBoards);

var baseUrl = "" + window.location.origin + drupalSettings.path.baseUrl;

var UserProfile = function (_Component) {
  babelHelpers.inherits(UserProfile, _Component);

  function UserProfile(props) {
    babelHelpers.classCallCheck(this, UserProfile);

    var _this = babelHelpers.possibleConstructorReturn(this, (UserProfile.__proto__ || Object.getPrototypeOf(UserProfile)).call(this, props));

    _this.state = drupalSettings.user;
    return _this;
  }

  babelHelpers.createClass(UserProfile, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "columns" },
        _react2.default.createElement(
          "div",
          { className: "column is-half is-offset-one-quarter" },
          _react2.default.createElement(
            "div",
            { className: "box" },
            _react2.default.createElement(
              "section",
              { className: "media" },
              _react2.default.createElement(
                "div",
                { className: "media-left" },
                _react2.default.createElement(_gravatar2.default, { md5: this.state.gravatar, name: this.state.email })
              ),
              _react2.default.createElement(
                "div",
                { className: "media-content" },
                _react2.default.createElement(
                  "div",
                  { className: "content" },
                  _react2.default.createElement(
                    "h1",
                    null,
                    this.state.email
                  ),
                  _react2.default.createElement(
                    "nav",
                    { className: "level is-mobile" },
                    _react2.default.createElement(
                      "div",
                      { className: "level-left" },
                      _react2.default.createElement(
                        "div",
                        { className: "level-item" },
                        _react2.default.createElement(
                          "a",
                          { href: baseUrl + "user/" + this.state.uid + "/edit" },
                          "Edit"
                        )
                      ),
                      _react2.default.createElement(
                        "div",
                        { className: "level-item" },
                        _react2.default.createElement(
                          "a",
                          { href: baseUrl + "user/" + this.state.uid + "/issues" },
                          "My issues"
                        )
                      )
                    )
                  )
                )
              )
            )
          ),
          _react2.default.createElement(_myBoards2.default, { uid: this.state.uid })
        )
      );
    }
  }]);
  return UserProfile;
}(_react.Component);

exports.default = UserProfile;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _queryString = __webpack_require__(85);

var _queryString2 = babelHelpers.interopRequireDefault(_queryString);

var _propTypes = __webpack_require__(1);

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var Gravatar = function (_Component) {
  babelHelpers.inherits(Gravatar, _Component);

  function Gravatar() {
    babelHelpers.classCallCheck(this, Gravatar);
    return babelHelpers.possibleConstructorReturn(this, (Gravatar.__proto__ || Object.getPrototypeOf(Gravatar)).apply(this, arguments));
  }

  babelHelpers.createClass(Gravatar, [{
    key: 'render',
    value: function render() {
      var base = 'https://www.gravatar.com/avatar/';
      var query = _queryString2.default.stringify({
        s: this.props.size,
        r: this.props.rating,
        d: this.props.default
      });
      var retinaQuery = _queryString2.default.stringify({
        s: this.props.size * 2,
        r: this.props.rating,
        d: this.props.default
      });
      var src = '' + base + this.props.md5 + '?' + query;
      var retinaSrc = '' + base + this.props.md5 + '?' + retinaQuery;

      return _react2.default.createElement(
        'figure',
        { className: 'image is-128x128' },
        _react2.default.createElement('img', {
          alt: 'Gravatar for ' + this.props.name,
          style: this.props.style,
          src: src,
          srcSet: retinaSrc + ' 2x',
          height: this.props.size,
          width: this.props.size,
          className: 'user-profile-gravatar'
        })
      );
    }
  }]);
  return Gravatar;
}(_react.Component);

Gravatar.propTypes = {
  name: _propTypes2.default.string,
  md5: _propTypes2.default.string,
  size: _propTypes2.default.number,
  rating: _propTypes2.default.string,
  default: _propTypes2.default.string
};
Gravatar.defaultProps = {
  size: 128,
  rating: 'g',
  default: 'identicon'
};
exports.default = Gravatar;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strictUriEncode = __webpack_require__(86);
var objectAssign = __webpack_require__(13);
var decodeComponent = __webpack_require__(87);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [encode(key, opts), '[', index, ']'].join('') : [encode(key, opts), '[', encode(index, opts), ']=', encode(value, opts)].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [encode(key, opts), '[]=', encode(value, opts)].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [encode(key, opts), '=', encode(value, opts)].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if ((typeof input === 'undefined' ? 'undefined' : babelHelpers.typeof(input)) === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	var queryStart = str.indexOf('?');
	if (queryStart === -1) {
		return '';
	}
	return str.slice(queryStart + 1);
};

exports.parse = function (str, opts) {
	opts = objectAssign({ arrayFormat: 'none' }, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^[?#&]/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeComponent(val);

		formatter(decodeComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + (typeof encodedURI === 'undefined' ? 'undefined' : babelHelpers.typeof(encodedURI)) + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var _propTypes = __webpack_require__(1);

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _utils = __webpack_require__(9);

var MyBoards = function (_Component) {
  babelHelpers.inherits(MyBoards, _Component);

  function MyBoards() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, MyBoards);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = MyBoards.__proto__ || Object.getPrototypeOf(MyBoards)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false,
      boards: []
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(MyBoards, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      _superagent2.default.get(_utils.baseUrl + 'api/user/' + this.props.uid + '/boards').end(function (err, _ref2) {
        var body = _ref2.body;

        _this2.setState({
          loaded: true,
          boards: body
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'box' },
        _react2.default.createElement(
          'a',
          { className: 'is-pulled-right button is-outlined is-info', href: _utils.baseUrl + 'user/' + this.props.uid + '/node-boards/add' },
          'Add Board'
        ),
        _react2.default.createElement(
          'h2',
          { className: 'is-size-4' },
          'My Boards'
        ),
        _react2.default.createElement(
          'table',
          { className: 'table is-fullwidth' },
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'th',
                null,
                'Title'
              ),
              _react2.default.createElement(
                'th',
                null,
                'Links'
              )
            )
          ),
          _react2.default.createElement(
            'tbody',
            null,
            this.state.boards.map(function (board) {
              return _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                  'td',
                  null,
                  _react2.default.createElement(
                    'a',
                    { href: _utils.baseUrl + 'node-board/' + board.uuid },
                    board.title
                  )
                ),
                _react2.default.createElement(
                  'td',
                  null,
                  _react2.default.createElement(
                    'nav',
                    { className: 'level is-mobile' },
                    _react2.default.createElement(
                      'div',
                      { className: 'level-left' },
                      _react2.default.createElement(
                        'a',
                        { className: 'level-item' },
                        _react2.default.createElement(
                          'a',
                          { href: _utils.baseUrl + 'node-board/' + board.uuid + '/edit' },
                          'Edit'
                        )
                      )
                    )
                  )
                )
              );
            })
          )
        )
      );
    }
  }]);
  return MyBoards;
}(_react.Component);

MyBoards.propTypes = {
  uid: _propTypes2.default.number
};
exports.default = MyBoards;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _superagent = __webpack_require__(2);

var _superagent2 = babelHelpers.interopRequireDefault(_superagent);

var baseUrl = '' + window.location.origin + drupalSettings.path.baseUrl;

var NodeBoardForm = function (_Component) {
  babelHelpers.inherits(NodeBoardForm, _Component);

  function NodeBoardForm(props) {
    babelHelpers.classCallCheck(this, NodeBoardForm);

    var _this = babelHelpers.possibleConstructorReturn(this, (NodeBoardForm.__proto__ || Object.getPrototypeOf(NodeBoardForm)).call(this, props));

    _this.state = {
      processing: false,
      error: false,
      boardId: null,
      uid: drupalSettings.form.uid,
      boardName: '',
      nodes: [
      // Provide a default empty text input.
      { nid: '' }],
      csrfToken: drupalSettings.form.csrfToken
    };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  babelHelpers.createClass(NodeBoardForm, [{
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      var _this2 = this;

      event.preventDefault();
      this.setState({
        processing: true
      }, function () {
        var entityObject = {
          title: [{
            value: _this2.state.boardName
          }],
          uid: [{
            target_id: _this2.state.uid
          }],
          nids: _this2.state.nodes.map(function (node) {
            return { value: node.nid };
          })
        };
        if (_this2.state.boardId !== null) {
          entityObject.board_id = [{
            value: _this2.state.boardId
          }];
        }

        console.log(entityObject);
        _superagent2.default.post(baseUrl + 'entity/node_board').set('X-CSRF-Token', _this2.state.csrfToken).send(entityObject).end(function (error, res) {
          if (res.statusCode === 201) {
            var body = JSON.parse(res.text);
            ga('send', {
              hitType: 'event',
              eventCategory: 'Add Node Board',
              eventAction: 'add',
              eventLabel: _this2.state.boardName
            });
            window.location.href = baseUrl + 'node-board/' + body.uuid[0].value;
          } else {
            ga('send', {
              hitType: 'event',
              eventCategory: 'Add Node Board',
              eventAction: 'error',
              eventLabel: error
            });
            console.log(error);
            console.log(res);
            alert('Error, check console logs');
          }
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        _react2.default.createElement(
          'div',
          { className: 'box' },
          _react2.default.createElement(
            'h1',
            { className: 'is-size-4' },
            'Add new node board'
          ),
          _react2.default.createElement(
            'div',
            { className: 'field' },
            _react2.default.createElement(
              'label',
              { className: 'label' },
              'Title'
            ),
            _react2.default.createElement(
              'div',
              { className: 'control' },
              _react2.default.createElement('input', { className: 'input', type: 'text', value: this.state.boardName, onChange: function onChange(e) {
                  return _this3.setState({ boardName: e.target.value });
                } })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'field' },
            _react2.default.createElement(
              'label',
              { className: 'label' },
              'Issue node IDs'
            ),
            this.state.nodes.map(function (node, id) {
              return _react2.default.createElement(
                'div',
                { className: 'control' },
                _react2.default.createElement('input', {
                  className: 'input',
                  type: 'text',
                  value: node.nid,
                  style: {
                    marginBottom: '10px'
                  },
                  onChange: function onChange(e) {
                    var newNid = e.target.value;
                    _this3.setState({
                      nodes: _this3.state.nodes.map(function (s, _id) {
                        if (_id !== id) return s;
                        return babelHelpers.extends({}, s, { nid: newNid });
                      })
                    });
                  }
                })
              );
            }),
            _react2.default.createElement(
              'button',
              {
                className: 'is-info button',
                type: 'button',
                onClick: function onClick(e) {
                  _this3.setState({
                    nodes: _this3.state.nodes.concat([{ nid: '' }])
                  });
                }
              },
              'Add another'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'control' },
            _react2.default.createElement(
              'button',
              { className: 'is-primary button ' + (this.state.processing ? ['is-loading'] : []) },
              'Submit'
            )
          )
        )
      );
    }
  }]);
  return NodeBoardForm;
}(_react.Component);

exports.default = NodeBoardForm;

/***/ })
/******/ ]);