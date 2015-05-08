// Creating an event
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// Requires imu.js and socket.js to run
var ImuStore = require('../hardware/imu');
var io = require('./../socket');

// Initializing variables
var CALIBRATE_COUNT = 200;
var index = 0;
var latestData = null;
var avg = {
	accel: {x: 0, y: 0, z: 0}
};

// Creating an object form an event
var CalibratedImuStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return latestData;
	}
});


ImuStore.on('change', function() {
	// New latest data point
	index++;

	latestData = ImuStore.getAll();

	// If statements that tests the value of the acceleration in 
	// three directions(x, y, z) and assigning it zero if the 
	// value of the acceleration is between -0.1 to 0.1
	if (index > CALIBRATE_COUNT) {
		latestData.accel.x -= avg.accel.x;
		latestData.accel.y -= avg.accel.y;
		latestData.accel.z -= avg.accel.z;
		if (latestData.accel.x > -0.1 && latestData.accel.x < 0.1) {
			latestData.accel.x = 0;
		}
		if (latestData.accel.y > -0.1 && latestData.accel.y < 0.1) {
			latestData.accel.y = 0;
		}
		if (latestData.accel.z > -0.1 && latestData.accel.z < 0.1) {
			latestData.accel.z = 0;
		}

		// Arithmetics that determine the acceleration, and the current heading
		var accel = Math.sqrt(Math.pow(latestData.accel.x, 2) + Math.pow(latestData.accel.y, 2));
		var accelHeading = Math.atan2(latestData.accel.y, latestData.accel.x);
		accelHeading = latestData.heading + accelHeading;
		latestData.accelTranslated = {
			x: accel * Math.cos(accelHeading),
			y: accel * Math.sin(accelHeading),
			us: latestData.accel.us
		};

		return CalibratedImuStore.emit('change');
	}

	// Updating the value of acceleration in three directions (x, y, z)
	avg.accel.x += latestData.accel.x;
	avg.accel.y += latestData.accel.y;
	avg.accel.z += latestData.accel.z;

	// If statement that computes the value of acceleration based on the current
	// value of index, this if statement executes every 500ms and sends the value 
	// to browser.
	if (index === CALIBRATE_COUNT) {
		avg.accel.x /= CALIBRATE_COUNT;
		avg.accel.y /= CALIBRATE_COUNT;
		avg.accel.z /= CALIBRATE_COUNT;
		console.log('Accelerometer calibrated, offsets: ', avg.accel.x, avg.accel.y, avg.accel.z);
		setTimeout(sendToBrowser, 500);
	}
});

//Sends to browser every 500ms.
var sendToBrowser = function() {
	io.sockets.emit('imu:update', latestData);
	setTimeout(sendToBrowser, 500);
};

module.exports = CalibratedImuStore;
