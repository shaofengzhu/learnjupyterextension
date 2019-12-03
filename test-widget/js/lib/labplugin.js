var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'shaofengwidget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'shaofengwidget',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

