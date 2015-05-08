'use strict';

// The algorithm for calculating the estimated position from accelerometer data
// is from the Freescale Semiconductor Application Note titled "Implementing
// Positioning Algorithms Using Accelerometers":
// http://cache.freescale.com/files/sensors/doc/app_note/AN3397.pdf

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var MAX_SPEED = 50;

//var SpeedStore = require('./SpeedStore');
var io = require('../socket');
var motors = require('../hardware/motors');

var initialPosition = require('../config').initialPosition;
var position = {
	x: initialPosition.x,
	y: initialPosition.y,
	heading: 0
};

// Array of latest three speed readings
// Access circularly
var speeds = [{x:0,y:0},{x:0,y:0},{x:0,y:0}];
var index = 0;

var PositionStore = assign({}, EventEmitter.prototype, {
	setEstimate: function(newPosition) {
		position.x = newPosition.x;
		position.y = newPosition.y;
		position.heading = newPosition.heading;
	},
	getAll: function() {
		return position;
	}
});

//var previousDirection = 0;
var previousSpeedLeft = 0;
var previousSpeedRight = 0;
var oldTime = Date.now();
var theta = 0;
var distanceX  = position.x;
var distanceY = position.y;
var readingCount = 0;
//var previousImuHeading = 0;
function recalculate() {
	var newTime = Date.now();
	var deltaTime = newTime - oldTime;
	oldTime = newTime;

	//var newHeading = imu.getAll().heading;
	//var avgHeading = (previousImuHeading + avgHeading) / 2;

	var deltaLeft = previousSpeedLeft * deltaTime / 3000;
	var deltaRight = previousSpeedRight * deltaTime / 3000;
	var deltaCenter = (deltaRight + deltaLeft) / 2;

	var deltaTheta = (deltaRight - deltaLeft) * 2;
	position.heading = position.heading + deltaTheta;

	var deltaDistanceX = deltaCenter * Math.sin(position.heading*Math.PI/180);
	var deltaDistanceY = deltaCenter * Math.cos(position.heading*Math.PI/180);
	position.x = position.x - deltaDistanceX;
	position.y = position.y + deltaDistanceY;

	//console.log(deltaTheta, distanceX, distanceY);

	previousSpeedLeft = motors.left.desiredSpeed / 100 * MAX_SPEED;
	previousSpeedRight = motors.right.desiredSpeed / 100 * MAX_SPEED;

	if (position.x !== distanceX || position.y !== distanceY || position.heading !== theta) {
		distanceX = position.x;// = distanceX;
		distanceY = position.y;// = distanceY;
		theta = position.heading;// = theta;
		PositionStore.emit('change');
		io.sockets.emit('estimatedPosition:update', position);
	}
	setTimeout(recalculate, 100);
}
//motors.on('change', recalculate);
setTimeout(recalculate, 100);

/*SpeedStore.on('change', function() {
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
});*/

/*var previousBrowserPosition = {
	x: -1,
	y: -1
};
var sendToBrowser = function() {
	if (previousBrowserPosition.x !== position.x || previousBrowserPosition.y !== position.y) {
		previousBrowserPosition.x = position.x;
		previousBrowserPosition.y = position.y;
		io.sockets.emit('estimatedPosition:update', position);
	}
	setTimeout(sendToBrowser, 100);
};

setTimeout(sendToBrowser, 500);*/

module.exports = PositionStore;
