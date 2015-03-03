'use strict';

// The algorithm for calculating the estimated position from accelerometer data
// is from the Freescale Semiconductor Application Note titled "Implementing
// Positioning Algorithms Using Accelerometers":
// http://cache.freescale.com/files/sensors/doc/app_note/AN3397.pdf

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var SpeedStore = require('./SpeedStore');
var io = require('./../socket');

var initialPosition = {
	x: 0,
	y: 0
};
var position = {
	x: 0,
	y: 0
};

// Array of latest three speed readings
// Access circularly
var speeds = [{x:0,y:0},{x:0,y:0},{x:0,y:0}];
var index = 0;

var PositionStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return position;
	}
});

SpeedStore.on('change', function() {
	// New latest data point
	var prevIndex = index;
	index = (++index) % 3;

	speeds[index] = SpeedStore.getAll();

	var prev = speeds[prevIndex];
	var speed = speeds[index];
	//console.log(accel);process.exit();
	var deltaT = (speed.us - prev.us)/1e9;

	if (isNaN(deltaT)) {
		// First sample
		setTimeout(sendToBrowser, 500);
		return;
	}

	position.x = position.x + prev.x + (speed.x - prev.x)/2*deltaT;
	position.y = position.y + prev.y + (speed.y - prev.y)/2*deltaT;
	position.us = speed.us;
	//console.log(index, position.x, position.y);
	PositionStore.emit('change');
});

var sendToBrowser = function() {
	io.sockets.emit('estimatedPosition:update', position);
	setTimeout(sendToBrowser, 100);
};

module.exports = PositionStore;
