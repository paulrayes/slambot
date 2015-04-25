'use strict';

// Require our dependencies
var childProcess = require('child_process');
var b = require('bonescript');

childProcess.exec('service apache2 stop', function() {
	var io = require('./socket');

	// Set our status/load/heartbeat pin as an output
	var led = 'USR1';
	b.pinMode(led, 'out');
	var statusLight = 1;

	setInterval(function() {
		b.digitalWrite(led, statusLight);
		statusLight = 1 - statusLight;
	}, 3000);

	require('./hardware/lcd').init();
	require('./hardware/wifi');

	// Load our hardware modules
	//var lidar = undefined;
			//require('./hardware/pru');
			require('./stores/LoadStore');
			require('./hardware/motors');
			//var lidar = require('./hardware/lidar');
			//require('./hardware/oe');
			//require('./hardware/imu');

			// Load our higher-level modules
			require('./stores/EstimatedPositionStore');

	var firstSocketEstablished = false;
	io.sockets.on('connection', function(socket) {
		if (!firstSocketEstablished) {
			console.log('First socket connection established, starting all the things');
			firstSocketEstablished = true;

			// Load our higher-level modules
			//require('./stores/SpeedStore');
			//require('./stores/EstimatedPositionStore');
		} else {
			console.log('Socket connection established');
		}
	});

	function exitHandler(options, err) {
		if (typeof lidar !== 'undefined') {
			lidar.cleanup();
		}
		if (err) {
			console.log(err.stack);
		}
		if (options.exit) {
			process.exit();
		}
	}


	//do something when app is closing
	//process.on('exit', exitHandler.bind(null,{cleanup:true}));

	//catches ctrl+c event
	process.on('SIGINT', exitHandler.bind(null, {exit:true}));
	process.on('SIGTERM', exitHandler.bind(null, {exit:true}));

	//catches uncaught exceptions
	process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

	console.log('Robot started');
});
