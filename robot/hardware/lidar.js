'use strict';

var fs = require('fs');

var b = require('bonescript');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var SerialPort = require('serialport').SerialPort;

var io = require('../socket');

b.pinMode('P8_36', 'out');
b.digitalWrite('P8_36', 1);

var commands = {};
commands.STOP = new Buffer([0xA5, 0x25]);
commands.RESET = new Buffer([0xA5, 0x40]);
commands.SCAN = new Buffer([0xA5, 0x20]);
commands.FORCE_SCAN = new Buffer([0xA5, 0x21]);
commands.GET_INFO = new Buffer([0xA5, 0x50]);
commands.GET_HEALTH = new Buffer([0xA5, 0x51]);

var port = new SerialPort('/dev/ttyO5', {
	baudrate: 115200
	//buffersize: 8*1024,
	/*platformOptions: {
		vmin: 1000,
		vtime: 0
	}*/
});

var readingCount = 0;
var readings = [];
var latestData = null;

var scanStarted = false;
var packetSize = 5;
var arr = [];
function processData(buffer) {
	//if (!scanStarted && buffer.length === 7 && buffer[0] === 0xA5 && buffer[1] === 0x5A && buffer[2] === 0x05 && buffer[3] === 0x00 && buffer[4] === 0x00 && buffer[5] === 0x40 && buffer[6] === 0x81) {
	for (var i = 0; i < buffer.length; i++) {
		arr.push(buffer[i]);
	}
	if (!scanStarted) {
		var location = 0;
		while (location + 7 < arr.length && !scanStarted) {
			if (arr[location+0] === 0xA5 && arr[location+1] === 0x5A && arr[location+2] === 0x05 && arr[location+3] === 0x00 && arr[location+4] === 0x00 && arr[location+5] === 0x40 && arr[location+6] === 0x81) {
				console.log('lidar: scan started');
				scanStarted = true;
				location = location + 7;
				arr.splice(0, 7);
			} else {
				location++;
				arr.splice(0, 1);
			}
		}
	}
	//if (!scanStarted && buffer[0] === 0xA5 && buffer[1] === 0x5A && buffer[2] === 0x05 && buffer[3] === 0x00 && buffer[4] === 0x00 && buffer[5] === 0x40 && buffer[6] === 0x81) {
	//	console.log('lidar: scan started');
	//	scanStarted = true;
	//	return;
	//}
	if (scanStarted === true) {
		var location = 0;
		process.exit();
		while (location + packetSize < arr.length) {
			var newReading = (arr[location + 0] & 0x01);
			var notNewReading = ((arr[location + 0] & 0x02) >> 1);
			var check = (arr[location + 1] & 0x01) === 1;
			if ((newReading === notNewReading) || !check) {
				console.log('lidar: invalid data');
				return;
				//throw Error("lidar: invalid data");
			}

			if (newReading) {
				if (readings.length > 50) {
					readingCount++;
					if (readingCount > 1) {
						//console.log('lidar: ' + readings.length + ' readings in ' + readingCount);
						LidarStore.emit('change');
						io.sockets.emit('lidar:update', {
							count: readingCount,
							readings: readings
						});
					}
				}
				readings = [];
			}

			var distance = ((arr[location + 4] << 8) | arr[location + 3]) / 4;
			if (distance > 0) {
				var angle = ((arr[location + 2] << 7) | (arr[location + 1] >> 1)) / 64;
				readings.push({
					angle: angle,
					distance: distance
				});
			}

			location = location + packetSize;
			arr.splice(0, packetSize);
		}
	}
}
/*port.on('data', function(buffer) {
	process(buffer);
});*/

function openFsPort() {
	fs.open('/dev/ttyO5', 'r', function(err, fd) {
		console.log('port opened ' + err);
		var buffer = new Buffer(256);
		function read() {
			fs.read(fd, buffer, 0, buffer.length, null, function(err, bytesRead, buffer) {
				//console.log(bytesRead);
				console.log(buffer);
				//processData(buffer);
				process.nextTick(read);
			});
		}
		read();
	});
}
openFsPort();
port.on('open', function(err) {
	if (err) {
		throw err;
	}
	console.log('lidar: serial port open');
	setTimeout(function() {
		console.log('lidar: reseting');
		port.write(commands.RESET, function(err) {
			if (err) {
				throw err;
			}
			setTimeout(function() {
				console.log('lidar: starting scan');
				port.write(commands.SCAN, function(err) {
					if (err) {
						throw err;
					}
					/*port.drain(function() {
						port.close();
					});*/
					port.close(function(err) {
						if (err) {
							throw err;
						}
						//openFsPort();
					});
				});
			}, 5000);
		});
	}, 2000);
});

var LidarStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return latestData;
	},
	cleanup: function() {
		console.log('lidar: turning off');
		b.digitalWrite('P8_36', 0);
	}
});

module.exports = LidarStore;
