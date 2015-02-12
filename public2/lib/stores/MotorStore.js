var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var Motor = function() {
	this.desiredSpeed = 0;
	this.actualSpeed = 0;
	this.actualRpm = 0;
};

var data = {
	left: new Motor(),
	right: new Motor(),
	desiredSpeed: 0,
	desiredDirection: 0,
	actualSpeed: 0,
	actualDirection: 0,
	desiredSpeedLength: 0,
	desiredAngle: 0,
	actualSpeedLength: 0,
	actualAngle: 0
};

var MotorStore = assign({}, EventEmitter.prototype, {
	data: data,
	setVectors: function() {
		data.desiredSpeedLength = Math.sqrt(Math.pow(data.desiredSpeed, 2) + Math.pow(data.desiredDirection, 2));
		data.desiredAngle = Math.atan2(data.desiredDirection, data.desiredSpeed)*180/Math.PI;
		data.actualSpeedLength = Math.sqrt(Math.pow(data.actualSpeed, 2) + Math.pow(data.actualDirection, 2));
		data.actualAngle = Math.atan2(data.actualDirection, data.actualSpeed)*180/Math.PI;
	},
	updateMotors: function() {
		this.setVectors();
		socket.emit('motors:update', {
			desiredSpeed: data.desiredSpeed,
			desiredDirection: data.desiredDirection
		});
		this.emit('change');
	}
});

socket.on('motors:update', function(newData) {
	data.desiredSpeed = newData.desiredSpeed;
	data.desiredDirection = newData.desiredDirection;

	data.actualSpeed = newData.actualSpeed;
	data.actualDirection = newData.actualDirection;

	data.left.desiredSpeed = newData.left.desiredSpeed;
	data.left.actualSpeed = newData.left.actualSpeed;
	data.left.actualRpm = newData.left.actualRpm;

	data.right.desiredSpeed = newData.right.desiredSpeed;
	data.right.actualSpeed = newData.right.actualSpeed;
	data.right.actualRpm = newData.right.actualRpm;

	MotorStore.setVectors();
	MotorStore.emit('change');
});

window.addEventListener('keydown', function(event) {
	var keyCodes = {
		87: 'w',
		65: 'a',
		83: 's',
		68: 'd'
	};

	var key = keyCodes[event.which];
	if (typeof key !== 'undefined') {
		if (key === 'w') {
			if (data.desiredSpeed !== 100) {
				data.desiredSpeed = 100;
				MotorStore.updateMotors();
			}
		} else if (key === 's') {
			if (data.desiredSpeed !== -100) {
				data.desiredSpeed = -100;
				MotorStore.updateMotors();
			}
		} else if (key === 'a') {
			if (data.desiredDirection !== -100) {
				data.desiredDirection = -100;
				MotorStore.updateMotors();
			}
		} else if (key === 'd') {
			if (data.desiredDirection !== 100) {
				data.desiredDirection = 100;
				MotorStore.updateMotors();
			}
		}
	}
});

window.addEventListener('keyup', function(event) {
	var keyCodes = {
		87: 'w',
		65: 'a',
		83: 's',
		68: 'd'
	};

	var key = keyCodes[event.which];
	if (typeof key !== 'undefined') {
		if (key === 'w' || key === 's') {
			if (data.desiredSpeed !== 0) {
				data.desiredSpeed = 0;
				MotorStore.updateMotors();
			}
		} else if (key === 'a' || key === 'd') {
			if (data.desiredDirection !== 0) {
				data.desiredDirection = 0;
				MotorStore.updateMotors();
			}
		}
	}
});

(function() {
	var lastTimestamp = 0;

	setInterval(function() {
		var gamepad = navigator.getGamepads && navigator.getGamepads()[0];
		if (gamepad !== undefined) {
			if (gamepad.timestamp > lastTimestamp) {
				lastTimestamp = gamepad.timestamp;
				data.desiredSpeed = Math.round(-50*gamepad.axes[1]);
				data.desiredDirection = Math.round(50*gamepad.axes[0]);
				MotorStore.updateMotors();
			}
		}
	}, 100);
}());

module.exports = MotorStore;
