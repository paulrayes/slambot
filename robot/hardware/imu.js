'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var b = require('bonescript');
var i2c = require('i2c');
var lsm303 = new (require('lsm303'))();

var io = require('./../socket');

var accel = lsm303.accelerometer();
var mag = lsm303.magnetometer();

var twosComplement = function(value, numberOfBits) {
	var upper = Math.pow(2, numberOfBits);
	if (value > upper / 2) {
		return value - upper;
	}
	else {
		return value;
	}
};

var trueRound = function(value, digits) {
	var rounded = Math.round((value * Math.pow(10, digits)).toFixed(digits - 1));
	return parseFloat((rounded / Math.pow(10, digits)).toFixed(digits));
};

var buffToXYZGyro = function(buffer){
	var pos;
	pos = {
		x: trueRound(twosComplement((buffer[1] << 8) | buffer[0], 16) * 0.00875, 1),
		z: trueRound(twosComplement((buffer[3] << 8) | buffer[2], 16) * 0.00875, 1),
		y: trueRound(twosComplement((buffer[5] << 8) | buffer[4], 16) * 0.00875, 1)
	};
	return pos;
};

//var sclPin = 'P9_19';
//var sdaPin = 'P9_20';

var gyroAddress = 0x6B;
var device = '/dev/i2c-1';

var Imu = function() {
	var gyroWire = new i2c(gyroAddress, {device: device});

	// Check if we have the gyro connected
	gyroWire.writeByte(0x0F, function(err) {
		if (err) {
			console.log('Could not connect to the gyro');
		} else {
			gyroWire.readByte(function(err, data) {
				console.log(data.toString(16));
				if (err) {
					console.log('Could not read WhoAmI from the gyro');
				} else if (data === -44) {
					console.log('Found gyro.');
				} else {
					console.log('Found gyro but it did not reply with correct WhoAmI');
				}
			});
		}
	});

	// Switch gyro to normal mode and enable all three channels
	gyroWire.writeBytes(0x20, [0x0F], function(err) {
		if (err) {
			console.log('Could not enable the gyro.');
		}
	});

	this.getData = function(next) {
		var data = {
			accel: false,
			mag: false,
			heading: false,
			temp: false,
			gyro: false
		};
		var totalDone = 0;
		accel.readAxes(function(err, axes) {
			if (err) {
				console.log('Error reading Accelerometer Axes : ' + err);
				next(err);
			} else {
				// Range is +/-16 G, high resolution enabled
				// One LSB is 4 mG according to the datasheet
				// 1 G = 9.80665 m/s2 according to Wikipedia
				axes.x = axes.x * 0.4 * 9.80665;
				axes.y = axes.y * 0.4 * 9.80665;
				axes.z = axes.z * 0.4 * 9.80665;
				data.accel = axes;
				totalDone++;
				if (totalDone >= 4) {
					next(null, data);
				}
			}
		});

		mag.readAxes(function(err, axes) {
			if (err) {
				console.log('Error reading Magnetometer Axes : ' + err);
				next(err);
			} else {
				data.mag = axes;
				data.heading = Math.atan2(axes.y, axes.x) * 180 / Math.PI;
				data.heading = data.heading - 90; // Correct for mounting position of sensor
				totalDone++;
				if (totalDone >= 4) {
					next(null, data);
				}
			}
		});

		mag.readTemp(function(err, temp) {
			if (err) {
				console.log('Error reading Temperature : ' + err);
				next(err);
			} else {
				data.temp = temp.temp;
				totalDone++;
				if (totalDone >= 4) {
					next(null, data);
				}
			}
		});

		gyroWire.readBytes(0x28 | (1 << 7), 6, function(err, res) {
			if (err) {
				console.log('Error reading Gyro Axes : ' + err);
				next(err);
			} else {
				var axes = buffToXYZGyro(res);
				data.gyro = axes;
				totalDone++;
				if (totalDone >= 4) {
					next(null, data);
				}
			}
		});
	};
};

var imu = new Imu();
var latestData = null;

var ImuStore = assign({}, EventEmitter.prototype, {
	data: null,
	getAll: function() {
		return latestData;
	}
});

var refresh = function() {
	imu.getData(function(err, data) {
		var accel = Math.sqrt(Math.pow(data.accel.x, 2) + Math.pow(data.accel.y, 2));
		var accelHeading = Math.atan2(data.accel.y, data.accel.x);
		accelHeading = data.heading + accelHeading;
		data.accelTranslated = {
			x: accel * Math.cos(accelHeading),
			y: accel * Math.sin(accelHeading)
		};

		latestData = data;
		ImuStore.emit('change');
	});
	setTimeout(refresh, 10);
};

setTimeout(refresh, 250);

var sendToBrowser = function() {
	io.sockets.emit('imu:update', latestData);
	setTimeout(sendToBrowser, 1000);
};
setTimeout(sendToBrowser, 1000);

module.exports = ImuStore;
