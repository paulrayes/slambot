// File that determines the speed of the robot based on its heading.
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// Calling CalibratedImuStore.js and socket.js
var ImuStore = require('./CalibratedImuStore');
var io = require('./../socket');

// Initializing variables
var initialSpeed = {
	x: 0,
	y: 0
};
var speed = {
	x: 0,
	y: 0
};
var zeroCount = {
	x: 0,
	y: 0
};

// Array of latest five acceleration readings
// Access circularly
var accelerations = [{},{},{},{},{}];
var index = 0;

// Creating an object from an event
var SpeedStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return speed;
	}
});


ImuStore.on('change', function() {
	// New latest data point
	var prevIndex = index;
	index = (++index) % 30;

	// Assigning objects
	var data = ImuStore.getAll();
	var accel = data.accelTranslated;
	accelerations[index] = accel;
	var prev = accelerations[prevIndex];
	var deltaT = (accel.us - prev.us)/1e9;

	if (isNaN(deltaT)) {
		// First sample
		setTimeout(sendToBrowser, 500);
		return;
	}

	speed.us = accel.us;

	// If statement that increment the count based on the 
	// value of acceleration in the x-direction
	if (accel.x === 0) {
		zeroCount.x++;
	} else {
		zeroCount.x = 0;
	}

	// If the count is greater or equal to 25, set the speed
	// of both x and y to zero, else perform arithmetic to determine
	// new value of the speed (x-direction).
	if (zeroCount.x >= 25) {
		speed.x = 0;
		speed.y = 0;
	} else {
		speed.x = speed.x + (accel.x + prev.x)/2*deltaT;
	}

	// If statement that increment the count based on the 
	// value of acceleration in the y-direction
	if (accel.y === 0) {
		zeroCount.y++;
	} else {
		zeroCount.y = 0;
	}

	// If the count is greater or equal to 25, set the speed
	// of both x and y to zero, else perform arithmetic to determine
	// new value of the speed (y-direction).
	if (zeroCount.y >= 25) {
		speed.x = 0;
		speed.y = 0;
	} else {
		speed.y = speed.y + (accel.y + prev.y)/2*deltaT
	}

	// Arithmetic that determines new value of speed using pythagorean theorem
	speed.length = Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2));
	speed.x = speed.length * Math.cos(data.heading);
	speed.y = speed.length * Math.sin(data.heading);

	SpeedStore.emit('change');
	if (index == 0) {
	}
});

// Update and sends to browser every 500ms
var sendToBrowser = function() {
	io.sockets.emit('speed:update', speed);
	setTimeout(sendToBrowser, 500);
};

module.exports = SpeedStore;
