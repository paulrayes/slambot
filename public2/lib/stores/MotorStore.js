var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ls = require('local-storage');
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
	setEnabled: function(enabled) {
		var prev = this.isEnabled();
		if (prev !== enabled) {
			ls.set('motorStore:enabled', enabled);
			this.emitChange();
		}
	},
	isEnabled: function() {
		return ls.get('motorStore:enabled') || false;
	},
	setVectors: function() {
		data.desiredSpeedLength = Math.sqrt(Math.pow(data.desiredSpeed, 2) + Math.pow(data.desiredDirection, 2));
		data.desiredAngle = Math.atan2(data.desiredDirection, data.desiredSpeed)*180/Math.PI;
		data.actualSpeedLength = Math.sqrt(Math.pow(data.actualSpeed, 2) + Math.pow(data.actualDirection, 2));
		data.actualAngle = Math.atan2(data.actualDirection, data.actualSpeed)*180/Math.PI;
	},
	updateMotors: function() {
		this.setVectors();
		this.emitChange();
	},
	emitChange: function() {
		socket.emit('motors:update', {
			desiredSpeed: data.desiredSpeed,
			desiredDirection: data.desiredDirection,
			enabled: MotorStore.isEnabled()
		});
		this.emit('change');
	}
});

socket.on('motors:update', function(newData) {
	MotorStore.data.desiredSpeed = newData.desiredSpeed;
	MotorStore.data.desiredDirection = newData.desiredDirection;

	MotorStore.data.actualSpeed = newData.actualSpeed;
	MotorStore.data.actualDirection = newData.actualDirection;

	MotorStore.data.left.desiredSpeed = newData.left.desiredSpeed;
	MotorStore.data.left.actualSpeed = newData.left.actualSpeed;
	MotorStore.data.left.actualRpm = newData.left.actualRpm;

	MotorStore.data.right.desiredSpeed = newData.right.desiredSpeed;
	MotorStore.data.right.actualSpeed = newData.right.actualSpeed;
	MotorStore.data.right.actualRpm = newData.right.actualRpm;

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
			if (MotorStore.data.desiredSpeed !== 100) {
				MotorStore.data.desiredSpeed = 100;
				MotorStore.updateMotors();
			}
		} else if (key === 's') {
			if (MotorStore.data.desiredSpeed !== -100) {
				MotorStore.data.desiredSpeed = -100;
				MotorStore.updateMotors();
			}
		} else if (key === 'a') {
			if (MotorStore.data.desiredDirection !== -100) {
				MotorStore.data.desiredDirection = -100;
				MotorStore.updateMotors();
			}
		} else if (key === 'd') {
			if (MotorStore.data.desiredDirection !== 100) {
				MotorStore.data.desiredDirection = 100;
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
			if (MotorStore.data.desiredSpeed !== 0) {
				MotorStore.data.desiredSpeed = 0;
				MotorStore.updateMotors();
			}
		} else if (key === 'a' || key === 'd') {
			if (MotorStore.data.desiredDirection !== 0) {
				MotorStore.data.desiredDirection = 0;
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
				MotorStore.data.desiredSpeed = Math.round(-100*gamepad.axes[1]);
				MotorStore.data.desiredDirection = Math.round(100*gamepad.axes[0]);
				MotorStore.updateMotors();
			}
		}
	}, 100);
}());

module.exports = MotorStore;
