// create a new Python subprocess
var py = new Worker('py_worker.js');

// when a message is received from the main thread, pass it to Python
onmessage = function(event) {
  py.postMessage(event.data);
};

// when a message is received from Python, send it back to the main thread
py.onmessage = function(event) {
  postMessage(event.data);
};

// load the Python script
py.importScripts('gobang_ai.py');
