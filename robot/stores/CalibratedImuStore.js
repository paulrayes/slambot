var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ImuStore = require('../hardware/imu');
var io = require('./../socket');

var CALIBRATE_COUNT = 200;
var index = 0;
var latestData = null;
var avg = {
	accel: {x: 0, y: 0, z: 0}
};

var CalibratedImuStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return latestData;
	}
});

ImuStore.on('change', function() {
	// New latest data point
	index++;

	latestData = ImuStore.getAll();

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

	avg.accel.x += latestData.accel.x;
	avg.accel.y += latestData.accel.y;
	avg.accel.z += latestData.accel.z;

	if (index === CALIBRATE_COUNT) {
		avg.accel.x /= CALIBRATE_COUNT;
		avg.accel.y /= CALIBRATE_COUNT;
		avg.accel.z /= CALIBRATE_COUNT;
		console.log('Accelerometer calibrated, offsets: ', avg.accel.x, avg.accel.y, avg.accel.z);
		//index = 0;
		//avg.accel = {x: 0,y:0,z:0};
		setTimeout(sendToBrowser, 500);
	}
});

var sendToBrowser = function() {
	io.sockets.emit('imu:update', latestData);
	setTimeout(sendToBrowser, 500);
};

module.exports = CalibratedImuStore;
