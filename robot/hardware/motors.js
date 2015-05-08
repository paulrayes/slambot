'use strict';

// Creating an event
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var b = require('bonescript');
var io = require('../socket');

var MAX_SPEED = 65;

// Speeds are relative to a theoretical maximum speed and thus an actual speed of -100 or 100 is not likely.
// But, that's pretty fast so most of the time we'll probably have a desired speed of less than that.

// Whether the motor driver is enabled, controls the STBY pin
var _enabled = false;

// Number from -100 (backwards) to 100 (forwards), 0 is stopped
var _desiredSpeed = 0;
// Number from -100 (left) to 100 (right), 0 is straight
var _desiredDirection = 0;

var _actualSpeed = 0;
var _actualDirection = 0;

var stbyPin = 'P9_13';
b.pinMode(stbyPin, 'out');
b.digitalWrite(stbyPin, _enabled); // Initially be disabled

// Assigning objects
var aPwmPin = 'P9_14';
var aIn1Pin = 'P9_12';
var aIn2Pin = 'P9_11';
var bPwmPin = 'P9_16';
var bIn1Pin = 'P9_15';
var bIn2Pin = 'P9_23';

var Motor = function(pwmPin, in1Pin, in2Pin) {
	this.desiredSpeed = 0;
	this.actualSpeed = 0;
	this.actualRpm = 0;
	this.pwmPin = pwmPin;
	this.in1Pin = in1Pin;
	this.in2Pin = in2Pin;
	b.pinMode(this.in1Pin, 'out');
	b.pinMode(this.in2Pin, 'out');

	this.move = function() {
		// Tell the motor driver what direction we want
		if (this.desiredSpeed === 0) {
			// Brake
			b.digitalWrite(this.in1Pin, 1);
			b.digitalWrite(this.in2Pin, 1);
		} else if (this.desiredSpeed > 0) {
			// Forward
			b.digitalWrite(this.in1Pin, 1);
			b.digitalWrite(this.in2Pin, 0);
		} else {
			// Backward
			b.digitalWrite(this.in1Pin, 0);
			b.digitalWrite(this.in2Pin, 1);
		}

		// desiredSpeed is -100 to 100, make it 0 to 1 instead
		var speed = Math.abs(this.desiredSpeed)/100;


		// Even max speed is too fast, slow it down
		speed = speed / 2;

		speed = speed / 100 * MAX_SPEED;

		// Tell the motor driver the speed
		b.analogWrite(this.pwmPin, speed, 2000);
	};
};


var motorsService = {
	left: new Motor(aPwmPin, aIn1Pin, aIn2Pin),
	right: new Motor(bPwmPin, bIn1Pin, bIn2Pin),

	get enabled() {
		return _enabled;
	},
	set enabled(value) {
		if (_enabled !== value) {
			if (value) {
				console.log('Enabling motor driver');
			} else {
				console.log('Disabling motor driver');
			}
		}
		_enabled = value;
		b.digitalWrite(stbyPin, value ? 1 : 0);
	},
	get desiredSpeed() {
		return _desiredSpeed;
	},
	set desiredSpeed(value) {
		_desiredSpeed = value;
		this.updateMotors();
	},
	get desiredDirection() {
		return _desiredDirection;
	},
	set desiredDirection(value) {
		_desiredDirection = value;
		this.updateMotors();
	},
	get actualSpeed() {
		return _actualSpeed;
	},
	get actualDirection() {
		return _actualDirection;
	},

	setDesiredSpeedAndDirection: function(speed, direction) {
		_desiredSpeed = speed;
		_desiredDirection = direction;
		this.updateMotors();
	},
	updateMotors: function() {
		//console.log('Setting speed to ' + _desiredSpeed + ' with direction ' + _desiredDirection);

		this.left.desiredSpeed = _desiredSpeed + _desiredDirection;
		this.right.desiredSpeed = _desiredSpeed - _desiredDirection;

		// If statements that rounds the desired speed if it exceeds -100, and 100
		if (this.left.desiredSpeed > 100) {
			this.left.desiredSpeed = 100;
		}
		if (this.left.desiredSpeed < -100) {
			this.left.desiredSpeed = -100;
		}
		if (this.right.desiredSpeed > 100) {
			this.right.desiredSpeed = 100;
		}
		if (this.right.desiredSpeed < -100) {
			this.right.desiredSpeed = -100;
		}
		this.left.move();
		this.right.move();
		this.emit();
	},

	emit: function() {
		io.sockets.emit('motors:update', {
			desiredSpeed: _desiredSpeed,
			desiredDirection: _desiredDirection,
			actualSpeed: _actualSpeed,
			actualDirection: _actualDirection,
			left: this.left,
			right: this.right
		});
		module.exports.emit('change');
	}
};

io.sockets.on('connection', function(socket) {
	socket.on('motors:update', function(data) {
		motorsService.enabled = data.enabled;
		motorsService.setDesiredSpeedAndDirection(data.desiredSpeed, data.desiredDirection);
	});
	motorsService.emit();
});


module.exports = assign({}, EventEmitter.prototype, {
	left: motorsService.left,
	right: motorsService.right
});
