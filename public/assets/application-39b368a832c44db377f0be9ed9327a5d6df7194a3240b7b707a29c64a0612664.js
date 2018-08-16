/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var cspNonce;

      cspNonce = Rails.cspNonce = function() {
        var meta;
        meta = document.querySelector('meta[name=csp-nonce]');
        return meta && meta.content;
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.nonce = cspNonce();
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.ActiveStorage=e():t.ActiveStorage=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,r){"use strict";function n(t){var e=a(document.head,'meta[name="'+t+'"]');if(e)return e.getAttribute("content")}function i(t,e){return"string"==typeof t&&(e=t,t=document),o(t.querySelectorAll(e))}function a(t,e){return"string"==typeof t&&(e=t,t=document),t.querySelector(e)}function u(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=t.disabled,i=r.bubbles,a=r.cancelable,u=r.detail,o=document.createEvent("Event");o.initEvent(e,i||!0,a||!0),o.detail=u||{};try{t.disabled=!1,t.dispatchEvent(o)}finally{t.disabled=n}return o}function o(t){return Array.isArray(t)?t:Array.from?Array.from(t):[].slice.call(t)}e.d=n,e.c=i,e.b=a,e.a=u,e.e=o},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(t&&"function"==typeof t[e]){for(var r=arguments.length,n=Array(r>2?r-2:0),i=2;i<r;i++)n[i-2]=arguments[i];return t[e].apply(t,n)}}r.d(e,"a",function(){return c});var a=r(6),u=r(8),o=r(9),s=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),f=0,c=function(){function t(e,r,i){n(this,t),this.id=++f,this.file=e,this.url=r,this.delegate=i}return s(t,[{key:"create",value:function(t){var e=this;a.a.create(this.file,function(r,n){if(r)return void t(r);var a=new u.a(e.file,n,e.url);i(e.delegate,"directUploadWillCreateBlobWithXHR",a.xhr),a.create(function(r){if(r)t(r);else{var n=new o.a(a);i(e.delegate,"directUploadWillStoreFileWithXHR",n.xhr),n.create(function(e){e?t(e):t(null,a.toJSON())})}})})}}]),t}()},function(t,e,r){"use strict";function n(){window.ActiveStorage&&Object(i.a)()}Object.defineProperty(e,"__esModule",{value:!0});var i=r(3),a=r(1);r.d(e,"start",function(){return i.a}),r.d(e,"DirectUpload",function(){return a.a}),setTimeout(n,1)},function(t,e,r){"use strict";function n(){d||(d=!0,document.addEventListener("submit",i),document.addEventListener("ajax:before",a))}function i(t){u(t)}function a(t){"FORM"==t.target.tagName&&u(t)}function u(t){var e=t.target;if(e.hasAttribute(l))return void t.preventDefault();var r=new c.a(e),n=r.inputs;n.length&&(t.preventDefault(),e.setAttribute(l,""),n.forEach(s),r.start(function(t){e.removeAttribute(l),t?n.forEach(f):o(e)}))}function o(t){var e=Object(h.b)(t,"input[type=submit]");if(e){var r=e,n=r.disabled;e.disabled=!1,e.focus(),e.click(),e.disabled=n}else e=document.createElement("input"),e.type="submit",e.style.display="none",t.appendChild(e),e.click(),t.removeChild(e)}function s(t){t.disabled=!0}function f(t){t.disabled=!1}e.a=n;var c=r(4),h=r(0),l="data-direct-uploads-processing",d=!1},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return s});var i=r(5),a=r(0),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o="input[type=file][data-direct-upload-url]:not([disabled])",s=function(){function t(e){n(this,t),this.form=e,this.inputs=Object(a.c)(e,o).filter(function(t){return t.files.length})}return u(t,[{key:"start",value:function(t){var e=this,r=this.createDirectUploadControllers();this.dispatch("start"),function n(){var i=r.shift();i?i.start(function(r){r?(t(r),e.dispatch("end")):n()}):(t(),e.dispatch("end"))}()}},{key:"createDirectUploadControllers",value:function(){var t=[];return this.inputs.forEach(function(e){Object(a.e)(e.files).forEach(function(r){var n=new i.a(e,r);t.push(n)})}),t}},{key:"dispatch",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object(a.a)(this.form,"direct-uploads:"+t,{detail:e})}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return o});var i=r(1),a=r(0),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=function(){function t(e,r){n(this,t),this.input=e,this.file=r,this.directUpload=new i.a(this.file,this.url,this),this.dispatch("initialize")}return u(t,[{key:"start",value:function(t){var e=this,r=document.createElement("input");r.type="hidden",r.name=this.input.name,this.input.insertAdjacentElement("beforebegin",r),this.dispatch("start"),this.directUpload.create(function(n,i){n?(r.parentNode.removeChild(r),e.dispatchError(n)):r.value=i.signed_id,e.dispatch("end"),t(n)})}},{key:"uploadRequestDidProgress",value:function(t){var e=t.loaded/t.total*100;e&&this.dispatch("progress",{progress:e})}},{key:"dispatch",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.file=this.file,e.id=this.directUpload.id,Object(a.a)(this.input,"direct-upload:"+t,{detail:e})}},{key:"dispatchError",value:function(t){this.dispatch("error",{error:t}).defaultPrevented||alert(t)}},{key:"directUploadWillCreateBlobWithXHR",value:function(t){this.dispatch("before-blob-request",{xhr:t})}},{key:"directUploadWillStoreFileWithXHR",value:function(t){var e=this;this.dispatch("before-storage-request",{xhr:t}),t.upload.addEventListener("progress",function(t){return e.uploadRequestDidProgress(t)})}},{key:"url",get:function(){return this.input.getAttribute("data-direct-upload-url")}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return s});var i=r(7),a=r.n(i),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=File.prototype.slice||File.prototype.mozSlice||File.prototype.webkitSlice,s=function(){function t(e){n(this,t),this.file=e,this.chunkSize=2097152,this.chunkCount=Math.ceil(this.file.size/this.chunkSize),this.chunkIndex=0}return u(t,null,[{key:"create",value:function(e,r){new t(e).create(r)}}]),u(t,[{key:"create",value:function(t){var e=this;this.callback=t,this.md5Buffer=new a.a.ArrayBuffer,this.fileReader=new FileReader,this.fileReader.addEventListener("load",function(t){return e.fileReaderDidLoad(t)}),this.fileReader.addEventListener("error",function(t){return e.fileReaderDidError(t)}),this.readNextChunk()}},{key:"fileReaderDidLoad",value:function(t){if(this.md5Buffer.append(t.target.result),!this.readNextChunk()){var e=this.md5Buffer.end(!0),r=btoa(e);this.callback(null,r)}}},{key:"fileReaderDidError",value:function(t){this.callback("Error reading "+this.file.name)}},{key:"readNextChunk",value:function(){if(this.chunkIndex<this.chunkCount){var t=this.chunkIndex*this.chunkSize,e=Math.min(t+this.chunkSize,this.file.size),r=o.call(this.file,t,e);return this.fileReader.readAsArrayBuffer(r),this.chunkIndex++,!0}return!1}}]),t}()},function(t,e,r){!function(e){t.exports=e()}(function(t){"use strict";function e(t,e){var r=t[0],n=t[1],i=t[2],a=t[3];r+=(n&i|~n&a)+e[0]-680876936|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[1]-389564586|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[2]+606105819|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[3]-1044525330|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[4]-176418897|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[5]+1200080426|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[6]-1473231341|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[7]-45705983|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[8]+1770035416|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[9]-1958414417|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[10]-42063|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[11]-1990404162|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[12]+1804603682|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[13]-40341101|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[14]-1502002290|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[15]+1236535329|0,n=(n<<22|n>>>10)+i|0,r+=(n&a|i&~a)+e[1]-165796510|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[6]-1069501632|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[11]+643717713|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[0]-373897302|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[5]-701558691|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[10]+38016083|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[15]-660478335|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[4]-405537848|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[9]+568446438|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[14]-1019803690|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[3]-187363961|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[8]+1163531501|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[13]-1444681467|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[2]-51403784|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[7]+1735328473|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[12]-1926607734|0,n=(n<<20|n>>>12)+i|0,r+=(n^i^a)+e[5]-378558|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[8]-2022574463|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[11]+1839030562|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[14]-35309556|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[1]-1530992060|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[4]+1272893353|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[7]-155497632|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[10]-1094730640|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[13]+681279174|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[0]-358537222|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[3]-722521979|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[6]+76029189|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[9]-640364487|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[12]-421815835|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[15]+530742520|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[2]-995338651|0,n=(n<<23|n>>>9)+i|0,r+=(i^(n|~a))+e[0]-198630844|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[7]+1126891415|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[14]-1416354905|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[5]-57434055|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[12]+1700485571|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[3]-1894986606|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[10]-1051523|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[1]-2054922799|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[8]+1873313359|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[15]-30611744|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[6]-1560198380|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[13]+1309151649|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[4]-145523070|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[11]-1120210379|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[2]+718787259|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[9]-343485551|0,n=(n<<21|n>>>11)+i|0,t[0]=r+t[0]|0,t[1]=n+t[1]|0,t[2]=i+t[2]|0,t[3]=a+t[3]|0}function r(t){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=t.charCodeAt(e)+(t.charCodeAt(e+1)<<8)+(t.charCodeAt(e+2)<<16)+(t.charCodeAt(e+3)<<24);return r}function n(t){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=t[e]+(t[e+1]<<8)+(t[e+2]<<16)+(t[e+3]<<24);return r}function i(t){var n,i,a,u,o,s,f=t.length,c=[1732584193,-271733879,-1732584194,271733878];for(n=64;n<=f;n+=64)e(c,r(t.substring(n-64,n)));for(t=t.substring(n-64),i=t.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],n=0;n<i;n+=1)a[n>>2]|=t.charCodeAt(n)<<(n%4<<3);if(a[n>>2]|=128<<(n%4<<3),n>55)for(e(c,a),n=0;n<16;n+=1)a[n]=0;return u=8*f,u=u.toString(16).match(/(.*?)(.{0,8})$/),o=parseInt(u[2],16),s=parseInt(u[1],16)||0,a[14]=o,a[15]=s,e(c,a),c}function a(t){var r,i,a,u,o,s,f=t.length,c=[1732584193,-271733879,-1732584194,271733878];for(r=64;r<=f;r+=64)e(c,n(t.subarray(r-64,r)));for(t=r-64<f?t.subarray(r-64):new Uint8Array(0),i=t.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],r=0;r<i;r+=1)a[r>>2]|=t[r]<<(r%4<<3);if(a[r>>2]|=128<<(r%4<<3),r>55)for(e(c,a),r=0;r<16;r+=1)a[r]=0;return u=8*f,u=u.toString(16).match(/(.*?)(.{0,8})$/),o=parseInt(u[2],16),s=parseInt(u[1],16)||0,a[14]=o,a[15]=s,e(c,a),c}function u(t){var e,r="";for(e=0;e<4;e+=1)r+=p[t>>8*e+4&15]+p[t>>8*e&15];return r}function o(t){var e;for(e=0;e<t.length;e+=1)t[e]=u(t[e]);return t.join("")}function s(t){return/[\u0080-\uFFFF]/.test(t)&&(t=unescape(encodeURIComponent(t))),t}function f(t,e){var r,n=t.length,i=new ArrayBuffer(n),a=new Uint8Array(i);for(r=0;r<n;r+=1)a[r]=t.charCodeAt(r);return e?a:i}function c(t){return String.fromCharCode.apply(null,new Uint8Array(t))}function h(t,e,r){var n=new Uint8Array(t.byteLength+e.byteLength);return n.set(new Uint8Array(t)),n.set(new Uint8Array(e),t.byteLength),r?n:n.buffer}function l(t){var e,r=[],n=t.length;for(e=0;e<n-1;e+=2)r.push(parseInt(t.substr(e,2),16));return String.fromCharCode.apply(String,r)}function d(){this.reset()}var p=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];return"5d41402abc4b2a76b9719d911017c592"!==o(i("hello"))&&function(t,e){var r=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(r>>16)<<16|65535&r},"undefined"==typeof ArrayBuffer||ArrayBuffer.prototype.slice||function(){function e(t,e){return t=0|t||0,t<0?Math.max(t+e,0):Math.min(t,e)}ArrayBuffer.prototype.slice=function(r,n){var i,a,u,o,s=this.byteLength,f=e(r,s),c=s;return n!==t&&(c=e(n,s)),f>c?new ArrayBuffer(0):(i=c-f,a=new ArrayBuffer(i),u=new Uint8Array(a),o=new Uint8Array(this,f,i),u.set(o),a)}}(),d.prototype.append=function(t){return this.appendBinary(s(t)),this},d.prototype.appendBinary=function(t){this._buff+=t,this._length+=t.length;var n,i=this._buff.length;for(n=64;n<=i;n+=64)e(this._hash,r(this._buff.substring(n-64,n)));return this._buff=this._buff.substring(n-64),this},d.prototype.end=function(t){var e,r,n=this._buff,i=n.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<i;e+=1)a[e>>2]|=n.charCodeAt(e)<<(e%4<<3);return this._finish(a,i),r=o(this._hash),t&&(r=l(r)),this.reset(),r},d.prototype.reset=function(){return this._buff="",this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},d.prototype.getState=function(){return{buff:this._buff,length:this._length,hash:this._hash}},d.prototype.setState=function(t){return this._buff=t.buff,this._length=t.length,this._hash=t.hash,this},d.prototype.destroy=function(){delete this._hash,delete this._buff,delete this._length},d.prototype._finish=function(t,r){var n,i,a,u=r;if(t[u>>2]|=128<<(u%4<<3),u>55)for(e(this._hash,t),u=0;u<16;u+=1)t[u]=0;n=8*this._length,n=n.toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(n[2],16),a=parseInt(n[1],16)||0,t[14]=i,t[15]=a,e(this._hash,t)},d.hash=function(t,e){return d.hashBinary(s(t),e)},d.hashBinary=function(t,e){var r=i(t),n=o(r);return e?l(n):n},d.ArrayBuffer=function(){this.reset()},d.ArrayBuffer.prototype.append=function(t){var r,i=h(this._buff.buffer,t,!0),a=i.length;for(this._length+=t.byteLength,r=64;r<=a;r+=64)e(this._hash,n(i.subarray(r-64,r)));return this._buff=r-64<a?new Uint8Array(i.buffer.slice(r-64)):new Uint8Array(0),this},d.ArrayBuffer.prototype.end=function(t){var e,r,n=this._buff,i=n.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<i;e+=1)a[e>>2]|=n[e]<<(e%4<<3);return this._finish(a,i),r=o(this._hash),t&&(r=l(r)),this.reset(),r},d.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},d.ArrayBuffer.prototype.getState=function(){var t=d.prototype.getState.call(this);return t.buff=c(t.buff),t},d.ArrayBuffer.prototype.setState=function(t){return t.buff=f(t.buff,!0),d.prototype.setState.call(this,t)},d.ArrayBuffer.prototype.destroy=d.prototype.destroy,d.ArrayBuffer.prototype._finish=d.prototype._finish,d.ArrayBuffer.hash=function(t,e){var r=a(new Uint8Array(t)),n=o(r);return e?l(n):n},d})},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return u});var i=r(0),a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=function(){function t(e,r,a){var u=this;n(this,t),this.file=e,this.attributes={filename:e.name,content_type:e.type,byte_size:e.size,checksum:r},this.xhr=new XMLHttpRequest,this.xhr.open("POST",a,!0),this.xhr.responseType="json",this.xhr.setRequestHeader("Content-Type","application/json"),this.xhr.setRequestHeader("Accept","application/json"),this.xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"),this.xhr.setRequestHeader("X-CSRF-Token",Object(i.d)("csrf-token")),this.xhr.addEventListener("load",function(t){return u.requestDidLoad(t)}),this.xhr.addEventListener("error",function(t){return u.requestDidError(t)})}return a(t,[{key:"create",value:function(t){this.callback=t,this.xhr.send(JSON.stringify({blob:this.attributes}))}},{key:"requestDidLoad",value:function(t){if(this.status>=200&&this.status<300){var e=this.response,r=e.direct_upload;delete e.direct_upload,this.attributes=e,this.directUploadData=r,this.callback(null,this.toJSON())}else this.requestDidError(t)}},{key:"requestDidError",value:function(t){this.callback('Error creating Blob for "'+this.file.name+'". Status: '+this.status)}},{key:"toJSON",value:function(){var t={};for(var e in this.attributes)t[e]=this.attributes[e];return t}},{key:"status",get:function(){return this.xhr.status}},{key:"response",get:function(){var t=this.xhr,e=t.responseType,r=t.response;return"json"==e?r:JSON.parse(r)}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return a});var i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),a=function(){function t(e){var r=this;n(this,t),this.blob=e,this.file=e.file;var i=e.directUploadData,a=i.url,u=i.headers;this.xhr=new XMLHttpRequest,this.xhr.open("PUT",a,!0),this.xhr.responseType="text";for(var o in u)this.xhr.setRequestHeader(o,u[o]);this.xhr.addEventListener("load",function(t){return r.requestDidLoad(t)}),this.xhr.addEventListener("error",function(t){return r.requestDidError(t)})}return i(t,[{key:"create",value:function(t){this.callback=t,this.xhr.send(this.file.slice())}},{key:"requestDidLoad",value:function(t){var e=this.xhr,r=e.status,n=e.response;r>=200&&r<300?this.callback(null,n):this.requestDidError(t)}},{key:"requestDidError",value:function(t){this.callback('Error storing "'+this.file.name+'". Status: '+this.xhr.status)}}]),t}()}])});
(function() {


}).call(this);
(function() {


}).call(this);
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=70)}([function(e,t,n){e.exports=n(82)()},function(e,t,n){"use strict";e.exports=n(71)},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o,i,a,u){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,o,i,a,u],s=0;(l=new Error(t.replace(/%s/g,function(){return c[s++]}))).name="Invariant Violation"}throw l.framesToPop=1,l}}},function(e,t,n){"use strict";var r=function(){};e.exports=r},function(e,t,n){"use strict";e.exports=function(){}},function(e,t,n){"use strict";var r=n(4),o=n.n(r),i=n(2),a=n.n(i);function u(e){return"/"===e.charAt(0)}function l(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}var c=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],r=t&&t.split("/")||[],o=e&&u(e),i=t&&u(t),a=o||i;if(e&&u(e)?r=n:n.length&&(r.pop(),r=r.concat(n)),!r.length)return"/";var c=void 0;if(r.length){var s=r[r.length-1];c="."===s||".."===s||""===s}else c=!1;for(var f=0,p=r.length;p>=0;p--){var d=r[p];"."===d?l(r,p):".."===d?(l(r,p),f++):f&&(l(r,p),f--)}if(!a)for(;f--;f)r.unshift("..");!a||""===r[0]||r[0]&&u(r[0])||r.unshift("");var h=r.join("/");return c&&"/"!==h.substr(-1)&&(h+="/"),h},s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var f=function e(t,n){if(t===n)return!0;if(null==t||null==n)return!1;if(Array.isArray(t))return Array.isArray(n)&&t.length===n.length&&t.every(function(t,r){return e(t,n[r])});var r=void 0===t?"undefined":s(t);if(r!==(void 0===n?"undefined":s(n)))return!1;if("object"===r){var o=t.valueOf(),i=n.valueOf();if(o!==t||i!==n)return e(o,i);var a=Object.keys(t),u=Object.keys(n);return a.length===u.length&&a.every(function(r){return e(t[r],n[r])})}return!1},p=function(e){return"/"===e.charAt(0)?e:"/"+e},d=function(e){return"/"===e.charAt(0)?e.substr(1):e},h=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)},v=function(e,t){return h(e,t)?e.substr(t.length):e},m=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},y=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},g=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o},b=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},_=function(e,t,n,r){var o=void 0;"string"==typeof e?(o=y(e)).state=t:(void 0===(o=b({},e)).pathname&&(o.pathname=""),o.search?"?"!==o.search.charAt(0)&&(o.search="?"+o.search):o.search="",o.hash?"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash):o.hash="",void 0!==t&&void 0===o.state&&(o.state=t));try{o.pathname=decodeURI(o.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(o.key=n),r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=c(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o},w=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&f(e.state,t.state)},E=function(){var e=null,t=[];return{setPrompt:function(t){return o()(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},confirmTransitionTo:function(t,n,r,i){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof r?r(a,i):(o()(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),i(!0)):i(!1!==a)}else i(!0)},appendListener:function(e){var n=!0,r=function(){n&&e.apply(void 0,arguments)};return t.push(r),function(){n=!1,t=t.filter(function(e){return e!==r})}},notifyListeners:function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];t.forEach(function(e){return e.apply(void 0,n)})}}},x=!("undefined"==typeof window||!window.document||!window.document.createElement),O=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},k=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},C=function(e,t){return t(window.confirm(e))},S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},j=function(){try{return window.history.state||{}}catch(e){return{}}},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};a()(x,"Browser history needs a DOM");var t=window.history,n=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&window.history&&"pushState"in window.history}(),r=!(-1===window.navigator.userAgent.indexOf("Trident")),i=e.forceRefresh,u=void 0!==i&&i,l=e.getUserConfirmation,c=void 0===l?C:l,s=e.keyLength,f=void 0===s?6:s,d=e.basename?m(p(e.basename)):"",y=function(e){var t=e||{},n=t.key,r=t.state,i=window.location,a=i.pathname+i.search+i.hash;return o()(!d||h(a,d),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+a+'" to begin with "'+d+'".'),d&&(a=v(a,d)),_(a,r,n)},b=function(){return Math.random().toString(36).substr(2,f)},w=E(),T=function(e){P(W,e),W.length=t.length,w.notifyListeners(W.location,W.action)},N=function(e){(function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")})(e)||A(y(e.state))},R=function(){A(y(j()))},M=!1,A=function(e){M?(M=!1,T()):w.confirmTransitionTo(e,"POP",c,function(t){t?T({action:"POP",location:e}):I(e)})},I=function(e){var t=W.location,n=D.indexOf(t.key);-1===n&&(n=0);var r=D.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(M=!0,L(o))},U=y(j()),D=[U.key],z=function(e){return d+g(e)},L=function(e){t.go(e)},F=0,B=function(e){1===(F+=e)?(O(window,"popstate",N),r&&O(window,"hashchange",R)):0===F&&(k(window,"popstate",N),r&&k(window,"hashchange",R))},H=!1,W={length:t.length,action:"POP",location:U,createHref:z,push:function(e,r){o()(!("object"===(void 0===e?"undefined":S(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var i=_(e,r,b(),W.location);w.confirmTransitionTo(i,"PUSH",c,function(e){if(e){var r=z(i),a=i.key,l=i.state;if(n)if(t.pushState({key:a,state:l},null,r),u)window.location.href=r;else{var c=D.indexOf(W.location.key),s=D.slice(0,-1===c?0:c+1);s.push(i.key),D=s,T({action:"PUSH",location:i})}else o()(void 0===l,"Browser history cannot push state in browsers that do not support HTML5 history"),window.location.href=r}})},replace:function(e,r){o()(!("object"===(void 0===e?"undefined":S(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var i=_(e,r,b(),W.location);w.confirmTransitionTo(i,"REPLACE",c,function(e){if(e){var r=z(i),a=i.key,l=i.state;if(n)if(t.replaceState({key:a,state:l},null,r),u)window.location.replace(r);else{var c=D.indexOf(W.location.key);-1!==c&&(D[c]=i.key),T({action:"REPLACE",location:i})}else o()(void 0===l,"Browser history cannot replace state in browsers that do not support HTML5 history"),window.location.replace(r)}})},go:L,goBack:function(){return L(-1)},goForward:function(){return L(1)},block:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=w.setPrompt(e);return H||(B(1),H=!0),function(){return H&&(H=!1,B(-1)),t()}},listen:function(e){var t=w.appendListener(e);return B(1),function(){B(-1),t()}}};return W},N=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},R={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+d(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:d,decodePath:p},slash:{encodePath:p,decodePath:p}},M=function(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)},A=function(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)},I=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};a()(x,"Hash history needs a DOM");var t=window.history,n=-1===window.navigator.userAgent.indexOf("Firefox"),r=e.getUserConfirmation,i=void 0===r?C:r,u=e.hashType,l=void 0===u?"slash":u,c=e.basename?m(p(e.basename)):"",s=R[l],f=s.encodePath,d=s.decodePath,y=function(){var e=d(M());return o()(!c||h(e,c),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+e+'" to begin with "'+c+'".'),c&&(e=v(e,c)),_(e)},b=E(),S=function(e){N($,e),$.length=t.length,b.notifyListeners($.location,$.action)},P=!1,j=null,T=function(){var e=M(),t=f(e);if(e!==t)A(t);else{var n=y(),r=$.location;if(!P&&w(r,n))return;if(j===g(n))return;j=null,I(n)}},I=function(e){P?(P=!1,S()):b.confirmTransitionTo(e,"POP",i,function(t){t?S({action:"POP",location:e}):U(e)})},U=function(e){var t=$.location,n=F.lastIndexOf(g(t));-1===n&&(n=0);var r=F.lastIndexOf(g(e));-1===r&&(r=0);var o=n-r;o&&(P=!0,B(o))},D=M(),z=f(D);D!==z&&A(z);var L=y(),F=[g(L)],B=function(e){o()(n,"Hash history go(n) causes a full page reload in this browser"),t.go(e)},H=0,W=function(e){1===(H+=e)?O(window,"hashchange",T):0===H&&k(window,"hashchange",T)},q=!1,$={length:t.length,action:"POP",location:L,createHref:function(e){return"#"+f(c+g(e))},push:function(e,t){o()(void 0===t,"Hash history cannot push state; it is ignored");var n=_(e,void 0,void 0,$.location);b.confirmTransitionTo(n,"PUSH",i,function(e){if(e){var t=g(n),r=f(c+t);if(M()!==r){j=t,function(e){window.location.hash=e}(r);var i=F.lastIndexOf(g($.location)),a=F.slice(0,-1===i?0:i+1);a.push(t),F=a,S({action:"PUSH",location:n})}else o()(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),S()}})},replace:function(e,t){o()(void 0===t,"Hash history cannot replace state; it is ignored");var n=_(e,void 0,void 0,$.location);b.confirmTransitionTo(n,"REPLACE",i,function(e){if(e){var t=g(n),r=f(c+t);M()!==r&&(j=t,A(r));var o=F.indexOf(g($.location));-1!==o&&(F[o]=t),S({action:"REPLACE",location:n})}})},go:B,goBack:function(){return B(-1)},goForward:function(){return B(1)},block:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=b.setPrompt(e);return q||(W(1),q=!0),function(){return q&&(q=!1,W(-1)),t()}},listen:function(e){var t=b.appendListener(e);return W(1),function(){W(-1),t()}}};return $},U="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},D=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},z=function(e,t,n){return Math.min(Math.max(e,t),n)},L=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.getUserConfirmation,n=e.initialEntries,r=void 0===n?["/"]:n,i=e.initialIndex,a=void 0===i?0:i,u=e.keyLength,l=void 0===u?6:u,c=E(),s=function(e){D(m,e),m.length=m.entries.length,c.notifyListeners(m.location,m.action)},f=function(){return Math.random().toString(36).substr(2,l)},p=z(a,0,r.length-1),d=r.map(function(e){return _(e,void 0,"string"==typeof e?f():e.key||f())}),h=g,v=function(e){var n=z(m.index+e,0,m.entries.length-1),r=m.entries[n];c.confirmTransitionTo(r,"POP",t,function(e){e?s({action:"POP",location:r,index:n}):s()})},m={length:d.length,action:"POP",location:d[p],index:p,entries:d,createHref:h,push:function(e,n){o()(!("object"===(void 0===e?"undefined":U(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var r=_(e,n,f(),m.location);c.confirmTransitionTo(r,"PUSH",t,function(e){if(e){var t=m.index+1,n=m.entries.slice(0);n.length>t?n.splice(t,n.length-t,r):n.push(r),s({action:"PUSH",location:r,index:t,entries:n})}})},replace:function(e,n){o()(!("object"===(void 0===e?"undefined":U(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var r=_(e,n,f(),m.location);c.confirmTransitionTo(r,"REPLACE",t,function(e){e&&(m.entries[m.index]=r,s({action:"REPLACE",location:r}))})},go:v,goBack:function(){return v(-1)},goForward:function(){return v(1)},canGo:function(e){var t=m.index+e;return t>=0&&t<m.entries.length},block:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return c.setPrompt(e)},listen:function(e){return c.appendListener(e)}};return m};n.d(t,"a",function(){return T}),n.d(t,"b",function(){return I}),n.d(t,"d",function(){return L}),n.d(t,"c",function(){return _}),n.d(t,"f",function(){return w}),n.d(t,!1,function(){return y}),n.d(t,"e",function(){return g})},function(e,t,n){"use strict";n.r(t);var r=n(28);n.d(t,"MemoryRouter",function(){return r.a});var o=n(29);n.d(t,"Prompt",function(){return o.a});var i=n(30);n.d(t,"Redirect",function(){return i.a});var a=n(16);n.d(t,"Route",function(){return a.a});var u=n(8);n.d(t,"Router",function(){return u.a});var l=n(31);n.d(t,"StaticRouter",function(){return l.a});var c=n(32);n.d(t,"Switch",function(){return c.a});var s=n(12);n.d(t,"generatePath",function(){return s.a});var f=n(9);n.d(t,"matchPath",function(){return f.a});var p=n(33);n.d(t,"withRouter",function(){return p.a})},function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(0),i=n.n(o),a=i.a.shape({trySubscribe:i.a.func.isRequired,tryUnsubscribe:i.a.func.isRequired,notifyNestedSubs:i.a.func.isRequired,isSubscribed:i.a.func.isRequired}),u=i.a.shape({subscribe:i.a.func.isRequired,dispatch:i.a.func.isRequired,getState:i.a.func.isRequired});function l(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"store",n=arguments[1]||t+"Subscription",o=function(e){function o(n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o);var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n,r));return i[t]=n.store,i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(o,e),o.prototype.getChildContext=function(){var e;return(e={})[t]=this[t],e[n]=null,e},o.prototype.render=function(){return r.Children.only(this.props.children)},o}(r.Component);return o.propTypes={store:u.isRequired,children:i.a.element.isRequired},o.childContextTypes=((e={})[t]=u.isRequired,e[n]=a,e),o}var c=l(),s=n(34),f=n.n(s),p=n(2),d=n.n(p);var h=null,v={notify:function(){}};var m=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.store=t,this.parentSub=n,this.onStateChange=r,this.unsubscribe=null,this.listeners=v}return e.prototype.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},e.prototype.notifyNestedSubs=function(){this.listeners.notify()},e.prototype.isSubscribed=function(){return Boolean(this.unsubscribe)},e.prototype.trySubscribe=function(){this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=function(){var e=[],t=[];return{clear:function(){t=h,e=h},notify:function(){for(var n=e=t,r=0;r<n.length;r++)n[r]()},get:function(){return t},subscribe:function(n){var r=!0;return t===e&&(t=e.slice()),t.push(n),function(){r&&e!==h&&(r=!1,t===e&&(t=e.slice()),t.splice(t.indexOf(n),1))}}}}())},e.prototype.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=v)},e}(),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var g=0,b={};function _(){}function w(e){var t,n,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=o.getDisplayName,l=void 0===i?function(e){return"ConnectAdvanced("+e+")"}:i,c=o.methodName,s=void 0===c?"connectAdvanced":c,p=o.renderCountProp,h=void 0===p?void 0:p,v=o.shouldHandleStateChanges,w=void 0===v||v,E=o.storeKey,x=void 0===E?"store":E,O=o.withRef,k=void 0!==O&&O,C=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(o,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),S=x+"Subscription",P=g++,j=((t={})[x]=u,t[S]=a,t),T=((n={})[S]=a,n);return function(t){d()("function"==typeof t,"You must pass a component to the function returned by "+s+". Instead received "+JSON.stringify(t));var n=t.displayName||t.name||"Component",o=l(n),i=y({},C,{getDisplayName:l,methodName:s,renderCountProp:h,shouldHandleStateChanges:w,storeKey:x,withRef:k,displayName:o,wrappedComponentName:n,WrappedComponent:t}),a=function(n){function a(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,n.call(this,e,t));return r.version=P,r.state={},r.renderCount=0,r.store=e[x]||t[x],r.propsMode=Boolean(e[x]),r.setWrappedInstance=r.setWrappedInstance.bind(r),d()(r.store,'Could not find "'+x+'" in either the context or props of "'+o+'". Either wrap the root component in a <Provider>, or explicitly pass "'+x+'" as a prop to "'+o+'".'),r.initSelector(),r.initSubscription(),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(a,n),a.prototype.getChildContext=function(){var e,t=this.propsMode?null:this.subscription;return(e={})[S]=t||this.context[S],e},a.prototype.componentDidMount=function(){w&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},a.prototype.componentWillReceiveProps=function(e){this.selector.run(e)},a.prototype.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},a.prototype.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=_,this.store=null,this.selector.run=_,this.selector.shouldComponentUpdate=!1},a.prototype.getWrappedInstance=function(){return d()(k,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+s+"() call."),this.wrappedInstance},a.prototype.setWrappedInstance=function(e){this.wrappedInstance=e},a.prototype.initSelector=function(){var t=e(this.store.dispatch,i);this.selector=function(e,t){var n={run:function(r){try{var o=e(t.getState(),r);(o!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=o,n.error=null)}catch(e){n.shouldComponentUpdate=!0,n.error=e}}};return n}(t,this.store),this.selector.run(this.props)},a.prototype.initSubscription=function(){if(w){var e=(this.propsMode?this.props:this.context)[S];this.subscription=new m(this.store,e,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},a.prototype.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(b)):this.notifyNestedSubs()},a.prototype.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},a.prototype.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},a.prototype.addExtraProps=function(e){if(!(k||h||this.propsMode&&this.subscription))return e;var t=y({},e);return k&&(t.ref=this.setWrappedInstance),h&&(t[h]=this.renderCount++),this.propsMode&&this.subscription&&(t[S]=this.subscription),t},a.prototype.render=function(){var e=this.selector;if(e.shouldComponentUpdate=!1,e.error)throw e.error;return Object(r.createElement)(t,this.addExtraProps(e.props))},a}(r.Component);return a.WrappedComponent=t,a.displayName=o,a.childContextTypes=T,a.contextTypes=j,a.propTypes=j,f()(a,t)}}var E=Object.prototype.hasOwnProperty;function x(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function O(e,t){if(x(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!E.call(t,n[o])||!x(e[n[o]],t[n[o]]))return!1;return!0}var k=n(11),C=n(68),S="object"==typeof self&&self&&self.Object===Object&&self,P=(C.a||S||Function("return this")()).Symbol,j=Object.prototype;j.hasOwnProperty,j.toString,P&&P.toStringTag;Object.prototype.toString;P&&P.toStringTag;Object.getPrototypeOf,Object;var T=Function.prototype,N=Object.prototype,R=T.toString;N.hasOwnProperty,R.call(Object);function M(e){return function(t,n){var r=e(t,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function A(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function I(e,t){return function(t,n){n.displayName;var r=function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)};return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=A(e);var o=r(t,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=A(o),o=r(t,n)),o},r}}var U=[function(e){return"function"==typeof e?I(e):void 0},function(e){return e?void 0:M(function(e){return{dispatch:e}})},function(e){return e&&"object"==typeof e?M(function(t){return Object(k.bindActionCreators)(e,t)}):void 0}];var D=[function(e){return"function"==typeof e?I(e):void 0},function(e){return e?void 0:M(function(){return{}})}],z=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function L(e,t,n){return z({},n,e,t)}var F=[function(e){return"function"==typeof e?function(e){return function(t,n){n.displayName;var r=n.pure,o=n.areMergedPropsEqual,i=!1,a=void 0;return function(t,n,u){var l=e(t,n,u);return i?r&&o(l,a)||(a=l):(i=!0,a=l),a}}}(e):void 0},function(e){return e?void 0:function(){return L}}];function B(e,t,n,r){return function(o,i){return n(e(o,i),t(r,i),i)}}function H(e,t,n,r,o){var i=o.areStatesEqual,a=o.areOwnPropsEqual,u=o.areStatePropsEqual,l=!1,c=void 0,s=void 0,f=void 0,p=void 0,d=void 0;function h(o,l){var h=!a(l,s),v=!i(o,c);return c=o,s=l,h&&v?(f=e(c,s),t.dependsOnOwnProps&&(p=t(r,s)),d=n(f,p,s)):h?(e.dependsOnOwnProps&&(f=e(c,s)),t.dependsOnOwnProps&&(p=t(r,s)),d=n(f,p,s)):v?function(){var t=e(c,s),r=!u(t,f);return f=t,r&&(d=n(f,p,s)),d}():d}return function(o,i){return l?h(o,i):function(o,i){return f=e(c=o,s=i),p=t(r,s),d=n(f,p,s),l=!0,d}(o,i)}}function W(e,t){var n=t.initMapStateToProps,r=t.initMapDispatchToProps,o=t.initMergeProps,i=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),a=n(e,i),u=r(e,i),l=o(e,i);return(i.pure?H:B)(a,u,l,e,i)}var q=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function $(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function V(e,t){return e===t}var Y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.connectHOC,n=void 0===t?w:t,r=e.mapStateToPropsFactories,o=void 0===r?D:r,i=e.mapDispatchToPropsFactories,a=void 0===i?U:i,u=e.mergePropsFactories,l=void 0===u?F:u,c=e.selectorFactory,s=void 0===c?W:c;return function(e,t,r){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},u=i.pure,c=void 0===u||u,f=i.areStatesEqual,p=void 0===f?V:f,d=i.areOwnPropsEqual,h=void 0===d?O:d,v=i.areStatePropsEqual,m=void 0===v?O:v,y=i.areMergedPropsEqual,g=void 0===y?O:y,b=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(i,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),_=$(e,o,"mapStateToProps"),w=$(t,a,"mapDispatchToProps"),E=$(r,l,"mergeProps");return n(s,q({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:_,initMapDispatchToProps:w,initMergeProps:E,pure:c,areStatesEqual:p,areOwnPropsEqual:h,areStatePropsEqual:m,areMergedPropsEqual:g},b))}}();n.d(t,"Provider",function(){return c}),n.d(t,"createProvider",function(){return l}),n.d(t,"connectAdvanced",function(){return w}),n.d(t,"connect",function(){return Y})},function(e,t,n){"use strict";var r=n(3),o=n.n(r),i=n(2),a=n.n(i),u=n(1),l=n.n(u),c=n(0),s=n.n(c),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function p(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var d=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=p(this,e.call.apply(e,[this].concat(i))),r.state={match:r.computeMatch(r.props.history.location.pathname)},p(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:f({},this.context.router,{history:this.props.history,route:{location:this.props.history.location,match:this.state.match}})}},t.prototype.computeMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}},t.prototype.componentWillMount=function(){var e=this,t=this.props,n=t.children,r=t.history;a()(null==n||1===l.a.Children.count(n),"A <Router> may have only one child element"),this.unlisten=r.listen(function(){e.setState({match:e.computeMatch(r.location.pathname)})})},t.prototype.componentWillReceiveProps=function(e){o()(this.props.history===e.history,"You cannot change <Router history>")},t.prototype.componentWillUnmount=function(){this.unlisten()},t.prototype.render=function(){var e=this.props.children;return e?l.a.Children.only(e):null},t}(l.a.Component);d.propTypes={history:s.a.object.isRequired,children:s.a.node},d.contextTypes={router:s.a.object},d.childContextTypes={router:s.a.object.isRequired},t.a=d},function(e,t,n){"use strict";var r=n(35),o=n.n(r),i={},a=0;t.a=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments[2];"string"==typeof t&&(t={path:t});var r=t,u=r.path,l=r.exact,c=void 0!==l&&l,s=r.strict,f=void 0!==s&&s,p=r.sensitive,d=void 0!==p&&p;if(null==u)return n;var h=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=i[n]||(i[n]={});if(r[e])return r[e];var u=[],l={re:o()(e,u,t),keys:u};return a<1e4&&(r[e]=l,a++),l}(u,{end:c,strict:f,sensitive:d}),v=h.re,m=h.keys,y=v.exec(e);if(!y)return null;var g=y[0],b=y.slice(1),_=e===g;return c&&!_?null:{path:u,url:"/"===u&&""===g?"/":g,isExact:_,params:m.reduce(function(e,t,n){return e[t.name]=b[n],e},{})}}},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t,n){"use strict";n.r(t),n.d(t,"createStore",function(){return l}),n.d(t,"combineReducers",function(){return s}),n.d(t,"bindActionCreators",function(){return p}),n.d(t,"applyMiddleware",function(){return h}),n.d(t,"compose",function(){return d}),n.d(t,"__DO_NOT_USE__ActionTypes",function(){return o});var r=n(41),o={INIT:"@@redux/INIT"+Math.random().toString(36).substring(7).split("").join("."),REPLACE:"@@redux/REPLACE"+Math.random().toString(36).substring(7).split("").join(".")},i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function u(e){if("object"!==(void 0===e?"undefined":i(e))||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function l(e,t,n){var a;if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(l)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var c=e,s=t,f=[],p=f,d=!1;function h(){p===f&&(p=f.slice())}function v(){if(d)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return s}function m(e){if("function"!=typeof e)throw new Error("Expected the listener to be a function.");if(d)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");var t=!0;return h(),p.push(e),function(){if(t){if(d)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");t=!1,h();var n=p.indexOf(e);p.splice(n,1)}}}function y(e){if(!u(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(d)throw new Error("Reducers may not dispatch actions.");try{d=!0,s=c(s,e)}finally{d=!1}for(var t=f=p,n=0;n<t.length;n++){(0,t[n])()}return e}return y({type:o.INIT}),(a={dispatch:y,subscribe:m,getState:v,replaceReducer:function(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");c=e,y({type:o.REPLACE})}})[r.a]=function(){var e,t=m;return(e={subscribe:function(e){if("object"!==(void 0===e?"undefined":i(e))||null===e)throw new TypeError("Expected the observer to be an object.");function n(){e.next&&e.next(v())}return n(),{unsubscribe:t(n)}}})[r.a]=function(){return this},e},a}function c(e,t){var n=t&&t.type;return"Given "+(n&&'action "'+String(n)+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function s(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var i=t[r];0,"function"==typeof e[i]&&(n[i]=e[i])}var a=Object.keys(n);var u=void 0;try{!function(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:o.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:"@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".")}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+o.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}(n)}catch(e){u=e}return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];if(u)throw u;for(var r=!1,o={},i=0;i<a.length;i++){var l=a[i],s=n[l],f=e[l],p=s(f,t);if(void 0===p){var d=c(l,t);throw new Error(d)}o[l]=p,r=r||p!==f}return r?o:e}}function f(e,t){return function(){return t(e.apply(this,arguments))}}function p(e,t){if("function"==typeof e)return f(e,t);if("object"!==(void 0===e?"undefined":i(e))||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":void 0===e?"undefined":i(e))+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),r={},o=0;o<n.length;o++){var a=n[o],u=e[a];"function"==typeof u&&(r[a]=f(u,t))}return r}function d(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}function h(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){for(var n=arguments.length,r=Array(n),o=0;o<n;o++)r[o]=arguments[o];var i=e.apply(void 0,r),u=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},l={getState:i.getState,dispatch:function(){return u.apply(void 0,arguments)}},c=t.map(function(e){return e(l)});return u=d.apply(void 0,c)(i.dispatch),a({},i,{dispatch:u})}}}},function(e,t,n){"use strict";var r=n(35),o=n.n(r),i={},a=0;t.a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return"/"===e?e:function(e){var t=e,n=i[t]||(i[t]={});if(n[e])return n[e];var r=o.a.compile(e);return a<1e4&&(n[e]=r,a++),r}(e)(t,{pretty:!0})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.logoutCurrentUser=t.receiveErrors=t.receiveCurrentUser=t.logout=t.login=t.signup=t.RECEIVE_ERRORS=t.LOGOUT_CURRENT_USER=t.RECEIVE_CURRENT_USER=void 0;var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(85));var o=t.RECEIVE_CURRENT_USER="RECEIVE_CURRENT_USER",i=t.LOGOUT_CURRENT_USER="LOGOUT_CURRENT_USER",a=t.RECEIVE_ERRORS="RECEIVE_ERRORS",u=(t.signup=function(e){return function(t){return r.signup(e).then(function(e){return t(u(e))},function(e){return t(l(e.responseJSON))})}},t.login=function(e){return function(t){return r.login(e).then(function(e){return t(u(e))},function(e){return t(l(e.responseJSON))})}},t.logout=function(){return function(e){return r.logout().then(function(t){return e(c())})}},t.receiveCurrentUser=function(e){return{type:o,currentUser:e}}),l=t.receiveErrors=function(e){return{type:a,errors:e}},c=t.logoutCurrentUser=function(){return{type:i}}},function(e,t,n){var r=n(54),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();e.exports=i},function(e,t,n){"use strict";n.r(t);var r=n(3),o=n.n(r),i=n(1),a=n.n(i),u=n(0),l=n.n(u),c=n(5),s=n(8).a;function f(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var p=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=f(this,e.call.apply(e,[this].concat(i))),r.history=Object(c.a)(r.props),f(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){o()(!this.props.history,"<BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { BrowserRouter as Router }`.")},t.prototype.render=function(){return a.a.createElement(s,{history:this.history,children:this.props.children})},t}(a.a.Component);p.propTypes={basename:l.a.string,forceRefresh:l.a.bool,getUserConfirmation:l.a.func,keyLength:l.a.number,children:l.a.node};var d=p;function h(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var v=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=h(this,e.call.apply(e,[this].concat(i))),r.history=Object(c.b)(r.props),h(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){o()(!this.props.history,"<HashRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { HashRouter as Router }`.")},t.prototype.render=function(){return a.a.createElement(s,{history:this.history,children:this.props.children})},t}(a.a.Component);v.propTypes={basename:l.a.string,getUserConfirmation:l.a.func,hashType:l.a.oneOf(["hashbang","noslash","slash"]),children:l.a.node};var m=v,y=n(2),g=n.n(y),b=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function _(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var w=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},E=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=_(this,e.call.apply(e,[this].concat(i))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!w(e)){e.preventDefault();var t=r.context.router.history,n=r.props,o=n.replace,i=n.to;o?t.replace(i):t.push(i)}},_(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),n=e.innerRef,r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["replace","to","innerRef"]);g()(this.context.router,"You should not use <Link> outside a <Router>"),g()(void 0!==t,'You must specify the "to" property');var o=this.context.router.history,i="string"==typeof t?Object(c.c)(t,null,null,o.location):t,u=o.createHref(i);return a.a.createElement("a",b({},r,{onClick:this.handleClick,href:u,ref:n}))},t}(a.a.Component);E.propTypes={onClick:l.a.func,target:l.a.string,replace:l.a.bool,to:l.a.oneOfType([l.a.string,l.a.object]).isRequired,innerRef:l.a.oneOfType([l.a.string,l.a.func])},E.defaultProps={replace:!1},E.contextTypes={router:l.a.shape({history:l.a.shape({push:l.a.func.isRequired,replace:l.a.func.isRequired,createHref:l.a.func.isRequired}).isRequired}).isRequired};var x=E,O=n(28).a,k=n(16).a,C=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var P=function(e){var t=e.to,n=e.exact,r=e.strict,o=e.location,i=e.activeClassName,u=e.className,l=e.activeStyle,c=e.style,s=e.isActive,f=e["aria-current"],p=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["to","exact","strict","location","activeClassName","className","activeStyle","style","isActive","aria-current"]),d="object"===(void 0===t?"undefined":S(t))?t.pathname:t,h=d&&d.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1");return a.a.createElement(k,{path:h,exact:n,strict:r,location:o,children:function(e){var n=e.location,r=e.match,o=!!(s?s(r,n):r);return a.a.createElement(x,C({to:t,className:o?[u,i].filter(function(e){return e}).join(" "):u,style:o?C({},c,l):c,"aria-current":o&&f||null},p))}})};P.propTypes={to:x.propTypes.to,exact:l.a.bool,strict:l.a.bool,location:l.a.object,activeClassName:l.a.string,className:l.a.string,activeStyle:l.a.object,style:l.a.object,isActive:l.a.func,"aria-current":l.a.oneOf(["page","step","location","date","time","true"])},P.defaultProps={activeClassName:"active","aria-current":"page"};var j=P,T=n(29).a,N=n(30).a,R=n(31).a,M=n(32).a,A=n(12).a,I=n(9).a,U=n(33).a;n.d(t,"BrowserRouter",function(){return d}),n.d(t,"HashRouter",function(){return m}),n.d(t,"Link",function(){return x}),n.d(t,"MemoryRouter",function(){return O}),n.d(t,"NavLink",function(){return j}),n.d(t,"Prompt",function(){return T}),n.d(t,"Redirect",function(){return N}),n.d(t,"Route",function(){return k}),n.d(t,"Router",function(){return s}),n.d(t,"StaticRouter",function(){return R}),n.d(t,"Switch",function(){return M}),n.d(t,"generatePath",function(){return A}),n.d(t,"matchPath",function(){return I}),n.d(t,"withRouter",function(){return U})},function(e,t,n){"use strict";var r=n(3),o=n.n(r),i=n(2),a=n.n(i),u=n(1),l=n.n(u),c=n(0),s=n.n(c),f=n(9),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function d(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var h=function(e){return 0===l.a.Children.count(e)},v=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=d(this,e.call.apply(e,[this].concat(i))),r.state={match:r.computeMatch(r.props,r.context.router)},d(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:p({},this.context.router,{route:{location:this.props.location||this.context.router.route.location,match:this.state.match}})}},t.prototype.computeMatch=function(e,t){var n=e.computedMatch,r=e.location,o=e.path,i=e.strict,u=e.exact,l=e.sensitive;if(n)return n;a()(t,"You should not use <Route> or withRouter() outside a <Router>");var c=t.route,s=(r||c.location).pathname;return Object(f.a)(s,{path:o,strict:i,exact:u,sensitive:l},c.match)},t.prototype.componentWillMount=function(){o()(!(this.props.component&&this.props.render),"You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"),o()(!(this.props.component&&this.props.children&&!h(this.props.children)),"You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"),o()(!(this.props.render&&this.props.children&&!h(this.props.children)),"You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored")},t.prototype.componentWillReceiveProps=function(e,t){o()(!(e.location&&!this.props.location),'<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),o()(!(!e.location&&this.props.location),'<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'),this.setState({match:this.computeMatch(e,t.router)})},t.prototype.render=function(){var e=this.state.match,t=this.props,n=t.children,r=t.component,o=t.render,i=this.context.router,a=i.history,u=i.route,c=i.staticContext,s={match:e,location:this.props.location||u.location,history:a,staticContext:c};return r?e?l.a.createElement(r,s):null:o?e?o(s):null:"function"==typeof n?n(s):n&&!h(n)?l.a.Children.only(n):null},t}(l.a.Component);v.propTypes={computedMatch:s.a.object,path:s.a.string,exact:s.a.bool,strict:s.a.bool,sensitive:s.a.bool,component:s.a.func,render:s.a.func,children:s.a.oneOfType([s.a.func,s.a.node]),location:s.a.object},v.contextTypes={router:s.a.shape({history:s.a.object.isRequired,route:s.a.object.isRequired,staticContext:s.a.object})},v.childContextTypes={router:s.a.object.isRequired},t.a=v},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=t.OPEN_MODAL="OPEN_MODAL",o=t.CLOSE_MODAL="CLOSE_MODAL";t.openModal=function(e){return{type:r,modal:e}},t.closeModal=function(){return{type:o}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fetchHome=t.fetchHomes=t.receiveHome=t.receiveHomes=t.RECEIVE_HOME=t.RECEIVE_HOMES=void 0;var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(93));var o=t.RECEIVE_HOMES="RECEIVE_HOMES",i=t.RECEIVE_HOME="RECEIVE_HOME",a=t.receiveHomes=function(e){return{type:o,homes:e}},u=t.receiveHome=function(e){var t=e.home;return{type:i,home:t}};t.fetchHomes=function(){return function(e){return r.fetchHomes().then(function(t){return e(a(t))})}},t.fetchHome=function(e){return function(t){return r.fetchHome(e).then(function(e){return t(u(e))})}}},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t,n){var r=n(108),o=n(109),i=n(110),a=n(111),u=n(112);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=i,l.prototype.has=a,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(23);e.exports=function(e,t){for(var n=e.length;n--;)if(r(e[n][0],t))return n;return-1}},function(e,t){e.exports=function(e,t){return e===t||e!=e&&t!=t}},function(e,t,n){var r=n(53),o=n(119),i=n(120),a="[object Null]",u="[object Undefined]",l=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?u:a:l&&l in Object(e)?o(e):i(e)}},function(e,t,n){var r=n(37)(Object,"create");e.exports=r},function(e,t,n){var r=n(134);e.exports=function(e,t){var n=e.__data__;return r(t)?n["string"==typeof t?"string":"hash"]:n.map}},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";var r=n(3),o=n.n(r),i=n(1),a=n.n(i),u=n(0),l=n.n(u),c=n(5),s=n(8);function f(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var p=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=f(this,e.call.apply(e,[this].concat(i))),r.history=Object(c.d)(r.props),f(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){o()(!this.props.history,"<MemoryRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { MemoryRouter as Router }`.")},t.prototype.render=function(){return a.a.createElement(s.a,{history:this.history,children:this.props.children})},t}(a.a.Component);p.propTypes={initialEntries:l.a.array,initialIndex:l.a.number,getUserConfirmation:l.a.func,keyLength:l.a.number,children:l.a.node},t.a=p},function(e,t,n){"use strict";var r=n(1),o=n.n(r),i=n(0),a=n.n(i),u=n(2),l=n.n(u);var c=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.enable=function(e){this.unblock&&this.unblock(),this.unblock=this.context.router.history.block(e)},t.prototype.disable=function(){this.unblock&&(this.unblock(),this.unblock=null)},t.prototype.componentWillMount=function(){l()(this.context.router,"You should not use <Prompt> outside a <Router>"),this.props.when&&this.enable(this.props.message)},t.prototype.componentWillReceiveProps=function(e){e.when?this.props.when&&this.props.message===e.message||this.enable(e.message):this.disable()},t.prototype.componentWillUnmount=function(){this.disable()},t.prototype.render=function(){return null},t}(o.a.Component);c.propTypes={when:a.a.bool,message:a.a.oneOfType([a.a.func,a.a.string]).isRequired},c.defaultProps={when:!0},c.contextTypes={router:a.a.shape({history:a.a.shape({block:a.a.func.isRequired}).isRequired}).isRequired},t.a=c},function(e,t,n){"use strict";var r=n(1),o=n.n(r),i=n(0),a=n.n(i),u=n(3),l=n.n(u),c=n(2),s=n.n(c),f=n(5),p=n(12),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var h=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){s()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=Object(f.c)(e.to),n=Object(f.c)(this.props.to);Object(f.f)(t,n)?l()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"'):this.perform()},t.prototype.computeTo=function(e){var t=e.computedMatch,n=e.to;return t?"string"==typeof n?Object(p.a)(n,t.params):d({},n,{pathname:Object(p.a)(n.pathname,t.params)}):n},t.prototype.perform=function(){var e=this.context.router.history,t=this.props.push,n=this.computeTo(this.props);t?e.push(n):e.replace(n)},t.prototype.render=function(){return null},t}(o.a.Component);h.propTypes={computedMatch:a.a.object,push:a.a.bool,from:a.a.string,to:a.a.oneOfType([a.a.string,a.a.object]).isRequired},h.defaultProps={push:!1},h.contextTypes={router:a.a.shape({history:a.a.shape({push:a.a.func.isRequired,replace:a.a.func.isRequired}).isRequired,staticContext:a.a.object}).isRequired},t.a=h},function(e,t,n){"use strict";var r=n(3),o=n.n(r),i=n(2),a=n.n(i),u=n(1),l=n.n(u),c=n(0),s=n.n(c),f=n(5),p=n(8),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function h(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var v=function(e){return"/"===e.charAt(0)?e:"/"+e},m=function(e,t){return e?d({},t,{pathname:v(e)+t.pathname}):t},y=function(e){return"string"==typeof e?e:Object(f.e)(e)},g=function(e){return function(){a()(!1,"You cannot %s with <StaticRouter>",e)}},b=function(){},_=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=h(this,e.call.apply(e,[this].concat(i))),r.createHref=function(e){return v(r.props.basename+y(e))},r.handlePush=function(e){var t=r.props,n=t.basename,o=t.context;o.action="PUSH",o.location=m(n,Object(f.c)(e)),o.url=y(o.location)},r.handleReplace=function(e){var t=r.props,n=t.basename,o=t.context;o.action="REPLACE",o.location=m(n,Object(f.c)(e)),o.url=y(o.location)},r.handleListen=function(){return b},r.handleBlock=function(){return b},h(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:{staticContext:this.props.context}}},t.prototype.componentWillMount=function(){o()(!this.props.history,"<StaticRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { StaticRouter as Router }`.")},t.prototype.render=function(){var e=this.props,t=e.basename,n=(e.context,e.location),r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["basename","context","location"]),o={createHref:this.createHref,action:"POP",location:function(e,t){if(!e)return t;var n=v(e);return 0!==t.pathname.indexOf(n)?t:d({},t,{pathname:t.pathname.substr(n.length)})}(t,Object(f.c)(n)),push:this.handlePush,replace:this.handleReplace,go:g("go"),goBack:g("goBack"),goForward:g("goForward"),listen:this.handleListen,block:this.handleBlock};return l.a.createElement(p.a,d({},r,{history:o}))},t}(l.a.Component);_.propTypes={basename:s.a.string,context:s.a.object.isRequired,location:s.a.oneOfType([s.a.string,s.a.object])},_.defaultProps={basename:"",location:"/"},_.childContextTypes={router:s.a.object.isRequired},t.a=_},function(e,t,n){"use strict";var r=n(1),o=n.n(r),i=n(0),a=n.n(i),u=n(3),l=n.n(u),c=n(2),s=n.n(c),f=n(9);var p=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){s()(this.context.router,"You should not use <Switch> outside a <Router>")},t.prototype.componentWillReceiveProps=function(e){l()(!(e.location&&!this.props.location),'<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),l()(!(!e.location&&this.props.location),'<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.')},t.prototype.render=function(){var e=this.context.router.route,t=this.props.children,n=this.props.location||e.location,r=void 0,i=void 0;return o.a.Children.forEach(t,function(t){if(null==r&&o.a.isValidElement(t)){var a=t.props,u=a.path,l=a.exact,c=a.strict,s=a.sensitive,p=a.from,d=u||p;i=t,r=Object(f.a)(n.pathname,{path:d,exact:l,strict:c,sensitive:s},e.match)}}),r?o.a.cloneElement(i,{location:n,computedMatch:r}):null},t}(o.a.Component);p.contextTypes={router:a.a.shape({route:a.a.object.isRequired}).isRequired},p.propTypes={children:a.a.node,location:a.a.object},t.a=p},function(e,t,n){"use strict";var r=n(1),o=n.n(r),i=n(0),a=n.n(i),u=n(34),l=n.n(u),c=n(16),s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.a=function(e){var t=function(t){var n=t.wrappedComponentRef,r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["wrappedComponentRef"]);return o.a.createElement(c.a,{children:function(t){return o.a.createElement(e,s({},r,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,t.propTypes={wrappedComponentRef:a.a.func},l()(t,e)}},function(e,t,n){"use strict";var r={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},o={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},i=Object.defineProperty,a=Object.getOwnPropertyNames,u=Object.getOwnPropertySymbols,l=Object.getOwnPropertyDescriptor,c=Object.getPrototypeOf,s=c&&c(Object);e.exports=function e(t,n,f){if("string"!=typeof n){if(s){var p=c(n);p&&p!==s&&e(t,p,f)}var d=a(n);u&&(d=d.concat(u(n)));for(var h=0;h<d.length;++h){var v=d[h];if(!(r[v]||o[v]||f&&f[v])){var m=l(n,v);try{i(t,v,m)}catch(e){}}}return t}return t}},function(e,t,n){var r=n(87);e.exports=h,e.exports.parse=i,e.exports.compile=function(e,t){return l(i(e,t))},e.exports.tokensToFunction=l,e.exports.tokensToRegExp=d;var o=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function i(e,t){for(var n,r=[],i=0,a=0,u="",l=t&&t.delimiter||"/";null!=(n=o.exec(e));){var f=n[0],p=n[1],d=n.index;if(u+=e.slice(a,d),a=d+f.length,p)u+=p[1];else{var h=e[a],v=n[2],m=n[3],y=n[4],g=n[5],b=n[6],_=n[7];u&&(r.push(u),u="");var w=null!=v&&null!=h&&h!==v,E="+"===b||"*"===b,x="?"===b||"*"===b,O=n[2]||l,k=y||g;r.push({name:m||i++,prefix:v||"",delimiter:O,optional:x,repeat:E,partial:w,asterisk:!!_,pattern:k?s(k):_?".*":"[^"+c(O)+"]+?"})}}return a<e.length&&(u+=e.substr(a)),u&&r.push(u),r}function a(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function l(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,o){for(var i="",l=n||{},c=(o||{}).pretty?a:encodeURIComponent,s=0;s<e.length;s++){var f=e[s];if("string"!=typeof f){var p,d=l[f.name];if(null==d){if(f.optional){f.partial&&(i+=f.prefix);continue}throw new TypeError('Expected "'+f.name+'" to be defined')}if(r(d)){if(!f.repeat)throw new TypeError('Expected "'+f.name+'" to not repeat, but received `'+JSON.stringify(d)+"`");if(0===d.length){if(f.optional)continue;throw new TypeError('Expected "'+f.name+'" to not be empty')}for(var h=0;h<d.length;h++){if(p=c(d[h]),!t[s].test(p))throw new TypeError('Expected all "'+f.name+'" to match "'+f.pattern+'", but received `'+JSON.stringify(p)+"`");i+=(0===h?f.prefix:f.delimiter)+p}}else{if(p=f.asterisk?u(d):c(d),!t[s].test(p))throw new TypeError('Expected "'+f.name+'" to match "'+f.pattern+'", but received "'+p+'"');i+=f.prefix+p}}else i+=f}return i}}function c(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function s(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function f(e,t){return e.keys=t,e}function p(e){return e.sensitive?"":"i"}function d(e,t,n){r(t)||(n=t||n,t=[]);for(var o=(n=n||{}).strict,i=!1!==n.end,a="",u=0;u<e.length;u++){var l=e[u];if("string"==typeof l)a+=c(l);else{var s=c(l.prefix),d="(?:"+l.pattern+")";t.push(l),l.repeat&&(d+="(?:"+s+d+")*"),a+=d=l.optional?l.partial?s+"("+d+")?":"(?:"+s+"("+d+"))?":s+"("+d+")"}}var h=c(n.delimiter||"/"),v=a.slice(-h.length)===h;return o||(a=(v?a.slice(0,-h.length):a)+"(?:"+h+"(?=$))?"),a+=i?"$":o&&v?"":"(?="+h+"|$)",f(new RegExp("^"+a,p(n)),t)}function h(e,t,n){return r(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}(e,t):r(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(h(e[o],t,n).source);return f(new RegExp("(?:"+r.join("|")+")",p(n)),t)}(e,t,n):function(e,t,n){return d(i(e,n),t,n)}(e,t,n)}},function(e,t,n){var r=n(106),o=n(163)(function(e,t,n){r(e,t,n)});e.exports=o},function(e,t,n){var r=n(118),o=n(124);e.exports=function(e,t){var n=o(e,t);return r(n)?n:void 0}},function(e,t,n){var r=n(24),o=n(10),i="[object AsyncFunction]",a="[object Function]",u="[object GeneratorFunction]",l="[object Proxy]";e.exports=function(e){if(!o(e))return!1;var t=r(e);return t==a||t==u||t==i||t==l}},function(e,t,n){var r=n(56);e.exports=function(e,t,n){"__proto__"==t&&r?r(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}},function(e,t,n){var r=n(38),o=n(61);e.exports=function(e){return null!=e&&o(e.length)&&!r(e)}},function(e,t,n){"use strict";(function(e,r){var o,i=n(69);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var a=Object(i.a)(o);t.a=a}).call(this,n(17),n(84)(e))},function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,a,u=function(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),l=1;l<arguments.length;l++){for(var c in n=Object(arguments[l]))o.call(n,c)&&(u[c]=n[c]);if(r){a=r(n);for(var s=0;s<a.length;s++)i.call(n,a[s])&&(u[a[s]]=n[a[s]])}}return u}},function(e,t,n){"use strict";var r=function(e){};e.exports=function(e,t,n,o,i,a,u,l){if(r(t),!e){var c;if(void 0===t)c=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var s=[n,o,i,a,u,l],f=0;(c=new Error(t.replace(/%s/g,function(){return s[f++]}))).name="Invariant Violation"}throw c.framesToPop=1,c}}},function(e,t,n){"use strict";e.exports={}},function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},function(e,t,n){"use strict";!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}(),e.exports=n(72)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=(n(6),n(18)),i=n(13),a=function(e){return e&&e.__esModule?e:{default:e}}(n(90));t.default=(0,r.connect)(function(e){return{formType:"login",errors:e.errors.session}},function(e){return{processForm:function(t){return e((0,i.login)(t))},otherForm:function(){return e((0,o.openModal)("signup"))},closeModal:function(){return e((0,o.closeModal)())}}})(a.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=(n(6),n(18)),i=n(13),a=function(e){return e&&e.__esModule?e:{default:e}}(n(91));t.default=(0,r.connect)(function(e){return{formType:"signup",errors:e.errors.session}},function(e){return{processForm:function(t){return e((0,i.signup)(t))},otherForm:function(){return e((0,o.openModal)("login"))},closeModal:function(){return e((0,o.closeModal)())}}})(a.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeFilter=t.UPDATE_BOUNDS=void 0,t.updateFilter=function(e,t){return function(n,o){return n(i(e,t)),(0,r.fetchHomes)(o().filters)(n)}};var r=n(19),o=t.UPDATE_BOUNDS="UPDATE_BOUNDS",i=t.changeFilter=function(e){return{type:o,bounds:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=l(n(1)),i=l(n(46)),a=n(15),u=l(n(97));function l(e){return e&&e.__esModule?e:{default:e}}var c=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={},n.addHome=n.addHome.bind(n),n.bounds=new google.maps.LatLngBounds,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){var e=this,t=i.default.findDOMNode(this.refs.map),n=void 0;"true"===this.props.show&&(n={lat:this.props.homes[0].latitude,lng:this.props.homes[0].longitude});var r={center:n||this.props.center,zoom:13};this.map=new google.maps.Map(t,r),this.MarkerManager=new u.default(this.map),this.MarkerManager.updateMarkers(this.props.homes),this.listenForMove(),this.props.homes.forEach(function(t){return e.addHome(t)})}},{key:"componentWillReceiveProps",value:function(){this.props.homes.forEach(this.addHome)}},{key:"componentDidUpdate",value:function(){this.MarkerManager.updateMarkers(this.props.homes)}},{key:"addHome",value:function(e){var t=this,n=new google.maps.LatLng(e.latitude,e.longitude),r=new google.maps.Marker({position:n,map:this.map});this.bounds.extend(n),r.addListener("click",function(){t.props.history.push("/homes/"+e.id)}),this.map.panToBounds(this.bounds)}},{key:"listenForMove",value:function(){var e=this;google.maps.event.addListener(this.map,"idle",function(){var t=e.map.getBounds();"true"!=e.props.show&&e.props.updateFilter("bounds",t),console.log("center",t.getCenter().lat(),t.getCenter().lng()),console.log("north east",t.getNorthEast().lat(),t.getNorthEast().lng()),console.log("south west",t.getSouthWest().lat(),t.getSouthWest().lng())})}},{key:"render",value:function(){return!this.props.homes.length>1?null:o.default.createElement("div",null,o.default.createElement("div",function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({ref:"map",id:"map-container"},"ref","map")))}}]),t}();t.default=(0,a.withRouter)(c)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=a(n(1)),i=a(n(50));n(6);function a(e){return e&&e.__esModule?e:{default:e}}var u=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){this.props.fetchHome(this.props.homeId)}},{key:"render",value:function(){if(!this.props.home)return null;var e=this.props,t=e.home,n=e.homeId,r=e.fetchHome;return o.default.createElement("div",null,o.default.createElement("div",{className:"big-photo"}),o.default.createElement("div",{className:"home-show-content"},o.default.createElement("div",{className:"home-show-left"},o.default.createElement("div",{className:"home-show-details"},o.default.createElement("div",{className:"quick-info"},o.default.createElement("div",{className:"name-city-left"},o.default.createElement("div",{className:"home-show-title"},t.name),o.default.createElement("div",{className:"home-show-city"},t.city)),o.default.createElement("div",{className:"host-photo-container"},o.default.createElement("div",{className:"host-photo"}))),o.default.createElement("div",{className:"home-show-info"},o.default.createElement("div",null,o.default.createElement("span",null,o.default.createElement("i",{className:"fas fa-users fa-xs"})),o.default.createElement("span",null," ",t.max_guests," guests")),o.default.createElement("div",null,o.default.createElement("span",null,o.default.createElement("i",{className:"fas fa-door-open fa-xs"})),o.default.createElement("span",null,t.num_rooms," rooms")),o.default.createElement("div",null,o.default.createElement("span",null,o.default.createElement("i",{className:"fas fa-bed fa-xs"})),o.default.createElement("span",null,t.num_beds," beds")),o.default.createElement("div",null,o.default.createElement("span",null,o.default.createElement("i",{className:"fas fa-bath fa-xs"})),o.default.createElement("span",null,t.num_baths," baths"))),o.default.createElement("div",{className:"home-show-description"},o.default.createElement("div",{className:"text"},t.description),o.default.createElement("div",{className:"read-more"},o.default.createElement("span",null,"Read more about the space ")," ",o.default.createElement("i",{className:"fas fa-angle-down"})),o.default.createElement("div",{className:"contact-host"},o.default.createElement("span",null,"Contact host")))),o.default.createElement("div",{className:"home-show-map"},o.default.createElement(i.default,{show:"true",homes:[t],center:{lat:37.76962,lng:-122.42205},homeId:n,fetchHome:r}))),o.default.createElement("div",{className:"home-show-right"},o.default.createElement("div",{className:"reservation-container"},o.default.createElement("div",{className:"price-container"},o.default.createElement("div",{className:"price"},o.default.createElement("div",{className:"value"},"$",t.price),o.default.createElement("div",{className:"word"},"  per night")),o.default.createElement("div",{className:"stars"},o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("div",{className:"review-count"},"  217"))),o.default.createElement("form",null,o.default.createElement("div",{className:"date-container"},o.default.createElement("div",{className:"date-label"},o.default.createElement("div",null,o.default.createElement("span",null,"Dates"))),o.default.createElement("div",{className:"calendar-input"},o.default.createElement("input",{type:"date"}),o.default.createElement("input",{type:"date"}))),o.default.createElement("div",{className:"guest-container"},o.default.createElement("div",{className:"guest-label"},o.default.createElement("div",null,o.default.createElement("span",null,"Guests"))),o.default.createElement("div",{className:"guest-input"},o.default.createElement("select",null,o.default.createElement("option",null,"1 Guest"),o.default.createElement("option",null,"2 Guests"),o.default.createElement("option",null,"3 Guests"),o.default.createElement("option",null,"4 Guests"),o.default.createElement("option",null,"5 Guests"),o.default.createElement("option",null,"6 Guests"),o.default.createElement("option",null,"7 Guests"),o.default.createElement("option",null,"8 Guests"),o.default.createElement("option",null,"9 Guests"),o.default.createElement("option",null,"10 Guests"),o.default.createElement("option",null,"11 Guests"),o.default.createElement("option",null,"12 Guests")))),o.default.createElement("div",{className:"button-container"},o.default.createElement("button",{type:"submit"},"Book"))),o.default.createElement("div",{className:"additional-info"},o.default.createElement("span",{className:"notice"},"You won't be charged yet"),o.default.createElement("span",{className:"disclaimer-1"},"This home is on people’s minds."),o.default.createElement("span",{className:"disclaimer-2"},"It’s been viewed 500+ times in the past week."))))))}}]),t}();t.default=u},function(e,t,n){var r=n(37)(n(14),"Map");e.exports=r},function(e,t,n){var r=n(14).Symbol;e.exports=r},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(17))},function(e,t,n){var r=n(39),o=n(23);e.exports=function(e,t,n){(void 0===n||o(e[t],n))&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){var r=n(37),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,n){var r=n(148)(Object.getPrototypeOf,Object);e.exports=r},function(e,t){var n=Object.prototype;e.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)}},function(e,t,n){var r=n(149),o=n(20),i=Object.prototype,a=i.hasOwnProperty,u=i.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&a.call(e,"callee")&&!u.call(e,"callee")};e.exports=l},function(e,t){var n=Array.isArray;e.exports=n},function(e,t){var n=9007199254740991;e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}},function(e,t,n){(function(e){var r=n(14),o=n(151),i="object"==typeof t&&t&&!t.nodeType&&t,a=i&&"object"==typeof e&&e&&!e.nodeType&&e,u=a&&a.exports===i?r.Buffer:void 0,l=(u?u.isBuffer:void 0)||o;e.exports=l}).call(this,n(27)(e))},function(e,t,n){var r=n(153),o=n(154),i=n(155),a=i&&i.isTypedArray,u=a?o(a):r;e.exports=u},function(e,t){e.exports=function(e,t){return"__proto__"==t?void 0:e[t]}},function(e,t,n){var r=n(159),o=n(161),i=n(40);e.exports=function(e){return i(e)?r(e,!0):o(e)}},function(e,t){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;e.exports=function(e,t){var o=typeof e;return!!(t=null==t?n:t)&&("number"==o||"symbol"!=o&&r.test(e))&&e>-1&&e%1==0&&e<t}},function(e,t){e.exports=function(e){return e}},function(e,t,n){"use strict";(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.a=n}).call(this,n(17))},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}n.d(t,"a",function(){return r})},function(e,t,n){"use strict";var r=l(n(1)),o=l(n(46)),i=l(n(79)),a=l(n(102)),u=n(19);function l(e){return e&&e.__esModule?e:{default:e}}document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("root"),t=void 0;if(window.currentUser){var n=window.currentUser,l=n.id,c={entities:{users:function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},l,n)},session:{id:l}};t=(0,a.default)(c),window.store=t,delete window.currentUser}else t=(0,a.default)();window.dispatch=t.dispatch,window.getState=t.dispatch,window.fetchHomes=u.fetchHomes,o.default.render(r.default.createElement(i.default,{store:t}),e)})},function(e,t,n){"use strict";
/** @license React v16.4.2
 * react.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(42),o=n(43),i=n(44),a=n(45),u="function"==typeof Symbol&&Symbol.for,l=u?Symbol.for("react.element"):60103,c=u?Symbol.for("react.portal"):60106,s=u?Symbol.for("react.fragment"):60107,f=u?Symbol.for("react.strict_mode"):60108,p=u?Symbol.for("react.profiler"):60114,d=u?Symbol.for("react.provider"):60109,h=u?Symbol.for("react.context"):60110,v=u?Symbol.for("react.async_mode"):60111,m=u?Symbol.for("react.forward_ref"):60112;u&&Symbol.for("react.timeout");var y="function"==typeof Symbol&&Symbol.iterator;function g(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);o(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};function _(e,t,n){this.props=e,this.context=t,this.refs=i,this.updater=n||b}function w(){}function E(e,t,n){this.props=e,this.context=t,this.refs=i,this.updater=n||b}_.prototype.isReactComponent={},_.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&g("85"),this.updater.enqueueSetState(this,e,t,"setState")},_.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},w.prototype=_.prototype;var x=E.prototype=new w;x.constructor=E,r(x,_.prototype),x.isPureReactComponent=!0;var O={current:null},k=Object.prototype.hasOwnProperty,C={key:!0,ref:!0,__self:!0,__source:!0};function S(e,t,n){var r=void 0,o={},i=null,a=null;if(null!=t)for(r in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(i=""+t.key),t)k.call(t,r)&&!C.hasOwnProperty(r)&&(o[r]=t[r]);var u=arguments.length-2;if(1===u)o.children=n;else if(1<u){for(var c=Array(u),s=0;s<u;s++)c[s]=arguments[s+2];o.children=c}if(e&&e.defaultProps)for(r in u=e.defaultProps)void 0===o[r]&&(o[r]=u[r]);return{$$typeof:l,type:e,key:i,ref:a,props:o,_owner:O.current}}function P(e){return"object"==typeof e&&null!==e&&e.$$typeof===l}var j=/\/+/g,T=[];function N(e,t,n,r){if(T.length){var o=T.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function R(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>T.length&&T.push(e)}function M(e,t,n,r){var o=typeof e;"undefined"!==o&&"boolean"!==o||(e=null);var i=!1;if(null===e)i=!0;else switch(o){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case l:case c:i=!0}}if(i)return n(r,e,""===t?"."+A(e,0):t),1;if(i=0,t=""===t?".":t+":",Array.isArray(e))for(var a=0;a<e.length;a++){var u=t+A(o=e[a],a);i+=M(o,u,n,r)}else if(null===e||void 0===e?u=null:u="function"==typeof(u=y&&e[y]||e["@@iterator"])?u:null,"function"==typeof u)for(e=u.call(e),a=0;!(o=e.next()).done;)i+=M(o=o.value,u=t+A(o,a++),n,r);else"object"===o&&g("31","[object Object]"===(n=""+e)?"object with keys {"+Object.keys(e).join(", ")+"}":n,"");return i}function A(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}(e.key):t.toString(36)}function I(e,t){e.func.call(e.context,t,e.count++)}function U(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?D(e,r,n,a.thatReturnsArgument):null!=e&&(P(e)&&(t=o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(j,"$&/")+"/")+n,e={$$typeof:l,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}),r.push(e))}function D(e,t,n,r,o){var i="";null!=n&&(i=(""+n).replace(j,"$&/")+"/"),t=N(t,i,r,o),null==e||M(e,"",U,t),R(t)}var z={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return D(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;t=N(null,null,t,n),null==e||M(e,"",I,t),R(t)},count:function(e){return null==e?0:M(e,"",a.thatReturnsNull,null)},toArray:function(e){var t=[];return D(e,t,null,a.thatReturnsArgument),t},only:function(e){return P(e)||g("143"),e}},createRef:function(){return{current:null}},Component:_,PureComponent:E,createContext:function(e,t){return void 0===t&&(t=null),(e={$$typeof:h,_calculateChangedBits:t,_defaultValue:e,_currentValue:e,_currentValue2:e,_changedBits:0,_changedBits2:0,Provider:null,Consumer:null}).Provider={$$typeof:d,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:m,render:e}},Fragment:s,StrictMode:f,unstable_AsyncMode:v,unstable_Profiler:p,createElement:S,cloneElement:function(e,t,n){(null===e||void 0===e)&&g("267",e);var o=void 0,i=r({},e.props),a=e.key,u=e.ref,c=e._owner;if(null!=t){void 0!==t.ref&&(u=t.ref,c=O.current),void 0!==t.key&&(a=""+t.key);var s=void 0;for(o in e.type&&e.type.defaultProps&&(s=e.type.defaultProps),t)k.call(t,o)&&!C.hasOwnProperty(o)&&(i[o]=void 0===t[o]&&void 0!==s?s[o]:t[o])}if(1===(o=arguments.length-2))i.children=n;else if(1<o){s=Array(o);for(var f=0;f<o;f++)s[f]=arguments[f+2];i.children=s}return{$$typeof:l,type:e.type,key:a,ref:u,props:i,_owner:c}},createFactory:function(e){var t=S.bind(null,e);return t.type=e,t},isValidElement:P,version:"16.4.2",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:O,assign:r}},L={default:z},F=L&&z||L;e.exports=F.default?F.default:F},function(e,t,n){"use strict";
/** @license React v16.4.2
 * react-dom.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(43),o=n(1),i=n(73),a=n(42),u=n(45),l=n(74),c=n(75),s=n(76),f=n(44);function p(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,o=0;o<t;o++)n+="&args[]="+encodeURIComponent(arguments[o+1]);r(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}o||p("227");var d={_caughtError:null,_hasCaughtError:!1,_rethrowError:null,_hasRethrowError:!1,invokeGuardedCallback:function(e,t,n,r,o,i,a,u,l){(function(e,t,n,r,o,i,a,u,l){this._hasCaughtError=!1,this._caughtError=null;var c=Array.prototype.slice.call(arguments,3);try{t.apply(n,c)}catch(e){this._caughtError=e,this._hasCaughtError=!0}}).apply(d,arguments)},invokeGuardedCallbackAndCatchFirstError:function(e,t,n,r,o,i,a,u,l){if(d.invokeGuardedCallback.apply(this,arguments),d.hasCaughtError()){var c=d.clearCaughtError();d._hasRethrowError||(d._hasRethrowError=!0,d._rethrowError=c)}},rethrowCaughtError:function(){return function(){if(d._hasRethrowError){var e=d._rethrowError;throw d._rethrowError=null,d._hasRethrowError=!1,e}}.apply(d,arguments)},hasCaughtError:function(){return d._hasCaughtError},clearCaughtError:function(){if(d._hasCaughtError){var e=d._caughtError;return d._caughtError=null,d._hasCaughtError=!1,e}p("198")}};var h=null,v={};function m(){if(h)for(var e in v){var t=v[e],n=h.indexOf(e);if(-1<n||p("96",e),!g[n])for(var r in t.extractEvents||p("97",e),g[n]=t,n=t.eventTypes){var o=void 0,i=n[r],a=t,u=r;b.hasOwnProperty(u)&&p("99",u),b[u]=i;var l=i.phasedRegistrationNames;if(l){for(o in l)l.hasOwnProperty(o)&&y(l[o],a,u);o=!0}else i.registrationName?(y(i.registrationName,a,u),o=!0):o=!1;o||p("98",r,e)}}}function y(e,t,n){_[e]&&p("100",e),_[e]=t,w[e]=t.eventTypes[n].dependencies}var g=[],b={},_={},w={};function E(e){h&&p("101"),h=Array.prototype.slice.call(e),m()}function x(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var r=e[t];v.hasOwnProperty(t)&&v[t]===r||(v[t]&&p("102",t),v[t]=r,n=!0)}n&&m()}var O={plugins:g,eventNameDispatchConfigs:b,registrationNameModules:_,registrationNameDependencies:w,possibleRegistrationNames:null,injectEventPluginOrder:E,injectEventPluginsByName:x},k=null,C=null,S=null;function P(e,t,n,r){t=e.type||"unknown-event",e.currentTarget=S(r),d.invokeGuardedCallbackAndCatchFirstError(t,n,void 0,e),e.currentTarget=null}function j(e,t){return null==t&&p("30"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function T(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}var N=null;function R(e,t){if(e){var n=e._dispatchListeners,r=e._dispatchInstances;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)P(e,t,n[o],r[o]);else n&&P(e,t,n,r);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function M(e){return R(e,!0)}function A(e){return R(e,!1)}var I={injectEventPluginOrder:E,injectEventPluginsByName:x};function U(e,t){var n=e.stateNode;if(!n)return null;var r=k(n);if(!r)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(r=!r.disabled)||(r=!("button"===(e=e.type)||"input"===e||"select"===e||"textarea"===e)),e=!r;break e;default:e=!1}return e?null:(n&&"function"!=typeof n&&p("231",t,typeof n),n)}function D(e,t){null!==e&&(N=j(N,e)),e=N,N=null,e&&(T(e,t?M:A),N&&p("95"),d.rethrowCaughtError())}function z(e,t,n,r){for(var o=null,i=0;i<g.length;i++){var a=g[i];a&&(a=a.extractEvents(e,t,n,r))&&(o=j(o,a))}D(o,!1)}var L={injection:I,getListener:U,runEventsInBatch:D,runExtractedEventsInBatch:z},F=Math.random().toString(36).slice(2),B="__reactInternalInstance$"+F,H="__reactEventHandlers$"+F;function W(e){if(e[B])return e[B];for(;!e[B];){if(!e.parentNode)return null;e=e.parentNode}return 5===(e=e[B]).tag||6===e.tag?e:null}function q(e){if(5===e.tag||6===e.tag)return e.stateNode;p("33")}function $(e){return e[H]||null}var V={precacheFiberNode:function(e,t){t[B]=e},getClosestInstanceFromNode:W,getInstanceFromNode:function(e){return!(e=e[B])||5!==e.tag&&6!==e.tag?null:e},getNodeFromInstance:q,getFiberCurrentPropsFromNode:$,updateFiberProps:function(e,t){e[H]=t}};function Y(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function K(e,t,n){for(var r=[];e;)r.push(e),e=Y(e);for(e=r.length;0<e--;)t(r[e],"captured",n);for(e=0;e<r.length;e++)t(r[e],"bubbled",n)}function G(e,t,n){(t=U(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=j(n._dispatchListeners,t),n._dispatchInstances=j(n._dispatchInstances,e))}function Q(e){e&&e.dispatchConfig.phasedRegistrationNames&&K(e._targetInst,G,e)}function Z(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst;K(t=t?Y(t):null,G,e)}}function X(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=U(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=j(n._dispatchListeners,t),n._dispatchInstances=j(n._dispatchInstances,e))}function J(e){e&&e.dispatchConfig.registrationName&&X(e._targetInst,null,e)}function ee(e){T(e,Q)}function te(e,t,n,r){if(n&&r)e:{for(var o=n,i=r,a=0,u=o;u;u=Y(u))a++;u=0;for(var l=i;l;l=Y(l))u++;for(;0<a-u;)o=Y(o),a--;for(;0<u-a;)i=Y(i),u--;for(;a--;){if(o===i||o===i.alternate)break e;o=Y(o),i=Y(i)}o=null}else o=null;for(i=o,o=[];n&&n!==i&&(null===(a=n.alternate)||a!==i);)o.push(n),n=Y(n);for(n=[];r&&r!==i&&(null===(a=r.alternate)||a!==i);)n.push(r),r=Y(r);for(r=0;r<o.length;r++)X(o[r],"bubbled",e);for(e=n.length;0<e--;)X(n[e],"captured",t)}var ne={accumulateTwoPhaseDispatches:ee,accumulateTwoPhaseDispatchesSkipTarget:function(e){T(e,Z)},accumulateEnterLeaveDispatches:te,accumulateDirectDispatches:function(e){T(e,J)}};function re(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n["ms"+e]="MS"+t,n["O"+e]="o"+t.toLowerCase(),n}var oe={animationend:re("Animation","AnimationEnd"),animationiteration:re("Animation","AnimationIteration"),animationstart:re("Animation","AnimationStart"),transitionend:re("Transition","TransitionEnd")},ie={},ae={};function ue(e){if(ie[e])return ie[e];if(!oe[e])return e;var t,n=oe[e];for(t in n)if(n.hasOwnProperty(t)&&t in ae)return ie[e]=n[t];return e}i.canUseDOM&&(ae=document.createElement("div").style,"AnimationEvent"in window||(delete oe.animationend.animation,delete oe.animationiteration.animation,delete oe.animationstart.animation),"TransitionEvent"in window||delete oe.transitionend.transition);var le=ue("animationend"),ce=ue("animationiteration"),se=ue("animationstart"),fe=ue("transitionend"),pe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),de=null;function he(){return!de&&i.canUseDOM&&(de="textContent"in document.documentElement?"textContent":"innerText"),de}var ve={_root:null,_startText:null,_fallbackText:null};function me(){if(ve._fallbackText)return ve._fallbackText;var e,t,n=ve._startText,r=n.length,o=ye(),i=o.length;for(e=0;e<r&&n[e]===o[e];e++);var a=r-e;for(t=1;t<=a&&n[r-t]===o[i-t];t++);return ve._fallbackText=o.slice(e,1<t?1-t:void 0),ve._fallbackText}function ye(){return"value"in ve._root?ve._root.value:ve._root[he()]}var ge="dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances".split(" "),be={type:null,target:null,currentTarget:u.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};function _e(e,t,n,r){for(var o in this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?u.thatReturnsTrue:u.thatReturnsFalse,this.isPropagationStopped=u.thatReturnsFalse,this}function we(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function Ee(e){e instanceof this||p("223"),e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function xe(e){e.eventPool=[],e.getPooled=we,e.release=Ee}a(_e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=u.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=u.thatReturnsTrue)},persist:function(){this.isPersistent=u.thatReturnsTrue},isPersistent:u.thatReturnsFalse,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;for(t=0;t<ge.length;t++)this[ge[t]]=null}}),_e.Interface=be,_e.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var o=new t;return a(o,n.prototype),n.prototype=o,n.prototype.constructor=n,n.Interface=a({},r.Interface,e),n.extend=r.extend,xe(n),n},xe(_e);var Oe=_e.extend({data:null}),ke=_e.extend({data:null}),Ce=[9,13,27,32],Se=i.canUseDOM&&"CompositionEvent"in window,Pe=null;i.canUseDOM&&"documentMode"in document&&(Pe=document.documentMode);var je=i.canUseDOM&&"TextEvent"in window&&!Pe,Te=i.canUseDOM&&(!Se||Pe&&8<Pe&&11>=Pe),Ne=String.fromCharCode(32),Re={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},Me=!1;function Ae(e,t){switch(e){case"keyup":return-1!==Ce.indexOf(t.keyCode);case"keydown":return 229!==t.keyCode;case"keypress":case"mousedown":case"blur":return!0;default:return!1}}function Ie(e){return"object"==typeof(e=e.detail)&&"data"in e?e.data:null}var Ue=!1;var De={eventTypes:Re,extractEvents:function(e,t,n,r){var o=void 0,i=void 0;if(Se)e:{switch(e){case"compositionstart":o=Re.compositionStart;break e;case"compositionend":o=Re.compositionEnd;break e;case"compositionupdate":o=Re.compositionUpdate;break e}o=void 0}else Ue?Ae(e,n)&&(o=Re.compositionEnd):"keydown"===e&&229===n.keyCode&&(o=Re.compositionStart);return o?(Te&&(Ue||o!==Re.compositionStart?o===Re.compositionEnd&&Ue&&(i=me()):(ve._root=r,ve._startText=ye(),Ue=!0)),o=Oe.getPooled(o,t,n,r),i?o.data=i:null!==(i=Ie(n))&&(o.data=i),ee(o),i=o):i=null,(e=je?function(e,t){switch(e){case"compositionend":return Ie(t);case"keypress":return 32!==t.which?null:(Me=!0,Ne);case"textInput":return(e=t.data)===Ne&&Me?null:e;default:return null}}(e,n):function(e,t){if(Ue)return"compositionend"===e||!Se&&Ae(e,t)?(e=me(),ve._root=null,ve._startText=null,ve._fallbackText=null,Ue=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Te?null:t.data;default:return null}}(e,n))?((t=ke.getPooled(Re.beforeInput,t,n,r)).data=e,ee(t)):t=null,null===i?t:null===t?i:[i,t]}},ze=null,Le={injectFiberControlledHostComponent:function(e){ze=e}},Fe=null,Be=null;function He(e){if(e=C(e)){ze&&"function"==typeof ze.restoreControlledState||p("194");var t=k(e.stateNode);ze.restoreControlledState(e.stateNode,e.type,t)}}function We(e){Fe?Be?Be.push(e):Be=[e]:Fe=e}function qe(){return null!==Fe||null!==Be}function $e(){if(Fe){var e=Fe,t=Be;if(Be=Fe=null,He(e),t)for(e=0;e<t.length;e++)He(t[e])}}var Ve={injection:Le,enqueueStateRestore:We,needsStateRestore:qe,restoreStateIfNeeded:$e};function Ye(e,t){return e(t)}function Ke(e,t,n){return e(t,n)}function Ge(){}var Qe=!1;function Ze(e,t){if(Qe)return e(t);Qe=!0;try{return Ye(e,t)}finally{Qe=!1,qe()&&(Ge(),$e())}}var Xe={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Je(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!Xe[e.type]:"textarea"===t}function et(e){return(e=e.target||e.srcElement||window).correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function tt(e,t){return!(!i.canUseDOM||t&&!("addEventListener"in document))&&((t=(e="on"+e)in document)||((t=document.createElement("div")).setAttribute(e,"return;"),t="function"==typeof t[e]),t)}function nt(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function rt(e){e._valueTracker||(e._valueTracker=function(e){var t=nt(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&void 0!==n&&"function"==typeof n.get&&"function"==typeof n.set){var o=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(e){r=""+e,i.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}(e))}function ot(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=nt(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}var it=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,at="function"==typeof Symbol&&Symbol.for,ut=at?Symbol.for("react.element"):60103,lt=at?Symbol.for("react.portal"):60106,ct=at?Symbol.for("react.fragment"):60107,st=at?Symbol.for("react.strict_mode"):60108,ft=at?Symbol.for("react.profiler"):60114,pt=at?Symbol.for("react.provider"):60109,dt=at?Symbol.for("react.context"):60110,ht=at?Symbol.for("react.async_mode"):60111,vt=at?Symbol.for("react.forward_ref"):60112,mt=at?Symbol.for("react.timeout"):60113,yt="function"==typeof Symbol&&Symbol.iterator;function gt(e){return null===e||void 0===e?null:"function"==typeof(e=yt&&e[yt]||e["@@iterator"])?e:null}function bt(e){var t=e.type;if("function"==typeof t)return t.displayName||t.name;if("string"==typeof t)return t;switch(t){case ht:return"AsyncMode";case dt:return"Context.Consumer";case ct:return"ReactFragment";case lt:return"ReactPortal";case ft:return"Profiler("+e.pendingProps.id+")";case pt:return"Context.Provider";case st:return"StrictMode";case mt:return"Timeout"}if("object"==typeof t&&null!==t)switch(t.$$typeof){case vt:return""!==(e=t.render.displayName||t.render.name||"")?"ForwardRef("+e+")":"ForwardRef"}return null}function _t(e){var t="";do{e:switch(e.tag){case 0:case 1:case 2:case 5:var n=e._debugOwner,r=e._debugSource,o=bt(e),i=null;n&&(i=bt(n)),n=r,o="\n    in "+(o||"Unknown")+(n?" (at "+n.fileName.replace(/^.*[\\\/]/,"")+":"+n.lineNumber+")":i?" (created by "+i+")":"");break e;default:o=""}t+=o,e=e.return}while(e);return t}var wt=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Et=Object.prototype.hasOwnProperty,xt={},Ot={};function kt(e,t,n,r,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t}var Ct={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Ct[e]=new kt(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];Ct[t]=new kt(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){Ct[e]=new kt(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","preserveAlpha"].forEach(function(e){Ct[e]=new kt(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Ct[e]=new kt(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){Ct[e]=new kt(e,3,!0,e.toLowerCase(),null)}),["capture","download"].forEach(function(e){Ct[e]=new kt(e,4,!1,e.toLowerCase(),null)}),["cols","rows","size","span"].forEach(function(e){Ct[e]=new kt(e,6,!1,e.toLowerCase(),null)}),["rowSpan","start"].forEach(function(e){Ct[e]=new kt(e,5,!1,e.toLowerCase(),null)});var St=/[\-:]([a-z])/g;function Pt(e){return e[1].toUpperCase()}function jt(e,t,n,r){var o=Ct.hasOwnProperty(t)?Ct[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(function(e,t,n,r){if(null===t||void 0===t||function(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,n,r))return!0;if(r)return!1;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}(t,n,o,r)&&(n=null),r||null===o?function(e){return!!Et.call(Ot,e)||!Et.call(xt,e)&&(wt.test(e)?Ot[e]=!0:(xt[e]=!0,!1))}(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(n=3===(o=o.type)||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function Tt(e,t){var n=t.checked;return a({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function Nt(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=Ut(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function Rt(e,t){null!=(t=t.checked)&&jt(e,"checked",t,!1)}function Mt(e,t){Rt(e,t);var n=Ut(t.value);null!=n&&("number"===t.type?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n)),t.hasOwnProperty("value")?It(e,t.type,n):t.hasOwnProperty("defaultValue")&&It(e,t.type,Ut(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function At(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){t=""+e._wrapperState.initialValue;var r=e.value;n||t===r||(e.value=t),e.defaultValue=t}""!==(n=e.name)&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!e.defaultChecked,""!==n&&(e.name=n)}function It(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}function Ut(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(St,Pt);Ct[t]=new kt(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(St,Pt);Ct[t]=new kt(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(St,Pt);Ct[t]=new kt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),Ct.tabIndex=new kt("tabIndex",1,!1,"tabindex",null);var Dt={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function zt(e,t,n){return(e=_e.getPooled(Dt.change,e,t,n)).type="change",We(n),ee(e),e}var Lt=null,Ft=null;function Bt(e){D(e,!1)}function Ht(e){if(ot(q(e)))return e}function Wt(e,t){if("change"===e)return t}var qt=!1;function $t(){Lt&&(Lt.detachEvent("onpropertychange",Vt),Ft=Lt=null)}function Vt(e){"value"===e.propertyName&&Ht(Ft)&&Ze(Bt,e=zt(Ft,e,et(e)))}function Yt(e,t,n){"focus"===e?($t(),Ft=n,(Lt=t).attachEvent("onpropertychange",Vt)):"blur"===e&&$t()}function Kt(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return Ht(Ft)}function Gt(e,t){if("click"===e)return Ht(t)}function Qt(e,t){if("input"===e||"change"===e)return Ht(t)}i.canUseDOM&&(qt=tt("input")&&(!document.documentMode||9<document.documentMode));var Zt={eventTypes:Dt,_isInputEventSupported:qt,extractEvents:function(e,t,n,r){var o=t?q(t):window,i=void 0,a=void 0,u=o.nodeName&&o.nodeName.toLowerCase();if("select"===u||"input"===u&&"file"===o.type?i=Wt:Je(o)?qt?i=Qt:(i=Kt,a=Yt):(u=o.nodeName)&&"input"===u.toLowerCase()&&("checkbox"===o.type||"radio"===o.type)&&(i=Gt),i&&(i=i(e,t)))return zt(i,n,r);a&&a(e,o,t),"blur"===e&&(e=o._wrapperState)&&e.controlled&&"number"===o.type&&It(o,"number",o.value)}},Xt=_e.extend({view:null,detail:null}),Jt={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function en(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=Jt[e])&&!!t[e]}function tn(){return en}var nn=Xt.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:tn,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)}}),rn=nn.extend({pointerId:null,width:null,height:null,pressure:null,tiltX:null,tiltY:null,pointerType:null,isPrimary:null}),on={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},an={eventTypes:on,extractEvents:function(e,t,n,r){var o="mouseover"===e||"pointerover"===e,i="mouseout"===e||"pointerout"===e;if(o&&(n.relatedTarget||n.fromElement)||!i&&!o)return null;if(o=r.window===r?r:(o=r.ownerDocument)?o.defaultView||o.parentWindow:window,i?(i=t,t=(t=n.relatedTarget||n.toElement)?W(t):null):i=null,i===t)return null;var a=void 0,u=void 0,l=void 0,c=void 0;return"mouseout"===e||"mouseover"===e?(a=nn,u=on.mouseLeave,l=on.mouseEnter,c="mouse"):"pointerout"!==e&&"pointerover"!==e||(a=rn,u=on.pointerLeave,l=on.pointerEnter,c="pointer"),e=null==i?o:q(i),o=null==t?o:q(t),(u=a.getPooled(u,i,n,r)).type=c+"leave",u.target=e,u.relatedTarget=o,(n=a.getPooled(l,t,n,r)).type=c+"enter",n.target=o,n.relatedTarget=e,te(u,n,i,t),[u,n]}};function un(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!=(2&t.effectTag))return 1;for(;t.return;)if(0!=(2&(t=t.return).effectTag))return 1}return 3===t.tag?2:3}function ln(e){2!==un(e)&&p("188")}function cn(e){var t=e.alternate;if(!t)return 3===(t=un(e))&&p("188"),1===t?null:e;for(var n=e,r=t;;){var o=n.return,i=o?o.alternate:null;if(!o||!i)break;if(o.child===i.child){for(var a=o.child;a;){if(a===n)return ln(o),e;if(a===r)return ln(o),t;a=a.sibling}p("188")}if(n.return!==r.return)n=o,r=i;else{a=!1;for(var u=o.child;u;){if(u===n){a=!0,n=o,r=i;break}if(u===r){a=!0,r=o,n=i;break}u=u.sibling}if(!a){for(u=i.child;u;){if(u===n){a=!0,n=i,r=o;break}if(u===r){a=!0,r=i,n=o;break}u=u.sibling}a||p("189")}}n.alternate!==r&&p("190")}return 3!==n.tag&&p("188"),n.stateNode.current===n?e:t}function sn(e){if(!(e=cn(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}var fn=_e.extend({animationName:null,elapsedTime:null,pseudoElement:null}),pn=_e.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),dn=Xt.extend({relatedTarget:null});function hn(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}var vn={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},mn={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},yn=Xt.extend({key:function(e){if(e.key){var t=vn[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?13===(e=hn(e))?"Enter":String.fromCharCode(e):"keydown"===e.type||"keyup"===e.type?mn[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:tn,charCode:function(e){return"keypress"===e.type?hn(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?hn(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),gn=nn.extend({dataTransfer:null}),bn=Xt.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:tn}),_n=_e.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),wn=nn.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),En=[["abort","abort"],[le,"animationEnd"],[ce,"animationIteration"],[se,"animationStart"],["canplay","canPlay"],["canplaythrough","canPlayThrough"],["drag","drag"],["dragenter","dragEnter"],["dragexit","dragExit"],["dragleave","dragLeave"],["dragover","dragOver"],["durationchange","durationChange"],["emptied","emptied"],["encrypted","encrypted"],["ended","ended"],["error","error"],["gotpointercapture","gotPointerCapture"],["load","load"],["loadeddata","loadedData"],["loadedmetadata","loadedMetadata"],["loadstart","loadStart"],["lostpointercapture","lostPointerCapture"],["mousemove","mouseMove"],["mouseout","mouseOut"],["mouseover","mouseOver"],["playing","playing"],["pointermove","pointerMove"],["pointerout","pointerOut"],["pointerover","pointerOver"],["progress","progress"],["scroll","scroll"],["seeking","seeking"],["stalled","stalled"],["suspend","suspend"],["timeupdate","timeUpdate"],["toggle","toggle"],["touchmove","touchMove"],[fe,"transitionEnd"],["waiting","waiting"],["wheel","wheel"]],xn={},On={};function kn(e,t){var n=e[0],r="on"+((e=e[1])[0].toUpperCase()+e.slice(1));t={phasedRegistrationNames:{bubbled:r,captured:r+"Capture"},dependencies:[n],isInteractive:t},xn[e]=t,On[n]=t}[["blur","blur"],["cancel","cancel"],["click","click"],["close","close"],["contextmenu","contextMenu"],["copy","copy"],["cut","cut"],["dblclick","doubleClick"],["dragend","dragEnd"],["dragstart","dragStart"],["drop","drop"],["focus","focus"],["input","input"],["invalid","invalid"],["keydown","keyDown"],["keypress","keyPress"],["keyup","keyUp"],["mousedown","mouseDown"],["mouseup","mouseUp"],["paste","paste"],["pause","pause"],["play","play"],["pointercancel","pointerCancel"],["pointerdown","pointerDown"],["pointerup","pointerUp"],["ratechange","rateChange"],["reset","reset"],["seeked","seeked"],["submit","submit"],["touchcancel","touchCancel"],["touchend","touchEnd"],["touchstart","touchStart"],["volumechange","volumeChange"]].forEach(function(e){kn(e,!0)}),En.forEach(function(e){kn(e,!1)});var Cn={eventTypes:xn,isInteractiveTopLevelEventType:function(e){return void 0!==(e=On[e])&&!0===e.isInteractive},extractEvents:function(e,t,n,r){var o=On[e];if(!o)return null;switch(e){case"keypress":if(0===hn(n))return null;case"keydown":case"keyup":e=yn;break;case"blur":case"focus":e=dn;break;case"click":if(2===n.button)return null;case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":e=nn;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":e=gn;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":e=bn;break;case le:case ce:case se:e=fn;break;case fe:e=_n;break;case"scroll":e=Xt;break;case"wheel":e=wn;break;case"copy":case"cut":case"paste":e=pn;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":e=rn;break;default:e=_e}return ee(t=e.getPooled(o,t,n,r)),t}},Sn=Cn.isInteractiveTopLevelEventType,Pn=[];function jn(e){var t=e.targetInst;do{if(!t){e.ancestors.push(t);break}var n;for(n=t;n.return;)n=n.return;if(!(n=3!==n.tag?null:n.stateNode.containerInfo))break;e.ancestors.push(t),t=W(n)}while(t);for(n=0;n<e.ancestors.length;n++)t=e.ancestors[n],z(e.topLevelType,t,e.nativeEvent,et(e.nativeEvent))}var Tn=!0;function Nn(e){Tn=!!e}function Rn(e,t){if(!t)return null;var n=(Sn(e)?An:In).bind(null,e);t.addEventListener(e,n,!1)}function Mn(e,t){if(!t)return null;var n=(Sn(e)?An:In).bind(null,e);t.addEventListener(e,n,!0)}function An(e,t){Ke(In,e,t)}function In(e,t){if(Tn){var n=et(t);if(null===(n=W(n))||"number"!=typeof n.tag||2===un(n)||(n=null),Pn.length){var r=Pn.pop();r.topLevelType=e,r.nativeEvent=t,r.targetInst=n,e=r}else e={topLevelType:e,nativeEvent:t,targetInst:n,ancestors:[]};try{Ze(jn,e)}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>Pn.length&&Pn.push(e)}}}var Un={get _enabled(){return Tn},setEnabled:Nn,isEnabled:function(){return Tn},trapBubbledEvent:Rn,trapCapturedEvent:Mn,dispatchEvent:In},Dn={},zn=0,Ln="_reactListenersID"+(""+Math.random()).slice(2);function Fn(e){return Object.prototype.hasOwnProperty.call(e,Ln)||(e[Ln]=zn++,Dn[e[Ln]]={}),Dn[e[Ln]]}function Bn(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Hn(e,t){var n,r=Bn(e);for(e=0;r;){if(3===r.nodeType){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Bn(r)}}function Wn(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&("text"===e.type||"search"===e.type||"tel"===e.type||"url"===e.type||"password"===e.type)||"textarea"===t||"true"===e.contentEditable)}var qn=i.canUseDOM&&"documentMode"in document&&11>=document.documentMode,$n={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Vn=null,Yn=null,Kn=null,Gn=!1;function Qn(e,t){if(Gn||null==Vn||Vn!==l())return null;var n=Vn;return"selectionStart"in n&&Wn(n)?n={start:n.selectionStart,end:n.selectionEnd}:window.getSelection?n={anchorNode:(n=window.getSelection()).anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}:n=void 0,Kn&&c(Kn,n)?null:(Kn=n,(e=_e.getPooled($n.select,Yn,e,t)).type="select",e.target=Vn,ee(e),e)}var Zn={eventTypes:$n,extractEvents:function(e,t,n,r){var o,i=r.window===r?r.document:9===r.nodeType?r:r.ownerDocument;if(!(o=!i)){e:{i=Fn(i),o=w.onSelect;for(var a=0;a<o.length;a++){var u=o[a];if(!i.hasOwnProperty(u)||!i[u]){i=!1;break e}}i=!0}o=!i}if(o)return null;switch(i=t?q(t):window,e){case"focus":(Je(i)||"true"===i.contentEditable)&&(Vn=i,Yn=t,Kn=null);break;case"blur":Kn=Yn=Vn=null;break;case"mousedown":Gn=!0;break;case"contextmenu":case"mouseup":return Gn=!1,Qn(n,r);case"selectionchange":if(qn)break;case"keydown":case"keyup":return Qn(n,r)}return null}};I.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),k=V.getFiberCurrentPropsFromNode,C=V.getInstanceFromNode,S=V.getNodeFromInstance,I.injectEventPluginsByName({SimpleEventPlugin:Cn,EnterLeaveEventPlugin:an,ChangeEventPlugin:Zt,SelectEventPlugin:Zn,BeforeInputEventPlugin:De});var Xn="function"==typeof requestAnimationFrame?requestAnimationFrame:void 0,Jn=Date,er=setTimeout,tr=clearTimeout,nr=void 0;if("object"==typeof performance&&"function"==typeof performance.now){var rr=performance;nr=function(){return rr.now()}}else nr=function(){return Jn.now()};var or=void 0,ir=void 0;if(i.canUseDOM){var ar="function"==typeof Xn?Xn:function(){p("276")},ur=null,lr=null,cr=-1,sr=!1,fr=!1,pr=0,dr=33,hr=33,vr={didTimeout:!1,timeRemaining:function(){var e=pr-nr();return 0<e?e:0}},mr=function(e,t){var n=e.scheduledCallback,r=!1;try{n(t),r=!0}finally{ir(e),r||(sr=!0,window.postMessage(yr,"*"))}},yr="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(e){if(e.source===window&&e.data===yr&&(sr=!1,null!==ur)){if(null!==ur){var t=nr();if(!(-1===cr||cr>t)){e=-1;for(var n=[],r=ur;null!==r;){var o=r.timeoutTime;-1!==o&&o<=t?n.push(r):-1!==o&&(-1===e||o<e)&&(e=o),r=r.next}if(0<n.length)for(vr.didTimeout=!0,t=0,r=n.length;t<r;t++)mr(n[t],vr);cr=e}}for(e=nr();0<pr-e&&null!==ur;)e=ur,vr.didTimeout=!1,mr(e,vr),e=nr();null===ur||fr||(fr=!0,ar(gr))}},!1);var gr=function(e){fr=!1;var t=e-pr+hr;t<hr&&dr<hr?(8>t&&(t=8),hr=t<dr?dr:t):dr=t,pr=e+hr,sr||(sr=!0,window.postMessage(yr,"*"))};or=function(e,t){var n=-1;return null!=t&&"number"==typeof t.timeout&&(n=nr()+t.timeout),(-1===cr||-1!==n&&n<cr)&&(cr=n),e={scheduledCallback:e,timeoutTime:n,prev:null,next:null},null===ur?ur=e:null!==(t=e.prev=lr)&&(t.next=e),lr=e,fr||(fr=!0,ar(gr)),e},ir=function(e){if(null!==e.prev||ur===e){var t=e.next,n=e.prev;e.next=null,e.prev=null,null!==t?null!==n?(n.next=t,t.prev=n):(t.prev=null,ur=t):null!==n?(n.next=null,lr=n):lr=ur=null}}}else{var br=new Map;or=function(e){var t={scheduledCallback:e,timeoutTime:0,next:null,prev:null},n=er(function(){e({timeRemaining:function(){return 1/0},didTimeout:!1})});return br.set(e,n),t},ir=function(e){var t=br.get(e.scheduledCallback);br.delete(e),tr(t)}}function _r(e,t){return e=a({children:void 0},t),(t=function(e){var t="";return o.Children.forEach(e,function(e){null==e||"string"!=typeof e&&"number"!=typeof e||(t+=e)}),t}(t.children))&&(e.children=t),e}function wr(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+n,t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function Er(e,t){var n=t.value;e._wrapperState={initialValue:null!=n?n:t.defaultValue,wasMultiple:!!t.multiple}}function xr(e,t){return null!=t.dangerouslySetInnerHTML&&p("91"),a({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Or(e,t){var n=t.value;null==n&&(n=t.defaultValue,null!=(t=t.children)&&(null!=n&&p("92"),Array.isArray(t)&&(1>=t.length||p("93"),t=t[0]),n=""+t),null==n&&(n="")),e._wrapperState={initialValue:""+n}}function kr(e,t){var n=t.value;null!=n&&((n=""+n)!==e.value&&(e.value=n),null==t.defaultValue&&(e.defaultValue=n)),null!=t.defaultValue&&(e.defaultValue=t.defaultValue)}function Cr(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}var Sr={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function Pr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function jr(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?Pr(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}var Tr=void 0,Nr=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n)})}:e}(function(e,t){if(e.namespaceURI!==Sr.svg||"innerHTML"in e)e.innerHTML=t;else{for((Tr=Tr||document.createElement("div")).innerHTML="<svg>"+t+"</svg>",t=Tr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Rr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}var Mr={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ar=["Webkit","ms","Moz","O"];function Ir(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=n,i=t[n];o=null==i||"boolean"==typeof i||""===i?"":r||"number"!=typeof i||0===i||Mr.hasOwnProperty(o)&&Mr[o]?(""+i).trim():i+"px","float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}Object.keys(Mr).forEach(function(e){Ar.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Mr[t]=Mr[e]})});var Ur=a({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Dr(e,t,n){t&&(Ur[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&p("137",e,n()),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&p("60"),"object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML||p("61")),null!=t.style&&"object"!=typeof t.style&&p("62",n()))}function zr(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Lr=u.thatReturns("");function Fr(e,t){var n=Fn(e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument);t=w[t];for(var r=0;r<t.length;r++){var o=t[r];if(!n.hasOwnProperty(o)||!n[o]){switch(o){case"scroll":Mn("scroll",e);break;case"focus":case"blur":Mn("focus",e),Mn("blur",e),n.blur=!0,n.focus=!0;break;case"cancel":case"close":tt(o,!0)&&Mn(o,e);break;case"invalid":case"submit":case"reset":break;default:-1===pe.indexOf(o)&&Rn(o,e)}n[o]=!0}}}function Br(e,t,n,r){return n=9===n.nodeType?n:n.ownerDocument,r===Sr.html&&(r=Pr(e)),r===Sr.html?"script"===e?((e=n.createElement("div")).innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):e="string"==typeof t.is?n.createElement(e,{is:t.is}):n.createElement(e):e=n.createElementNS(r,e),e}function Hr(e,t){return(9===t.nodeType?t:t.ownerDocument).createTextNode(e)}function Wr(e,t,n,r){var o=zr(t,n);switch(t){case"iframe":case"object":Rn("load",e);var i=n;break;case"video":case"audio":for(i=0;i<pe.length;i++)Rn(pe[i],e);i=n;break;case"source":Rn("error",e),i=n;break;case"img":case"image":case"link":Rn("error",e),Rn("load",e),i=n;break;case"form":Rn("reset",e),Rn("submit",e),i=n;break;case"details":Rn("toggle",e),i=n;break;case"input":Nt(e,n),i=Tt(e,n),Rn("invalid",e),Fr(r,"onChange");break;case"option":i=_r(e,n);break;case"select":Er(e,n),i=a({},n,{value:void 0}),Rn("invalid",e),Fr(r,"onChange");break;case"textarea":Or(e,n),i=xr(e,n),Rn("invalid",e),Fr(r,"onChange");break;default:i=n}Dr(t,i,Lr);var l,c=i;for(l in c)if(c.hasOwnProperty(l)){var s=c[l];"style"===l?Ir(e,s):"dangerouslySetInnerHTML"===l?null!=(s=s?s.__html:void 0)&&Nr(e,s):"children"===l?"string"==typeof s?("textarea"!==t||""!==s)&&Rr(e,s):"number"==typeof s&&Rr(e,""+s):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(_.hasOwnProperty(l)?null!=s&&Fr(r,l):null!=s&&jt(e,l,s,o))}switch(t){case"input":rt(e),At(e,n,!1);break;case"textarea":rt(e),Cr(e);break;case"option":null!=n.value&&e.setAttribute("value",n.value);break;case"select":e.multiple=!!n.multiple,null!=(t=n.value)?wr(e,!!n.multiple,t,!1):null!=n.defaultValue&&wr(e,!!n.multiple,n.defaultValue,!0);break;default:"function"==typeof i.onClick&&(e.onclick=u)}}function qr(e,t,n,r,o){var i=null;switch(t){case"input":n=Tt(e,n),r=Tt(e,r),i=[];break;case"option":n=_r(e,n),r=_r(e,r),i=[];break;case"select":n=a({},n,{value:void 0}),r=a({},r,{value:void 0}),i=[];break;case"textarea":n=xr(e,n),r=xr(e,r),i=[];break;default:"function"!=typeof n.onClick&&"function"==typeof r.onClick&&(e.onclick=u)}Dr(t,r,Lr),t=e=void 0;var l=null;for(e in n)if(!r.hasOwnProperty(e)&&n.hasOwnProperty(e)&&null!=n[e])if("style"===e){var c=n[e];for(t in c)c.hasOwnProperty(t)&&(l||(l={}),l[t]="")}else"dangerouslySetInnerHTML"!==e&&"children"!==e&&"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&"autoFocus"!==e&&(_.hasOwnProperty(e)?i||(i=[]):(i=i||[]).push(e,null));for(e in r){var s=r[e];if(c=null!=n?n[e]:void 0,r.hasOwnProperty(e)&&s!==c&&(null!=s||null!=c))if("style"===e)if(c){for(t in c)!c.hasOwnProperty(t)||s&&s.hasOwnProperty(t)||(l||(l={}),l[t]="");for(t in s)s.hasOwnProperty(t)&&c[t]!==s[t]&&(l||(l={}),l[t]=s[t])}else l||(i||(i=[]),i.push(e,l)),l=s;else"dangerouslySetInnerHTML"===e?(s=s?s.__html:void 0,c=c?c.__html:void 0,null!=s&&c!==s&&(i=i||[]).push(e,""+s)):"children"===e?c===s||"string"!=typeof s&&"number"!=typeof s||(i=i||[]).push(e,""+s):"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&(_.hasOwnProperty(e)?(null!=s&&Fr(o,e),i||c===s||(i=[])):(i=i||[]).push(e,s))}return l&&(i=i||[]).push("style",l),i}function $r(e,t,n,r,o){"input"===n&&"radio"===o.type&&null!=o.name&&Rt(e,o),zr(n,r),r=zr(n,o);for(var i=0;i<t.length;i+=2){var a=t[i],u=t[i+1];"style"===a?Ir(e,u):"dangerouslySetInnerHTML"===a?Nr(e,u):"children"===a?Rr(e,u):jt(e,a,u,r)}switch(n){case"input":Mt(e,o);break;case"textarea":kr(e,o);break;case"select":e._wrapperState.initialValue=void 0,t=e._wrapperState.wasMultiple,e._wrapperState.wasMultiple=!!o.multiple,null!=(n=o.value)?wr(e,!!o.multiple,n,!1):t!==!!o.multiple&&(null!=o.defaultValue?wr(e,!!o.multiple,o.defaultValue,!0):wr(e,!!o.multiple,o.multiple?[]:"",!1))}}function Vr(e,t,n,r,o){switch(t){case"iframe":case"object":Rn("load",e);break;case"video":case"audio":for(r=0;r<pe.length;r++)Rn(pe[r],e);break;case"source":Rn("error",e);break;case"img":case"image":case"link":Rn("error",e),Rn("load",e);break;case"form":Rn("reset",e),Rn("submit",e);break;case"details":Rn("toggle",e);break;case"input":Nt(e,n),Rn("invalid",e),Fr(o,"onChange");break;case"select":Er(e,n),Rn("invalid",e),Fr(o,"onChange");break;case"textarea":Or(e,n),Rn("invalid",e),Fr(o,"onChange")}for(var i in Dr(t,n,Lr),r=null,n)if(n.hasOwnProperty(i)){var a=n[i];"children"===i?"string"==typeof a?e.textContent!==a&&(r=["children",a]):"number"==typeof a&&e.textContent!==""+a&&(r=["children",""+a]):_.hasOwnProperty(i)&&null!=a&&Fr(o,i)}switch(t){case"input":rt(e),At(e,n,!0);break;case"textarea":rt(e),Cr(e);break;case"select":case"option":break;default:"function"==typeof n.onClick&&(e.onclick=u)}return r}function Yr(e,t){return e.nodeValue!==t}var Kr={createElement:Br,createTextNode:Hr,setInitialProperties:Wr,diffProperties:qr,updateProperties:$r,diffHydratedProperties:Vr,diffHydratedText:Yr,warnForUnmatchedText:function(){},warnForDeletedHydratableElement:function(){},warnForDeletedHydratableText:function(){},warnForInsertedHydratedElement:function(){},warnForInsertedHydratedText:function(){},restoreControlledState:function(e,t,n){switch(t){case"input":if(Mt(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=$(r);o||p("90"),ot(r),Mt(r,o)}}}break;case"textarea":kr(e,n);break;case"select":null!=(t=n.value)&&wr(e,!!n.multiple,t,!1)}}},Gr=null,Qr=null;function Zr(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function Xr(e,t){return"textarea"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&"string"==typeof t.dangerouslySetInnerHTML.__html}var Jr=nr,eo=or,to=ir;function no(e){for(e=e.nextSibling;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}function ro(e){for(e=e.firstChild;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}new Set;var oo=[],io=-1;function ao(e){return{current:e}}function uo(e){0>io||(e.current=oo[io],oo[io]=null,io--)}function lo(e,t){oo[++io]=e.current,e.current=t}var co=ao(f),so=ao(!1),fo=f;function po(e){return vo(e)?fo:co.current}function ho(e,t){var n=e.type.contextTypes;if(!n)return f;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o,i={};for(o in n)i[o]=t[o];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function vo(e){return 2===e.tag&&null!=e.type.childContextTypes}function mo(e){vo(e)&&(uo(so),uo(co))}function yo(e){uo(so),uo(co)}function go(e,t,n){co.current!==f&&p("168"),lo(co,t),lo(so,n)}function bo(e,t){var n=e.stateNode,r=e.type.childContextTypes;if("function"!=typeof n.getChildContext)return t;for(var o in n=n.getChildContext())o in r||p("108",bt(e)||"Unknown",o);return a({},t,n)}function _o(e){if(!vo(e))return!1;var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||f,fo=co.current,lo(co,t),lo(so,so.current),!0}function wo(e,t){var n=e.stateNode;if(n||p("169"),t){var r=bo(e,fo);n.__reactInternalMemoizedMergedChildContext=r,uo(so),uo(co),lo(co,r)}else uo(so);lo(so,t)}function Eo(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=null,this.index=0,this.ref=null,this.pendingProps=t,this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.expirationTime=0,this.alternate=null}function xo(e,t,n){var r=e.alternate;return null===r?((r=new Eo(e.tag,t,e.key,e.mode)).type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.effectTag=0,r.nextEffect=null,r.firstEffect=null,r.lastEffect=null),r.expirationTime=n,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Oo(e,t,n){var r=e.type,o=e.key;if(e=e.props,"function"==typeof r)var i=r.prototype&&r.prototype.isReactComponent?2:0;else if("string"==typeof r)i=5;else switch(r){case ct:return ko(e.children,t,n,o);case ht:i=11,t|=3;break;case st:i=11,t|=2;break;case ft:return(r=new Eo(15,e,o,4|t)).type=ft,r.expirationTime=n,r;case mt:i=16,t|=2;break;default:e:{switch("object"==typeof r&&null!==r?r.$$typeof:null){case pt:i=13;break e;case dt:i=12;break e;case vt:i=14;break e;default:p("130",null==r?r:typeof r,"")}i=void 0}}return(t=new Eo(i,e,o,t)).type=r,t.expirationTime=n,t}function ko(e,t,n,r){return(e=new Eo(10,e,r,t)).expirationTime=n,e}function Co(e,t,n){return(e=new Eo(6,e,null,t)).expirationTime=n,e}function So(e,t,n){return(t=new Eo(4,null!==e.children?e.children:[],e.key,t)).expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Po(e,t,n){return e={current:t=new Eo(3,null,null,t?3:0),containerInfo:e,pendingChildren:null,earliestPendingTime:0,latestPendingTime:0,earliestSuspendedTime:0,latestSuspendedTime:0,latestPingedTime:0,pendingCommitExpirationTime:0,finishedWork:null,context:null,pendingContext:null,hydrate:n,remainingExpirationTime:0,firstBatch:null,nextScheduledRoot:null},t.stateNode=e}var jo=null,To=null;function No(e){return function(t){try{return e(t)}catch(e){}}}function Ro(e){"function"==typeof jo&&jo(e)}function Mo(e){"function"==typeof To&&To(e)}var Ao=!1;function Io(e){return{expirationTime:0,baseState:e,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Uo(e){return{expirationTime:e.expirationTime,baseState:e.baseState,firstUpdate:e.firstUpdate,lastUpdate:e.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Do(e){return{expirationTime:e,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function zo(e,t,n){null===e.lastUpdate?e.firstUpdate=e.lastUpdate=t:(e.lastUpdate.next=t,e.lastUpdate=t),(0===e.expirationTime||e.expirationTime>n)&&(e.expirationTime=n)}function Lo(e,t,n){var r=e.alternate;if(null===r){var o=e.updateQueue,i=null;null===o&&(o=e.updateQueue=Io(e.memoizedState))}else o=e.updateQueue,i=r.updateQueue,null===o?null===i?(o=e.updateQueue=Io(e.memoizedState),i=r.updateQueue=Io(r.memoizedState)):o=e.updateQueue=Uo(i):null===i&&(i=r.updateQueue=Uo(o));null===i||o===i?zo(o,t,n):null===o.lastUpdate||null===i.lastUpdate?(zo(o,t,n),zo(i,t,n)):(zo(o,t,n),i.lastUpdate=t)}function Fo(e,t,n){var r=e.updateQueue;null===(r=null===r?e.updateQueue=Io(e.memoizedState):Bo(e,r)).lastCapturedUpdate?r.firstCapturedUpdate=r.lastCapturedUpdate=t:(r.lastCapturedUpdate.next=t,r.lastCapturedUpdate=t),(0===r.expirationTime||r.expirationTime>n)&&(r.expirationTime=n)}function Bo(e,t){var n=e.alternate;return null!==n&&t===n.updateQueue&&(t=e.updateQueue=Uo(t)),t}function Ho(e,t,n,r,o,i){switch(n.tag){case 1:return"function"==typeof(e=n.payload)?e.call(i,r,o):e;case 3:e.effectTag=-1025&e.effectTag|64;case 0:if(null===(o="function"==typeof(e=n.payload)?e.call(i,r,o):e)||void 0===o)break;return a({},r,o);case 2:Ao=!0}return r}function Wo(e,t,n,r,o){if(Ao=!1,!(0===t.expirationTime||t.expirationTime>o)){for(var i=(t=Bo(e,t)).baseState,a=null,u=0,l=t.firstUpdate,c=i;null!==l;){var s=l.expirationTime;s>o?(null===a&&(a=l,i=c),(0===u||u>s)&&(u=s)):(c=Ho(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastEffect?t.firstEffect=t.lastEffect=l:(t.lastEffect.nextEffect=l,t.lastEffect=l))),l=l.next}for(s=null,l=t.firstCapturedUpdate;null!==l;){var f=l.expirationTime;f>o?(null===s&&(s=l,null===a&&(i=c)),(0===u||u>f)&&(u=f)):(c=Ho(e,0,l,c,n,r),null!==l.callback&&(e.effectTag|=32,l.nextEffect=null,null===t.lastCapturedEffect?t.firstCapturedEffect=t.lastCapturedEffect=l:(t.lastCapturedEffect.nextEffect=l,t.lastCapturedEffect=l))),l=l.next}null===a&&(t.lastUpdate=null),null===s?t.lastCapturedUpdate=null:e.effectTag|=32,null===a&&null===s&&(i=c),t.baseState=i,t.firstUpdate=a,t.firstCapturedUpdate=s,t.expirationTime=u,e.memoizedState=c}}function qo(e,t){"function"!=typeof e&&p("191",e),e.call(t)}function $o(e,t,n){for(null!==t.firstCapturedUpdate&&(null!==t.lastUpdate&&(t.lastUpdate.next=t.firstCapturedUpdate,t.lastUpdate=t.lastCapturedUpdate),t.firstCapturedUpdate=t.lastCapturedUpdate=null),e=t.firstEffect,t.firstEffect=t.lastEffect=null;null!==e;){var r=e.callback;null!==r&&(e.callback=null,qo(r,n)),e=e.nextEffect}for(e=t.firstCapturedEffect,t.firstCapturedEffect=t.lastCapturedEffect=null;null!==e;)null!==(t=e.callback)&&(e.callback=null,qo(t,n)),e=e.nextEffect}function Vo(e,t){return{value:e,source:t,stack:_t(t)}}var Yo=ao(null),Ko=ao(null),Go=ao(0);function Qo(e){var t=e.type._context;lo(Go,t._changedBits),lo(Ko,t._currentValue),lo(Yo,e),t._currentValue=e.pendingProps.value,t._changedBits=e.stateNode}function Zo(e){var t=Go.current,n=Ko.current;uo(Yo),uo(Ko),uo(Go),(e=e.type._context)._currentValue=n,e._changedBits=t}var Xo={},Jo=ao(Xo),ei=ao(Xo),ti=ao(Xo);function ni(e){return e===Xo&&p("174"),e}function ri(e,t){lo(ti,t),lo(ei,e),lo(Jo,Xo);var n=t.nodeType;switch(n){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:jr(null,"");break;default:t=jr(t=(n=8===n?t.parentNode:t).namespaceURI||null,n=n.tagName)}uo(Jo),lo(Jo,t)}function oi(e){uo(Jo),uo(ei),uo(ti)}function ii(e){ei.current===e&&(uo(Jo),uo(ei))}function ai(e,t,n){var r=e.memoizedState;r=null===(t=t(n,r))||void 0===t?r:a({},r,t),e.memoizedState=r,null!==(e=e.updateQueue)&&0===e.expirationTime&&(e.baseState=r)}var ui={isMounted:function(e){return!!(e=e._reactInternalFiber)&&2===un(e)},enqueueSetState:function(e,t,n){e=e._reactInternalFiber;var r=ba(),o=Do(r=ya(r,e));o.payload=t,void 0!==n&&null!==n&&(o.callback=n),Lo(e,o,r),ga(e,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternalFiber;var r=ba(),o=Do(r=ya(r,e));o.tag=1,o.payload=t,void 0!==n&&null!==n&&(o.callback=n),Lo(e,o,r),ga(e,r)},enqueueForceUpdate:function(e,t){e=e._reactInternalFiber;var n=ba(),r=Do(n=ya(n,e));r.tag=2,void 0!==t&&null!==t&&(r.callback=t),Lo(e,r,n),ga(e,n)}};function li(e,t,n,r,o,i){var a=e.stateNode;return e=e.type,"function"==typeof a.shouldComponentUpdate?a.shouldComponentUpdate(n,o,i):!e.prototype||!e.prototype.isPureReactComponent||(!c(t,n)||!c(r,o))}function ci(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&ui.enqueueReplaceState(t,t.state,null)}function si(e,t){var n=e.type,r=e.stateNode,o=e.pendingProps,i=po(e);r.props=o,r.state=e.memoizedState,r.refs=f,r.context=ho(e,i),null!==(i=e.updateQueue)&&(Wo(e,i,o,r,t),r.state=e.memoizedState),"function"==typeof(i=e.type.getDerivedStateFromProps)&&(ai(e,i,o),r.state=e.memoizedState),"function"==typeof n.getDerivedStateFromProps||"function"==typeof r.getSnapshotBeforeUpdate||"function"!=typeof r.UNSAFE_componentWillMount&&"function"!=typeof r.componentWillMount||(n=r.state,"function"==typeof r.componentWillMount&&r.componentWillMount(),"function"==typeof r.UNSAFE_componentWillMount&&r.UNSAFE_componentWillMount(),n!==r.state&&ui.enqueueReplaceState(r,r.state,null),null!==(i=e.updateQueue)&&(Wo(e,i,o,r,t),r.state=e.memoizedState)),"function"==typeof r.componentDidMount&&(e.effectTag|=4)}var fi=Array.isArray;function pi(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){var r=void 0;(n=n._owner)&&(2!==n.tag&&p("110"),r=n.stateNode),r||p("147",e);var o=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===o?t.ref:((t=function(e){var t=r.refs===f?r.refs={}:r.refs;null===e?delete t[o]:t[o]=e})._stringRef=o,t)}"string"!=typeof e&&p("148"),n._owner||p("254",e)}return e}function di(e,t){"textarea"!==e.type&&p("31","[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function hi(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t,n){return(e=xo(e,t,n)).index=0,e.sibling=null,e}function i(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.effectTag=2,n):r:(t.effectTag=2,n):n}function a(t){return e&&null===t.alternate&&(t.effectTag=2),t}function u(e,t,n,r){return null===t||6!==t.tag?((t=Co(n,e.mode,r)).return=e,t):((t=o(t,n,r)).return=e,t)}function l(e,t,n,r){return null!==t&&t.type===n.type?((r=o(t,n.props,r)).ref=pi(e,t,n),r.return=e,r):((r=Oo(n,e.mode,r)).ref=pi(e,t,n),r.return=e,r)}function c(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=So(n,e.mode,r)).return=e,t):((t=o(t,n.children||[],r)).return=e,t)}function s(e,t,n,r,i){return null===t||10!==t.tag?((t=ko(n,e.mode,r,i)).return=e,t):((t=o(t,n,r)).return=e,t)}function f(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=Co(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case ut:return(n=Oo(t,e.mode,n)).ref=pi(e,null,t),n.return=e,n;case lt:return(t=So(t,e.mode,n)).return=e,t}if(fi(t)||gt(t))return(t=ko(t,e.mode,n,null)).return=e,t;di(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:u(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case ut:return n.key===o?n.type===ct?s(e,t,n.props.children,r,o):l(e,t,n,r):null;case lt:return n.key===o?c(e,t,n,r):null}if(fi(n)||gt(n))return null!==o?null:s(e,t,n,r,null);di(e,n)}return null}function h(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return u(t,e=e.get(n)||null,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case ut:return e=e.get(null===r.key?n:r.key)||null,r.type===ct?s(t,e,r.props.children,o,r.key):l(t,e,r,o);case lt:return c(t,e=e.get(null===r.key?n:r.key)||null,r,o)}if(fi(r)||gt(r))return s(t,e=e.get(n)||null,r,o,null);di(t,r)}return null}function v(o,a,u,l){for(var c=null,s=null,p=a,v=a=0,m=null;null!==p&&v<u.length;v++){p.index>v?(m=p,p=null):m=p.sibling;var y=d(o,p,u[v],l);if(null===y){null===p&&(p=m);break}e&&p&&null===y.alternate&&t(o,p),a=i(y,a,v),null===s?c=y:s.sibling=y,s=y,p=m}if(v===u.length)return n(o,p),c;if(null===p){for(;v<u.length;v++)(p=f(o,u[v],l))&&(a=i(p,a,v),null===s?c=p:s.sibling=p,s=p);return c}for(p=r(o,p);v<u.length;v++)(m=h(p,o,v,u[v],l))&&(e&&null!==m.alternate&&p.delete(null===m.key?v:m.key),a=i(m,a,v),null===s?c=m:s.sibling=m,s=m);return e&&p.forEach(function(e){return t(o,e)}),c}function m(o,a,u,l){var c=gt(u);"function"!=typeof c&&p("150"),null==(u=c.call(u))&&p("151");for(var s=c=null,v=a,m=a=0,y=null,g=u.next();null!==v&&!g.done;m++,g=u.next()){v.index>m?(y=v,v=null):y=v.sibling;var b=d(o,v,g.value,l);if(null===b){v||(v=y);break}e&&v&&null===b.alternate&&t(o,v),a=i(b,a,m),null===s?c=b:s.sibling=b,s=b,v=y}if(g.done)return n(o,v),c;if(null===v){for(;!g.done;m++,g=u.next())null!==(g=f(o,g.value,l))&&(a=i(g,a,m),null===s?c=g:s.sibling=g,s=g);return c}for(v=r(o,v);!g.done;m++,g=u.next())null!==(g=h(v,o,m,g.value,l))&&(e&&null!==g.alternate&&v.delete(null===g.key?m:g.key),a=i(g,a,m),null===s?c=g:s.sibling=g,s=g);return e&&v.forEach(function(e){return t(o,e)}),c}return function(e,r,i,u){var l="object"==typeof i&&null!==i&&i.type===ct&&null===i.key;l&&(i=i.props.children);var c="object"==typeof i&&null!==i;if(c)switch(i.$$typeof){case ut:e:{for(c=i.key,l=r;null!==l;){if(l.key===c){if(10===l.tag?i.type===ct:l.type===i.type){n(e,l.sibling),(r=o(l,i.type===ct?i.props.children:i.props,u)).ref=pi(e,l,i),r.return=e,e=r;break e}n(e,l);break}t(e,l),l=l.sibling}i.type===ct?((r=ko(i.props.children,e.mode,u,i.key)).return=e,e=r):((u=Oo(i,e.mode,u)).ref=pi(e,r,i),u.return=e,e=u)}return a(e);case lt:e:{for(l=i.key;null!==r;){if(r.key===l){if(4===r.tag&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),(r=o(r,i.children||[],u)).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=So(i,e.mode,u)).return=e,e=r}return a(e)}if("string"==typeof i||"number"==typeof i)return i=""+i,null!==r&&6===r.tag?(n(e,r.sibling),(r=o(r,i,u)).return=e,e=r):(n(e,r),(r=Co(i,e.mode,u)).return=e,e=r),a(e);if(fi(i))return v(e,r,i,u);if(gt(i))return m(e,r,i,u);if(c&&di(e,i),void 0===i&&!l)switch(e.tag){case 2:case 1:p("152",(u=e.type).displayName||u.name||"Component")}return n(e,r)}}var vi=hi(!0),mi=hi(!1),yi=null,gi=null,bi=!1;function _i(e,t){var n=new Eo(5,null,null,0);n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function wi(e,t){switch(e.tag){case 5:var n=e.type;return null!==(t=1!==t.nodeType||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t)&&(e.stateNode=t,!0);case 6:return null!==(t=""===e.pendingProps||3!==t.nodeType?null:t)&&(e.stateNode=t,!0);default:return!1}}function Ei(e){if(bi){var t=gi;if(t){var n=t;if(!wi(e,t)){if(!(t=no(n))||!wi(e,t))return e.effectTag|=2,bi=!1,void(yi=e);_i(yi,n)}yi=e,gi=ro(t)}else e.effectTag|=2,bi=!1,yi=e}}function xi(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag;)e=e.return;yi=e}function Oi(e){if(e!==yi)return!1;if(!bi)return xi(e),bi=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!Xr(t,e.memoizedProps))for(t=gi;t;)_i(e,t),t=no(t);return xi(e),gi=yi?no(e.stateNode):null,!0}function ki(){gi=yi=null,bi=!1}function Ci(e,t,n){Si(e,t,n,t.expirationTime)}function Si(e,t,n,r){t.child=null===e?mi(t,null,n,r):vi(t,e.child,n,r)}function Pi(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function ji(e,t,n,r,o){Pi(e,t);var i=0!=(64&t.effectTag);if(!n&&!i)return r&&wo(t,!1),Ri(e,t);n=t.stateNode,it.current=t;var a=i?null:n.render();return t.effectTag|=1,i&&(Si(e,t,null,o),t.child=null),Si(e,t,a,o),t.memoizedState=n.state,t.memoizedProps=n.props,r&&wo(t,!0),t.child}function Ti(e){var t=e.stateNode;t.pendingContext?go(0,t.pendingContext,t.pendingContext!==t.context):t.context&&go(0,t.context,!1),ri(e,t.containerInfo)}function Ni(e,t,n,r){var o=e.child;for(null!==o&&(o.return=e);null!==o;){switch(o.tag){case 12:var i=0|o.stateNode;if(o.type===t&&0!=(i&n)){for(i=o;null!==i;){var a=i.alternate;if(0===i.expirationTime||i.expirationTime>r)i.expirationTime=r,null!==a&&(0===a.expirationTime||a.expirationTime>r)&&(a.expirationTime=r);else{if(null===a||!(0===a.expirationTime||a.expirationTime>r))break;a.expirationTime=r}i=i.return}i=null}else i=o.child;break;case 13:i=o.type===e.type?null:o.child;break;default:i=o.child}if(null!==i)i.return=o;else for(i=o;null!==i;){if(i===e){i=null;break}if(null!==(o=i.sibling)){o.return=i.return,i=o;break}i=i.return}o=i}}function Ri(e,t){if(null!==e&&t.child!==e.child&&p("153"),null!==t.child){var n=xo(e=t.child,e.pendingProps,e.expirationTime);for(t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=xo(e,e.pendingProps,e.expirationTime)).return=t;n.sibling=null}return t.child}function Mi(e,t,n){if(0===t.expirationTime||t.expirationTime>n){switch(t.tag){case 3:Ti(t);break;case 2:_o(t);break;case 4:ri(t,t.stateNode.containerInfo);break;case 13:Qo(t)}return null}switch(t.tag){case 0:null!==e&&p("155");var r=t.type,o=t.pendingProps,i=po(t);return r=r(o,i=ho(t,i)),t.effectTag|=1,"object"==typeof r&&null!==r&&"function"==typeof r.render&&void 0===r.$$typeof?(i=t.type,t.tag=2,t.memoizedState=null!==r.state&&void 0!==r.state?r.state:null,"function"==typeof(i=i.getDerivedStateFromProps)&&ai(t,i,o),o=_o(t),r.updater=ui,t.stateNode=r,r._reactInternalFiber=t,si(t,n),e=ji(e,t,!0,o,n)):(t.tag=1,Ci(e,t,r),t.memoizedProps=o,e=t.child),e;case 1:return o=t.type,n=t.pendingProps,so.current||t.memoizedProps!==n?(o=o(n,r=ho(t,r=po(t))),t.effectTag|=1,Ci(e,t,o),t.memoizedProps=n,e=t.child):e=Ri(e,t),e;case 2:if(o=_o(t),null===e)if(null===t.stateNode){var a=t.pendingProps,u=t.type;r=po(t);var l=2===t.tag&&null!=t.type.contextTypes;a=new u(a,i=l?ho(t,r):f),t.memoizedState=null!==a.state&&void 0!==a.state?a.state:null,a.updater=ui,t.stateNode=a,a._reactInternalFiber=t,l&&((l=t.stateNode).__reactInternalMemoizedUnmaskedChildContext=r,l.__reactInternalMemoizedMaskedChildContext=i),si(t,n),r=!0}else{u=t.type,r=t.stateNode,l=t.memoizedProps,i=t.pendingProps,r.props=l;var c=r.context;a=ho(t,a=po(t));var s=u.getDerivedStateFromProps;(u="function"==typeof s||"function"==typeof r.getSnapshotBeforeUpdate)||"function"!=typeof r.UNSAFE_componentWillReceiveProps&&"function"!=typeof r.componentWillReceiveProps||(l!==i||c!==a)&&ci(t,r,i,a),Ao=!1;var d=t.memoizedState;c=r.state=d;var h=t.updateQueue;null!==h&&(Wo(t,h,i,r,n),c=t.memoizedState),l!==i||d!==c||so.current||Ao?("function"==typeof s&&(ai(t,s,i),c=t.memoizedState),(l=Ao||li(t,l,i,d,c,a))?(u||"function"!=typeof r.UNSAFE_componentWillMount&&"function"!=typeof r.componentWillMount||("function"==typeof r.componentWillMount&&r.componentWillMount(),"function"==typeof r.UNSAFE_componentWillMount&&r.UNSAFE_componentWillMount()),"function"==typeof r.componentDidMount&&(t.effectTag|=4)):("function"==typeof r.componentDidMount&&(t.effectTag|=4),t.memoizedProps=i,t.memoizedState=c),r.props=i,r.state=c,r.context=a,r=l):("function"==typeof r.componentDidMount&&(t.effectTag|=4),r=!1)}else u=t.type,r=t.stateNode,i=t.memoizedProps,l=t.pendingProps,r.props=i,c=r.context,a=ho(t,a=po(t)),(u="function"==typeof(s=u.getDerivedStateFromProps)||"function"==typeof r.getSnapshotBeforeUpdate)||"function"!=typeof r.UNSAFE_componentWillReceiveProps&&"function"!=typeof r.componentWillReceiveProps||(i!==l||c!==a)&&ci(t,r,l,a),Ao=!1,c=t.memoizedState,d=r.state=c,null!==(h=t.updateQueue)&&(Wo(t,h,l,r,n),d=t.memoizedState),i!==l||c!==d||so.current||Ao?("function"==typeof s&&(ai(t,s,l),d=t.memoizedState),(s=Ao||li(t,i,l,c,d,a))?(u||"function"!=typeof r.UNSAFE_componentWillUpdate&&"function"!=typeof r.componentWillUpdate||("function"==typeof r.componentWillUpdate&&r.componentWillUpdate(l,d,a),"function"==typeof r.UNSAFE_componentWillUpdate&&r.UNSAFE_componentWillUpdate(l,d,a)),"function"==typeof r.componentDidUpdate&&(t.effectTag|=4),"function"==typeof r.getSnapshotBeforeUpdate&&(t.effectTag|=256)):("function"!=typeof r.componentDidUpdate||i===e.memoizedProps&&c===e.memoizedState||(t.effectTag|=4),"function"!=typeof r.getSnapshotBeforeUpdate||i===e.memoizedProps&&c===e.memoizedState||(t.effectTag|=256),t.memoizedProps=l,t.memoizedState=d),r.props=l,r.state=d,r.context=a,r=s):("function"!=typeof r.componentDidUpdate||i===e.memoizedProps&&c===e.memoizedState||(t.effectTag|=4),"function"!=typeof r.getSnapshotBeforeUpdate||i===e.memoizedProps&&c===e.memoizedState||(t.effectTag|=256),r=!1);return ji(e,t,r,o,n);case 3:return Ti(t),null!==(o=t.updateQueue)?(r=null!==(r=t.memoizedState)?r.element:null,Wo(t,o,t.pendingProps,null,n),(o=t.memoizedState.element)===r?(ki(),e=Ri(e,t)):(r=t.stateNode,(r=(null===e||null===e.child)&&r.hydrate)&&(gi=ro(t.stateNode.containerInfo),yi=t,r=bi=!0),r?(t.effectTag|=2,t.child=mi(t,null,o,n)):(ki(),Ci(e,t,o)),e=t.child)):(ki(),e=Ri(e,t)),e;case 5:return ni(ti.current),(o=ni(Jo.current))!==(r=jr(o,t.type))&&(lo(ei,t),lo(Jo,r)),null===e&&Ei(t),o=t.type,l=t.memoizedProps,r=t.pendingProps,i=null!==e?e.memoizedProps:null,so.current||l!==r||((l=1&t.mode&&!!r.hidden)&&(t.expirationTime=1073741823),l&&1073741823===n)?(l=r.children,Xr(o,r)?l=null:i&&Xr(o,i)&&(t.effectTag|=16),Pi(e,t),1073741823!==n&&1&t.mode&&r.hidden?(t.expirationTime=1073741823,t.memoizedProps=r,e=null):(Ci(e,t,l),t.memoizedProps=r,e=t.child)):e=Ri(e,t),e;case 6:return null===e&&Ei(t),t.memoizedProps=t.pendingProps,null;case 16:return null;case 4:return ri(t,t.stateNode.containerInfo),o=t.pendingProps,so.current||t.memoizedProps!==o?(null===e?t.child=vi(t,null,o,n):Ci(e,t,o),t.memoizedProps=o,e=t.child):e=Ri(e,t),e;case 14:return o=t.type.render,n=t.pendingProps,r=t.ref,so.current||t.memoizedProps!==n||r!==(null!==e?e.ref:null)?(Ci(e,t,o=o(n,r)),t.memoizedProps=n,e=t.child):e=Ri(e,t),e;case 10:return n=t.pendingProps,so.current||t.memoizedProps!==n?(Ci(e,t,n),t.memoizedProps=n,e=t.child):e=Ri(e,t),e;case 11:return n=t.pendingProps.children,so.current||null!==n&&t.memoizedProps!==n?(Ci(e,t,n),t.memoizedProps=n,e=t.child):e=Ri(e,t),e;case 15:return n=t.pendingProps,t.memoizedProps===n?e=Ri(e,t):(Ci(e,t,n.children),t.memoizedProps=n,e=t.child),e;case 13:return function(e,t,n){var r=t.type._context,o=t.pendingProps,i=t.memoizedProps,a=!0;if(so.current)a=!1;else if(i===o)return t.stateNode=0,Qo(t),Ri(e,t);var u=o.value;if(t.memoizedProps=o,null===i)u=1073741823;else if(i.value===o.value){if(i.children===o.children&&a)return t.stateNode=0,Qo(t),Ri(e,t);u=0}else{var l=i.value;if(l===u&&(0!==l||1/l==1/u)||l!=l&&u!=u){if(i.children===o.children&&a)return t.stateNode=0,Qo(t),Ri(e,t);u=0}else if(u="function"==typeof r._calculateChangedBits?r._calculateChangedBits(l,u):1073741823,0==(u|=0)){if(i.children===o.children&&a)return t.stateNode=0,Qo(t),Ri(e,t)}else Ni(t,r,u,n)}return t.stateNode=u,Qo(t),Ci(e,t,o.children),t.child}(e,t,n);case 12:e:if(r=t.type,i=t.pendingProps,l=t.memoizedProps,o=r._currentValue,a=r._changedBits,so.current||0!==a||l!==i){if(t.memoizedProps=i,void 0!==(u=i.unstable_observedBits)&&null!==u||(u=1073741823),t.stateNode=u,0!=(a&u))Ni(t,r,a,n);else if(l===i){e=Ri(e,t);break e}n=(n=i.children)(o),t.effectTag|=1,Ci(e,t,n),e=t.child}else e=Ri(e,t);return e;default:p("156")}}function Ai(e){e.effectTag|=4}var Ii=void 0,Ui=void 0,Di=void 0;function zi(e,t){var n=t.pendingProps;switch(t.tag){case 1:return null;case 2:return mo(t),null;case 3:oi(),yo();var r=t.stateNode;return r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),null!==e&&null!==e.child||(Oi(t),t.effectTag&=-3),Ii(t),null;case 5:ii(t),r=ni(ti.current);var o=t.type;if(null!==e&&null!=t.stateNode){var i=e.memoizedProps,a=t.stateNode,u=ni(Jo.current);a=qr(a,o,i,n,r),Ui(e,t,a,o,i,n,r,u),e.ref!==t.ref&&(t.effectTag|=128)}else{if(!n)return null===t.stateNode&&p("166"),null;if(e=ni(Jo.current),Oi(t))n=t.stateNode,o=t.type,i=t.memoizedProps,n[B]=t,n[H]=i,r=Vr(n,o,i,e,r),t.updateQueue=r,null!==r&&Ai(t);else{(e=Br(o,n,r,e))[B]=t,e[H]=n;e:for(i=t.child;null!==i;){if(5===i.tag||6===i.tag)e.appendChild(i.stateNode);else if(4!==i.tag&&null!==i.child){i.child.return=i,i=i.child;continue}if(i===t)break;for(;null===i.sibling;){if(null===i.return||i.return===t)break e;i=i.return}i.sibling.return=i.return,i=i.sibling}Wr(e,o,n,r),Zr(o,n)&&Ai(t),t.stateNode=e}null!==t.ref&&(t.effectTag|=128)}return null;case 6:if(e&&null!=t.stateNode)Di(e,t,e.memoizedProps,n);else{if("string"!=typeof n)return null===t.stateNode&&p("166"),null;r=ni(ti.current),ni(Jo.current),Oi(t)?(r=t.stateNode,n=t.memoizedProps,r[B]=t,Yr(r,n)&&Ai(t)):((r=Hr(n,r))[B]=t,t.stateNode=r)}return null;case 14:case 16:case 10:case 11:case 15:return null;case 4:return oi(),Ii(t),null;case 13:return Zo(t),null;case 12:return null;case 0:p("167");default:p("156")}}function Li(e,t){var n=t.source;null===t.stack&&null!==n&&_t(n),null!==n&&bt(n),t=t.value,null!==e&&2===e.tag&&bt(e);try{t&&t.suppressReactErrorLogging||console.error(t)}catch(e){e&&e.suppressReactErrorLogging||console.error(e)}}function Fi(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){va(e,t)}else t.current=null}function Bi(e){switch(Mo(e),e.tag){case 2:Fi(e);var t=e.stateNode;if("function"==typeof t.componentWillUnmount)try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(t){va(e,t)}break;case 5:Fi(e);break;case 4:qi(e)}}function Hi(e){return 5===e.tag||3===e.tag||4===e.tag}function Wi(e){e:{for(var t=e.return;null!==t;){if(Hi(t)){var n=t;break e}t=t.return}p("160"),n=void 0}var r=t=void 0;switch(n.tag){case 5:t=n.stateNode,r=!1;break;case 3:case 4:t=n.stateNode.containerInfo,r=!0;break;default:p("161")}16&n.effectTag&&(Rr(t,""),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||Hi(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}for(var o=e;;){if(5===o.tag||6===o.tag)if(n)if(r){var i=t,a=o.stateNode,u=n;8===i.nodeType?i.parentNode.insertBefore(a,u):i.insertBefore(a,u)}else t.insertBefore(o.stateNode,n);else r?(i=t,a=o.stateNode,8===i.nodeType?i.parentNode.insertBefore(a,i):i.appendChild(a)):t.appendChild(o.stateNode);else if(4!==o.tag&&null!==o.child){o.child.return=o,o=o.child;continue}if(o===e)break;for(;null===o.sibling;){if(null===o.return||o.return===e)return;o=o.return}o.sibling.return=o.return,o=o.sibling}}function qi(e){for(var t=e,n=!1,r=void 0,o=void 0;;){if(!n){n=t.return;e:for(;;){switch(null===n&&p("160"),n.tag){case 5:r=n.stateNode,o=!1;break e;case 3:case 4:r=n.stateNode.containerInfo,o=!0;break e}n=n.return}n=!0}if(5===t.tag||6===t.tag){e:for(var i=t,a=i;;)if(Bi(a),null!==a.child&&4!==a.tag)a.child.return=a,a=a.child;else{if(a===i)break;for(;null===a.sibling;){if(null===a.return||a.return===i)break e;a=a.return}a.sibling.return=a.return,a=a.sibling}o?(i=r,a=t.stateNode,8===i.nodeType?i.parentNode.removeChild(a):i.removeChild(a)):r.removeChild(t.stateNode)}else if(4===t.tag?r=t.stateNode.containerInfo:Bi(t),null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;4===(t=t.return).tag&&(n=!1)}t.sibling.return=t.return,t=t.sibling}}function $i(e,t){switch(t.tag){case 2:break;case 5:var n=t.stateNode;if(null!=n){var r=t.memoizedProps;e=null!==e?e.memoizedProps:r;var o=t.type,i=t.updateQueue;t.updateQueue=null,null!==i&&(n[H]=r,$r(n,i,o,e,r))}break;case 6:null===t.stateNode&&p("162"),t.stateNode.nodeValue=t.memoizedProps;break;case 3:case 15:case 16:break;default:p("163")}}function Vi(e,t,n){(n=Do(n)).tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Xa(r),Li(e,t)},n}function Yi(e,t,n){(n=Do(n)).tag=3;var r=e.stateNode;return null!==r&&"function"==typeof r.componentDidCatch&&(n.callback=function(){null===sa?sa=new Set([this]):sa.add(this);var n=t.value,r=t.stack;Li(e,t),this.componentDidCatch(n,{componentStack:null!==r?r:""})}),n}function Ki(e,t,n,r,o,i){n.effectTag|=512,n.firstEffect=n.lastEffect=null,r=Vo(r,n),e=t;do{switch(e.tag){case 3:return e.effectTag|=1024,void Fo(e,r=Vi(e,r,i),i);case 2:if(t=r,n=e.stateNode,0==(64&e.effectTag)&&null!==n&&"function"==typeof n.componentDidCatch&&(null===sa||!sa.has(n)))return e.effectTag|=1024,void Fo(e,r=Yi(e,t,i),i)}e=e.return}while(null!==e)}function Gi(e){switch(e.tag){case 2:mo(e);var t=e.effectTag;return 1024&t?(e.effectTag=-1025&t|64,e):null;case 3:return oi(),yo(),1024&(t=e.effectTag)?(e.effectTag=-1025&t|64,e):null;case 5:return ii(e),null;case 16:return 1024&(t=e.effectTag)?(e.effectTag=-1025&t|64,e):null;case 4:return oi(),null;case 13:return Zo(e),null;default:return null}}Ii=function(){},Ui=function(e,t,n){(t.updateQueue=n)&&Ai(t)},Di=function(e,t,n,r){n!==r&&Ai(t)};var Qi=Jr(),Zi=2,Xi=Qi,Ji=0,ea=0,ta=!1,na=null,ra=null,oa=0,ia=-1,aa=!1,ua=null,la=!1,ca=!1,sa=null;function fa(){if(null!==na)for(var e=na.return;null!==e;){var t=e;switch(t.tag){case 2:mo(t);break;case 3:oi(),yo();break;case 5:ii(t);break;case 4:oi();break;case 13:Zo(t)}e=e.return}ra=null,oa=0,ia=-1,aa=!1,na=null,ca=!1}function pa(e){for(;;){var t=e.alternate,n=e.return,r=e.sibling;if(0==(512&e.effectTag)){t=zi(t,e);var o=e;if(1073741823===oa||1073741823!==o.expirationTime){var i=0;switch(o.tag){case 3:case 2:var a=o.updateQueue;null!==a&&(i=a.expirationTime)}for(a=o.child;null!==a;)0!==a.expirationTime&&(0===i||i>a.expirationTime)&&(i=a.expirationTime),a=a.sibling;o.expirationTime=i}if(null!==t)return t;if(null!==n&&0==(512&n.effectTag)&&(null===n.firstEffect&&(n.firstEffect=e.firstEffect),null!==e.lastEffect&&(null!==n.lastEffect&&(n.lastEffect.nextEffect=e.firstEffect),n.lastEffect=e.lastEffect),1<e.effectTag&&(null!==n.lastEffect?n.lastEffect.nextEffect=e:n.firstEffect=e,n.lastEffect=e)),null!==r)return r;if(null===n){ca=!0;break}e=n}else{if(null!==(e=Gi(e)))return e.effectTag&=511,e;if(null!==n&&(n.firstEffect=n.lastEffect=null,n.effectTag|=512),null!==r)return r;if(null===n)break;e=n}}return null}function da(e){var t=Mi(e.alternate,e,oa);return null===t&&(t=pa(e)),it.current=null,t}function ha(e,t,n){ta&&p("243"),ta=!0,t===oa&&e===ra&&null!==na||(fa(),oa=t,ia=-1,na=xo((ra=e).current,null,oa),e.pendingCommitExpirationTime=0);var r=!1;for(aa=!n||oa<=Zi;;){try{if(n)for(;null!==na&&!Za();)na=da(na);else for(;null!==na;)na=da(na)}catch(t){if(null===na)r=!0,Xa(t);else{null===na&&p("271");var o=(n=na).return;if(null===o){r=!0,Xa(t);break}Ki(e,o,n,t,0,oa),na=pa(n)}}break}if(ta=!1,r)return null;if(null===na){if(ca)return e.pendingCommitExpirationTime=t,e.current.alternate;aa&&p("262"),0<=ia&&setTimeout(function(){var t=e.current.expirationTime;0!==t&&(0===e.remainingExpirationTime||e.remainingExpirationTime<t)&&Ha(e,t)},ia),function(e){null===Sa&&p("246"),Sa.remainingExpirationTime=e}(e.current.expirationTime)}return null}function va(e,t){var n;e:{for(ta&&!la&&p("263"),n=e.return;null!==n;){switch(n.tag){case 2:var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromCatch||"function"==typeof r.componentDidCatch&&(null===sa||!sa.has(r))){Lo(n,e=Yi(n,e=Vo(t,e),1),1),ga(n,1),n=void 0;break e}break;case 3:Lo(n,e=Vi(n,e=Vo(t,e),1),1),ga(n,1),n=void 0;break e}n=n.return}3===e.tag&&(Lo(e,n=Vi(e,n=Vo(t,e),1),1),ga(e,1)),n=void 0}return n}function ma(){var e=2+25*(1+((ba()-2+500)/25|0));return e<=Ji&&(e=Ji+1),Ji=e}function ya(e,t){return e=0!==ea?ea:ta?la?1:oa:1&t.mode?Ua?2+10*(1+((e-2+15)/10|0)):2+25*(1+((e-2+500)/25|0)):1,Ua&&(0===ja||e>ja)&&(ja=e),e}function ga(e,t){for(;null!==e;){if((0===e.expirationTime||e.expirationTime>t)&&(e.expirationTime=t),null!==e.alternate&&(0===e.alternate.expirationTime||e.alternate.expirationTime>t)&&(e.alternate.expirationTime=t),null===e.return){if(3!==e.tag)break;var n=e.stateNode;!ta&&0!==oa&&t<oa&&fa();var r=n.current.expirationTime;ta&&!la&&ra===n||Ha(n,r),La>za&&p("185")}e=e.return}}function ba(){return Xi=Jr()-Qi,Zi=2+(Xi/10|0)}function _a(e){var t=ea;ea=2+25*(1+((ba()-2+500)/25|0));try{return e()}finally{ea=t}}function wa(e,t,n,r,o){var i=ea;ea=1;try{return e(t,n,r,o)}finally{ea=i}}var Ea=null,xa=null,Oa=0,ka=void 0,Ca=!1,Sa=null,Pa=0,ja=0,Ta=!1,Na=!1,Ra=null,Ma=null,Aa=!1,Ia=!1,Ua=!1,Da=null,za=1e3,La=0,Fa=1;function Ba(e){if(0!==Oa){if(e>Oa)return;null!==ka&&to(ka)}var t=Jr()-Qi;Oa=e,ka=eo(qa,{timeout:10*(e-2)-t})}function Ha(e,t){if(null===e.nextScheduledRoot)e.remainingExpirationTime=t,null===xa?(Ea=xa=e,e.nextScheduledRoot=e):(xa=xa.nextScheduledRoot=e).nextScheduledRoot=Ea;else{var n=e.remainingExpirationTime;(0===n||t<n)&&(e.remainingExpirationTime=t)}Ca||(Aa?Ia&&(Sa=e,Pa=1,Ga(e,1,!1)):1===t?$a():Ba(t))}function Wa(){var e=0,t=null;if(null!==xa)for(var n=xa,r=Ea;null!==r;){var o=r.remainingExpirationTime;if(0===o){if((null===n||null===xa)&&p("244"),r===r.nextScheduledRoot){Ea=xa=r.nextScheduledRoot=null;break}if(r===Ea)Ea=o=r.nextScheduledRoot,xa.nextScheduledRoot=o,r.nextScheduledRoot=null;else{if(r===xa){(xa=n).nextScheduledRoot=Ea,r.nextScheduledRoot=null;break}n.nextScheduledRoot=r.nextScheduledRoot,r.nextScheduledRoot=null}r=n.nextScheduledRoot}else{if((0===e||o<e)&&(e=o,t=r),r===xa)break;n=r,r=r.nextScheduledRoot}}null!==(n=Sa)&&n===t&&1===e?La++:La=0,Sa=t,Pa=e}function qa(e){Va(0,!0,e)}function $a(){Va(1,!1,null)}function Va(e,t,n){if(Ma=n,Wa(),t)for(;null!==Sa&&0!==Pa&&(0===e||e>=Pa)&&(!Ta||ba()>=Pa);)ba(),Ga(Sa,Pa,!Ta),Wa();else for(;null!==Sa&&0!==Pa&&(0===e||e>=Pa);)Ga(Sa,Pa,!1),Wa();null!==Ma&&(Oa=0,ka=null),0!==Pa&&Ba(Pa),Ma=null,Ta=!1,Ka()}function Ya(e,t){Ca&&p("253"),Sa=e,Pa=t,Ga(e,t,!1),$a(),Ka()}function Ka(){if(La=0,null!==Da){var e=Da;Da=null;for(var t=0;t<e.length;t++){var n=e[t];try{n._onComplete()}catch(e){Na||(Na=!0,Ra=e)}}}if(Na)throw e=Ra,Ra=null,Na=!1,e}function Ga(e,t,n){Ca&&p("245"),Ca=!0,n?null!==(n=e.finishedWork)?Qa(e,n,t):null!==(n=ha(e,t,!0))&&(Za()?e.finishedWork=n:Qa(e,n,t)):null!==(n=e.finishedWork)?Qa(e,n,t):null!==(n=ha(e,t,!1))&&Qa(e,n,t),Ca=!1}function Qa(e,t,n){var r=e.firstBatch;if(null!==r&&r._expirationTime<=n&&(null===Da?Da=[r]:Da.push(r),r._defer))return e.finishedWork=t,void(e.remainingExpirationTime=0);if(e.finishedWork=null,la=ta=!0,(n=t.stateNode).current===t&&p("177"),0===(r=n.pendingCommitExpirationTime)&&p("261"),n.pendingCommitExpirationTime=0,ba(),it.current=null,1<t.effectTag)if(null!==t.lastEffect){t.lastEffect.nextEffect=t;var o=t.firstEffect}else o=t;else o=t.firstEffect;Gr=Tn;var i=l();if(Wn(i)){if("selectionStart"in i)var a={start:i.selectionStart,end:i.selectionEnd};else e:{var u=window.getSelection&&window.getSelection();if(u&&0!==u.rangeCount){a=u.anchorNode;var c=u.anchorOffset,f=u.focusNode;u=u.focusOffset;try{a.nodeType,f.nodeType}catch(e){a=null;break e}var d=0,h=-1,v=-1,m=0,y=0,g=i,b=null;t:for(;;){for(var _;g!==a||0!==c&&3!==g.nodeType||(h=d+c),g!==f||0!==u&&3!==g.nodeType||(v=d+u),3===g.nodeType&&(d+=g.nodeValue.length),null!==(_=g.firstChild);)b=g,g=_;for(;;){if(g===i)break t;if(b===a&&++m===c&&(h=d),b===f&&++y===u&&(v=d),null!==(_=g.nextSibling))break;b=(g=b).parentNode}g=_}a=-1===h||-1===v?null:{start:h,end:v}}else a=null}a=a||{start:0,end:0}}else a=null;for(Qr={focusedElem:i,selectionRange:a},Nn(!1),ua=o;null!==ua;){i=!1,a=void 0;try{for(;null!==ua;){if(256&ua.effectTag){var w=ua.alternate;switch((c=ua).tag){case 2:if(256&c.effectTag&&null!==w){var E=w.memoizedProps,x=w.memoizedState,O=c.stateNode;O.props=c.memoizedProps,O.state=c.memoizedState;var k=O.getSnapshotBeforeUpdate(E,x);O.__reactInternalSnapshotBeforeUpdate=k}break;case 3:case 5:case 6:case 4:break;default:p("163")}}ua=ua.nextEffect}}catch(e){i=!0,a=e}i&&(null===ua&&p("178"),va(ua,a),null!==ua&&(ua=ua.nextEffect))}for(ua=o;null!==ua;){w=!1,E=void 0;try{for(;null!==ua;){var C=ua.effectTag;if(16&C&&Rr(ua.stateNode,""),128&C){var S=ua.alternate;if(null!==S){var P=S.ref;null!==P&&("function"==typeof P?P(null):P.current=null)}}switch(14&C){case 2:Wi(ua),ua.effectTag&=-3;break;case 6:Wi(ua),ua.effectTag&=-3,$i(ua.alternate,ua);break;case 4:$i(ua.alternate,ua);break;case 8:qi(x=ua),x.return=null,x.child=null,x.alternate&&(x.alternate.child=null,x.alternate.return=null)}ua=ua.nextEffect}}catch(e){w=!0,E=e}w&&(null===ua&&p("178"),va(ua,E),null!==ua&&(ua=ua.nextEffect))}if(P=Qr,S=l(),C=P.focusedElem,w=P.selectionRange,S!==C&&s(document.documentElement,C)){null!==w&&Wn(C)&&(S=w.start,void 0===(P=w.end)&&(P=S),"selectionStart"in C?(C.selectionStart=S,C.selectionEnd=Math.min(P,C.value.length)):window.getSelection&&(S=window.getSelection(),E=C[he()].length,P=Math.min(w.start,E),w=void 0===w.end?P:Math.min(w.end,E),!S.extend&&P>w&&(E=w,w=P,P=E),E=Hn(C,P),x=Hn(C,w),E&&x&&(1!==S.rangeCount||S.anchorNode!==E.node||S.anchorOffset!==E.offset||S.focusNode!==x.node||S.focusOffset!==x.offset)&&((O=document.createRange()).setStart(E.node,E.offset),S.removeAllRanges(),P>w?(S.addRange(O),S.extend(x.node,x.offset)):(O.setEnd(x.node,x.offset),S.addRange(O))))),S=[];for(P=C;P=P.parentNode;)1===P.nodeType&&S.push({element:P,left:P.scrollLeft,top:P.scrollTop});for("function"==typeof C.focus&&C.focus(),C=0;C<S.length;C++)(P=S[C]).element.scrollLeft=P.left,P.element.scrollTop=P.top}for(Qr=null,Nn(Gr),Gr=null,n.current=t,ua=o;null!==ua;){o=!1,C=void 0;try{for(S=r;null!==ua;){var j=ua.effectTag;if(36&j){var T=ua.alternate;switch(w=S,(P=ua).tag){case 2:var N=P.stateNode;if(4&P.effectTag)if(null===T)N.props=P.memoizedProps,N.state=P.memoizedState,N.componentDidMount();else{var R=T.memoizedProps,M=T.memoizedState;N.props=P.memoizedProps,N.state=P.memoizedState,N.componentDidUpdate(R,M,N.__reactInternalSnapshotBeforeUpdate)}var A=P.updateQueue;null!==A&&(N.props=P.memoizedProps,N.state=P.memoizedState,$o(P,A,N));break;case 3:var I=P.updateQueue;if(null!==I){if(E=null,null!==P.child)switch(P.child.tag){case 5:E=P.child.stateNode;break;case 2:E=P.child.stateNode}$o(P,I,E)}break;case 5:var U=P.stateNode;null===T&&4&P.effectTag&&Zr(P.type,P.memoizedProps)&&U.focus();break;case 6:case 4:case 15:case 16:break;default:p("163")}}if(128&j){P=void 0;var D=ua.ref;if(null!==D){var z=ua.stateNode;switch(ua.tag){case 5:P=z;break;default:P=z}"function"==typeof D?D(P):D.current=P}}var L=ua.nextEffect;ua.nextEffect=null,ua=L}}catch(e){o=!0,C=e}o&&(null===ua&&p("178"),va(ua,C),null!==ua&&(ua=ua.nextEffect))}ta=la=!1,Ro(t.stateNode),0===(t=n.current.expirationTime)&&(sa=null),e.remainingExpirationTime=t}function Za(){return!(null===Ma||Ma.timeRemaining()>Fa)&&(Ta=!0)}function Xa(e){null===Sa&&p("246"),Sa.remainingExpirationTime=0,Na||(Na=!0,Ra=e)}function Ja(e,t){var n=Aa;Aa=!0;try{return e(t)}finally{(Aa=n)||Ca||$a()}}function eu(e,t){if(Aa&&!Ia){Ia=!0;try{return e(t)}finally{Ia=!1}}return e(t)}function tu(e,t){Ca&&p("187");var n=Aa;Aa=!0;try{return wa(e,t)}finally{Aa=n,$a()}}function nu(e,t,n){if(Ua)return e(t,n);Aa||Ca||0===ja||(Va(ja,!1,null),ja=0);var r=Ua,o=Aa;Aa=Ua=!0;try{return e(t,n)}finally{Ua=r,(Aa=o)||Ca||$a()}}function ru(e){var t=Aa;Aa=!0;try{wa(e)}finally{(Aa=t)||Ca||Va(1,!1,null)}}function ou(e,t,n,r,o){var i=t.current;if(n){var a;n=n._reactInternalFiber;e:{for(2===un(n)&&2===n.tag||p("170"),a=n;3!==a.tag;){if(vo(a)){a=a.stateNode.__reactInternalMemoizedMergedChildContext;break e}(a=a.return)||p("171")}a=a.stateNode.context}n=vo(n)?bo(n,a):a}else n=f;return null===t.context?t.context=n:t.pendingContext=n,t=o,(o=Do(r)).payload={element:e},null!==(t=void 0===t?null:t)&&(o.callback=t),Lo(i,o,r),ga(i,r),r}function iu(e){var t=e._reactInternalFiber;return void 0===t&&("function"==typeof e.render?p("188"):p("268",Object.keys(e))),null===(e=sn(t))?null:e.stateNode}function au(e,t,n,r){var o=t.current;return ou(e,t,n,o=ya(ba(),o),r)}function uu(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:default:return e.child.stateNode}}function lu(e){var t=e.findFiberByHostInstance;return function(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);jo=No(function(e){return t.onCommitFiberRoot(n,e)}),To=No(function(e){return t.onCommitFiberUnmount(n,e)})}catch(e){}return!0}(a({},e,{findHostInstanceByFiber:function(e){return null===(e=sn(e))?null:e.stateNode},findFiberByHostInstance:function(e){return t?t(e):null}}))}var cu=Ja,su=nu,fu=function(){Ca||0===ja||(Va(ja,!1,null),ja=0)};function pu(e){this._expirationTime=ma(),this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function du(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function hu(e,t,n){this._internalRoot=Po(e,t,n)}function vu(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function mu(e,t,n,r,o){vu(n)||p("200");var i=n._reactRootContainer;if(i){if("function"==typeof o){var a=o;o=function(){var e=uu(i._internalRoot);a.call(e)}}null!=e?i.legacy_renderSubtreeIntoContainer(e,t,o):i.render(t,o)}else{if(i=n._reactRootContainer=function(e,t){if(t||(t=!(!(t=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new hu(e,!1,t)}(n,r),"function"==typeof o){var u=o;o=function(){var e=uu(i._internalRoot);u.call(e)}}eu(function(){null!=e?i.legacy_renderSubtreeIntoContainer(e,t,o):i.render(t,o)})}return uu(i._internalRoot)}function yu(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return vu(t)||p("200"),function(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:lt,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}(e,t,null,n)}Le.injectFiberControlledHostComponent(Kr),pu.prototype.render=function(e){this._defer||p("250"),this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,r=new du;return ou(e,t,null,n,r._onCommit),r},pu.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},pu.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(this._defer&&null!==t||p("251"),this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var r=null,o=t;o!==this;)r=o,o=o._next;null===r&&p("251"),r._next=o._next,this._next=t,e.firstBatch=this}this._defer=!1,Ya(e,n),t=this._next,this._next=null,null!==(t=e.firstBatch=t)&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},pu.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},du.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},du.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];"function"!=typeof n&&p("191",n),n()}}},hu.prototype.render=function(e,t){var n=this._internalRoot,r=new du;return null!==(t=void 0===t?null:t)&&r.then(t),au(e,n,null,r._onCommit),r},hu.prototype.unmount=function(e){var t=this._internalRoot,n=new du;return null!==(e=void 0===e?null:e)&&n.then(e),au(null,t,null,n._onCommit),n},hu.prototype.legacy_renderSubtreeIntoContainer=function(e,t,n){var r=this._internalRoot,o=new du;return null!==(n=void 0===n?null:n)&&o.then(n),au(t,r,e,o._onCommit),o},hu.prototype.createBatch=function(){var e=new pu(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime<=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e},Ye=cu,Ke=su,Ge=fu;var gu={createPortal:yu,findDOMNode:function(e){return null==e?null:1===e.nodeType?e:iu(e)},hydrate:function(e,t,n){return mu(null,e,t,!0,n)},render:function(e,t,n){return mu(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,r){return(null==e||void 0===e._reactInternalFiber)&&p("38"),mu(e,t,n,!1,r)},unmountComponentAtNode:function(e){return vu(e)||p("40"),!!e._reactRootContainer&&(eu(function(){mu(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:function(){return yu.apply(void 0,arguments)},unstable_batchedUpdates:Ja,unstable_deferredUpdates:_a,unstable_interactiveUpdates:nu,flushSync:tu,unstable_flushControlled:ru,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{EventPluginHub:L,EventPluginRegistry:O,EventPropagators:ne,ReactControlledComponent:Ve,ReactDOMComponentTree:V,ReactDOMEventListener:Un},unstable_createRoot:function(e,t){return new hu(e,!0,null!=t&&!0===t.hydrate)}};lu({findFiberByHostInstance:W,bundleType:0,version:"16.4.2",rendererPackageName:"react-dom"});var bu={default:gu},_u=bu&&gu||bu;e.exports=_u.default?_u.default:_u},function(e,t,n){"use strict";var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o={canUseDOM:r,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:r&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:r&&!!window.screen,isInWorker:!r};e.exports=o},function(e,t,n){"use strict";e.exports=function(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}},function(e,t,n){"use strict";var r=Object.prototype.hasOwnProperty;function o(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}e.exports=function(e,t){if(o(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(var a=0;a<n.length;a++)if(!r.call(t,n[a])||!o(e[n[a]],t[n[a]]))return!1;return!0}},function(e,t,n){"use strict";var r=n(77);e.exports=function e(t,n){return!(!t||!n)&&(t===n||!r(t)&&(r(n)?e(t,n.parentNode):"contains"in t?t.contains(n):!!t.compareDocumentPosition&&!!(16&t.compareDocumentPosition(n))))}},function(e,t,n){"use strict";var r=n(78);e.exports=function(e){return r(e)&&3==e.nodeType}},function(e,t,n){"use strict";e.exports=function(e){var t=(e?e.ownerDocument||e:document).defaultView||window;return!(!e||!("function"==typeof t.Node?e instanceof t.Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=u(n(1)),o=u(n(80)),i=n(7),a=n(15);function u(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t=e.store;return r.default.createElement(i.Provider,{store:t},r.default.createElement(a.HashRouter,null,r.default.createElement(o.default,null)))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=d(n(1)),o=d(n(81)),i=n(15),a=d(n(88)),u=d(n(47)),l=d(n(48)),c=d(n(92)),s=d(n(98)),f=d(n(100)),p=n(101);d(n(51));function d(e){return e&&e.__esModule?e:{default:e}}var h=function(e){e.children;return r.default.createElement("div",{className:"home"},r.default.createElement(o.default,null),r.default.createElement(a.default,null))},v=function(e){e.children;return r.default.createElement("div",{className:"search"},r.default.createElement(o.default,null),r.default.createElement(c.default,null))},m=function(e){return r.default.createElement("div",{className:"show"},r.default.createElement(o.default,null),r.default.createElement(s.default,{ownProps:e}))};t.default=function(e){e.children;return r.default.createElement("div",{className:"home-page"},r.default.createElement(f.default,null),r.default.createElement("div",null,r.default.createElement(i.Switch,null,r.default.createElement(p.AuthRoute,{exact:!0,path:"/login",component:u.default}),r.default.createElement(p.AuthRoute,{exact:!0,path:"/signup",component:l.default}),r.default.createElement(i.Route,{exact:!0,path:"/search",component:v}),r.default.createElement(i.Route,{exact:!0,path:"/homes/:homeId",component:m}),r.default.createElement(i.Route,{path:"/",component:h}))))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=n(13),i=n(18),a=function(e){return e&&e.__esModule?e:{default:e}}(n(86));t.default=(0,r.connect)(function(e){return{currentUser:e.session.id}},function(e){return{login:function(t){return e((0,o.login)(t))},logout:function(){return e((0,o.logout)())},openModal:function(t){return e((0,i.openModal)(t))}}})(a.default)},function(e,t,n){"use strict";var r=n(83);function o(){}e.exports=function(){function e(e,t,n,o,i,a){if(a!==r){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=o,n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.login=function(e){return $.ajax({method:"POST",url:"/api/session",data:{user:e}})},t.signup=function(e){return $.ajax({method:"POST",url:"/api/user",data:{user:e}})},t.logout=function(){return $.ajax({method:"delete",url:"/api/session"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),i=n(6);var a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={search_content:""},n.handleSubmit=n.handleSubmit.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){var e=this,t=document.getElementById("autocomplete");new google.maps.places.SearchBox(t).addListener("places_changed",function(){return e.handleSubmit()})}},{key:"handleSubmit",value:function(e){this.props.history.push("/search")}},{key:"update",value:function(e){var t=this;return function(n){t.setState(function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},e,n.target.value))}}},{key:"render",value:function(){var e=this,t=this.props,n=t.openModal,r=t.currentUser,i=t.logout,a=t.login;return r?o.default.createElement("header",null,o.default.createElement("nav",{className:"navbar"},o.default.createElement("div",{className:"left-nav"},o.default.createElement("a",{href:""},o.default.createElement("svg",{viewBox:"0 0 1000 1000",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z"})))),o.default.createElement("div",{className:"nav-search-bar"},o.default.createElement("div",{className:"inner1"},o.default.createElement("div",{className:"inner2"},o.default.createElement("div",{className:"inner3"},o.default.createElement("div",{className:"inner4"},o.default.createElement("form",{className:"nav-form"},o.default.createElement("div",{className:"inner5"},o.default.createElement("div",{className:"inner6"},o.default.createElement("div",{className:"magnify-glass"}),o.default.createElement("div",{className:"input-container"},o.default.createElement("input",{type:"text",placeholder:"Anywhere",onChange:e.update("search_content"),id:"autocomplete"})))))))))),o.default.createElement("div",{className:"right-nav"},o.default.createElement("div",{className:"nav-link-container"},o.default.createElement("ul",null,o.default.createElement("li",null,o.default.createElement("button",null,"Become a host")),o.default.createElement("li",null,o.default.createElement("button",null,"Earn credit")),o.default.createElement("li",null,o.default.createElement("button",null,"Help")),o.default.createElement("li",{onClick:function(){return i()}},o.default.createElement("button",{className:"header-button"},"Log Out"))))))):o.default.createElement("header",{className:"nav-container"},o.default.createElement("nav",{className:"navbar"},o.default.createElement("div",{className:"left-nav"},o.default.createElement("a",{href:""},o.default.createElement("svg",{viewBox:"0 0 1000 1000",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z"})))),o.default.createElement("div",{className:"nav-search-bar"},o.default.createElement("div",{className:"inner1"},o.default.createElement("div",{className:"inner2"},o.default.createElement("div",{className:"inner3"},o.default.createElement("div",{className:"inner4"},o.default.createElement("form",{className:"nav-form"},o.default.createElement("div",{className:"inner5"},o.default.createElement("div",{className:"inner6"},o.default.createElement("div",{className:"inner7"},o.default.createElement("div",{className:"input-container"},o.default.createElement("input",{type:"text",placeholder:"Anywhere",onChange:e.update("search_content"),id:"autocomplete"}))))))))))),o.default.createElement("div",{className:"right-nav"},o.default.createElement("div",{className:"nav-link-container"},o.default.createElement("ul",null,o.default.createElement("li",null,o.default.createElement("button",null,"Become a host")),o.default.createElement("li",null,o.default.createElement("button",null,"Earn credit")),o.default.createElement("li",null,o.default.createElement("button",null,"Help")),o.default.createElement("li",{onClick:function(){return n("signup")}},o.default.createElement("button",null,"Sign up")),o.default.createElement("li",{onClick:function(){return n("login")}},o.default.createElement("button",null,"Log in")),o.default.createElement("li",{onClick:function(){return a({email:"demo@demo.com",password:"123123"})}},o.default.createElement("button",null,"Demo User")))))))}}]),t}();t.default=(0,i.withRouter)(a)},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=function(e){return e&&e.__esModule?e:{default:e}}(n(89));t.default=(0,r.connect)(function(e){return{currentUser:e.session.id}},function(e){return{}})(o.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),i=n(6);var a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={search_content:""},n.handleSubmit=n.handleSubmit.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){var e=this,t=document.getElementById("autocomplete1");new google.maps.places.SearchBox(t).addListener("places_changed",function(){return e.handleSubmit()})}},{key:"handleSubmit",value:function(e){this.props.history.push("/search")}},{key:"update",value:function(e){var t=this;return function(n){t.setState(function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},e,n.target.value))}}},{key:"render",value:function(){return o.default.createElement("div",{className:"-page"},o.default.createElement("div",{className:"home-searchbar"},o.default.createElement("div",{className:"search-slogan"},o.default.createElement("h1",null,"Book unique homes and"),o.default.createElement("h1",null,"experiences all over the world.")),o.default.createElement("div",{className:"search-container"},o.default.createElement("form",{onSubmit:this.handleSubmit},o.default.createElement("input",{type:"text",placeholder:"Try 'Homes in Tokyo'",onChange:this.update("search_content"),id:"autocomplete1"})))))}}]),t}();t.default=(0,i.withRouter)(a)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),i=n(6);n(15);var a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={email:"",password:""},n.handleSubmit=n.handleSubmit.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidUpdate",value:function(){this.redirectIfLoggedIn()}},{key:"redirectIfLoggedIn",value:function(){this.props.loggedIn&&this.props.history.push("/")}},{key:"update",value:function(e){var t=this;return function(n){return t.setState(function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},e,n.currentTarget.value))}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.state;this.props.processForm(t).then(this.props.closeModal)}},{key:"renderErrors",value:function(){return o.default.createElement("ul",null,this.props.errors.map(function(e,t){return o.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=this;return o.default.createElement("section",{className:"login-form-container"},o.default.createElement("div",{className:"login-form-content"},o.default.createElement("div",{className:"close-x"},o.default.createElement("button",{className:"x-button",onClick:this.props.closeModal},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"img","aria-label":"Close",focusable:"false"},o.default.createElement("path",{d:"m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22",fillRule:"evenodd"})))),o.default.createElement("section",null,o.default.createElement("div",null,o.default.createElement("div",null,o.default.createElement("form",{onSubmit:this.handleSubmit,className:"login-form-box"},o.default.createElement("br",null)," ",this.renderErrors(),o.default.createElement("div",{className:"login-form"},o.default.createElement("div",{className:"input-container"},o.default.createElement("div",{className:"input-container-2"},o.default.createElement("div",{className:"input-icon"},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m22.5 4h-21c-.83 0-1.5.67-1.5 1.51v12.99c0 .83.67 1.5 1.5 1.5h20.99a1.5 1.5 0 0 0 1.51-1.51v-12.98c0-.84-.67-1.51-1.5-1.51zm.5 14.2-6.14-7.91 6.14-4.66v12.58zm-.83-13.2-9.69 7.36c-.26.2-.72.2-.98 0l-9.67-7.36h20.35zm-21.17.63 6.14 4.67-6.14 7.88zm.63 13.37 6.3-8.1 2.97 2.26c.62.47 1.57.47 2.19 0l2.97-2.26 6.29 8.1z",fillRule:"evenodd"}))),o.default.createElement("div",{className:"form-input"},o.default.createElement("input",{type:"email",placeholder:"Email address",value:this.state.email,onChange:this.update("email"),className:"login-input"})))),o.default.createElement("div",{className:"input-container"},o.default.createElement("div",{className:"input-container-2"},o.default.createElement("div",{className:"input-icon"},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m19.5 9h-.5v-2a7 7 0 1 0 -14 0v2h-.5c-.78 0-1.5.72-1.5 1.5v12c0 .78.72 1.5 1.5 1.5h15c .78 0 1.5-.72 1.5-1.5v-12c0-.78-.72-1.5-1.5-1.5zm.5 13.5c0 .22-.28.5-.5.5h-15c-.22 0-.5-.28-.5-.5v-12c0-.22.28-.5.5-.5h1a .5.5 0 0 0 .5-.5v-2.5a6 6 0 1 1 12 0v2.5a.5.5 0 0 0 .5.5h1c .22 0 .5.28.5.5zm-8-10.5a3 3 0 0 0 -3 3c0 .83.36 1.59.94 2.15l-.9 2.16a.5.5 0 0 0 .46.69h5a .5.5 0 0 0 .46-.69l-.87-2.19c.56-.55.91-1.31.91-2.13a3 3 0 0 0 -3-3zm1.04 5.19.72 1.81h-3.51l.74-1.79a.5.5 0 0 0 -.17-.6 2 2 0 1 1 3.18-1.61c0 .64-.31 1.24-.8 1.6a.5.5 0 0 0 -.17.59zm-1.04-14.19a4 4 0 0 0 -4 4v2.5a.5.5 0 0 0 .5.5h7a .5.5 0 0 0 .5-.5v-2.5a4 4 0 0 0 -4-4zm3 6h-6v-2a3 3 0 1 1 6 0z",fillRule:"evenodd"}))),o.default.createElement("div",{className:"form-input"},o.default.createElement("input",{type:"password",placeholder:"Create a Password",value:this.state.password,onChange:this.update("password"),className:"login-input"})))),o.default.createElement("br",null),o.default.createElement("button",{type:"submit"},o.default.createElement("span",{className:"button-text"},"Log in"))),o.default.createElement("div",{className:"line-container"},o.default.createElement("div",{className:"line"})),o.default.createElement("div",{className:"redirect"},o.default.createElement("span",null,"Don't have an account? "),o.default.createElement("span",null,o.default.createElement("a",{onClick:function(){return e.props.otherForm()}}," Sign up")))))))))}}]),t}();t.default=(0,i.withRouter)(a)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),i=n(6);n(15);var a=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={email:"",password:"",first_name:"",last_name:""},n.handleSubmit=n.handleSubmit.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidUpdate",value:function(){this.redirectIfLoggedIn()}},{key:"redirectIfLoggedIn",value:function(){this.props.loggedIn&&this.props.history.push("/")}},{key:"update",value:function(e){var t=this;return function(n){return t.setState(function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},e,n.currentTarget.value))}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.state;this.props.processForm(t).then(this.props.closeModal)}},{key:"renderErrors",value:function(){return o.default.createElement("ul",null,this.props.errors.map(function(e,t){return o.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=this;return o.default.createElement("section",{className:"login-form-container"},o.default.createElement("div",{className:"login-form-content"},o.default.createElement("div",{className:"close-x"},o.default.createElement("button",{className:"x-button",onClick:this.props.closeModal},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"img","aria-label":"Close",focusable:"false"},o.default.createElement("path",{d:"m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22",fillRule:"evenodd"})))),o.default.createElement("section",null,o.default.createElement("div",null,o.default.createElement("div",null,o.default.createElement("form",{onSubmit:this.handleSubmit,className:"login-form-box"},o.default.createElement("br",null)," ",this.renderErrors(),o.default.createElement("div",{className:"login-form"},o.default.createElement("div",{className:"input-container"},o.default.createElement("div",{className:"input-container-2"},o.default.createElement("div",{className:"input-icon"},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m22.5 4h-21c-.83 0-1.5.67-1.5 1.51v12.99c0 .83.67 1.5 1.5 1.5h20.99a1.5 1.5 0 0 0 1.51-1.51v-12.98c0-.84-.67-1.51-1.5-1.51zm.5 14.2-6.14-7.91 6.14-4.66v12.58zm-.83-13.2-9.69 7.36c-.26.2-.72.2-.98 0l-9.67-7.36h20.35zm-21.17.63 6.14 4.67-6.14 7.88zm.63 13.37 6.3-8.1 2.97 2.26c.62.47 1.57.47 2.19 0l2.97-2.26 6.29 8.1z",fillRule:"evenodd"}))),o.default.createElement("div",{className:"form-input"},o.default.createElement("input",{type:"email",placeholder:"Email address",value:this.state.email,onChange:this.update("email"),className:"login-input"})))),o.default.createElement("div",{className:"input-container"},o.default.createElement("div",{className:"input-container-2"},o.default.createElement("div",{className:"input-icon"},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m14.76 11.38a6.01 6.01 0 0 0 3.28-5.36 6.02 6.02 0 0 0 -12.04 0 6.01 6.01 0 0 0 3.27 5.35c-4.81 1.22-9.27 5.31-9.27 8.7 0 1.56 6.8 3.93 12 3.93 5.23 0 12-2.34 12-3.93 0-3.39-4.45-7.47-9.24-8.7zm-7.76-5.36a5.02 5.02 0 0 1 10.04 0c0 2.69-2.12 4.87-4.78 5-.09 0-.18-.01-.26-.01s-.16.01-.24.01c-2.65-.14-4.76-2.32-4.76-5zm15.9 14.09a3.8 3.8 0 0 1 -.64.44c-.62.36-1.5.75-2.52 1.1-2.41.83-5.18 1.35-7.74 1.35-2.55 0-5.32-.52-7.74-1.37-1.01-.35-1.9-.74-2.52-1.1-.47-.27-.74-.51-.74-.46 0-3.35 5.55-7.85 10.64-8.05.13.01.25.02.38.02.12 0 .24-.01.36-.02 5.09.22 10.62 4.71 10.62 8.05 0-.07-.02-.04-.1.04z",fillRule:"evenodd"}))),o.default.createElement("div",{className:"form-input"},o.default.createElement("input",{type:"text",placeholder:"First name",value:this.state.first_name,onChange:this.update("first_name"),className:"login-input"})))),o.default.createElement("div",{className:"input-container"},o.default.createElement("div",{className:"input-container-2"},o.default.createElement("div",{className:"input-icon"},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m14.76 11.38a6.01 6.01 0 0 0 3.28-5.36 6.02 6.02 0 0 0 -12.04 0 6.01 6.01 0 0 0 3.27 5.35c-4.81 1.22-9.27 5.31-9.27 8.7 0 1.56 6.8 3.93 12 3.93 5.23 0 12-2.34 12-3.93 0-3.39-4.45-7.47-9.24-8.7zm-7.76-5.36a5.02 5.02 0 0 1 10.04 0c0 2.69-2.12 4.87-4.78 5-.09 0-.18-.01-.26-.01s-.16.01-.24.01c-2.65-.14-4.76-2.32-4.76-5zm15.9 14.09a3.8 3.8 0 0 1 -.64.44c-.62.36-1.5.75-2.52 1.1-2.41.83-5.18 1.35-7.74 1.35-2.55 0-5.32-.52-7.74-1.37-1.01-.35-1.9-.74-2.52-1.1-.47-.27-.74-.51-.74-.46 0-3.35 5.55-7.85 10.64-8.05.13.01.25.02.38.02.12 0 .24-.01.36-.02 5.09.22 10.62 4.71 10.62 8.05 0-.07-.02-.04-.1.04z",fillRule:"evenodd"}))),o.default.createElement("div",{className:"form-input"},o.default.createElement("input",{type:"text",placeholder:"Last name",value:this.state.last_name,onChange:this.update("last_name"),className:"login-input"})))),o.default.createElement("div",{className:"input-container"},o.default.createElement("div",{className:"input-container-2"},o.default.createElement("div",{className:"input-icon"},o.default.createElement("svg",{viewBox:"0 0 24 24",role:"presentation","aria-hidden":"true",focusable:"false"},o.default.createElement("path",{d:"m19.5 9h-.5v-2a7 7 0 1 0 -14 0v2h-.5c-.78 0-1.5.72-1.5 1.5v12c0 .78.72 1.5 1.5 1.5h15c .78 0 1.5-.72 1.5-1.5v-12c0-.78-.72-1.5-1.5-1.5zm.5 13.5c0 .22-.28.5-.5.5h-15c-.22 0-.5-.28-.5-.5v-12c0-.22.28-.5.5-.5h1a .5.5 0 0 0 .5-.5v-2.5a6 6 0 1 1 12 0v2.5a.5.5 0 0 0 .5.5h1c .22 0 .5.28.5.5zm-8-10.5a3 3 0 0 0 -3 3c0 .83.36 1.59.94 2.15l-.9 2.16a.5.5 0 0 0 .46.69h5a .5.5 0 0 0 .46-.69l-.87-2.19c.56-.55.91-1.31.91-2.13a3 3 0 0 0 -3-3zm1.04 5.19.72 1.81h-3.51l.74-1.79a.5.5 0 0 0 -.17-.6 2 2 0 1 1 3.18-1.61c0 .64-.31 1.24-.8 1.6a.5.5 0 0 0 -.17.59zm-1.04-14.19a4 4 0 0 0 -4 4v2.5a.5.5 0 0 0 .5.5h7a .5.5 0 0 0 .5-.5v-2.5a4 4 0 0 0 -4-4zm3 6h-6v-2a3 3 0 1 1 6 0z",fillRule:"evenodd"}))),o.default.createElement("div",{className:"form-input"},o.default.createElement("input",{type:"password",placeholder:"Create a Password",value:this.state.password,onChange:this.update("password"),className:"login-input"})))),o.default.createElement("br",null),o.default.createElement("button",{type:"submit"},o.default.createElement("span",{className:"button-text"},"Sign up"))),o.default.createElement("div",{className:"line-container"},o.default.createElement("div",{className:"line"})),o.default.createElement("div",{className:"redirect"},o.default.createElement("span",null,"Already have an Airbnb account? "),o.default.createElement("span",null,o.default.createElement("a",{onClick:function(){return e.props.otherForm()}}," Log in")))))))))}}]),t}();t.default=(0,i.withRouter)(a)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=n(19),i=n(49),a=function(e){return e&&e.__esModule?e:{default:e}}(n(94));t.default=(0,r.connect)(function(e){return{homes:Object.values(e.entities.homes),center:{lat:37.7758,lng:-122.435}}},function(e){return{fetchHomes:function(){return e((0,o.fetchHomes)())},updateFilter:function(t,n){return e((0,i.updateFilter)(t,n))}}})(a.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchHomes=function(e){return $.ajax({method:"GET",url:"api/homes",data:e})},t.fetchHome=function(e){return $.ajax({method:"GET",url:"api/homes/"+e})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n(1)),i=u(n(95)),a=u(n(50));function u(e){return e&&e.__esModule?e:{default:e}}var l=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){this.props.fetchHomes()}},{key:"render",value:function(){var e=this.props,t=e.homes,n=e.center,r=e.updateFilter,u=e.fetchHomes;return o.default.createElement("div",{className:"user-pane"},o.default.createElement("div",{className:"left-half"},o.default.createElement(i.default,{homes:t})),o.default.createElement("div",{className:"right-half"},o.default.createElement(a.default,{homes:t,center:n,updateFilter:r,fetchHomes:u})))}}]),t}();t.default=l},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n(1)),i=u(n(96)),a=n(6);function u(e){return e&&e.__esModule?e:{default:e}}var l=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"render",value:function(){var e=this.props.homes;return o.default.createElement("div",null,o.default.createElement("h1",{className:"home-number"}," ",e.length," homes "),o.default.createElement("ul",{className:"home-index-container"},e.map(function(e){return o.default.createElement(i.default,{key:e.id,home:e})})))}}]),t}();t.default=(0,a.withRouter)(l)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),i=n(6);var a=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"render",value:function(){var e=this,t=this.props.home;return o.default.createElement("div",{className:"home-index-item",onClick:function(){return e.props.history.push("/homes/"+t.id)}},o.default.createElement("div",{className:"home-index-photo"}),o.default.createElement("div",{className:"home-index-details"},o.default.createElement("div",{className:"home-index-rooms"},t.num_rooms," ROOMS"),o.default.createElement("div",{className:"home-index-name"},o.default.createElement("h1",null,t.name," ")),o.default.createElement("div",{className:"home-index-price"},"$",t.price," per night"),o.default.createElement("div",{className:"stars"},o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}),o.default.createElement("i",{className:"fas fa-star fa-xs"}))))}}]),t}();t.default=(0,i.withRouter)(a)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var o=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.map=t,this.markers={}}return r(e,[{key:"updateMarkers",value:function(e){console.log("time to update")}}]),e}();t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=n(19),i=(n(99),function(e){return e&&e.__esModule?e:{default:e}}(n(51)));t.default=(0,r.connect)(function(e,t){return{homeId:parseInt(t.ownProps.match.params.homeId),home:e.entities.homes[parseInt(t.ownProps.match.params.homeId)]}},function(e){return{fetchHome:function(t){return e((0,o.fetchHome)(t))}}})(i.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.selectHome=function(e,t){return e[t]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=l(n(1)),o=n(18),i=n(7),a=l(n(47)),u=l(n(48));function l(e){return e&&e.__esModule?e:{default:e}}t.default=(0,i.connect)(function(e){return{modal:e.ui.modal}},function(e){return{closeModal:function(){return e((0,o.closeModal)())}}})(function(e){var t=e.modal;if(!t)return null;var n=void 0;switch(t){case"login":n=r.default.createElement(a.default,null);break;case"signup":n=r.default.createElement(u.default,null);break;case"demo":n=r.default.createElement(a.default,{demo:{email:"demo@demo.com",password:"123123"}});break;default:return null}return r.default.createElement("div",{className:"modal-background",onClick:o.closeModal},r.default.createElement("div",{className:"modal-child",onClick:function(e){return e.stopPropagation()}},n))})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ProtectedRoute=t.AuthRoute=void 0;var r=n(7),o=n(6),i=function(e){return e&&e.__esModule?e:{default:e}}(n(1)),a=n(15);var u=function(e){return{loggedIn:Boolean(e.session.id)}};t.AuthRoute=(0,o.withRouter)((0,r.connect)(u)(function(e){var t=e.component,n=e.path,r=e.loggedIn,o=e.exact;return i.default.createElement(a.Route,{path:n,exact:o,render:function(e){return r?i.default.createElement(a.Redirect,{to:"/"}):i.default.createElement(t,e)}})})),t.ProtectedRoute=(0,o.withRouter)((0,r.connect)(u)(function(e){var t=e.component,n=e.path,r=e.loggedIn,o=e.exact;return i.default.createElement(a.Route,{path:n,exact:o,render:function(e){return r?i.default.createElement(t,e):i.default.createElement(a.Redirect,{to:"/login"})}})}))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=u(n(103)),i=u(n(104)),a=u(n(181));function u(e){return e&&e.__esModule?e:{default:e}}t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,r.createStore)(i.default,e,(0,r.applyMiddleware)(o.default,a.default))}},function(e,t,n){"use strict";function r(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}n.r(t);var o=r();o.withExtraArgument=r,t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=l(n(105)),i=l(n(172)),a=l(n(175)),u=l(n(179));function l(e){return e&&e.__esModule?e:{default:e}}var c=(0,r.combineReducers)({entities:a.default,session:o.default,errors:u.default,ui:i.default});t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(13),o=function(e){return e&&e.__esModule?e:{default:e}}(n(36));var i=Object.freeze({id:null,errors:[]});t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i,t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_CURRENT_USER:var n=t.currentUser.id;return(0,o.default)({},{id:n});case r.LOGOUT_CURRENT_USER:return i;case r.RECEIVE_ERRORS:var a=t.errors;return(0,o.default)({},i,{errors:a});default:return e}}},function(e,t,n){var r=n(107),o=n(55),i=n(138),a=n(140),u=n(10),l=n(65),c=n(64);e.exports=function e(t,n,s,f,p){t!==n&&i(n,function(i,l){if(u(i))p||(p=new r),a(t,n,l,s,e,f,p);else{var d=f?f(c(t,l),i,l+"",t,n,p):void 0;void 0===d&&(d=i),o(t,l,d)}},l)}},function(e,t,n){var r=n(21),o=n(113),i=n(114),a=n(115),u=n(116),l=n(117);function c(e){var t=this.__data__=new r(e);this.size=t.size}c.prototype.clear=o,c.prototype.delete=i,c.prototype.get=a,c.prototype.has=u,c.prototype.set=l,e.exports=c},function(e,t){e.exports=function(){this.__data__=[],this.size=0}},function(e,t,n){var r=n(22),o=Array.prototype.splice;e.exports=function(e){var t=this.__data__,n=r(t,e);return!(n<0||(n==t.length-1?t.pop():o.call(t,n,1),--this.size,0))}},function(e,t,n){var r=n(22);e.exports=function(e){var t=this.__data__,n=r(t,e);return n<0?void 0:t[n][1]}},function(e,t,n){var r=n(22);e.exports=function(e){return r(this.__data__,e)>-1}},function(e,t,n){var r=n(22);e.exports=function(e,t){var n=this.__data__,o=r(n,e);return o<0?(++this.size,n.push([e,t])):n[o][1]=t,this}},function(e,t,n){var r=n(21);e.exports=function(){this.__data__=new r,this.size=0}},function(e,t){e.exports=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}},function(e,t){e.exports=function(e){return this.__data__.get(e)}},function(e,t){e.exports=function(e){return this.__data__.has(e)}},function(e,t,n){var r=n(21),o=n(52),i=n(125),a=200;e.exports=function(e,t){var n=this.__data__;if(n instanceof r){var u=n.__data__;if(!o||u.length<a-1)return u.push([e,t]),this.size=++n.size,this;n=this.__data__=new i(u)}return n.set(e,t),this.size=n.size,this}},function(e,t,n){var r=n(38),o=n(121),i=n(10),a=n(123),u=/^\[object .+?Constructor\]$/,l=Function.prototype,c=Object.prototype,s=l.toString,f=c.hasOwnProperty,p=RegExp("^"+s.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=function(e){return!(!i(e)||o(e))&&(r(e)?p:u).test(a(e))}},function(e,t,n){var r=n(53),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,u=r?r.toStringTag:void 0;e.exports=function(e){var t=i.call(e,u),n=e[u];try{e[u]=void 0;var r=!0}catch(e){}var o=a.call(e);return r&&(t?e[u]=n:delete e[u]),o}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t,n){var r=n(122),o=function(){var e=/[^.]+$/.exec(r&&r.keys&&r.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}();e.exports=function(e){return!!o&&o in e}},function(e,t,n){var r=n(14)["__core-js_shared__"];e.exports=r},function(e,t){var n=Function.prototype.toString;e.exports=function(e){if(null!=e){try{return n.call(e)}catch(e){}try{return e+""}catch(e){}}return""}},function(e,t){e.exports=function(e,t){return null==e?void 0:e[t]}},function(e,t,n){var r=n(126),o=n(133),i=n(135),a=n(136),u=n(137);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=i,l.prototype.has=a,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(127),o=n(21),i=n(52);e.exports=function(){this.size=0,this.__data__={hash:new r,map:new(i||o),string:new r}}},function(e,t,n){var r=n(128),o=n(129),i=n(130),a=n(131),u=n(132);function l(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}l.prototype.clear=r,l.prototype.delete=o,l.prototype.get=i,l.prototype.has=a,l.prototype.set=u,e.exports=l},function(e,t,n){var r=n(25);e.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(e,t){e.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}},function(e,t,n){var r=n(25),o="__lodash_hash_undefined__",i=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;if(r){var n=t[e];return n===o?void 0:n}return i.call(t,e)?t[e]:void 0}},function(e,t,n){var r=n(25),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;return r?void 0!==t[e]:o.call(t,e)}},function(e,t,n){var r=n(25),o="__lodash_hash_undefined__";e.exports=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=r&&void 0===t?o:t,this}},function(e,t,n){var r=n(26);e.exports=function(e){var t=r(this,e).delete(e);return this.size-=t?1:0,t}},function(e,t){e.exports=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}},function(e,t,n){var r=n(26);e.exports=function(e){return r(this,e).get(e)}},function(e,t,n){var r=n(26);e.exports=function(e){return r(this,e).has(e)}},function(e,t,n){var r=n(26);e.exports=function(e,t){var n=r(this,e),o=n.size;return n.set(e,t),this.size+=n.size==o?0:1,this}},function(e,t,n){var r=n(139)();e.exports=r},function(e,t){e.exports=function(e){return function(t,n,r){for(var o=-1,i=Object(t),a=r(t),u=a.length;u--;){var l=a[e?u:++o];if(!1===n(i[l],l,i))break}return t}}},function(e,t,n){var r=n(55),o=n(141),i=n(142),a=n(145),u=n(146),l=n(59),c=n(60),s=n(150),f=n(62),p=n(38),d=n(10),h=n(152),v=n(63),m=n(64),y=n(156);e.exports=function(e,t,n,g,b,_,w){var E=m(e,n),x=m(t,n),O=w.get(x);if(O)r(e,n,O);else{var k=_?_(E,x,n+"",e,t,w):void 0,C=void 0===k;if(C){var S=c(x),P=!S&&f(x),j=!S&&!P&&v(x);k=x,S||P||j?c(E)?k=E:s(E)?k=a(E):P?(C=!1,k=o(x,!0)):j?(C=!1,k=i(x,!0)):k=[]:h(x)||l(x)?(k=E,l(E)?k=y(E):(!d(E)||g&&p(E))&&(k=u(x))):C=!1}C&&(w.set(x,k),b(k,x,g,_,w),w.delete(x)),r(e,n,k)}}},function(e,t,n){(function(e){var r=n(14),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o?r.Buffer:void 0,u=a?a.allocUnsafe:void 0;e.exports=function(e,t){if(t)return e.slice();var n=e.length,r=u?u(n):new e.constructor(n);return e.copy(r),r}}).call(this,n(27)(e))},function(e,t,n){var r=n(143);e.exports=function(e,t){var n=t?r(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}},function(e,t,n){var r=n(144);e.exports=function(e){var t=new e.constructor(e.byteLength);return new r(t).set(new r(e)),t}},function(e,t,n){var r=n(14).Uint8Array;e.exports=r},function(e,t){e.exports=function(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}},function(e,t,n){var r=n(147),o=n(57),i=n(58);e.exports=function(e){return"function"!=typeof e.constructor||i(e)?{}:r(o(e))}},function(e,t,n){var r=n(10),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=i},function(e,t){e.exports=function(e,t){return function(n){return e(t(n))}}},function(e,t,n){var r=n(24),o=n(20),i="[object Arguments]";e.exports=function(e){return o(e)&&r(e)==i}},function(e,t,n){var r=n(40),o=n(20);e.exports=function(e){return o(e)&&r(e)}},function(e,t){e.exports=function(){return!1}},function(e,t,n){var r=n(24),o=n(57),i=n(20),a="[object Object]",u=Function.prototype,l=Object.prototype,c=u.toString,s=l.hasOwnProperty,f=c.call(Object);e.exports=function(e){if(!i(e)||r(e)!=a)return!1;var t=o(e);if(null===t)return!0;var n=s.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==f}},function(e,t,n){var r=n(24),o=n(61),i=n(20),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,e.exports=function(e){return i(e)&&o(e.length)&&!!a[r(e)]}},function(e,t){e.exports=function(e){return function(t){return e(t)}}},function(e,t,n){(function(e){var r=n(54),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o&&r.process,u=function(){try{var e=i&&i.require&&i.require("util").types;return e||a&&a.binding&&a.binding("util")}catch(e){}}();e.exports=u}).call(this,n(27)(e))},function(e,t,n){var r=n(157),o=n(65);e.exports=function(e){return r(e,o(e))}},function(e,t,n){var r=n(158),o=n(39);e.exports=function(e,t,n,i){var a=!n;n||(n={});for(var u=-1,l=t.length;++u<l;){var c=t[u],s=i?i(n[c],e[c],c,n,e):void 0;void 0===s&&(s=e[c]),a?o(n,c,s):r(n,c,s)}return n}},function(e,t,n){var r=n(39),o=n(23),i=Object.prototype.hasOwnProperty;e.exports=function(e,t,n){var a=e[t];i.call(e,t)&&o(a,n)&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){var r=n(160),o=n(59),i=n(60),a=n(62),u=n(66),l=n(63),c=Object.prototype.hasOwnProperty;e.exports=function(e,t){var n=i(e),s=!n&&o(e),f=!n&&!s&&a(e),p=!n&&!s&&!f&&l(e),d=n||s||f||p,h=d?r(e.length,String):[],v=h.length;for(var m in e)!t&&!c.call(e,m)||d&&("length"==m||f&&("offset"==m||"parent"==m)||p&&("buffer"==m||"byteLength"==m||"byteOffset"==m)||u(m,v))||h.push(m);return h}},function(e,t){e.exports=function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}},function(e,t,n){var r=n(10),o=n(58),i=n(162),a=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return i(e);var t=o(e),n=[];for(var u in e)("constructor"!=u||!t&&a.call(e,u))&&n.push(u);return n}},function(e,t){e.exports=function(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}},function(e,t,n){var r=n(164),o=n(171);e.exports=function(e){return r(function(t,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,u=i>2?n[2]:void 0;for(a=e.length>3&&"function"==typeof a?(i--,a):void 0,u&&o(n[0],n[1],u)&&(a=i<3?void 0:a,i=1),t=Object(t);++r<i;){var l=n[r];l&&e(t,l,r,a)}return t})}},function(e,t,n){var r=n(67),o=n(165),i=n(167);e.exports=function(e,t){return i(o(e,t,r),e+"")}},function(e,t,n){var r=n(166),o=Math.max;e.exports=function(e,t,n){return t=o(void 0===t?e.length-1:t,0),function(){for(var i=arguments,a=-1,u=o(i.length-t,0),l=Array(u);++a<u;)l[a]=i[t+a];a=-1;for(var c=Array(t+1);++a<t;)c[a]=i[a];return c[t]=n(l),r(e,this,c)}}},function(e,t){e.exports=function(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}},function(e,t,n){var r=n(168),o=n(170)(r);e.exports=o},function(e,t,n){var r=n(169),o=n(56),i=n(67),a=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i;e.exports=a},function(e,t){e.exports=function(e){return function(){return e}}},function(e,t){var n=800,r=16,o=Date.now;e.exports=function(e){var t=0,i=0;return function(){var a=o(),u=r-(a-i);if(i=a,u>0){if(++t>=n)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}},function(e,t,n){var r=n(23),o=n(40),i=n(66),a=n(10);e.exports=function(e,t,n){if(!a(n))return!1;var u=typeof t;return!!("number"==u?o(n)&&i(t,n.length):"string"==u&&t in n)&&r(n[t],e)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=a(n(173)),i=a(n(174));function a(e){return e&&e.__esModule?e:{default:e}}t.default=(0,r.combineReducers)({modal:o.default,filter:i.default})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments[1];switch(t.type){case r.OPEN_MODAL:return t.modal;case r.CLOSE_MODAL:return null;default:return e}};var r=n(18)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){return e&&e.__esModule?e:{default:e}}(n(36)),o=n(49);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);(0,r.default)({},e);switch(t.type){case o.UPDATE_BOUNDS:return t.bounds;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=a(n(176)),i=a(n(178));function a(e){return e&&e.__esModule?e:{default:e}}t.default=(0,r.combineReducers)({users:o.default,homes:i.default})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(177),o=n(13);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1],n=(0,r.merge)({},e);switch(Object.freeze(e),t.type){case o.RECEIVE_CURRENT_USER:return(0,r.merge)(n,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},t.currentUser.id,t.currentUser));default:return e}}},function(e,t,n){(function(e,r){var o;
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */(function(){var i,a=200,u="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",l="Expected a function",c="__lodash_hash_undefined__",s=500,f="__lodash_placeholder__",p=1,d=2,h=4,v=1,m=2,y=1,g=2,b=4,_=8,w=16,E=32,x=64,O=128,k=256,C=512,S=30,P="...",j=800,T=16,N=1,R=2,M=1/0,A=9007199254740991,I=1.7976931348623157e308,U=NaN,D=4294967295,z=D-1,L=D>>>1,F=[["ary",O],["bind",y],["bindKey",g],["curry",_],["curryRight",w],["flip",C],["partial",E],["partialRight",x],["rearg",k]],B="[object Arguments]",H="[object Array]",W="[object AsyncFunction]",q="[object Boolean]",$="[object Date]",V="[object DOMException]",Y="[object Error]",K="[object Function]",G="[object GeneratorFunction]",Q="[object Map]",Z="[object Number]",X="[object Null]",J="[object Object]",ee="[object Proxy]",te="[object RegExp]",ne="[object Set]",re="[object String]",oe="[object Symbol]",ie="[object Undefined]",ae="[object WeakMap]",ue="[object WeakSet]",le="[object ArrayBuffer]",ce="[object DataView]",se="[object Float32Array]",fe="[object Float64Array]",pe="[object Int8Array]",de="[object Int16Array]",he="[object Int32Array]",ve="[object Uint8Array]",me="[object Uint8ClampedArray]",ye="[object Uint16Array]",ge="[object Uint32Array]",be=/\b__p \+= '';/g,_e=/\b(__p \+=) '' \+/g,we=/(__e\(.*?\)|\b__t\)) \+\n'';/g,Ee=/&(?:amp|lt|gt|quot|#39);/g,xe=/[&<>"']/g,Oe=RegExp(Ee.source),ke=RegExp(xe.source),Ce=/<%-([\s\S]+?)%>/g,Se=/<%([\s\S]+?)%>/g,Pe=/<%=([\s\S]+?)%>/g,je=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Te=/^\w*$/,Ne=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Re=/[\\^$.*+?()[\]{}|]/g,Me=RegExp(Re.source),Ae=/^\s+|\s+$/g,Ie=/^\s+/,Ue=/\s+$/,De=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ze=/\{\n\/\* \[wrapped with (.+)\] \*/,Le=/,? & /,Fe=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Be=/\\(\\)?/g,He=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,We=/\w*$/,qe=/^[-+]0x[0-9a-f]+$/i,$e=/^0b[01]+$/i,Ve=/^\[object .+?Constructor\]$/,Ye=/^0o[0-7]+$/i,Ke=/^(?:0|[1-9]\d*)$/,Ge=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Qe=/($^)/,Ze=/['\n\r\u2028\u2029\\]/g,Xe="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Je="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",et="[\\ud800-\\udfff]",tt="["+Je+"]",nt="["+Xe+"]",rt="\\d+",ot="[\\u2700-\\u27bf]",it="[a-z\\xdf-\\xf6\\xf8-\\xff]",at="[^\\ud800-\\udfff"+Je+rt+"\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",ut="\\ud83c[\\udffb-\\udfff]",lt="[^\\ud800-\\udfff]",ct="(?:\\ud83c[\\udde6-\\uddff]){2}",st="[\\ud800-\\udbff][\\udc00-\\udfff]",ft="[A-Z\\xc0-\\xd6\\xd8-\\xde]",pt="(?:"+it+"|"+at+")",dt="(?:"+ft+"|"+at+")",ht="(?:"+nt+"|"+ut+")"+"?",vt="[\\ufe0e\\ufe0f]?"+ht+("(?:\\u200d(?:"+[lt,ct,st].join("|")+")[\\ufe0e\\ufe0f]?"+ht+")*"),mt="(?:"+[ot,ct,st].join("|")+")"+vt,yt="(?:"+[lt+nt+"?",nt,ct,st,et].join("|")+")",gt=RegExp("['’]","g"),bt=RegExp(nt,"g"),_t=RegExp(ut+"(?="+ut+")|"+yt+vt,"g"),wt=RegExp([ft+"?"+it+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[tt,ft,"$"].join("|")+")",dt+"+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[tt,ft+pt,"$"].join("|")+")",ft+"?"+pt+"+(?:['’](?:d|ll|m|re|s|t|ve))?",ft+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",rt,mt].join("|"),"g"),Et=RegExp("[\\u200d\\ud800-\\udfff"+Xe+"\\ufe0e\\ufe0f]"),xt=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Ot=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],kt=-1,Ct={};Ct[se]=Ct[fe]=Ct[pe]=Ct[de]=Ct[he]=Ct[ve]=Ct[me]=Ct[ye]=Ct[ge]=!0,Ct[B]=Ct[H]=Ct[le]=Ct[q]=Ct[ce]=Ct[$]=Ct[Y]=Ct[K]=Ct[Q]=Ct[Z]=Ct[J]=Ct[te]=Ct[ne]=Ct[re]=Ct[ae]=!1;var St={};St[B]=St[H]=St[le]=St[ce]=St[q]=St[$]=St[se]=St[fe]=St[pe]=St[de]=St[he]=St[Q]=St[Z]=St[J]=St[te]=St[ne]=St[re]=St[oe]=St[ve]=St[me]=St[ye]=St[ge]=!0,St[Y]=St[K]=St[ae]=!1;var Pt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},jt=parseFloat,Tt=parseInt,Nt="object"==typeof e&&e&&e.Object===Object&&e,Rt="object"==typeof self&&self&&self.Object===Object&&self,Mt=Nt||Rt||Function("return this")(),At="object"==typeof t&&t&&!t.nodeType&&t,It=At&&"object"==typeof r&&r&&!r.nodeType&&r,Ut=It&&It.exports===At,Dt=Ut&&Nt.process,zt=function(){try{var e=It&&It.require&&It.require("util").types;return e||Dt&&Dt.binding&&Dt.binding("util")}catch(e){}}(),Lt=zt&&zt.isArrayBuffer,Ft=zt&&zt.isDate,Bt=zt&&zt.isMap,Ht=zt&&zt.isRegExp,Wt=zt&&zt.isSet,qt=zt&&zt.isTypedArray;function $t(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function Vt(e,t,n,r){for(var o=-1,i=null==e?0:e.length;++o<i;){var a=e[o];t(r,a,n(a),e)}return r}function Yt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}function Kt(e,t){for(var n=null==e?0:e.length;n--&&!1!==t(e[n],n,e););return e}function Gt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(!t(e[n],n,e))return!1;return!0}function Qt(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var a=e[n];t(a,n,e)&&(i[o++]=a)}return i}function Zt(e,t){return!!(null==e?0:e.length)&&ln(e,t,0)>-1}function Xt(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0;return!1}function Jt(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}function en(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}function tn(e,t,n,r){var o=-1,i=null==e?0:e.length;for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e);return n}function nn(e,t,n,r){var o=null==e?0:e.length;for(r&&o&&(n=e[--o]);o--;)n=t(n,e[o],o,e);return n}function rn(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}var on=pn("length");function an(e,t,n){var r;return n(e,function(e,n,o){if(t(e,n,o))return r=n,!1}),r}function un(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i;return-1}function ln(e,t,n){return t==t?function(e,t,n){var r=n-1,o=e.length;for(;++r<o;)if(e[r]===t)return r;return-1}(e,t,n):un(e,sn,n)}function cn(e,t,n,r){for(var o=n-1,i=e.length;++o<i;)if(r(e[o],t))return o;return-1}function sn(e){return e!=e}function fn(e,t){var n=null==e?0:e.length;return n?vn(e,t)/n:U}function pn(e){return function(t){return null==t?i:t[e]}}function dn(e){return function(t){return null==e?i:e[t]}}function hn(e,t,n,r,o){return o(e,function(e,o,i){n=r?(r=!1,e):t(n,e,o,i)}),n}function vn(e,t){for(var n,r=-1,o=e.length;++r<o;){var a=t(e[r]);a!==i&&(n=n===i?a:n+a)}return n}function mn(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function yn(e){return function(t){return e(t)}}function gn(e,t){return Jt(t,function(t){return e[t]})}function bn(e,t){return e.has(t)}function _n(e,t){for(var n=-1,r=e.length;++n<r&&ln(t,e[n],0)>-1;);return n}function wn(e,t){for(var n=e.length;n--&&ln(t,e[n],0)>-1;);return n}var En=dn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),xn=dn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function On(e){return"\\"+Pt[e]}function kn(e){return Et.test(e)}function Cn(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function Sn(e,t){return function(n){return e(t(n))}}function Pn(e,t){for(var n=-1,r=e.length,o=0,i=[];++n<r;){var a=e[n];a!==t&&a!==f||(e[n]=f,i[o++]=n)}return i}function jn(e,t){return"__proto__"==t?i:e[t]}function Tn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function Nn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function Rn(e){return kn(e)?function(e){var t=_t.lastIndex=0;for(;_t.test(e);)++t;return t}(e):on(e)}function Mn(e){return kn(e)?function(e){return e.match(_t)||[]}(e):function(e){return e.split("")}(e)}var An=dn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var In=function e(t){var n=(t=null==t?Mt:In.defaults(Mt.Object(),t,In.pick(Mt,Ot))).Array,r=t.Date,o=t.Error,Xe=t.Function,Je=t.Math,et=t.Object,tt=t.RegExp,nt=t.String,rt=t.TypeError,ot=n.prototype,it=Xe.prototype,at=et.prototype,ut=t["__core-js_shared__"],lt=it.toString,ct=at.hasOwnProperty,st=0,ft=function(){var e=/[^.]+$/.exec(ut&&ut.keys&&ut.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),pt=at.toString,dt=lt.call(et),ht=Mt._,vt=tt("^"+lt.call(ct).replace(Re,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),mt=Ut?t.Buffer:i,yt=t.Symbol,_t=t.Uint8Array,Et=mt?mt.allocUnsafe:i,Pt=Sn(et.getPrototypeOf,et),Nt=et.create,Rt=at.propertyIsEnumerable,At=ot.splice,It=yt?yt.isConcatSpreadable:i,Dt=yt?yt.iterator:i,zt=yt?yt.toStringTag:i,on=function(){try{var e=Li(et,"defineProperty");return e({},"",{}),e}catch(e){}}(),dn=t.clearTimeout!==Mt.clearTimeout&&t.clearTimeout,Un=r&&r.now!==Mt.Date.now&&r.now,Dn=t.setTimeout!==Mt.setTimeout&&t.setTimeout,zn=Je.ceil,Ln=Je.floor,Fn=et.getOwnPropertySymbols,Bn=mt?mt.isBuffer:i,Hn=t.isFinite,Wn=ot.join,qn=Sn(et.keys,et),$n=Je.max,Vn=Je.min,Yn=r.now,Kn=t.parseInt,Gn=Je.random,Qn=ot.reverse,Zn=Li(t,"DataView"),Xn=Li(t,"Map"),Jn=Li(t,"Promise"),er=Li(t,"Set"),tr=Li(t,"WeakMap"),nr=Li(et,"create"),rr=tr&&new tr,or={},ir=sa(Zn),ar=sa(Xn),ur=sa(Jn),lr=sa(er),cr=sa(tr),sr=yt?yt.prototype:i,fr=sr?sr.valueOf:i,pr=sr?sr.toString:i;function dr(e){if(Su(e)&&!mu(e)&&!(e instanceof yr)){if(e instanceof mr)return e;if(ct.call(e,"__wrapped__"))return fa(e)}return new mr(e)}var hr=function(){function e(){}return function(t){if(!Cu(t))return{};if(Nt)return Nt(t);e.prototype=t;var n=new e;return e.prototype=i,n}}();function vr(){}function mr(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=i}function yr(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=D,this.__views__=[]}function gr(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function br(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function _r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function wr(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new _r;++t<n;)this.add(e[t])}function Er(e){var t=this.__data__=new br(e);this.size=t.size}function xr(e,t){var n=mu(e),r=!n&&vu(e),o=!n&&!r&&_u(e),i=!n&&!r&&!o&&Iu(e),a=n||r||o||i,u=a?mn(e.length,nt):[],l=u.length;for(var c in e)!t&&!ct.call(e,c)||a&&("length"==c||o&&("offset"==c||"parent"==c)||i&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||Vi(c,l))||u.push(c);return u}function Or(e){var t=e.length;return t?e[Eo(0,t-1)]:i}function kr(e,t){return ua(ri(e),Ar(t,0,e.length))}function Cr(e){return ua(ri(e))}function Sr(e,t,n){(n===i||pu(e[t],n))&&(n!==i||t in e)||Rr(e,t,n)}function Pr(e,t,n){var r=e[t];ct.call(e,t)&&pu(r,n)&&(n!==i||t in e)||Rr(e,t,n)}function jr(e,t){for(var n=e.length;n--;)if(pu(e[n][0],t))return n;return-1}function Tr(e,t,n,r){return Lr(e,function(e,o,i){t(r,e,n(e),i)}),r}function Nr(e,t){return e&&oi(t,rl(t),e)}function Rr(e,t,n){"__proto__"==t&&on?on(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function Mr(e,t){for(var r=-1,o=t.length,a=n(o),u=null==e;++r<o;)a[r]=u?i:Xu(e,t[r]);return a}function Ar(e,t,n){return e==e&&(n!==i&&(e=e<=n?e:n),t!==i&&(e=e>=t?e:t)),e}function Ir(e,t,n,r,o,a){var u,l=t&p,c=t&d,s=t&h;if(n&&(u=o?n(e,r,o,a):n(e)),u!==i)return u;if(!Cu(e))return e;var f=mu(e);if(f){if(u=function(e){var t=e.length,n=new e.constructor(t);return t&&"string"==typeof e[0]&&ct.call(e,"index")&&(n.index=e.index,n.input=e.input),n}(e),!l)return ri(e,u)}else{var v=Hi(e),m=v==K||v==G;if(_u(e))return Zo(e,l);if(v==J||v==B||m&&!o){if(u=c||m?{}:qi(e),!l)return c?function(e,t){return oi(e,Bi(e),t)}(e,function(e,t){return e&&oi(t,ol(t),e)}(u,e)):function(e,t){return oi(e,Fi(e),t)}(e,Nr(u,e))}else{if(!St[v])return o?e:{};u=function(e,t,n){var r=e.constructor;switch(t){case le:return Xo(e);case q:case $:return new r(+e);case ce:return function(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}(e,n);case se:case fe:case pe:case de:case he:case ve:case me:case ye:case ge:return Jo(e,n);case Q:return new r;case Z:case re:return new r(e);case te:return function(e){var t=new e.constructor(e.source,We.exec(e));return t.lastIndex=e.lastIndex,t}(e);case ne:return new r;case oe:return function(e){return fr?et(fr.call(e)):{}}(e)}}(e,v,l)}}a||(a=new Er);var y=a.get(e);if(y)return y;if(a.set(e,u),Ru(e))return e.forEach(function(r){u.add(Ir(r,t,n,r,e,a))}),u;if(Pu(e))return e.forEach(function(r,o){u.set(o,Ir(r,t,n,o,e,a))}),u;var g=f?i:(s?c?Ri:Ni:c?ol:rl)(e);return Yt(g||e,function(r,o){g&&(r=e[o=r]),Pr(u,o,Ir(r,t,n,o,e,a))}),u}function Ur(e,t,n){var r=n.length;if(null==e)return!r;for(e=et(e);r--;){var o=n[r],a=t[o],u=e[o];if(u===i&&!(o in e)||!a(u))return!1}return!0}function Dr(e,t,n){if("function"!=typeof e)throw new rt(l);return ra(function(){e.apply(i,n)},t)}function zr(e,t,n,r){var o=-1,i=Zt,u=!0,l=e.length,c=[],s=t.length;if(!l)return c;n&&(t=Jt(t,yn(n))),r?(i=Xt,u=!1):t.length>=a&&(i=bn,u=!1,t=new wr(t));e:for(;++o<l;){var f=e[o],p=null==n?f:n(f);if(f=r||0!==f?f:0,u&&p==p){for(var d=s;d--;)if(t[d]===p)continue e;c.push(f)}else i(t,p,r)||c.push(f)}return c}dr.templateSettings={escape:Ce,evaluate:Se,interpolate:Pe,variable:"",imports:{_:dr}},dr.prototype=vr.prototype,dr.prototype.constructor=dr,mr.prototype=hr(vr.prototype),mr.prototype.constructor=mr,yr.prototype=hr(vr.prototype),yr.prototype.constructor=yr,gr.prototype.clear=function(){this.__data__=nr?nr(null):{},this.size=0},gr.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},gr.prototype.get=function(e){var t=this.__data__;if(nr){var n=t[e];return n===c?i:n}return ct.call(t,e)?t[e]:i},gr.prototype.has=function(e){var t=this.__data__;return nr?t[e]!==i:ct.call(t,e)},gr.prototype.set=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=nr&&t===i?c:t,this},br.prototype.clear=function(){this.__data__=[],this.size=0},br.prototype.delete=function(e){var t=this.__data__,n=jr(t,e);return!(n<0||(n==t.length-1?t.pop():At.call(t,n,1),--this.size,0))},br.prototype.get=function(e){var t=this.__data__,n=jr(t,e);return n<0?i:t[n][1]},br.prototype.has=function(e){return jr(this.__data__,e)>-1},br.prototype.set=function(e,t){var n=this.__data__,r=jr(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this},_r.prototype.clear=function(){this.size=0,this.__data__={hash:new gr,map:new(Xn||br),string:new gr}},_r.prototype.delete=function(e){var t=Di(this,e).delete(e);return this.size-=t?1:0,t},_r.prototype.get=function(e){return Di(this,e).get(e)},_r.prototype.has=function(e){return Di(this,e).has(e)},_r.prototype.set=function(e,t){var n=Di(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this},wr.prototype.add=wr.prototype.push=function(e){return this.__data__.set(e,c),this},wr.prototype.has=function(e){return this.__data__.has(e)},Er.prototype.clear=function(){this.__data__=new br,this.size=0},Er.prototype.delete=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n},Er.prototype.get=function(e){return this.__data__.get(e)},Er.prototype.has=function(e){return this.__data__.has(e)},Er.prototype.set=function(e,t){var n=this.__data__;if(n instanceof br){var r=n.__data__;if(!Xn||r.length<a-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new _r(r)}return n.set(e,t),this.size=n.size,this};var Lr=ui(Yr),Fr=ui(Kr,!0);function Br(e,t){var n=!0;return Lr(e,function(e,r,o){return n=!!t(e,r,o)}),n}function Hr(e,t,n){for(var r=-1,o=e.length;++r<o;){var a=e[r],u=t(a);if(null!=u&&(l===i?u==u&&!Au(u):n(u,l)))var l=u,c=a}return c}function Wr(e,t){var n=[];return Lr(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}function qr(e,t,n,r,o){var i=-1,a=e.length;for(n||(n=$i),o||(o=[]);++i<a;){var u=e[i];t>0&&n(u)?t>1?qr(u,t-1,n,r,o):en(o,u):r||(o[o.length]=u)}return o}var $r=li(),Vr=li(!0);function Yr(e,t){return e&&$r(e,t,rl)}function Kr(e,t){return e&&Vr(e,t,rl)}function Gr(e,t){return Qt(t,function(t){return xu(e[t])})}function Qr(e,t){for(var n=0,r=(t=Yo(t,e)).length;null!=e&&n<r;)e=e[ca(t[n++])];return n&&n==r?e:i}function Zr(e,t,n){var r=t(e);return mu(e)?r:en(r,n(e))}function Xr(e){return null==e?e===i?ie:X:zt&&zt in et(e)?function(e){var t=ct.call(e,zt),n=e[zt];try{e[zt]=i;var r=!0}catch(e){}var o=pt.call(e);return r&&(t?e[zt]=n:delete e[zt]),o}(e):function(e){return pt.call(e)}(e)}function Jr(e,t){return e>t}function eo(e,t){return null!=e&&ct.call(e,t)}function to(e,t){return null!=e&&t in et(e)}function no(e,t,r){for(var o=r?Xt:Zt,a=e[0].length,u=e.length,l=u,c=n(u),s=1/0,f=[];l--;){var p=e[l];l&&t&&(p=Jt(p,yn(t))),s=Vn(p.length,s),c[l]=!r&&(t||a>=120&&p.length>=120)?new wr(l&&p):i}p=e[0];var d=-1,h=c[0];e:for(;++d<a&&f.length<s;){var v=p[d],m=t?t(v):v;if(v=r||0!==v?v:0,!(h?bn(h,m):o(f,m,r))){for(l=u;--l;){var y=c[l];if(!(y?bn(y,m):o(e[l],m,r)))continue e}h&&h.push(m),f.push(v)}}return f}function ro(e,t,n){var r=null==(e=ta(e,t=Yo(t,e)))?e:e[ca(Ea(t))];return null==r?i:$t(r,e,n)}function oo(e){return Su(e)&&Xr(e)==B}function io(e,t,n,r,o){return e===t||(null==e||null==t||!Su(e)&&!Su(t)?e!=e&&t!=t:function(e,t,n,r,o,a){var u=mu(e),l=mu(t),c=u?H:Hi(e),s=l?H:Hi(t),f=(c=c==B?J:c)==J,p=(s=s==B?J:s)==J,d=c==s;if(d&&_u(e)){if(!_u(t))return!1;u=!0,f=!1}if(d&&!f)return a||(a=new Er),u||Iu(e)?ji(e,t,n,r,o,a):function(e,t,n,r,o,i,a){switch(n){case ce:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case le:return!(e.byteLength!=t.byteLength||!i(new _t(e),new _t(t)));case q:case $:case Z:return pu(+e,+t);case Y:return e.name==t.name&&e.message==t.message;case te:case re:return e==t+"";case Q:var u=Cn;case ne:var l=r&v;if(u||(u=Tn),e.size!=t.size&&!l)return!1;var c=a.get(e);if(c)return c==t;r|=m,a.set(e,t);var s=ji(u(e),u(t),r,o,i,a);return a.delete(e),s;case oe:if(fr)return fr.call(e)==fr.call(t)}return!1}(e,t,c,n,r,o,a);if(!(n&v)){var h=f&&ct.call(e,"__wrapped__"),y=p&&ct.call(t,"__wrapped__");if(h||y){var g=h?e.value():e,b=y?t.value():t;return a||(a=new Er),o(g,b,n,r,a)}}return!!d&&(a||(a=new Er),function(e,t,n,r,o,a){var u=n&v,l=Ni(e),c=l.length,s=Ni(t).length;if(c!=s&&!u)return!1;for(var f=c;f--;){var p=l[f];if(!(u?p in t:ct.call(t,p)))return!1}var d=a.get(e);if(d&&a.get(t))return d==t;var h=!0;a.set(e,t),a.set(t,e);for(var m=u;++f<c;){p=l[f];var y=e[p],g=t[p];if(r)var b=u?r(g,y,p,t,e,a):r(y,g,p,e,t,a);if(!(b===i?y===g||o(y,g,n,r,a):b)){h=!1;break}m||(m="constructor"==p)}if(h&&!m){var _=e.constructor,w=t.constructor;_!=w&&"constructor"in e&&"constructor"in t&&!("function"==typeof _&&_ instanceof _&&"function"==typeof w&&w instanceof w)&&(h=!1)}return a.delete(e),a.delete(t),h}(e,t,n,r,o,a))}(e,t,n,r,io,o))}function ao(e,t,n,r){var o=n.length,a=o,u=!r;if(null==e)return!a;for(e=et(e);o--;){var l=n[o];if(u&&l[2]?l[1]!==e[l[0]]:!(l[0]in e))return!1}for(;++o<a;){var c=(l=n[o])[0],s=e[c],f=l[1];if(u&&l[2]){if(s===i&&!(c in e))return!1}else{var p=new Er;if(r)var d=r(s,f,c,e,t,p);if(!(d===i?io(f,s,v|m,r,p):d))return!1}}return!0}function uo(e){return!(!Cu(e)||function(e){return!!ft&&ft in e}(e))&&(xu(e)?vt:Ve).test(sa(e))}function lo(e){return"function"==typeof e?e:null==e?jl:"object"==typeof e?mu(e)?vo(e[0],e[1]):ho(e):zl(e)}function co(e){if(!Zi(e))return qn(e);var t=[];for(var n in et(e))ct.call(e,n)&&"constructor"!=n&&t.push(n);return t}function so(e){if(!Cu(e))return function(e){var t=[];if(null!=e)for(var n in et(e))t.push(n);return t}(e);var t=Zi(e),n=[];for(var r in e)("constructor"!=r||!t&&ct.call(e,r))&&n.push(r);return n}function fo(e,t){return e<t}function po(e,t){var r=-1,o=gu(e)?n(e.length):[];return Lr(e,function(e,n,i){o[++r]=t(e,n,i)}),o}function ho(e){var t=zi(e);return 1==t.length&&t[0][2]?Ji(t[0][0],t[0][1]):function(n){return n===e||ao(n,e,t)}}function vo(e,t){return Ki(e)&&Xi(t)?Ji(ca(e),t):function(n){var r=Xu(n,e);return r===i&&r===t?Ju(n,e):io(t,r,v|m)}}function mo(e,t,n,r,o){e!==t&&$r(t,function(a,u){if(Cu(a))o||(o=new Er),function(e,t,n,r,o,a,u){var l=jn(e,n),c=jn(t,n),s=u.get(c);if(s)Sr(e,n,s);else{var f=a?a(l,c,n+"",e,t,u):i,p=f===i;if(p){var d=mu(c),h=!d&&_u(c),v=!d&&!h&&Iu(c);f=c,d||h||v?mu(l)?f=l:bu(l)?f=ri(l):h?(p=!1,f=Zo(c,!0)):v?(p=!1,f=Jo(c,!0)):f=[]:Tu(c)||vu(c)?(f=l,vu(l)?f=Wu(l):(!Cu(l)||r&&xu(l))&&(f=qi(c))):p=!1}p&&(u.set(c,f),o(f,c,r,a,u),u.delete(c)),Sr(e,n,f)}}(e,t,u,n,mo,r,o);else{var l=r?r(jn(e,u),a,u+"",e,t,o):i;l===i&&(l=a),Sr(e,u,l)}},ol)}function yo(e,t){var n=e.length;if(n)return Vi(t+=t<0?n:0,n)?e[t]:i}function go(e,t,n){var r=-1;return t=Jt(t.length?t:[jl],yn(Ui())),function(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}(po(e,function(e,n,o){return{criteria:Jt(t,function(t){return t(e)}),index:++r,value:e}}),function(e,t){return function(e,t,n){for(var r=-1,o=e.criteria,i=t.criteria,a=o.length,u=n.length;++r<a;){var l=ei(o[r],i[r]);if(l){if(r>=u)return l;var c=n[r];return l*("desc"==c?-1:1)}}return e.index-t.index}(e,t,n)})}function bo(e,t,n){for(var r=-1,o=t.length,i={};++r<o;){var a=t[r],u=Qr(e,a);n(u,a)&&So(i,Yo(a,e),u)}return i}function _o(e,t,n,r){var o=r?cn:ln,i=-1,a=t.length,u=e;for(e===t&&(t=ri(t)),n&&(u=Jt(e,yn(n)));++i<a;)for(var l=0,c=t[i],s=n?n(c):c;(l=o(u,s,l,r))>-1;)u!==e&&At.call(u,l,1),At.call(e,l,1);return e}function wo(e,t){for(var n=e?t.length:0,r=n-1;n--;){var o=t[n];if(n==r||o!==i){var i=o;Vi(o)?At.call(e,o,1):Lo(e,o)}}return e}function Eo(e,t){return e+Ln(Gn()*(t-e+1))}function xo(e,t){var n="";if(!e||t<1||t>A)return n;do{t%2&&(n+=e),(t=Ln(t/2))&&(e+=e)}while(t);return n}function Oo(e,t){return oa(ea(e,t,jl),e+"")}function ko(e){return Or(pl(e))}function Co(e,t){var n=pl(e);return ua(n,Ar(t,0,n.length))}function So(e,t,n,r){if(!Cu(e))return e;for(var o=-1,a=(t=Yo(t,e)).length,u=a-1,l=e;null!=l&&++o<a;){var c=ca(t[o]),s=n;if(o!=u){var f=l[c];(s=r?r(f,c,l):i)===i&&(s=Cu(f)?f:Vi(t[o+1])?[]:{})}Pr(l,c,s),l=l[c]}return e}var Po=rr?function(e,t){return rr.set(e,t),e}:jl,jo=on?function(e,t){return on(e,"toString",{configurable:!0,enumerable:!1,value:Cl(t),writable:!0})}:jl;function To(e){return ua(pl(e))}function No(e,t,r){var o=-1,i=e.length;t<0&&(t=-t>i?0:i+t),(r=r>i?i:r)<0&&(r+=i),i=t>r?0:r-t>>>0,t>>>=0;for(var a=n(i);++o<i;)a[o]=e[o+t];return a}function Ro(e,t){var n;return Lr(e,function(e,r,o){return!(n=t(e,r,o))}),!!n}function Mo(e,t,n){var r=0,o=null==e?r:e.length;if("number"==typeof t&&t==t&&o<=L){for(;r<o;){var i=r+o>>>1,a=e[i];null!==a&&!Au(a)&&(n?a<=t:a<t)?r=i+1:o=i}return o}return Ao(e,t,jl,n)}function Ao(e,t,n,r){t=n(t);for(var o=0,a=null==e?0:e.length,u=t!=t,l=null===t,c=Au(t),s=t===i;o<a;){var f=Ln((o+a)/2),p=n(e[f]),d=p!==i,h=null===p,v=p==p,m=Au(p);if(u)var y=r||v;else y=s?v&&(r||d):l?v&&d&&(r||!h):c?v&&d&&!h&&(r||!m):!h&&!m&&(r?p<=t:p<t);y?o=f+1:a=f}return Vn(a,z)}function Io(e,t){for(var n=-1,r=e.length,o=0,i=[];++n<r;){var a=e[n],u=t?t(a):a;if(!n||!pu(u,l)){var l=u;i[o++]=0===a?0:a}}return i}function Uo(e){return"number"==typeof e?e:Au(e)?U:+e}function Do(e){if("string"==typeof e)return e;if(mu(e))return Jt(e,Do)+"";if(Au(e))return pr?pr.call(e):"";var t=e+"";return"0"==t&&1/e==-M?"-0":t}function zo(e,t,n){var r=-1,o=Zt,i=e.length,u=!0,l=[],c=l;if(n)u=!1,o=Xt;else if(i>=a){var s=t?null:xi(e);if(s)return Tn(s);u=!1,o=bn,c=new wr}else c=t?[]:l;e:for(;++r<i;){var f=e[r],p=t?t(f):f;if(f=n||0!==f?f:0,u&&p==p){for(var d=c.length;d--;)if(c[d]===p)continue e;t&&c.push(p),l.push(f)}else o(c,p,n)||(c!==l&&c.push(p),l.push(f))}return l}function Lo(e,t){return null==(e=ta(e,t=Yo(t,e)))||delete e[ca(Ea(t))]}function Fo(e,t,n,r){return So(e,t,n(Qr(e,t)),r)}function Bo(e,t,n,r){for(var o=e.length,i=r?o:-1;(r?i--:++i<o)&&t(e[i],i,e););return n?No(e,r?0:i,r?i+1:o):No(e,r?i+1:0,r?o:i)}function Ho(e,t){var n=e;return n instanceof yr&&(n=n.value()),tn(t,function(e,t){return t.func.apply(t.thisArg,en([e],t.args))},n)}function Wo(e,t,r){var o=e.length;if(o<2)return o?zo(e[0]):[];for(var i=-1,a=n(o);++i<o;)for(var u=e[i],l=-1;++l<o;)l!=i&&(a[i]=zr(a[i]||u,e[l],t,r));return zo(qr(a,1),t,r)}function qo(e,t,n){for(var r=-1,o=e.length,a=t.length,u={};++r<o;){var l=r<a?t[r]:i;n(u,e[r],l)}return u}function $o(e){return bu(e)?e:[]}function Vo(e){return"function"==typeof e?e:jl}function Yo(e,t){return mu(e)?e:Ki(e,t)?[e]:la(qu(e))}var Ko=Oo;function Go(e,t,n){var r=e.length;return n=n===i?r:n,!t&&n>=r?e:No(e,t,n)}var Qo=dn||function(e){return Mt.clearTimeout(e)};function Zo(e,t){if(t)return e.slice();var n=e.length,r=Et?Et(n):new e.constructor(n);return e.copy(r),r}function Xo(e){var t=new e.constructor(e.byteLength);return new _t(t).set(new _t(e)),t}function Jo(e,t){var n=t?Xo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function ei(e,t){if(e!==t){var n=e!==i,r=null===e,o=e==e,a=Au(e),u=t!==i,l=null===t,c=t==t,s=Au(t);if(!l&&!s&&!a&&e>t||a&&u&&c&&!l&&!s||r&&u&&c||!n&&c||!o)return 1;if(!r&&!a&&!s&&e<t||s&&n&&o&&!r&&!a||l&&n&&o||!u&&o||!c)return-1}return 0}function ti(e,t,r,o){for(var i=-1,a=e.length,u=r.length,l=-1,c=t.length,s=$n(a-u,0),f=n(c+s),p=!o;++l<c;)f[l]=t[l];for(;++i<u;)(p||i<a)&&(f[r[i]]=e[i]);for(;s--;)f[l++]=e[i++];return f}function ni(e,t,r,o){for(var i=-1,a=e.length,u=-1,l=r.length,c=-1,s=t.length,f=$n(a-l,0),p=n(f+s),d=!o;++i<f;)p[i]=e[i];for(var h=i;++c<s;)p[h+c]=t[c];for(;++u<l;)(d||i<a)&&(p[h+r[u]]=e[i++]);return p}function ri(e,t){var r=-1,o=e.length;for(t||(t=n(o));++r<o;)t[r]=e[r];return t}function oi(e,t,n,r){var o=!n;n||(n={});for(var a=-1,u=t.length;++a<u;){var l=t[a],c=r?r(n[l],e[l],l,n,e):i;c===i&&(c=e[l]),o?Rr(n,l,c):Pr(n,l,c)}return n}function ii(e,t){return function(n,r){var o=mu(n)?Vt:Tr,i=t?t():{};return o(n,e,Ui(r,2),i)}}function ai(e){return Oo(function(t,n){var r=-1,o=n.length,a=o>1?n[o-1]:i,u=o>2?n[2]:i;for(a=e.length>3&&"function"==typeof a?(o--,a):i,u&&Yi(n[0],n[1],u)&&(a=o<3?i:a,o=1),t=et(t);++r<o;){var l=n[r];l&&e(t,l,r,a)}return t})}function ui(e,t){return function(n,r){if(null==n)return n;if(!gu(n))return e(n,r);for(var o=n.length,i=t?o:-1,a=et(n);(t?i--:++i<o)&&!1!==r(a[i],i,a););return n}}function li(e){return function(t,n,r){for(var o=-1,i=et(t),a=r(t),u=a.length;u--;){var l=a[e?u:++o];if(!1===n(i[l],l,i))break}return t}}function ci(e){return function(t){var n=kn(t=qu(t))?Mn(t):i,r=n?n[0]:t.charAt(0),o=n?Go(n,1).join(""):t.slice(1);return r[e]()+o}}function si(e){return function(t){return tn(xl(vl(t).replace(gt,"")),e,"")}}function fi(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=hr(e.prototype),r=e.apply(n,t);return Cu(r)?r:n}}function pi(e){return function(t,n,r){var o=et(t);if(!gu(t)){var a=Ui(n,3);t=rl(t),n=function(e){return a(o[e],e,o)}}var u=e(t,n,r);return u>-1?o[a?t[u]:u]:i}}function di(e){return Ti(function(t){var n=t.length,r=n,o=mr.prototype.thru;for(e&&t.reverse();r--;){var a=t[r];if("function"!=typeof a)throw new rt(l);if(o&&!u&&"wrapper"==Ai(a))var u=new mr([],!0)}for(r=u?r:n;++r<n;){var c=Ai(a=t[r]),s="wrapper"==c?Mi(a):i;u=s&&Gi(s[0])&&s[1]==(O|_|E|k)&&!s[4].length&&1==s[9]?u[Ai(s[0])].apply(u,s[3]):1==a.length&&Gi(a)?u[c]():u.thru(a)}return function(){var e=arguments,r=e[0];if(u&&1==e.length&&mu(r))return u.plant(r).value();for(var o=0,i=n?t[o].apply(this,e):r;++o<n;)i=t[o].call(this,i);return i}})}function hi(e,t,r,o,a,u,l,c,s,f){var p=t&O,d=t&y,h=t&g,v=t&(_|w),m=t&C,b=h?i:fi(e);return function y(){for(var g=arguments.length,_=n(g),w=g;w--;)_[w]=arguments[w];if(v)var E=Ii(y),x=function(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&++r;return r}(_,E);if(o&&(_=ti(_,o,a,v)),u&&(_=ni(_,u,l,v)),g-=x,v&&g<f){var O=Pn(_,E);return wi(e,t,hi,y.placeholder,r,_,O,c,s,f-g)}var k=d?r:this,C=h?k[e]:e;return g=_.length,c?_=function(e,t){for(var n=e.length,r=Vn(t.length,n),o=ri(e);r--;){var a=t[r];e[r]=Vi(a,n)?o[a]:i}return e}(_,c):m&&g>1&&_.reverse(),p&&s<g&&(_.length=s),this&&this!==Mt&&this instanceof y&&(C=b||fi(C)),C.apply(k,_)}}function vi(e,t){return function(n,r){return function(e,t,n,r){return Yr(e,function(e,o,i){t(r,n(e),o,i)}),r}(n,e,t(r),{})}}function mi(e,t){return function(n,r){var o;if(n===i&&r===i)return t;if(n!==i&&(o=n),r!==i){if(o===i)return r;"string"==typeof n||"string"==typeof r?(n=Do(n),r=Do(r)):(n=Uo(n),r=Uo(r)),o=e(n,r)}return o}}function yi(e){return Ti(function(t){return t=Jt(t,yn(Ui())),Oo(function(n){var r=this;return e(t,function(e){return $t(e,r,n)})})})}function gi(e,t){var n=(t=t===i?" ":Do(t)).length;if(n<2)return n?xo(t,e):t;var r=xo(t,zn(e/Rn(t)));return kn(t)?Go(Mn(r),0,e).join(""):r.slice(0,e)}function bi(e){return function(t,r,o){return o&&"number"!=typeof o&&Yi(t,r,o)&&(r=o=i),t=Lu(t),r===i?(r=t,t=0):r=Lu(r),function(e,t,r,o){for(var i=-1,a=$n(zn((t-e)/(r||1)),0),u=n(a);a--;)u[o?a:++i]=e,e+=r;return u}(t,r,o=o===i?t<r?1:-1:Lu(o),e)}}function _i(e){return function(t,n){return"string"==typeof t&&"string"==typeof n||(t=Hu(t),n=Hu(n)),e(t,n)}}function wi(e,t,n,r,o,a,u,l,c,s){var f=t&_;t|=f?E:x,(t&=~(f?x:E))&b||(t&=~(y|g));var p=[e,t,o,f?a:i,f?u:i,f?i:a,f?i:u,l,c,s],d=n.apply(i,p);return Gi(e)&&na(d,p),d.placeholder=r,ia(d,e,t)}function Ei(e){var t=Je[e];return function(e,n){if(e=Hu(e),n=null==n?0:Vn(Fu(n),292)){var r=(qu(e)+"e").split("e");return+((r=(qu(t(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return t(e)}}var xi=er&&1/Tn(new er([,-0]))[1]==M?function(e){return new er(e)}:Al;function Oi(e){return function(t){var n=Hi(t);return n==Q?Cn(t):n==ne?Nn(t):function(e,t){return Jt(t,function(t){return[t,e[t]]})}(t,e(t))}}function ki(e,t,r,o,a,u,c,s){var p=t&g;if(!p&&"function"!=typeof e)throw new rt(l);var d=o?o.length:0;if(d||(t&=~(E|x),o=a=i),c=c===i?c:$n(Fu(c),0),s=s===i?s:Fu(s),d-=a?a.length:0,t&x){var h=o,v=a;o=a=i}var m=p?i:Mi(e),C=[e,t,r,o,a,h,v,u,c,s];if(m&&function(e,t){var n=e[1],r=t[1],o=n|r,i=o<(y|g|O),a=r==O&&n==_||r==O&&n==k&&e[7].length<=t[8]||r==(O|k)&&t[7].length<=t[8]&&n==_;if(!i&&!a)return e;r&y&&(e[2]=t[2],o|=n&y?0:b);var u=t[3];if(u){var l=e[3];e[3]=l?ti(l,u,t[4]):u,e[4]=l?Pn(e[3],f):t[4]}(u=t[5])&&(l=e[5],e[5]=l?ni(l,u,t[6]):u,e[6]=l?Pn(e[5],f):t[6]),(u=t[7])&&(e[7]=u),r&O&&(e[8]=null==e[8]?t[8]:Vn(e[8],t[8])),null==e[9]&&(e[9]=t[9]),e[0]=t[0],e[1]=o}(C,m),e=C[0],t=C[1],r=C[2],o=C[3],a=C[4],!(s=C[9]=C[9]===i?p?0:e.length:$n(C[9]-d,0))&&t&(_|w)&&(t&=~(_|w)),t&&t!=y)S=t==_||t==w?function(e,t,r){var o=fi(e);return function a(){for(var u=arguments.length,l=n(u),c=u,s=Ii(a);c--;)l[c]=arguments[c];var f=u<3&&l[0]!==s&&l[u-1]!==s?[]:Pn(l,s);return(u-=f.length)<r?wi(e,t,hi,a.placeholder,i,l,f,i,i,r-u):$t(this&&this!==Mt&&this instanceof a?o:e,this,l)}}(e,t,s):t!=E&&t!=(y|E)||a.length?hi.apply(i,C):function(e,t,r,o){var i=t&y,a=fi(e);return function t(){for(var u=-1,l=arguments.length,c=-1,s=o.length,f=n(s+l),p=this&&this!==Mt&&this instanceof t?a:e;++c<s;)f[c]=o[c];for(;l--;)f[c++]=arguments[++u];return $t(p,i?r:this,f)}}(e,t,r,o);else var S=function(e,t,n){var r=t&y,o=fi(e);return function t(){return(this&&this!==Mt&&this instanceof t?o:e).apply(r?n:this,arguments)}}(e,t,r);return ia((m?Po:na)(S,C),e,t)}function Ci(e,t,n,r){return e===i||pu(e,at[n])&&!ct.call(r,n)?t:e}function Si(e,t,n,r,o,a){return Cu(e)&&Cu(t)&&(a.set(t,e),mo(e,t,i,Si,a),a.delete(t)),e}function Pi(e){return Tu(e)?i:e}function ji(e,t,n,r,o,a){var u=n&v,l=e.length,c=t.length;if(l!=c&&!(u&&c>l))return!1;var s=a.get(e);if(s&&a.get(t))return s==t;var f=-1,p=!0,d=n&m?new wr:i;for(a.set(e,t),a.set(t,e);++f<l;){var h=e[f],y=t[f];if(r)var g=u?r(y,h,f,t,e,a):r(h,y,f,e,t,a);if(g!==i){if(g)continue;p=!1;break}if(d){if(!rn(t,function(e,t){if(!bn(d,t)&&(h===e||o(h,e,n,r,a)))return d.push(t)})){p=!1;break}}else if(h!==y&&!o(h,y,n,r,a)){p=!1;break}}return a.delete(e),a.delete(t),p}function Ti(e){return oa(ea(e,i,ya),e+"")}function Ni(e){return Zr(e,rl,Fi)}function Ri(e){return Zr(e,ol,Bi)}var Mi=rr?function(e){return rr.get(e)}:Al;function Ai(e){for(var t=e.name+"",n=or[t],r=ct.call(or,t)?n.length:0;r--;){var o=n[r],i=o.func;if(null==i||i==e)return o.name}return t}function Ii(e){return(ct.call(dr,"placeholder")?dr:e).placeholder}function Ui(){var e=dr.iteratee||Tl;return e=e===Tl?lo:e,arguments.length?e(arguments[0],arguments[1]):e}function Di(e,t){var n=e.__data__;return function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}(t)?n["string"==typeof t?"string":"hash"]:n.map}function zi(e){for(var t=rl(e),n=t.length;n--;){var r=t[n],o=e[r];t[n]=[r,o,Xi(o)]}return t}function Li(e,t){var n=function(e,t){return null==e?i:e[t]}(e,t);return uo(n)?n:i}var Fi=Fn?function(e){return null==e?[]:(e=et(e),Qt(Fn(e),function(t){return Rt.call(e,t)}))}:Bl,Bi=Fn?function(e){for(var t=[];e;)en(t,Fi(e)),e=Pt(e);return t}:Bl,Hi=Xr;function Wi(e,t,n){for(var r=-1,o=(t=Yo(t,e)).length,i=!1;++r<o;){var a=ca(t[r]);if(!(i=null!=e&&n(e,a)))break;e=e[a]}return i||++r!=o?i:!!(o=null==e?0:e.length)&&ku(o)&&Vi(a,o)&&(mu(e)||vu(e))}function qi(e){return"function"!=typeof e.constructor||Zi(e)?{}:hr(Pt(e))}function $i(e){return mu(e)||vu(e)||!!(It&&e&&e[It])}function Vi(e,t){var n=typeof e;return!!(t=null==t?A:t)&&("number"==n||"symbol"!=n&&Ke.test(e))&&e>-1&&e%1==0&&e<t}function Yi(e,t,n){if(!Cu(n))return!1;var r=typeof t;return!!("number"==r?gu(n)&&Vi(t,n.length):"string"==r&&t in n)&&pu(n[t],e)}function Ki(e,t){if(mu(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!Au(e))||Te.test(e)||!je.test(e)||null!=t&&e in et(t)}function Gi(e){var t=Ai(e),n=dr[t];if("function"!=typeof n||!(t in yr.prototype))return!1;if(e===n)return!0;var r=Mi(n);return!!r&&e===r[0]}(Zn&&Hi(new Zn(new ArrayBuffer(1)))!=ce||Xn&&Hi(new Xn)!=Q||Jn&&"[object Promise]"!=Hi(Jn.resolve())||er&&Hi(new er)!=ne||tr&&Hi(new tr)!=ae)&&(Hi=function(e){var t=Xr(e),n=t==J?e.constructor:i,r=n?sa(n):"";if(r)switch(r){case ir:return ce;case ar:return Q;case ur:return"[object Promise]";case lr:return ne;case cr:return ae}return t});var Qi=ut?xu:Hl;function Zi(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||at)}function Xi(e){return e==e&&!Cu(e)}function Ji(e,t){return function(n){return null!=n&&n[e]===t&&(t!==i||e in et(n))}}function ea(e,t,r){return t=$n(t===i?e.length-1:t,0),function(){for(var o=arguments,i=-1,a=$n(o.length-t,0),u=n(a);++i<a;)u[i]=o[t+i];i=-1;for(var l=n(t+1);++i<t;)l[i]=o[i];return l[t]=r(u),$t(e,this,l)}}function ta(e,t){return t.length<2?e:Qr(e,No(t,0,-1))}var na=aa(Po),ra=Dn||function(e,t){return Mt.setTimeout(e,t)},oa=aa(jo);function ia(e,t,n){var r=t+"";return oa(e,function(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(De,"{\n/* [wrapped with "+t+"] */\n")}(r,function(e,t){return Yt(F,function(n){var r="_."+n[0];t&n[1]&&!Zt(e,r)&&e.push(r)}),e.sort()}(function(e){var t=e.match(ze);return t?t[1].split(Le):[]}(r),n)))}function aa(e){var t=0,n=0;return function(){var r=Yn(),o=T-(r-n);if(n=r,o>0){if(++t>=j)return arguments[0]}else t=0;return e.apply(i,arguments)}}function ua(e,t){var n=-1,r=e.length,o=r-1;for(t=t===i?r:t;++n<t;){var a=Eo(n,o),u=e[a];e[a]=e[n],e[n]=u}return e.length=t,e}var la=function(e){var t=au(e,function(e){return n.size===s&&n.clear(),e}),n=t.cache;return t}(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(Ne,function(e,n,r,o){t.push(r?o.replace(Be,"$1"):n||e)}),t});function ca(e){if("string"==typeof e||Au(e))return e;var t=e+"";return"0"==t&&1/e==-M?"-0":t}function sa(e){if(null!=e){try{return lt.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function fa(e){if(e instanceof yr)return e.clone();var t=new mr(e.__wrapped__,e.__chain__);return t.__actions__=ri(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}var pa=Oo(function(e,t){return bu(e)?zr(e,qr(t,1,bu,!0)):[]}),da=Oo(function(e,t){var n=Ea(t);return bu(n)&&(n=i),bu(e)?zr(e,qr(t,1,bu,!0),Ui(n,2)):[]}),ha=Oo(function(e,t){var n=Ea(t);return bu(n)&&(n=i),bu(e)?zr(e,qr(t,1,bu,!0),i,n):[]});function va(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Fu(n);return o<0&&(o=$n(r+o,0)),un(e,Ui(t,3),o)}function ma(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r-1;return n!==i&&(o=Fu(n),o=n<0?$n(r+o,0):Vn(o,r-1)),un(e,Ui(t,3),o,!0)}function ya(e){return null!=e&&e.length?qr(e,1):[]}function ga(e){return e&&e.length?e[0]:i}var ba=Oo(function(e){var t=Jt(e,$o);return t.length&&t[0]===e[0]?no(t):[]}),_a=Oo(function(e){var t=Ea(e),n=Jt(e,$o);return t===Ea(n)?t=i:n.pop(),n.length&&n[0]===e[0]?no(n,Ui(t,2)):[]}),wa=Oo(function(e){var t=Ea(e),n=Jt(e,$o);return(t="function"==typeof t?t:i)&&n.pop(),n.length&&n[0]===e[0]?no(n,i,t):[]});function Ea(e){var t=null==e?0:e.length;return t?e[t-1]:i}var xa=Oo(Oa);function Oa(e,t){return e&&e.length&&t&&t.length?_o(e,t):e}var ka=Ti(function(e,t){var n=null==e?0:e.length,r=Mr(e,t);return wo(e,Jt(t,function(e){return Vi(e,n)?+e:e}).sort(ei)),r});function Ca(e){return null==e?e:Qn.call(e)}var Sa=Oo(function(e){return zo(qr(e,1,bu,!0))}),Pa=Oo(function(e){var t=Ea(e);return bu(t)&&(t=i),zo(qr(e,1,bu,!0),Ui(t,2))}),ja=Oo(function(e){var t=Ea(e);return t="function"==typeof t?t:i,zo(qr(e,1,bu,!0),i,t)});function Ta(e){if(!e||!e.length)return[];var t=0;return e=Qt(e,function(e){if(bu(e))return t=$n(e.length,t),!0}),mn(t,function(t){return Jt(e,pn(t))})}function Na(e,t){if(!e||!e.length)return[];var n=Ta(e);return null==t?n:Jt(n,function(e){return $t(t,i,e)})}var Ra=Oo(function(e,t){return bu(e)?zr(e,t):[]}),Ma=Oo(function(e){return Wo(Qt(e,bu))}),Aa=Oo(function(e){var t=Ea(e);return bu(t)&&(t=i),Wo(Qt(e,bu),Ui(t,2))}),Ia=Oo(function(e){var t=Ea(e);return t="function"==typeof t?t:i,Wo(Qt(e,bu),i,t)}),Ua=Oo(Ta);var Da=Oo(function(e){var t=e.length,n=t>1?e[t-1]:i;return Na(e,n="function"==typeof n?(e.pop(),n):i)});function za(e){var t=dr(e);return t.__chain__=!0,t}function La(e,t){return t(e)}var Fa=Ti(function(e){var t=e.length,n=t?e[0]:0,r=this.__wrapped__,o=function(t){return Mr(t,e)};return!(t>1||this.__actions__.length)&&r instanceof yr&&Vi(n)?((r=r.slice(n,+n+(t?1:0))).__actions__.push({func:La,args:[o],thisArg:i}),new mr(r,this.__chain__).thru(function(e){return t&&!e.length&&e.push(i),e})):this.thru(o)});var Ba=ii(function(e,t,n){ct.call(e,n)?++e[n]:Rr(e,n,1)});var Ha=pi(va),Wa=pi(ma);function qa(e,t){return(mu(e)?Yt:Lr)(e,Ui(t,3))}function $a(e,t){return(mu(e)?Kt:Fr)(e,Ui(t,3))}var Va=ii(function(e,t,n){ct.call(e,n)?e[n].push(t):Rr(e,n,[t])});var Ya=Oo(function(e,t,r){var o=-1,i="function"==typeof t,a=gu(e)?n(e.length):[];return Lr(e,function(e){a[++o]=i?$t(t,e,r):ro(e,t,r)}),a}),Ka=ii(function(e,t,n){Rr(e,n,t)});function Ga(e,t){return(mu(e)?Jt:po)(e,Ui(t,3))}var Qa=ii(function(e,t,n){e[n?0:1].push(t)},function(){return[[],[]]});var Za=Oo(function(e,t){if(null==e)return[];var n=t.length;return n>1&&Yi(e,t[0],t[1])?t=[]:n>2&&Yi(t[0],t[1],t[2])&&(t=[t[0]]),go(e,qr(t,1),[])}),Xa=Un||function(){return Mt.Date.now()};function Ja(e,t,n){return t=n?i:t,t=e&&null==t?e.length:t,ki(e,O,i,i,i,i,t)}function eu(e,t){var n;if("function"!=typeof t)throw new rt(l);return e=Fu(e),function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=i),n}}var tu=Oo(function(e,t,n){var r=y;if(n.length){var o=Pn(n,Ii(tu));r|=E}return ki(e,r,t,n,o)}),nu=Oo(function(e,t,n){var r=y|g;if(n.length){var o=Pn(n,Ii(nu));r|=E}return ki(t,r,e,n,o)});function ru(e,t,n){var r,o,a,u,c,s,f=0,p=!1,d=!1,h=!0;if("function"!=typeof e)throw new rt(l);function v(t){var n=r,a=o;return r=o=i,f=t,u=e.apply(a,n)}function m(e){var n=e-s;return s===i||n>=t||n<0||d&&e-f>=a}function y(){var e=Xa();if(m(e))return g(e);c=ra(y,function(e){var n=t-(e-s);return d?Vn(n,a-(e-f)):n}(e))}function g(e){return c=i,h&&r?v(e):(r=o=i,u)}function b(){var e=Xa(),n=m(e);if(r=arguments,o=this,s=e,n){if(c===i)return function(e){return f=e,c=ra(y,t),p?v(e):u}(s);if(d)return c=ra(y,t),v(s)}return c===i&&(c=ra(y,t)),u}return t=Hu(t)||0,Cu(n)&&(p=!!n.leading,a=(d="maxWait"in n)?$n(Hu(n.maxWait)||0,t):a,h="trailing"in n?!!n.trailing:h),b.cancel=function(){c!==i&&Qo(c),f=0,r=s=o=c=i},b.flush=function(){return c===i?u:g(Xa())},b}var ou=Oo(function(e,t){return Dr(e,1,t)}),iu=Oo(function(e,t,n){return Dr(e,Hu(t)||0,n)});function au(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new rt(l);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=e.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(au.Cache||_r),n}function uu(e){if("function"!=typeof e)throw new rt(l);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}au.Cache=_r;var lu=Ko(function(e,t){var n=(t=1==t.length&&mu(t[0])?Jt(t[0],yn(Ui())):Jt(qr(t,1),yn(Ui()))).length;return Oo(function(r){for(var o=-1,i=Vn(r.length,n);++o<i;)r[o]=t[o].call(this,r[o]);return $t(e,this,r)})}),cu=Oo(function(e,t){var n=Pn(t,Ii(cu));return ki(e,E,i,t,n)}),su=Oo(function(e,t){var n=Pn(t,Ii(su));return ki(e,x,i,t,n)}),fu=Ti(function(e,t){return ki(e,k,i,i,i,t)});function pu(e,t){return e===t||e!=e&&t!=t}var du=_i(Jr),hu=_i(function(e,t){return e>=t}),vu=oo(function(){return arguments}())?oo:function(e){return Su(e)&&ct.call(e,"callee")&&!Rt.call(e,"callee")},mu=n.isArray,yu=Lt?yn(Lt):function(e){return Su(e)&&Xr(e)==le};function gu(e){return null!=e&&ku(e.length)&&!xu(e)}function bu(e){return Su(e)&&gu(e)}var _u=Bn||Hl,wu=Ft?yn(Ft):function(e){return Su(e)&&Xr(e)==$};function Eu(e){if(!Su(e))return!1;var t=Xr(e);return t==Y||t==V||"string"==typeof e.message&&"string"==typeof e.name&&!Tu(e)}function xu(e){if(!Cu(e))return!1;var t=Xr(e);return t==K||t==G||t==W||t==ee}function Ou(e){return"number"==typeof e&&e==Fu(e)}function ku(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=A}function Cu(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function Su(e){return null!=e&&"object"==typeof e}var Pu=Bt?yn(Bt):function(e){return Su(e)&&Hi(e)==Q};function ju(e){return"number"==typeof e||Su(e)&&Xr(e)==Z}function Tu(e){if(!Su(e)||Xr(e)!=J)return!1;var t=Pt(e);if(null===t)return!0;var n=ct.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&lt.call(n)==dt}var Nu=Ht?yn(Ht):function(e){return Su(e)&&Xr(e)==te};var Ru=Wt?yn(Wt):function(e){return Su(e)&&Hi(e)==ne};function Mu(e){return"string"==typeof e||!mu(e)&&Su(e)&&Xr(e)==re}function Au(e){return"symbol"==typeof e||Su(e)&&Xr(e)==oe}var Iu=qt?yn(qt):function(e){return Su(e)&&ku(e.length)&&!!Ct[Xr(e)]};var Uu=_i(fo),Du=_i(function(e,t){return e<=t});function zu(e){if(!e)return[];if(gu(e))return Mu(e)?Mn(e):ri(e);if(Dt&&e[Dt])return function(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}(e[Dt]());var t=Hi(e);return(t==Q?Cn:t==ne?Tn:pl)(e)}function Lu(e){return e?(e=Hu(e))===M||e===-M?(e<0?-1:1)*I:e==e?e:0:0===e?e:0}function Fu(e){var t=Lu(e),n=t%1;return t==t?n?t-n:t:0}function Bu(e){return e?Ar(Fu(e),0,D):0}function Hu(e){if("number"==typeof e)return e;if(Au(e))return U;if(Cu(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=Cu(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(Ae,"");var n=$e.test(e);return n||Ye.test(e)?Tt(e.slice(2),n?2:8):qe.test(e)?U:+e}function Wu(e){return oi(e,ol(e))}function qu(e){return null==e?"":Do(e)}var $u=ai(function(e,t){if(Zi(t)||gu(t))oi(t,rl(t),e);else for(var n in t)ct.call(t,n)&&Pr(e,n,t[n])}),Vu=ai(function(e,t){oi(t,ol(t),e)}),Yu=ai(function(e,t,n,r){oi(t,ol(t),e,r)}),Ku=ai(function(e,t,n,r){oi(t,rl(t),e,r)}),Gu=Ti(Mr);var Qu=Oo(function(e,t){e=et(e);var n=-1,r=t.length,o=r>2?t[2]:i;for(o&&Yi(t[0],t[1],o)&&(r=1);++n<r;)for(var a=t[n],u=ol(a),l=-1,c=u.length;++l<c;){var s=u[l],f=e[s];(f===i||pu(f,at[s])&&!ct.call(e,s))&&(e[s]=a[s])}return e}),Zu=Oo(function(e){return e.push(i,Si),$t(al,i,e)});function Xu(e,t,n){var r=null==e?i:Qr(e,t);return r===i?n:r}function Ju(e,t){return null!=e&&Wi(e,t,to)}var el=vi(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=pt.call(t)),e[t]=n},Cl(jl)),tl=vi(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=pt.call(t)),ct.call(e,t)?e[t].push(n):e[t]=[n]},Ui),nl=Oo(ro);function rl(e){return gu(e)?xr(e):co(e)}function ol(e){return gu(e)?xr(e,!0):so(e)}var il=ai(function(e,t,n){mo(e,t,n)}),al=ai(function(e,t,n,r){mo(e,t,n,r)}),ul=Ti(function(e,t){var n={};if(null==e)return n;var r=!1;t=Jt(t,function(t){return t=Yo(t,e),r||(r=t.length>1),t}),oi(e,Ri(e),n),r&&(n=Ir(n,p|d|h,Pi));for(var o=t.length;o--;)Lo(n,t[o]);return n});var ll=Ti(function(e,t){return null==e?{}:function(e,t){return bo(e,t,function(t,n){return Ju(e,n)})}(e,t)});function cl(e,t){if(null==e)return{};var n=Jt(Ri(e),function(e){return[e]});return t=Ui(t),bo(e,n,function(e,n){return t(e,n[0])})}var sl=Oi(rl),fl=Oi(ol);function pl(e){return null==e?[]:gn(e,rl(e))}var dl=si(function(e,t,n){return t=t.toLowerCase(),e+(n?hl(t):t)});function hl(e){return El(qu(e).toLowerCase())}function vl(e){return(e=qu(e))&&e.replace(Ge,En).replace(bt,"")}var ml=si(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()}),yl=si(function(e,t,n){return e+(n?" ":"")+t.toLowerCase()}),gl=ci("toLowerCase");var bl=si(function(e,t,n){return e+(n?"_":"")+t.toLowerCase()});var _l=si(function(e,t,n){return e+(n?" ":"")+El(t)});var wl=si(function(e,t,n){return e+(n?" ":"")+t.toUpperCase()}),El=ci("toUpperCase");function xl(e,t,n){return e=qu(e),(t=n?i:t)===i?function(e){return xt.test(e)}(e)?function(e){return e.match(wt)||[]}(e):function(e){return e.match(Fe)||[]}(e):e.match(t)||[]}var Ol=Oo(function(e,t){try{return $t(e,i,t)}catch(e){return Eu(e)?e:new o(e)}}),kl=Ti(function(e,t){return Yt(t,function(t){t=ca(t),Rr(e,t,tu(e[t],e))}),e});function Cl(e){return function(){return e}}var Sl=di(),Pl=di(!0);function jl(e){return e}function Tl(e){return lo("function"==typeof e?e:Ir(e,p))}var Nl=Oo(function(e,t){return function(n){return ro(n,e,t)}}),Rl=Oo(function(e,t){return function(n){return ro(e,n,t)}});function Ml(e,t,n){var r=rl(t),o=Gr(t,r);null!=n||Cu(t)&&(o.length||!r.length)||(n=t,t=e,e=this,o=Gr(t,rl(t)));var i=!(Cu(n)&&"chain"in n&&!n.chain),a=xu(e);return Yt(o,function(n){var r=t[n];e[n]=r,a&&(e.prototype[n]=function(){var t=this.__chain__;if(i||t){var n=e(this.__wrapped__);return(n.__actions__=ri(this.__actions__)).push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,en([this.value()],arguments))})}),e}function Al(){}var Il=yi(Jt),Ul=yi(Gt),Dl=yi(rn);function zl(e){return Ki(e)?pn(ca(e)):function(e){return function(t){return Qr(t,e)}}(e)}var Ll=bi(),Fl=bi(!0);function Bl(){return[]}function Hl(){return!1}var Wl=mi(function(e,t){return e+t},0),ql=Ei("ceil"),$l=mi(function(e,t){return e/t},1),Vl=Ei("floor");var Yl=mi(function(e,t){return e*t},1),Kl=Ei("round"),Gl=mi(function(e,t){return e-t},0);return dr.after=function(e,t){if("function"!=typeof t)throw new rt(l);return e=Fu(e),function(){if(--e<1)return t.apply(this,arguments)}},dr.ary=Ja,dr.assign=$u,dr.assignIn=Vu,dr.assignInWith=Yu,dr.assignWith=Ku,dr.at=Gu,dr.before=eu,dr.bind=tu,dr.bindAll=kl,dr.bindKey=nu,dr.castArray=function(){if(!arguments.length)return[];var e=arguments[0];return mu(e)?e:[e]},dr.chain=za,dr.chunk=function(e,t,r){t=(r?Yi(e,t,r):t===i)?1:$n(Fu(t),0);var o=null==e?0:e.length;if(!o||t<1)return[];for(var a=0,u=0,l=n(zn(o/t));a<o;)l[u++]=No(e,a,a+=t);return l},dr.compact=function(e){for(var t=-1,n=null==e?0:e.length,r=0,o=[];++t<n;){var i=e[t];i&&(o[r++]=i)}return o},dr.concat=function(){var e=arguments.length;if(!e)return[];for(var t=n(e-1),r=arguments[0],o=e;o--;)t[o-1]=arguments[o];return en(mu(r)?ri(r):[r],qr(t,1))},dr.cond=function(e){var t=null==e?0:e.length,n=Ui();return e=t?Jt(e,function(e){if("function"!=typeof e[1])throw new rt(l);return[n(e[0]),e[1]]}):[],Oo(function(n){for(var r=-1;++r<t;){var o=e[r];if($t(o[0],this,n))return $t(o[1],this,n)}})},dr.conforms=function(e){return function(e){var t=rl(e);return function(n){return Ur(n,e,t)}}(Ir(e,p))},dr.constant=Cl,dr.countBy=Ba,dr.create=function(e,t){var n=hr(e);return null==t?n:Nr(n,t)},dr.curry=function e(t,n,r){var o=ki(t,_,i,i,i,i,i,n=r?i:n);return o.placeholder=e.placeholder,o},dr.curryRight=function e(t,n,r){var o=ki(t,w,i,i,i,i,i,n=r?i:n);return o.placeholder=e.placeholder,o},dr.debounce=ru,dr.defaults=Qu,dr.defaultsDeep=Zu,dr.defer=ou,dr.delay=iu,dr.difference=pa,dr.differenceBy=da,dr.differenceWith=ha,dr.drop=function(e,t,n){var r=null==e?0:e.length;return r?No(e,(t=n||t===i?1:Fu(t))<0?0:t,r):[]},dr.dropRight=function(e,t,n){var r=null==e?0:e.length;return r?No(e,0,(t=r-(t=n||t===i?1:Fu(t)))<0?0:t):[]},dr.dropRightWhile=function(e,t){return e&&e.length?Bo(e,Ui(t,3),!0,!0):[]},dr.dropWhile=function(e,t){return e&&e.length?Bo(e,Ui(t,3),!0):[]},dr.fill=function(e,t,n,r){var o=null==e?0:e.length;return o?(n&&"number"!=typeof n&&Yi(e,t,n)&&(n=0,r=o),function(e,t,n,r){var o=e.length;for((n=Fu(n))<0&&(n=-n>o?0:o+n),(r=r===i||r>o?o:Fu(r))<0&&(r+=o),r=n>r?0:Bu(r);n<r;)e[n++]=t;return e}(e,t,n,r)):[]},dr.filter=function(e,t){return(mu(e)?Qt:Wr)(e,Ui(t,3))},dr.flatMap=function(e,t){return qr(Ga(e,t),1)},dr.flatMapDeep=function(e,t){return qr(Ga(e,t),M)},dr.flatMapDepth=function(e,t,n){return n=n===i?1:Fu(n),qr(Ga(e,t),n)},dr.flatten=ya,dr.flattenDeep=function(e){return null!=e&&e.length?qr(e,M):[]},dr.flattenDepth=function(e,t){return null!=e&&e.length?qr(e,t=t===i?1:Fu(t)):[]},dr.flip=function(e){return ki(e,C)},dr.flow=Sl,dr.flowRight=Pl,dr.fromPairs=function(e){for(var t=-1,n=null==e?0:e.length,r={};++t<n;){var o=e[t];r[o[0]]=o[1]}return r},dr.functions=function(e){return null==e?[]:Gr(e,rl(e))},dr.functionsIn=function(e){return null==e?[]:Gr(e,ol(e))},dr.groupBy=Va,dr.initial=function(e){return null!=e&&e.length?No(e,0,-1):[]},dr.intersection=ba,dr.intersectionBy=_a,dr.intersectionWith=wa,dr.invert=el,dr.invertBy=tl,dr.invokeMap=Ya,dr.iteratee=Tl,dr.keyBy=Ka,dr.keys=rl,dr.keysIn=ol,dr.map=Ga,dr.mapKeys=function(e,t){var n={};return t=Ui(t,3),Yr(e,function(e,r,o){Rr(n,t(e,r,o),e)}),n},dr.mapValues=function(e,t){var n={};return t=Ui(t,3),Yr(e,function(e,r,o){Rr(n,r,t(e,r,o))}),n},dr.matches=function(e){return ho(Ir(e,p))},dr.matchesProperty=function(e,t){return vo(e,Ir(t,p))},dr.memoize=au,dr.merge=il,dr.mergeWith=al,dr.method=Nl,dr.methodOf=Rl,dr.mixin=Ml,dr.negate=uu,dr.nthArg=function(e){return e=Fu(e),Oo(function(t){return yo(t,e)})},dr.omit=ul,dr.omitBy=function(e,t){return cl(e,uu(Ui(t)))},dr.once=function(e){return eu(2,e)},dr.orderBy=function(e,t,n,r){return null==e?[]:(mu(t)||(t=null==t?[]:[t]),mu(n=r?i:n)||(n=null==n?[]:[n]),go(e,t,n))},dr.over=Il,dr.overArgs=lu,dr.overEvery=Ul,dr.overSome=Dl,dr.partial=cu,dr.partialRight=su,dr.partition=Qa,dr.pick=ll,dr.pickBy=cl,dr.property=zl,dr.propertyOf=function(e){return function(t){return null==e?i:Qr(e,t)}},dr.pull=xa,dr.pullAll=Oa,dr.pullAllBy=function(e,t,n){return e&&e.length&&t&&t.length?_o(e,t,Ui(n,2)):e},dr.pullAllWith=function(e,t,n){return e&&e.length&&t&&t.length?_o(e,t,i,n):e},dr.pullAt=ka,dr.range=Ll,dr.rangeRight=Fl,dr.rearg=fu,dr.reject=function(e,t){return(mu(e)?Qt:Wr)(e,uu(Ui(t,3)))},dr.remove=function(e,t){var n=[];if(!e||!e.length)return n;var r=-1,o=[],i=e.length;for(t=Ui(t,3);++r<i;){var a=e[r];t(a,r,e)&&(n.push(a),o.push(r))}return wo(e,o),n},dr.rest=function(e,t){if("function"!=typeof e)throw new rt(l);return Oo(e,t=t===i?t:Fu(t))},dr.reverse=Ca,dr.sampleSize=function(e,t,n){return t=(n?Yi(e,t,n):t===i)?1:Fu(t),(mu(e)?kr:Co)(e,t)},dr.set=function(e,t,n){return null==e?e:So(e,t,n)},dr.setWith=function(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:So(e,t,n,r)},dr.shuffle=function(e){return(mu(e)?Cr:To)(e)},dr.slice=function(e,t,n){var r=null==e?0:e.length;return r?(n&&"number"!=typeof n&&Yi(e,t,n)?(t=0,n=r):(t=null==t?0:Fu(t),n=n===i?r:Fu(n)),No(e,t,n)):[]},dr.sortBy=Za,dr.sortedUniq=function(e){return e&&e.length?Io(e):[]},dr.sortedUniqBy=function(e,t){return e&&e.length?Io(e,Ui(t,2)):[]},dr.split=function(e,t,n){return n&&"number"!=typeof n&&Yi(e,t,n)&&(t=n=i),(n=n===i?D:n>>>0)?(e=qu(e))&&("string"==typeof t||null!=t&&!Nu(t))&&!(t=Do(t))&&kn(e)?Go(Mn(e),0,n):e.split(t,n):[]},dr.spread=function(e,t){if("function"!=typeof e)throw new rt(l);return t=null==t?0:$n(Fu(t),0),Oo(function(n){var r=n[t],o=Go(n,0,t);return r&&en(o,r),$t(e,this,o)})},dr.tail=function(e){var t=null==e?0:e.length;return t?No(e,1,t):[]},dr.take=function(e,t,n){return e&&e.length?No(e,0,(t=n||t===i?1:Fu(t))<0?0:t):[]},dr.takeRight=function(e,t,n){var r=null==e?0:e.length;return r?No(e,(t=r-(t=n||t===i?1:Fu(t)))<0?0:t,r):[]},dr.takeRightWhile=function(e,t){return e&&e.length?Bo(e,Ui(t,3),!1,!0):[]},dr.takeWhile=function(e,t){return e&&e.length?Bo(e,Ui(t,3)):[]},dr.tap=function(e,t){return t(e),e},dr.throttle=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new rt(l);return Cu(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),ru(e,t,{leading:r,maxWait:t,trailing:o})},dr.thru=La,dr.toArray=zu,dr.toPairs=sl,dr.toPairsIn=fl,dr.toPath=function(e){return mu(e)?Jt(e,ca):Au(e)?[e]:ri(la(qu(e)))},dr.toPlainObject=Wu,dr.transform=function(e,t,n){var r=mu(e),o=r||_u(e)||Iu(e);if(t=Ui(t,4),null==n){var i=e&&e.constructor;n=o?r?new i:[]:Cu(e)&&xu(i)?hr(Pt(e)):{}}return(o?Yt:Yr)(e,function(e,r,o){return t(n,e,r,o)}),n},dr.unary=function(e){return Ja(e,1)},dr.union=Sa,dr.unionBy=Pa,dr.unionWith=ja,dr.uniq=function(e){return e&&e.length?zo(e):[]},dr.uniqBy=function(e,t){return e&&e.length?zo(e,Ui(t,2)):[]},dr.uniqWith=function(e,t){return t="function"==typeof t?t:i,e&&e.length?zo(e,i,t):[]},dr.unset=function(e,t){return null==e||Lo(e,t)},dr.unzip=Ta,dr.unzipWith=Na,dr.update=function(e,t,n){return null==e?e:Fo(e,t,Vo(n))},dr.updateWith=function(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:Fo(e,t,Vo(n),r)},dr.values=pl,dr.valuesIn=function(e){return null==e?[]:gn(e,ol(e))},dr.without=Ra,dr.words=xl,dr.wrap=function(e,t){return cu(Vo(t),e)},dr.xor=Ma,dr.xorBy=Aa,dr.xorWith=Ia,dr.zip=Ua,dr.zipObject=function(e,t){return qo(e||[],t||[],Pr)},dr.zipObjectDeep=function(e,t){return qo(e||[],t||[],So)},dr.zipWith=Da,dr.entries=sl,dr.entriesIn=fl,dr.extend=Vu,dr.extendWith=Yu,Ml(dr,dr),dr.add=Wl,dr.attempt=Ol,dr.camelCase=dl,dr.capitalize=hl,dr.ceil=ql,dr.clamp=function(e,t,n){return n===i&&(n=t,t=i),n!==i&&(n=(n=Hu(n))==n?n:0),t!==i&&(t=(t=Hu(t))==t?t:0),Ar(Hu(e),t,n)},dr.clone=function(e){return Ir(e,h)},dr.cloneDeep=function(e){return Ir(e,p|h)},dr.cloneDeepWith=function(e,t){return Ir(e,p|h,t="function"==typeof t?t:i)},dr.cloneWith=function(e,t){return Ir(e,h,t="function"==typeof t?t:i)},dr.conformsTo=function(e,t){return null==t||Ur(e,t,rl(t))},dr.deburr=vl,dr.defaultTo=function(e,t){return null==e||e!=e?t:e},dr.divide=$l,dr.endsWith=function(e,t,n){e=qu(e),t=Do(t);var r=e.length,o=n=n===i?r:Ar(Fu(n),0,r);return(n-=t.length)>=0&&e.slice(n,o)==t},dr.eq=pu,dr.escape=function(e){return(e=qu(e))&&ke.test(e)?e.replace(xe,xn):e},dr.escapeRegExp=function(e){return(e=qu(e))&&Me.test(e)?e.replace(Re,"\\$&"):e},dr.every=function(e,t,n){var r=mu(e)?Gt:Br;return n&&Yi(e,t,n)&&(t=i),r(e,Ui(t,3))},dr.find=Ha,dr.findIndex=va,dr.findKey=function(e,t){return an(e,Ui(t,3),Yr)},dr.findLast=Wa,dr.findLastIndex=ma,dr.findLastKey=function(e,t){return an(e,Ui(t,3),Kr)},dr.floor=Vl,dr.forEach=qa,dr.forEachRight=$a,dr.forIn=function(e,t){return null==e?e:$r(e,Ui(t,3),ol)},dr.forInRight=function(e,t){return null==e?e:Vr(e,Ui(t,3),ol)},dr.forOwn=function(e,t){return e&&Yr(e,Ui(t,3))},dr.forOwnRight=function(e,t){return e&&Kr(e,Ui(t,3))},dr.get=Xu,dr.gt=du,dr.gte=hu,dr.has=function(e,t){return null!=e&&Wi(e,t,eo)},dr.hasIn=Ju,dr.head=ga,dr.identity=jl,dr.includes=function(e,t,n,r){e=gu(e)?e:pl(e),n=n&&!r?Fu(n):0;var o=e.length;return n<0&&(n=$n(o+n,0)),Mu(e)?n<=o&&e.indexOf(t,n)>-1:!!o&&ln(e,t,n)>-1},dr.indexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Fu(n);return o<0&&(o=$n(r+o,0)),ln(e,t,o)},dr.inRange=function(e,t,n){return t=Lu(t),n===i?(n=t,t=0):n=Lu(n),function(e,t,n){return e>=Vn(t,n)&&e<$n(t,n)}(e=Hu(e),t,n)},dr.invoke=nl,dr.isArguments=vu,dr.isArray=mu,dr.isArrayBuffer=yu,dr.isArrayLike=gu,dr.isArrayLikeObject=bu,dr.isBoolean=function(e){return!0===e||!1===e||Su(e)&&Xr(e)==q},dr.isBuffer=_u,dr.isDate=wu,dr.isElement=function(e){return Su(e)&&1===e.nodeType&&!Tu(e)},dr.isEmpty=function(e){if(null==e)return!0;if(gu(e)&&(mu(e)||"string"==typeof e||"function"==typeof e.splice||_u(e)||Iu(e)||vu(e)))return!e.length;var t=Hi(e);if(t==Q||t==ne)return!e.size;if(Zi(e))return!co(e).length;for(var n in e)if(ct.call(e,n))return!1;return!0},dr.isEqual=function(e,t){return io(e,t)},dr.isEqualWith=function(e,t,n){var r=(n="function"==typeof n?n:i)?n(e,t):i;return r===i?io(e,t,i,n):!!r},dr.isError=Eu,dr.isFinite=function(e){return"number"==typeof e&&Hn(e)},dr.isFunction=xu,dr.isInteger=Ou,dr.isLength=ku,dr.isMap=Pu,dr.isMatch=function(e,t){return e===t||ao(e,t,zi(t))},dr.isMatchWith=function(e,t,n){return n="function"==typeof n?n:i,ao(e,t,zi(t),n)},dr.isNaN=function(e){return ju(e)&&e!=+e},dr.isNative=function(e){if(Qi(e))throw new o(u);return uo(e)},dr.isNil=function(e){return null==e},dr.isNull=function(e){return null===e},dr.isNumber=ju,dr.isObject=Cu,dr.isObjectLike=Su,dr.isPlainObject=Tu,dr.isRegExp=Nu,dr.isSafeInteger=function(e){return Ou(e)&&e>=-A&&e<=A},dr.isSet=Ru,dr.isString=Mu,dr.isSymbol=Au,dr.isTypedArray=Iu,dr.isUndefined=function(e){return e===i},dr.isWeakMap=function(e){return Su(e)&&Hi(e)==ae},dr.isWeakSet=function(e){return Su(e)&&Xr(e)==ue},dr.join=function(e,t){return null==e?"":Wn.call(e,t)},dr.kebabCase=ml,dr.last=Ea,dr.lastIndexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r;return n!==i&&(o=(o=Fu(n))<0?$n(r+o,0):Vn(o,r-1)),t==t?function(e,t,n){for(var r=n+1;r--;)if(e[r]===t)return r;return r}(e,t,o):un(e,sn,o,!0)},dr.lowerCase=yl,dr.lowerFirst=gl,dr.lt=Uu,dr.lte=Du,dr.max=function(e){return e&&e.length?Hr(e,jl,Jr):i},dr.maxBy=function(e,t){return e&&e.length?Hr(e,Ui(t,2),Jr):i},dr.mean=function(e){return fn(e,jl)},dr.meanBy=function(e,t){return fn(e,Ui(t,2))},dr.min=function(e){return e&&e.length?Hr(e,jl,fo):i},dr.minBy=function(e,t){return e&&e.length?Hr(e,Ui(t,2),fo):i},dr.stubArray=Bl,dr.stubFalse=Hl,dr.stubObject=function(){return{}},dr.stubString=function(){return""},dr.stubTrue=function(){return!0},dr.multiply=Yl,dr.nth=function(e,t){return e&&e.length?yo(e,Fu(t)):i},dr.noConflict=function(){return Mt._===this&&(Mt._=ht),this},dr.noop=Al,dr.now=Xa,dr.pad=function(e,t,n){e=qu(e);var r=(t=Fu(t))?Rn(e):0;if(!t||r>=t)return e;var o=(t-r)/2;return gi(Ln(o),n)+e+gi(zn(o),n)},dr.padEnd=function(e,t,n){e=qu(e);var r=(t=Fu(t))?Rn(e):0;return t&&r<t?e+gi(t-r,n):e},dr.padStart=function(e,t,n){e=qu(e);var r=(t=Fu(t))?Rn(e):0;return t&&r<t?gi(t-r,n)+e:e},dr.parseInt=function(e,t,n){return n||null==t?t=0:t&&(t=+t),Kn(qu(e).replace(Ie,""),t||0)},dr.random=function(e,t,n){if(n&&"boolean"!=typeof n&&Yi(e,t,n)&&(t=n=i),n===i&&("boolean"==typeof t?(n=t,t=i):"boolean"==typeof e&&(n=e,e=i)),e===i&&t===i?(e=0,t=1):(e=Lu(e),t===i?(t=e,e=0):t=Lu(t)),e>t){var r=e;e=t,t=r}if(n||e%1||t%1){var o=Gn();return Vn(e+o*(t-e+jt("1e-"+((o+"").length-1))),t)}return Eo(e,t)},dr.reduce=function(e,t,n){var r=mu(e)?tn:hn,o=arguments.length<3;return r(e,Ui(t,4),n,o,Lr)},dr.reduceRight=function(e,t,n){var r=mu(e)?nn:hn,o=arguments.length<3;return r(e,Ui(t,4),n,o,Fr)},dr.repeat=function(e,t,n){return t=(n?Yi(e,t,n):t===i)?1:Fu(t),xo(qu(e),t)},dr.replace=function(){var e=arguments,t=qu(e[0]);return e.length<3?t:t.replace(e[1],e[2])},dr.result=function(e,t,n){var r=-1,o=(t=Yo(t,e)).length;for(o||(o=1,e=i);++r<o;){var a=null==e?i:e[ca(t[r])];a===i&&(r=o,a=n),e=xu(a)?a.call(e):a}return e},dr.round=Kl,dr.runInContext=e,dr.sample=function(e){return(mu(e)?Or:ko)(e)},dr.size=function(e){if(null==e)return 0;if(gu(e))return Mu(e)?Rn(e):e.length;var t=Hi(e);return t==Q||t==ne?e.size:co(e).length},dr.snakeCase=bl,dr.some=function(e,t,n){var r=mu(e)?rn:Ro;return n&&Yi(e,t,n)&&(t=i),r(e,Ui(t,3))},dr.sortedIndex=function(e,t){return Mo(e,t)},dr.sortedIndexBy=function(e,t,n){return Ao(e,t,Ui(n,2))},dr.sortedIndexOf=function(e,t){var n=null==e?0:e.length;if(n){var r=Mo(e,t);if(r<n&&pu(e[r],t))return r}return-1},dr.sortedLastIndex=function(e,t){return Mo(e,t,!0)},dr.sortedLastIndexBy=function(e,t,n){return Ao(e,t,Ui(n,2),!0)},dr.sortedLastIndexOf=function(e,t){if(null!=e&&e.length){var n=Mo(e,t,!0)-1;if(pu(e[n],t))return n}return-1},dr.startCase=_l,dr.startsWith=function(e,t,n){return e=qu(e),n=null==n?0:Ar(Fu(n),0,e.length),t=Do(t),e.slice(n,n+t.length)==t},dr.subtract=Gl,dr.sum=function(e){return e&&e.length?vn(e,jl):0},dr.sumBy=function(e,t){return e&&e.length?vn(e,Ui(t,2)):0},dr.template=function(e,t,n){var r=dr.templateSettings;n&&Yi(e,t,n)&&(t=i),e=qu(e),t=Yu({},t,r,Ci);var o,a,u=Yu({},t.imports,r.imports,Ci),l=rl(u),c=gn(u,l),s=0,f=t.interpolate||Qe,p="__p += '",d=tt((t.escape||Qe).source+"|"+f.source+"|"+(f===Pe?He:Qe).source+"|"+(t.evaluate||Qe).source+"|$","g"),h="//# sourceURL="+("sourceURL"in t?t.sourceURL:"lodash.templateSources["+ ++kt+"]")+"\n";e.replace(d,function(t,n,r,i,u,l){return r||(r=i),p+=e.slice(s,l).replace(Ze,On),n&&(o=!0,p+="' +\n__e("+n+") +\n'"),u&&(a=!0,p+="';\n"+u+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),s=l+t.length,t}),p+="';\n";var v=t.variable;v||(p="with (obj) {\n"+p+"\n}\n"),p=(a?p.replace(be,""):p).replace(_e,"$1").replace(we,"$1;"),p="function("+(v||"obj")+") {\n"+(v?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(a?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var m=Ol(function(){return Xe(l,h+"return "+p).apply(i,c)});if(m.source=p,Eu(m))throw m;return m},dr.times=function(e,t){if((e=Fu(e))<1||e>A)return[];var n=D,r=Vn(e,D);t=Ui(t),e-=D;for(var o=mn(r,t);++n<e;)t(n);return o},dr.toFinite=Lu,dr.toInteger=Fu,dr.toLength=Bu,dr.toLower=function(e){return qu(e).toLowerCase()},dr.toNumber=Hu,dr.toSafeInteger=function(e){return e?Ar(Fu(e),-A,A):0===e?e:0},dr.toString=qu,dr.toUpper=function(e){return qu(e).toUpperCase()},dr.trim=function(e,t,n){if((e=qu(e))&&(n||t===i))return e.replace(Ae,"");if(!e||!(t=Do(t)))return e;var r=Mn(e),o=Mn(t);return Go(r,_n(r,o),wn(r,o)+1).join("")},dr.trimEnd=function(e,t,n){if((e=qu(e))&&(n||t===i))return e.replace(Ue,"");if(!e||!(t=Do(t)))return e;var r=Mn(e);return Go(r,0,wn(r,Mn(t))+1).join("")},dr.trimStart=function(e,t,n){if((e=qu(e))&&(n||t===i))return e.replace(Ie,"");if(!e||!(t=Do(t)))return e;var r=Mn(e);return Go(r,_n(r,Mn(t))).join("")},dr.truncate=function(e,t){var n=S,r=P;if(Cu(t)){var o="separator"in t?t.separator:o;n="length"in t?Fu(t.length):n,r="omission"in t?Do(t.omission):r}var a=(e=qu(e)).length;if(kn(e)){var u=Mn(e);a=u.length}if(n>=a)return e;var l=n-Rn(r);if(l<1)return r;var c=u?Go(u,0,l).join(""):e.slice(0,l);if(o===i)return c+r;if(u&&(l+=c.length-l),Nu(o)){if(e.slice(l).search(o)){var s,f=c;for(o.global||(o=tt(o.source,qu(We.exec(o))+"g")),o.lastIndex=0;s=o.exec(f);)var p=s.index;c=c.slice(0,p===i?l:p)}}else if(e.indexOf(Do(o),l)!=l){var d=c.lastIndexOf(o);d>-1&&(c=c.slice(0,d))}return c+r},dr.unescape=function(e){return(e=qu(e))&&Oe.test(e)?e.replace(Ee,An):e},dr.uniqueId=function(e){var t=++st;return qu(e)+t},dr.upperCase=wl,dr.upperFirst=El,dr.each=qa,dr.eachRight=$a,dr.first=ga,Ml(dr,function(){var e={};return Yr(dr,function(t,n){ct.call(dr.prototype,n)||(e[n]=t)}),e}(),{chain:!1}),dr.VERSION="4.17.10",Yt(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){dr[e].placeholder=dr}),Yt(["drop","take"],function(e,t){yr.prototype[e]=function(n){n=n===i?1:$n(Fu(n),0);var r=this.__filtered__&&!t?new yr(this):this.clone();return r.__filtered__?r.__takeCount__=Vn(n,r.__takeCount__):r.__views__.push({size:Vn(n,D),type:e+(r.__dir__<0?"Right":"")}),r},yr.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),Yt(["filter","map","takeWhile"],function(e,t){var n=t+1,r=n==N||3==n;yr.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:Ui(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),Yt(["head","last"],function(e,t){var n="take"+(t?"Right":"");yr.prototype[e]=function(){return this[n](1).value()[0]}}),Yt(["initial","tail"],function(e,t){var n="drop"+(t?"":"Right");yr.prototype[e]=function(){return this.__filtered__?new yr(this):this[n](1)}}),yr.prototype.compact=function(){return this.filter(jl)},yr.prototype.find=function(e){return this.filter(e).head()},yr.prototype.findLast=function(e){return this.reverse().find(e)},yr.prototype.invokeMap=Oo(function(e,t){return"function"==typeof e?new yr(this):this.map(function(n){return ro(n,e,t)})}),yr.prototype.reject=function(e){return this.filter(uu(Ui(e)))},yr.prototype.slice=function(e,t){e=Fu(e);var n=this;return n.__filtered__&&(e>0||t<0)?new yr(n):(e<0?n=n.takeRight(-e):e&&(n=n.drop(e)),t!==i&&(n=(t=Fu(t))<0?n.dropRight(-t):n.take(t-e)),n)},yr.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},yr.prototype.toArray=function(){return this.take(D)},Yr(yr.prototype,function(e,t){var n=/^(?:filter|find|map|reject)|While$/.test(t),r=/^(?:head|last)$/.test(t),o=dr[r?"take"+("last"==t?"Right":""):t],a=r||/^find/.test(t);o&&(dr.prototype[t]=function(){var t=this.__wrapped__,u=r?[1]:arguments,l=t instanceof yr,c=u[0],s=l||mu(t),f=function(e){var t=o.apply(dr,en([e],u));return r&&p?t[0]:t};s&&n&&"function"==typeof c&&1!=c.length&&(l=s=!1);var p=this.__chain__,d=!!this.__actions__.length,h=a&&!p,v=l&&!d;if(!a&&s){t=v?t:new yr(this);var m=e.apply(t,u);return m.__actions__.push({func:La,args:[f],thisArg:i}),new mr(m,p)}return h&&v?e.apply(this,u):(m=this.thru(f),h?r?m.value()[0]:m.value():m)})}),Yt(["pop","push","shift","sort","splice","unshift"],function(e){var t=ot[e],n=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",r=/^(?:pop|shift)$/.test(e);dr.prototype[e]=function(){var e=arguments;if(r&&!this.__chain__){var o=this.value();return t.apply(mu(o)?o:[],e)}return this[n](function(n){return t.apply(mu(n)?n:[],e)})}}),Yr(yr.prototype,function(e,t){var n=dr[t];if(n){var r=n.name+"";(or[r]||(or[r]=[])).push({name:t,func:n})}}),or[hi(i,g).name]=[{name:"wrapper",func:i}],yr.prototype.clone=function(){var e=new yr(this.__wrapped__);return e.__actions__=ri(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=ri(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=ri(this.__views__),e},yr.prototype.reverse=function(){if(this.__filtered__){var e=new yr(this);e.__dir__=-1,e.__filtered__=!0}else(e=this.clone()).__dir__*=-1;return e},yr.prototype.value=function(){var e=this.__wrapped__.value(),t=this.__dir__,n=mu(e),r=t<0,o=n?e.length:0,i=function(e,t,n){for(var r=-1,o=n.length;++r<o;){var i=n[r],a=i.size;switch(i.type){case"drop":e+=a;break;case"dropRight":t-=a;break;case"take":t=Vn(t,e+a);break;case"takeRight":e=$n(e,t-a)}}return{start:e,end:t}}(0,o,this.__views__),a=i.start,u=i.end,l=u-a,c=r?u:a-1,s=this.__iteratees__,f=s.length,p=0,d=Vn(l,this.__takeCount__);if(!n||!r&&o==l&&d==l)return Ho(e,this.__actions__);var h=[];e:for(;l--&&p<d;){for(var v=-1,m=e[c+=t];++v<f;){var y=s[v],g=y.iteratee,b=y.type,_=g(m);if(b==R)m=_;else if(!_){if(b==N)continue e;break e}}h[p++]=m}return h},dr.prototype.at=Fa,dr.prototype.chain=function(){return za(this)},dr.prototype.commit=function(){return new mr(this.value(),this.__chain__)},dr.prototype.next=function(){this.__values__===i&&(this.__values__=zu(this.value()));var e=this.__index__>=this.__values__.length;return{done:e,value:e?i:this.__values__[this.__index__++]}},dr.prototype.plant=function(e){for(var t,n=this;n instanceof vr;){var r=fa(n);r.__index__=0,r.__values__=i,t?o.__wrapped__=r:t=r;var o=r;n=n.__wrapped__}return o.__wrapped__=e,t},dr.prototype.reverse=function(){var e=this.__wrapped__;if(e instanceof yr){var t=e;return this.__actions__.length&&(t=new yr(this)),(t=t.reverse()).__actions__.push({func:La,args:[Ca],thisArg:i}),new mr(t,this.__chain__)}return this.thru(Ca)},dr.prototype.toJSON=dr.prototype.valueOf=dr.prototype.value=function(){return Ho(this.__wrapped__,this.__actions__)},dr.prototype.first=dr.prototype.head,Dt&&(dr.prototype[Dt]=function(){return this}),dr}();Mt._=In,(o=function(){return In}.call(t,n,t,r))===i||(r.exports=o)}).call(this)}).call(this,n(17),n(27)(e))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){return e&&e.__esModule?e:{default:e}}(n(36)),o=n(19);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n=(0,r.default)({},e);switch(t.type){case o.RECEIVE_HOMES:return t.homes;case o.RECEIVE_HOME:var i=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},t.home.id,t.home);return(0,r.default)(n,i);default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=function(e){return e&&e.__esModule?e:{default:e}}(n(180));t.default=(0,r.combineReducers)({session:o.default})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(13),o=[];t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_ERRORS:return t.errors;case r.RECEIVE_CURRENT_USER:return o;default:return e}}},function(e,t,n){(function(e){!function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function i(e,t){i.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function a(e,t){a.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function u(e,t,n){u.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function l(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function c(e){var t=void 0===e?"undefined":E(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function s(e,t,n,r,f,p,d){f=f||[],d=d||[];var h=f.slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":E(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var v=r.normalize(h,p,e,t);v&&(e=v[0],t=v[1])}}}h.push(p)}"regexp"===c(e)&&"regexp"===c(t)&&(e=e.toString(),t=t.toString());var m=void 0===e?"undefined":E(e),y=void 0===t?"undefined":E(t),g="undefined"!==m||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),b="undefined"!==y||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!g&&b)n(new i(h,t));else if(!b&&g)n(new a(h,e));else if(c(e)!==c(t))n(new o(h,e,t));else if("date"===c(e)&&e-t!=0)n(new o(h,e,t));else if("object"===m&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var _;for(e.length,_=0;_<e.length;_++)_>=t.length?n(new u(h,_,new a(void 0,e[_]))):s(e[_],t[_],n,r,h,_,d);for(;_<t.length;)n(new u(h,_,new i(void 0,t[_++])))}else{var w=Object.keys(e),x=Object.keys(t);w.forEach(function(o,i){var a=x.indexOf(o);a>=0?(s(e[o],t[o],n,r,h,o,d),x=l(x,a)):s(e[o],void 0,n,r,h,o,d)}),x.forEach(function(e){s(void 0,t[e],n,r,h,e,d)})}d.length=d.length-1}else e!==t&&("number"===m&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],s(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,i=n.path?n.path.length-1:0;++o<i;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],a=r.path.length-1;for(o=0;o<a;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":delete i[r.path[o]];break;case"E":case"N":i[r.path[o]]=r.rhs}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":t=l(t,n);break;case"E":case"N":t[n]=r.rhs}return t}(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function d(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=function(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+i+"]",a];default:return[]}}(e);n.log.apply(n,["%c "+k[t].text,function(e){return"color: "+k[e].color+"; font-weight: bold"}(t)].concat(x(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function h(e,t,n,r){switch(void 0===e?"undefined":E(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,x(n)):e[r];case"function":return e(t);default:return e}}function v(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,i=void 0===o?function(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+r),n&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}(t):o,a=t.collapsed,u=t.colors,l=t.level,c=t.diff,s=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,v=o.startedTime,m=o.action,y=o.prevState,g=o.error,b=o.took,w=o.nextState,E=e[f+1];E&&(w=E.prevState,b=E.started-p);var x=r(m),O="function"==typeof a?a(function(){return w},m,o):a,k=_(v),C=u.title?"color: "+u.title(x)+";":"",S=["color: gray; font-weight: lighter;"];S.push(C),t.timestamp&&S.push("color: gray; font-weight: lighter;"),t.duration&&S.push("color: gray; font-weight: lighter;");var P=i(x,k,b);try{O?u.title&&s?n.groupCollapsed.apply(n,["%c "+P].concat(S)):n.groupCollapsed(P):u.title&&s?n.group.apply(n,["%c "+P].concat(S)):n.group(P)}catch(e){n.log(P)}var j=h(l,x,[y],"prevState"),T=h(l,x,[x],"action"),N=h(l,x,[g,y],"error"),R=h(l,x,[w],"nextState");if(j)if(u.prevState){var M="color: "+u.prevState(y)+"; font-weight: bold";n[j]("%c prev state",M,y)}else n[j]("prev state",y);if(T)if(u.action){var A="color: "+u.action(x)+"; font-weight: bold";n[T]("%c action    ",A,x)}else n[T]("action    ",x);if(g&&N)if(u.error){var I="color: "+u.error(g,y)+"; font-weight: bold;";n[N]("%c error     ",I,g)}else n[N]("error     ",g);if(R)if(u.nextState){var U="color: "+u.nextState(w)+"; font-weight: bold";n[R]("%c next state",U,w)}else n[R]("next state",w);c&&d(y,w,n,O);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function m(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},C,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,u=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var l=[];return function(e){var n=e.getState;return function(e){return function(c){if("function"==typeof i&&!i(n,c))return e(c);var s={};l.push(s),s.started=w.now(),s.startedTime=new Date,s.prevState=r(n()),s.action=c;var f=void 0;if(a)try{f=e(c)}catch(e){s.error=o(e)}else f=e(c);s.took=w.now()-s.started,s.nextState=r(n());var p=t.diff&&"function"==typeof u?u(n,c):t.diff;if(v(l,Object.assign({},t,{diff:p})),l.length=0,s.error)throw s.error;return f}}}}var y,g,b=function(e,t){return function(e,t){return new Array(t+1).join(e)}("0",t-e.toString().length)+e},_=function(e){return b(e.getHours(),2)+":"+b(e.getMinutes(),2)+":"+b(e.getSeconds(),2)+"."+b(e.getMilliseconds(),3)},w="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},x=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},O=[];y="object"===(void 0===e?"undefined":E(e))&&e?e:"undefined"!=typeof window?window:{},(g=y.DeepDiff)&&O.push(function(){void 0!==g&&y.DeepDiff===f&&(y.DeepDiff=g,g=void 0)}),n(o,r),n(i,r),n(a,r),n(u,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:s,enumerable:!0},applyDiff:{value:function(e,t,n){e&&t&&s(e,t,function(r){n&&!n(e,t,r)||p(e,t,r)})},enumerable:!0},applyChange:{value:p,enumerable:!0},revertChange:{value:function(e,t,n){if(e&&t&&n&&n.kind){var r,o,i=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===i[n.path[r]]&&(i[n.path[r]]={}),i=i[n.path[r]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],a=r.path.length-1;for(o=0;o<a;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":case"E":i[r.path[o]]=r.lhs;break;case"N":delete i[r.path[o]]}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":case"E":t[n]=r.lhs;break;case"N":t=l(t,n)}return t}(i[n.path[r]],n.index,n.item);break;case"D":case"E":i[n.path[r]]=n.lhs;break;case"N":delete i[n.path[r]]}}},enumerable:!0},isConflict:{value:function(){return void 0!==g},enumerable:!0},noConflict:{value:function(){return O&&(O.forEach(function(e){e()}),O=null),f},enumerable:!0}});var k={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},C={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},S=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?m()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=C,t.createLogger=m,t.logger=S,t.default=S,Object.defineProperty(t,"__esModule",{value:!0})}(t)}).call(this,n(17))}]);
//# sourceMappingURL=bundle.js.map
;
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//





;
