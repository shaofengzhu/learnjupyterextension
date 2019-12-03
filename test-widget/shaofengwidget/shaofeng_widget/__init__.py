from .example import *

def _jupyter_nbextension_paths():
    return [{
        # fixed syntax
        'section': 'notebook',
        # path relative to module directory - here: shaofeng_widget
        'src': 'static',
        # directory in the `nbextension/` namespace
        'dest': 'shaofengwidget',
        # path in the `nbextension/` namespace
        'require': 'shaofengwidget/extension'
    }]
