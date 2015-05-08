'use strict';

// Requires both bonescript.js and socket.js
var b = require('bonescript');
var io = require('./../socket');

// Assigning objects
var opticalEncoderPinRight1 = 'P8_7';
var opticalEncoderPinRight2 = 'P8_9';
var opticalEncoderPinLeft1 = 'P8_10';
var opticalEncoderPinLeft2 = 'P8_8';

// Define the type of mode the pins are.
b.pinMode(opticalEncoderPinLeft1, 'in');
b.pinMode(opticalEncoderPinLeft2, 'in');
b.pinMode(opticalEncoderPinRight1, 'in');
b.pinMode(opticalEncoderPinRight2, 'in');

// Initializing variables
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

function interruptCallbackLeft1(x) {
			oeALeft = x.value;
			if (oeALeft !== oeBLeft) {
				oePLeft++;
			} else {
				oePLeft--;
			}
}
function interruptCallbackLeft2(x) {
			oeBLeft = x.value;
			if (oeALeft === oeBLeft) {
				oePLeft++;
			} else {
				oePLeft--;
			}
}
function interruptCallbackRight1(x) {
			oeARight = x.value;
			if (oeARight !== oeBRight) {
				oePRight++;
			} else {
				oePRight--;
			}
}
function interruptCallbackRight2(x) {
			oeBRight = x.value;
			if (oeARight === oeBRight) {
				oePRight++;
			} else {
				oePRight--;
			}
}

// 
b.attachInterrupt(opticalEncoderPinLeft1, true, b.CHANGE, interruptCallbackLeft1);
b.attachInterrupt(opticalEncoderPinLeft2, true, b.CHANGE, interruptCallbackLeft2);
b.attachInterrupt(opticalEncoderPinRight1, true, b.CHANGE, interruptCallbackRight1);
b.attachInterrupt(opticalEncoderPinRight2, true, b.CHANGE, interruptCallbackRight2);

var theta = 0;
var distanceX  = 0;
var distanceY = 0;
var readingCount = 0;

var imu = require('./imu');
var motors = require('./motors');

var oldTime = Date.now();

var opticalDone = function() {

	oePNewLeft = oePLeft;
	oePNewRight = oePRight;

	console.log('pulses:', oePNewLeft - oePOldLeft, oePNewRight - oePOldRight);
	readingCount++;

	if (readingCount > 2) {

		var deltaLeft = ((oePNewLeft-oePOldLeft)/48) * (2*Math.PI*2.1);
		var deltaRight = ((oePNewRight-oePOldRight)/48) * (2*Math.PI*2.1);
		console.log('wheel distance traveled:', deltaLeft, deltaRight);

		var newTime = Date.now();
		var deltaTime = newTime - oldTime;
		oldTime = newTime;

			var deltaCenter = (deltaRight + deltaLeft) / 2;

			if (motors.desiredSpeed > 25) {
				theta = motors.desiredDirection*90/100;

				var deltaDistanceX = deltaCenter * Math.sin(theta);
				var deltaDistanceY = deltaCenter * Math.cos(theta);
				distanceX = distanceX + deltaDistanceX;
				distanceY = distanceY + deltaDistanceY;

			}

		console.log('distance:', Math.round(theta*10)/10, Math.round(distanceX*100)/100, Math.round(distanceY*100)/100);
		console.log('');
	}

	
	oePOldLeft = oePNewLeft;
	oeTOldLeft = oeTNewLeft;
	oePOldRight = oePNewRight;
	oeTOldRight = oeTNewRight;

	setTimeout(opticalDone, 1000);
};

module.exports = {};
