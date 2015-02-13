var socketio = require('socket.io');

// Set up socket.io
var port = 8080; // What port the server should run on
var io = socketio.listen(port);

io.sockets.on('connection', function(socket) {
	console.log('Socket connection established');
	//emitLoad();
});

module.exports = io;