
import os
from notebook.base.handlers import IPythonHandler
from notebook.utils import url_path_join

from tornado import web
import json

def customizeWebApp():
    app = web.Application()
    app.add_transform()

def load_jupyter_server_extension(nb_app):
    CONTENT_SECURITY_POLICY_HEADER_NAME = 'Content-Security-Policy'
    CONTENT_SECURITY_POLICY_HEADER_VALUE = 'frame-ancestors self http://localhost:8080'

    web_app = nb_app.web_app
    nb_app.log.info("update web_app.settings:")
    if 'headers' in web_app.settings and isinstance(web_app.settings['headers'], dict):
        if CONTENT_SECURITY_POLICY_HEADER_NAME not in web_app.settings['headers']:
            nb_app.log.info("shaofeng_serverextension add header Content-Security-Policy")
            web_app.settings["headers"][CONTENT_SECURITY_POLICY_HEADER_NAME] = CONTENT_SECURITY_POLICY_HEADER_VALUE
        else:
            nb_app.log.info("shaofeng_serverextension does not override Content-Security-Policy")
    else:
        nb_app.log.info("shaofeng_serverextension set headers with Content-Security-Policy")
        web_app.settings["headers"] = {CONTENT_SECURITY_POLICY_HEADER_NAME: CONTENT_SECURITY_POLICY_HEADER_VALUE}

    class CallbackHandler(IPythonHandler):
        """
        """

        def get(self, path):
            """
            """
            nb_app.log.info('in CallbackHandler with path={}'.format(path))
            self.write("This is Jupyter Excel")

    host_pattern = '.*$'
    base_url = web_app.settings['base_url']

    web_app.add_handlers(
        host_pattern,
        [
         (url_path_join(base_url, '/excel(.*)'), CallbackHandler),
         ]
    )

    nb_app.log.info("shaofeng_serverextension enabled")
