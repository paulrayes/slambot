(function() {
	'use strict';

	// Require our dependencies
	var socketio = require('socket.io');
	var b = require('bonescript');
	//var os = require('os');
	//var usage = require('usage');

	// Set up socket.io
	var port = 8080; // What port the server should run on
	var io = socketio.listen(port);

	io.configure(function(){
		io.set('transports', [             // disable all transports except websocket
			'websocket'//, 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
		]);
	});

	io.sockets.on('connection', function(socket) {
		console.log('Socket connection established');
		//emitLoad(0);
	});

	// Set our status/load/heartbeat pin as an output
	var led = 'USR0';
	b.pinMode(led, 'out');

	// Every five seconds send the CPU/memory usage out on the socket
	/*var pid = process.pid;
	var emitLoad = function(load) {
		usage.lookup(pid, { keepHistory: true }, function(err, result) {
			io.sockets.emit('load', {
				cpu: result.cpu,
				memory: result.memory,
				load: load
			});
		});
	};
	setInterval(function() {
		b.digitalWrite(led, 1);

		// Get the load
		var load = os.loadavg()[0];
		console.log('Load: ' + load);

		emitLoad(load);

		// This is a single core, shouldn't go above 2, but just in case...
		if (load > 2) {
			load = 2;
		}

		setTimeout(function() {
			b.digitalWrite(led, 0);
		}, load/2*5000);
	}, 5000);*/

	// Require our motors module, it handles all things motors
	require('./hardware/motors')(io, b);
}());