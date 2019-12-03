from .._version import __version__

def _jupyter_server_extension_paths():
    # path to file containing function load_jupyter_server_extension
    return [{'module': 'shaofengwidget.shaofeng_serverextension.server_extension'}]
