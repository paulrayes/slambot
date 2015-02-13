var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var data = {
	accel: {
		x: 0,
		y: 0,
		z: 0
	},
	accelTranslated: {
		x: 0,
		y: 0
	},
	mag: {
		x: 0,
		y: 0,
		z: 0
	},
	heading: 0,
	temp: 0,
	gyro: {
		x: 0,
		y: 0,
		z: 0
	}
};

var ImuStore = assign({}, EventEmitter.prototype, {
	data: data
});

socket.on('imu:update', function(newData) {
	ImuStore.data = newData;
	ImuStore.emit('change');
});

module.exports = ImuStore;
