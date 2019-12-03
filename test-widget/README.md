Learn Jupyter Extension and Widget
===============================

## Install
```console
pushd js
npm run build
popd

python setup.py sdist
pip install dist\shaofengwidget-0.1.0a0.tar.gz
```

## Test
```console
cd pages
http-server

cd notebooks
jupyter notebook
```
Then browse to http://localhost:8080/jupyter-embed.html


Shaofeng Test Widget

Installation
------------

To install use pip:

    $ pip install shaofengwidget
    $ jupyter nbextension enable --py --sys-prefix shaofengwidget

To install for jupyterlab

    $ jupyter labextension install shaofengwidget

For a development installation (requires npm),

    $ git clone https://github.com/Office Dev/test-widget.git
    $ cd test-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix shaofengwidget
    $ jupyter nbextension enable --py --sys-prefix shaofengwidget
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This take a minute or so to get started, but then allows you to hot-reload your javascript extension.
To see a change, save your javascript, watch the terminal for an update.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

