'use strict';

var b = require('bonescript');
var io = require('./../socket');

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

	get enabled() {
		return _enabled;
	},
	set enabled(value) {
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
var opticalEncoderPinLeft1 = 'P8_7';
b.pinMode(opticalEncoderPinLeft1, 'in');
var opticalEncoderPinLeft2 = 'P8_9';
b.pinMode(opticalEncoderPinLeft2, 'in');
var opticalEncoderPinRight1 = 'P8_8';
b.pinMode(opticalEncoderPinRight1, 'in');
var opticalEncoderPinRight2 = 'P8_10';
b.pinMode(opticalEncoderPinRight2, 'in');

//var prev = -1;
//var asdf = 0;
var oeALeft = -1;
var oeBLeft = -1;

var oePLeft = 0;
var oePOldLeft = 0;
var oePNewLeft = 0;
var oeTNewLeft = Date.now();
var oeTOldLeft = oeTNewLeft;

var oeARight = -1;
var oeBRight = -1;

var oePRight = 0;
var oePOldRight = 0;
var oePNewRight = 0;
var oeTNewRight = Date.now();
var oeTOldRight = oeTNewRight;

//var oeADone = false;
//var oeBDone = false;
//var motorMaxVelocity = 2880;


function interruptCallbackLeft1(x) {
	b.digitalRead(opticalEncoderPinLeft1, function (val) {
		if (val !== oeALeft) {
			oeALeft = val.value;
			if (oeALeft !== oeBLeft) {
				oePLeft++;
			} else {
				oePLeft--;
			}
		}
	});
}
function interruptCallbackLeft2(x) {
	b.digitalRead(opticalEncoderPinLeft2, function(val) {
		if (val !== oeBLeft) {
			oeBLeft = val.value;
			if (oeALeft === oeBLeft) {
				oePLeft++;
			} else {
				oePLeft--;
			}
		}
	});
}
function interruptCallbackRight1(x) {
	b.digitalRead(opticalEncoderPinRight1, function(val) {
		if (val !== oeARight) {
			oeARight = val.value;
			if (oeARight === oeBRight) {
				oePRight++;
			} else {
				oePRight--;
			}
		}
	});
}
function interruptCallbackRight2(x) {
	b.digitalRead(opticalEncoderPinRight2, function(val) {
		if (val !== oeBRight) {
			oeBRight = val.value;
			if (oeARight === oeBRight) {
				oePRight++;
			} else {
				oePRight--;
			}
		}
	});
}
b.attachInterrupt(opticalEncoderPinLeft1, true, b.CHANGE, interruptCallbackLeft1);
b.attachInterrupt(opticalEncoderPinLeft2, true, b.CHANGE, interruptCallbackLeft2);
b.attachInterrupt(opticalEncoderPinRight1, true, b.CHANGE, interruptCallbackRight1);
b.attachInterrupt(opticalEncoderPinRight2, true, b.CHANGE, interruptCallbackRight2);

var opticalDone = function() {

	oePNewLeft = oePLeft;
	oeTNewLeft = Date.now();
	var velocityLeft = (oePNewLeft - oePOldLeft) / (oeTNewLeft - oeTOldLeft);
	velocityLeft = (velocityLeft/48)*60000;
	//48 is the pulse per revolution, 60,000 milliseconds in minutes

	oePNewRight = oePRight;
	oeTNewRight = Date.now();
	var velocityRight = (oePNewRight - oePOldRight) / (oeTNewRight - oeTOldRight);
	velocityRight = (velocityRight/48)*60000;

	motorsService.left.actualRpm = velocityLeft;
	motorsService.right.actualRpm = velocityRight;

	//console.log(velocityLeft + ' ' + velocityRight);
	motorsService.emit();
	oePOldLeft = oePNewLeft;
	oeTOldLeft = oeTNewLeft;
	oePOldRight = oePNewRight;
	oeTOldRight = oeTNewRight;

	setTimeout(opticalDone, 500);
};

setTimeout(opticalDone, 100);

module.exports = motorsService;
