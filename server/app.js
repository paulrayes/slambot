var express = require('express');
var socketio = require('socket.io');
var b = require('bonescript');

var port = 8080;

// Setup the Express app and start the server
// This is used to serve all the static content in the public folder
var app = express();
app.use(express.static(__dirname + '/../public/build'));
app.disable('etag');
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});

// Setup socket.io on the existing server
global.io = socketio.listen(server);

global.io.sockets.on('connection', function(socket) {
	console.log('Socket connection established');
});

// Flash USR0 led for funsies
var led = 'USR0';
b.pinMode(led, 'out');
b.digitalWrite(led, 1);
setTimeout(function() {
	b.digitalWrite(led, 0);
}, 1000);

var motors = require('./hardware/motors')();
