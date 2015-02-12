//var b = require('octalbonescript');

module.exports = function(io, b) {
	'use strict';

	// Speeds are relative to a theoretical maximum speed and thus an actual speed of -100 or 100 is not likely.
	// But, that's pretty fast so most of the time we'll probably have a desired speed of less than that.

	// Number from -100 (backwards) to 100 (forwards), 0 is stopped
	var _desiredSpeed = 0;
	// Number from -100 (left) to 100 (right), 0 is straight
	var _desiredDirection = 0;

	var _actualSpeed = 0;
	var _actualDirection = 0;

	var stbyPin = 'P9_13';
	b.pinMode(stbyPin, 'out');
	b.digitalWrite(stbyPin, 1);

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
		//b.pinMode(this.pwmPin, 'out');
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
			//console.log(this.desiredSpeed);
			var speed = Math.abs(this.desiredSpeed)/100;
			//console.log(speed);

			// Even max speed is too fast, slow it down
			speed = speed / 2;

			// Tell the motor driver the speed
			b.analogWrite(this.pwmPin, speed, 2000);
		};
	};



	var motorsService = {
		left: new Motor(aPwmPin, aIn1Pin, aIn2Pin),
		right: new Motor(bPwmPin, bIn1Pin, bIn2Pin),

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

	/*b.pinMode('P8_7', 'in');
	b.digitalRead('P8_7', function(val) {
		console.log(val);
	});*/
	var opticalEncoderPin1 = 'P8_7';
	b.pinMode(opticalEncoderPin1, 'in');
	var opticalEncoderPin2 = 'P8_9';
	b.pinMode(opticalEncoderPin2, 'in');

	//var prev = -1;
	//var asdf = 0;
	var oeA = -1;
	var oeB = -1;
	//var oeD = 0;
	var oeP = 0;
	var oePOld = 0;
	var oePNew = 0;
	var oeTNew = Date.now();
	var oeTOld = oeTNew;
	//var oeADone = false;
	//var oeBDone = false;
	//var motorMaxVelocity = 2880;


	function interruptCallback1(x) {
		b.digitalRead(opticalEncoderPin1, function (val) {
			if (val !== oeA) {
				oeA = val.value;
				if (oeA !== oeB) {
					oeP++;
				} else {
					oeP--;
				}
			}
		});
	}
	function interruptCallback2(x) {
		b.digitalRead(opticalEncoderPin2, function(val) {
			if (val !== oeB) {
				oeB = val.value;
				if (oeA === oeB) {
					oeP++;
				} else {
					oeP--;
				}
			}
		});
	}
	b.attachInterrupt(opticalEncoderPin1, true, b.CHANGE, interruptCallback1);
	b.attachInterrupt(opticalEncoderPin2, true, b.CHANGE, interruptCallback2);

	var opticalDone = function() {

		oePNew = oeP;
		oeTNew = Date.now();
		var velocity = (oePNew - oePOld) / (oeTNew - oeTOld);
		velocity = (velocity/48)*60000;
		//48 is the pulse per revolution, 60,000 mili-seconds in minutes

		motorsService.left.actualSpeed = velocity;
		console.log(velocity);
		motorsService.emit();
		oePOld = oePNew;
		oeTOld = oeTNew;

		setTimeout(opticalDone, 500);
	};

	setTimeout(opticalDone, 100);

	return motorsService;
};
