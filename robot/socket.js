//var childProcess = require('child_process');
var socketio = require('socket.io');

// Set up socket.io
var port = 8080; // What port the server should run on
var io = socketio.listen(port, {
	transports: ['websocket']
});

module.exports = io;
