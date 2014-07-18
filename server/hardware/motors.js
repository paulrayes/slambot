//var b = require('bonescript');

module.exports = function(io) {
	'use strict';

	// Speeds are relative to a theoretical maximum speed and thus an actual speed of -100 or 100 is not likely.
	// But, that's pretty fast so msot of the time we'll probably have a desired speed of less than that.

	// Number from -100 (backwards) to 100 (forwards), 0 is stopped
	var _desiredSpeed = 0;
	// Number from -100 (left) to 100 (right), 0 is straight
	var _desiredDirection = 0;

	var _actualSpeed = 0;
	var _actualDirection = 0;

	var Motor = function() {
		this.desiredSpeed = 0;
		this.actualSpeed = 0;
		this.actualRpm = 0;
	};

	var motorsService = {
		left: new Motor(),
		right: new Motor(),

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


		updateMotors: function() {
			console.log('Setting speed to ' + _desiredSpeed + ' with direction ' + _desiredDirection);

			this.left.desiredSpeed = _desiredSpeed + _desiredDirection;
			this.right.desiredSpeed = _desiredSpeed - _desiredDirection;
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

		}
	};

	io.sockets.on('connection', function(socket) {
		console.log('Socket connection established in hardware/motors.js');
		socket.on('motors:update', function(data) {
			_desiredSpeed = data.desiredSpeed;
			_desiredDirection = data.desiredDirection;
			motorsService.updateMotors();
		});
		motorsService.emit();
	});

	return motorsService;
};