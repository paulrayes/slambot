var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ImuStore = require('./CalibratedImuStore');
var io = require('./../socket');

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

//var prevSpeedLength = 0;
//var prevHeading = 0;

var SpeedStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return speed;
	}
});

ImuStore.on('change', function() {
	// New latest data point
	var prevIndex = index;
	index = (++index) % 30;

	var data = ImuStore.getAll();
	var accel = data.accelTranslated;
	//accel.length = Math.sqrt(Math.pow(accel.x, 2) + Math.pow(accel.y, 2));
	//accel.x = accel.length * Math.cos(accel.heading)
	accelerations[index] = accel;

	var prev = accelerations[prevIndex];
	//var accel = accelerations[index];
	//console.log(accel);process.exit();
	var deltaT = (accel.us - prev.us)/1e9;

	if (isNaN(deltaT)) {
		// First sample
		setTimeout(sendToBrowser, 500);
		return;
	}

	/*speed = {
		x: speed.x + prev.x + (accel.x - prev.x)/2*deltaT,
		y: speed.y + prev.y + (accel.y - prev.y)/2*deltaT,
		us: accel.us
	};*/


	speed.us = accel.us;

	if (accel.x === 0) {
		zeroCount.x++;
	} else {
		zeroCount.x = 0;
	}
	if (zeroCount.x >= 25) {
		speed.x = 0;
		speed.y = 0;
	} else {
		speed.x = speed.x + (accel.x + prev.x)/2*deltaT;
	}

	if (accel.y === 0) {
		zeroCount.y++;
	} else {
		zeroCount.y = 0;
	}
	if (zeroCount.y >= 25) {
		speed.x = 0;
		speed.y = 0;
	} else {
		speed.y = speed.y + (accel.y + prev.y)/2*deltaT
	}

	speed.length = Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2));
	//console.log(data.heading, speed.length);
	speed.x = speed.length * Math.cos(data.heading);
	speed.y = speed.length * Math.sin(data.heading);

	//speed = newSpeed;
	//console.log(speed.x, speed.y);
	//console.log(zeroCount.x, zeroCount.y);
	SpeedStore.emit('change');
	if (index == 0) {
		//process.exit();
	}
});

var sendToBrowser = function() {
	io.sockets.emit('speed:update', speed);
	setTimeout(sendToBrowser, 500);
};

module.exports = SpeedStore;
