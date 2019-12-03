// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
__webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/shaofengwidget';


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
