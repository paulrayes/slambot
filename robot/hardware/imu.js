'use strict';

//var sclPin = 'P9_19';
//var sdaPin = 'P9_20';

var gyroAddress = 0x6B;
var device = '/dev/i2c-1';

// Find your magnetic declination at http://www.magnetic-declination.com
var magneticDeclination = {
	degrees: 10,
	feet: 41,
	seconds: 0
};

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var b = require('bonescript');
var i2c = require('i2c');
var lsm303 = new (require('lsm303'))();

var io = require('./../socket');

//var accel = lsm303.accelerometer({resolution: 2});
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
		x: twosComplement((buffer[1] << 8) | buffer[0], 16) * 0.00875,
		z: twosComplement((buffer[3] << 8) | buffer[2], 16) * 0.00875,
		y: twosComplement((buffer[5] << 8) | buffer[4], 16) * 0.00875
	};
	return pos;
};

// Calculate magnetic declination in degrees
magneticDeclination = magneticDeclination.degrees + (magneticDeclination.feet * 60 + magneticDeclination.seconds) / 3600;

var magCal = {
	x: {
		min: 0,
		max: 0
	},
	y: {
		min: 0,
		max: 0
	},
	z: {
		min: 0,
		max: 0
	}
};

function pad(num, size) {
	num = Math.round(num);
	if (num < 0) {
		num = -num;
		return '-' + ('000000000' + num).substr(-size);
	} else {
		return ' ' + ('000000000' + num).substr(-size);
	}

}

var Imu = function() {
	/*var gyroWire = new i2c(gyroAddress, {device: device});

	// Check if we have the gyro connected
	gyroWire.writeByte(0x0F, function(err) {
		if (err) {
			console.log('Could not connect to the gyro');
		} else {
			gyroWire.readByte(function(err, data) {
				if (err) {
					console.log('Could not read WhoAmI from the gyro');
				} else if (data === 15) {
					// Found gyro, display no message on success
					//console.log('Found gyro.');
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
	});*/

	this.getData = function(next) {
		var data = {
			accel: false,
			mag: false,
			heading: false,
			temp: false,
			gyro: false
		};
		var totalDone = 0;
		var TOTAL_COUNT = 1;
		/*accel.readAxes(function(err, axes) {
			if (err) {
				console.log('Error reading Accelerometer Axes : ' + err);
				next(err);
			} else {
				var hrTime = process.hrtime()
				axes.us = (hrTime[0] * 1000000) + (hrTime[1] / 1000);
				// Range is +/-16 G, high resolution enabled
				// One LSB is 12 mG according to the datasheet
				// 1 G = 9.80665 m/s2 according to Wikipedia
				axes.x = axes.x * 0.04;// * 9.80665;
				axes.y = axes.y * 0.04;// * 9.80665;
				axes.z = axes.z * 0.04;// * 9.80665;
				data.accel = axes;
				totalDone++;
				if (totalDone >= TOTAL_COUNT) {
					next(null, data);
				}
			}
		});*/

		mag.readAxes(function(err, axes) {
			if (err) {
				console.log('Error reading Magnetometer Axes : ' + err);
				next(err);
			} else {
				var hrTime = process.hrtime()
				axes.us = (hrTime[0] * 1000000) + (hrTime[1] / 1000);

				// Calibration algorithm from:
				// http://www.camelsoftware.com/firetail/blog/uavs/3-axis-magnetometer-calibration-a-simple-technique-for-hard-soft-errors/

				// Update calibration numbers if necessary
				// Calibrating continuously because we can
				if (axes.x > magCal.x.max) {
					magCal.x.max = axes.x;
				} else if (axes.x < magCal.x.min) {
					magCal.x.min = axes.x;
				}
				magCal.x.avg = (magCal.x.max + magCal.x.min) / 2;

				if (axes.y > magCal.y.max) {
					magCal.y.max = axes.y;
				} else if (axes.y < magCal.y.min) {
					magCal.y.min = axes.y;
				}
				magCal.y.avg = (magCal.y.max + magCal.y.min) / 2;

				if (axes.z > magCal.z.max) {
					magCal.z.max = axes.z;
				} else if (axes.x < magCal.z.min) {
					magCal.z.min = axes.z;
				}
				magCal.z.avg = (magCal.z.max + magCal.z.min) / 2;

				magCal.avgDistance = (Math.abs(magCal.x.avg) + Math.abs(magCal.y.avg) + Math.abs(magCal.z.avg)) / 2;
				magCal.x.scale = magCal.avgDistance / Math.abs(magCal.x.avg);
				magCal.y.scale = magCal.avgDistance / Math.abs(magCal.y.avg);
				magCal.z.scale = magCal.avgDistance / Math.abs(magCal.z.avg);

				axes.x = (axes.x - magCal.x.avg) * magCal.x.scale;
				axes.y = (axes.y - magCal.y.avg) * magCal.y.scale;
				axes.z = (axes.z - magCal.z.avg) * magCal.z.scale;

				data.mag = axes;

				// Calculate heading
				data.heading = Math.atan2(axes.y, axes.x) * 180 / Math.PI;
				data.heading += magneticDeclination; // Correct for location on Earth
				data.heading -= 90; // Correct for mounting position of sensor
				if (data.heading < -180) {
					data.heading += 360;
				}

				totalDone++;
				if (totalDone >= TOTAL_COUNT) {
					next(null, data);
				}
			}
		});

		/*mag.readTemp(function(err, temp) {
			if (err) {
				console.log('Error reading Temperature : ' + err);
				next(err);
			} else {
				data.temp = temp.temp;
				totalDone++;
				if (totalDone >= TOTAL_COUNT) {
					next(null, data);
				}
			}
		});*/

		/*gyroWire.readBytes(0x28 | (1 << 7), 6, function(err, res) {
			if (err) {
				console.log('Error reading Gyro Axes : ' + err);
				next(err);
			} else {
				var axes = buffToXYZGyro(res);
				data.gyro = axes;
				totalDone++;
				if (totalDone >= TOTAL_COUNT) {
					next(null, data);
				}
			}
		});*/
	};
};

var imu = new Imu();
var latestData = null;

var ImuStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return latestData;
	}
});

var refresh = function() {
	imu.getData(function(err, data) {
		//console.log(pad(data.accel.x*100, 4), pad(data.accel.y*100,4));

		latestData = data;
		ImuStore.emit('change');
		io.sockets.emit('imu:update', latestData);
	});
	setTimeout(refresh, 100);
};

setTimeout(refresh, 250);

module.exports = ImuStore;
