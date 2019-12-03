define(function() { return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
__webpack_require__.p = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/shaofengwidget';


// Configure requirejs
if (window.require) {
    window.require.config({
        map: {
            "*" : {
                "shaofengwidget": "nbextensions/shaofengwidget/index",
            }
        }
    });
}

function setup_extension(Jupyter) {
    window.addEventListener("message", function(ev) {
        if (ev && typeof(ev.data) === "string" && ev.data.length > 0) {
            msg = JSON.parse(ev.data);
            if (msg && msg.type === "shaofeng_input_response") {
                Jupyter.notebook.kernel.send_input_reply(msg.value);
            }
        }
    });

    let proto = Object.getPrototypeOf(Jupyter.notebook.kernel);
    if (!proto._shaofeng_saved_handle_input_request) {
        proto._shaofeng_saved_handle_input_request = proto._handle_input_request;
        proto._handle_input_request = function(request) {
            var header = request.header;
            var content = request.content;
            var msg_type = header.msg_type;
            if (msg_type !== 'input_request') {
                console.log("Invalid input request!", request);
                return;
            }

            var prefix = "Outer:";
            if (content && 
                typeof(content.prompt) === "string" &&
                content.prompt.substr(0, prefix.length) === prefix) {
                
                var msgToParent = {
                    type: "shaofeng_input_request",
                    value: content.prompt.substr(prefix.length)
                };

                window.parent.postMessage(JSON.stringify(msgToParent), "*");
            }
            else {
                this._shaofeng_saved_handle_input_request(request);
            }
        }
    }
}

function load_extension() {
    requirejs(["base/js/namespace", "base/js/events"], 
        function(Jupyter, events) {
            if (Jupyter.notebook.kernel) {
                setup_extension(Jupyter);
            }
            else {
                events.on('kernel_ready.Kernel', 
                    function() {
                        setup_extension(Jupyter);
                    });
            }
        }
    );
}

// Export the required load_ipython_extension
module.exports = {
    load_ipython_extension: load_extension
};


/***/ })
/******/ ])});;