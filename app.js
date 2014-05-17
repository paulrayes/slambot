var express = require('express');
var socketio = require('socket.io');
var b = require('bonescript');

var port = 8080;

// Setup the Express app and start the server
// This is used to serve all the static content in the public folder
var app = express();
app.use(express.static(__dirname + '/public'));
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});

// Setup socket.io on the existing server
var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

// Flash USR0 led for funsies
var led = 'USR0';
b.pinMode(led, 'out');
b.digitalWrite(led, 1);
setTimeout(function() {
	b.digitalWrite(led, 0);
}, 1000);
