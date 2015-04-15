'use strict';

var b = require('bonescript');
var io = require('./../socket');

var opticalEncoderPinRight1 = 'P8_7';
var opticalEncoderPinRight2 = 'P8_9';
var opticalEncoderPinLeft1 = 'P8_10';
var opticalEncoderPinLeft2 = 'P8_8';
b.pinMode(opticalEncoderPinLeft1, 'in');
b.pinMode(opticalEncoderPinLeft2, 'in');
b.pinMode(opticalEncoderPinRight1, 'in');
b.pinMode(opticalEncoderPinRight2, 'in');

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
	//console.log(x);
	//b.digitalRead(opticalEncoderPinLeft1, function (val) {
		//if (val !== oeALeft) {
			oeALeft = x.value;
			if (oeALeft !== oeBLeft) {
				oePLeft++;
			} else {
				oePLeft--;
			}
		//}
	//});
}
function interruptCallbackLeft2(x) {
	//b.digitalRead(opticalEncoderPinLeft2, function(val) {
		//if (val !== oeBLeft) {
			oeBLeft = x.value;
			if (oeALeft === oeBLeft) {
				oePLeft++;
			} else {
				oePLeft--;
			}
		//}
	//});
}
function interruptCallbackRight1(x) {
	//b.digitalRead(opticalEncoderPinRight1, function(val) {
		//if (val !== oeARight) {
			oeARight = x.value;
			if (oeARight !== oeBRight) {
				oePRight++;
			} else {
				oePRight--;
			}
		//}
	//});
}
function interruptCallbackRight2(x) {
	//b.digitalRead(opticalEncoderPinRight2, function(val) {
		//if (val !== oeBRight) {
			oeBRight = x.value;
			if (oeARight === oeBRight) {
				oePRight++;
			} else {
				oePRight--;
			}
		//}
	//});
}

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
	//oeTNewLeft = Date.now();
	//var velocityLeft = (oePNewLeft - oePOldLeft) / (oeTNewLeft - oeTOldLeft);
	//velocityLeft = (velocityLeft/48)*60000;
	//48 is the pulse per revolution, 60,000 milliseconds in minutes

	oePNewRight = oePRight;
	//oeTNewRight = Date.now();
	//var velocityRight = (oePNewRight - oePOldRight) / (oeTNewRight - oeTOldRight);
	//velocityRight = (velocityRight/48)*60000;

	//motorsService.left.actualRpm = velocityLeft;
	//motorsService.right.actualRpm = velocityRight;

	console.log('pulses:', oePNewLeft - oePOldLeft, oePNewRight - oePOldRight);
	readingCount++;

	if (readingCount > 2) {

		var deltaLeft = ((oePNewLeft-oePOldLeft)/48) * (2*Math.PI*2.1);
		var deltaRight = ((oePNewRight-oePOldRight)/48) * (2*Math.PI*2.1);
		console.log('wheel distance traveled:', deltaLeft, deltaRight);

		var newTime = Date.now();
		var deltaTime = newTime - oldTime;
		oldTime = newTime;

		/*if (Math.abs(deltaLeft - deltaRight) < 2) {
			console.log('straight');
			distanceX += deltaLeft * Math.cos(theta);
			distanceY += deltaRight * Math.sin(theta);
		} else {
			console.log('turning');*/
			//var deltaTheta = (2*Math.PI*2.1/8.8) * (((oePNewLeft-oePOldLeft)-(oePNewRight-oePOldRight)) / 48); 
			var deltaCenter = (deltaRight + deltaLeft) / 2;
			//var deltaTheta = (deltaRight - deltaLeft) / (8.8);
			//deltaTheta = 180 * deltaTheta / Math.PI;
			//theta = theta + deltaTheta;
			//theta = imu.getAll().heading;
			if (motors.desiredSpeed > 25) {
				theta = motors.desiredDirection*90/100;
				//var deltaDistanceX = (2.1*Math.cos(theta)) * ((oePNewLeft-oePOldLeft)+(oePNewRight-oePOldRight)) * (Math.PI/48);
				//var deltaDistanceY = (2.1*Math.sin(theta)) * ((oePNewLeft-oePOldLeft)+(oePNewRight-oePOldRight)) * (Math.PI/48);
				var deltaDistanceX = deltaCenter * Math.sin(theta);
				var deltaDistanceY = deltaCenter * Math.cos(theta);
				distanceX = distanceX + deltaDistanceX;
				distanceY = distanceY + deltaDistanceY;
			//} else {
				//theta = motors.desiredDirection*(90/100);
			}
		//}
		//console.log('motors:', motors.desiredSpeed, motors.desiredDirection);
		console.log('distance:', Math.round(theta*10)/10, Math.round(distanceX*100)/100, Math.round(distanceY*100)/100);
		console.log('');
	}

	//motorsService.emit();
	
	oePOldLeft = oePNewLeft;
	oeTOldLeft = oeTNewLeft;
	oePOldRight = oePNewRight;
	oeTOldRight = oeTNewRight;

	setTimeout(opticalDone, 1000);
};

//setTimeout(opticalDone, 100);

//var previousDirection = 0;
/*var previousSpeedLeft = 0;
var previousSpeedRight = 0;
//var previousImuHeading = 0;
motors.on('change', function() {
	var newTime = Date.now();
	var deltaTime = newTime - oldTime;
	oldTime = newTime;

	//var newHeading = imu.getAll().heading;
	//var avgHeading = (previousImuHeading + avgHeading) / 2;

	var deltaLeft = previousSpeedLeft * deltaTime / 3000;
	var deltaRight = previousSpeedRight * deltaTime / 3000;
	var deltaCenter = (deltaRight + deltaLeft) / 2;

	var deltaTheta = (deltaRight - deltaLeft) * 3.5;
	theta = theta + deltaTheta;

	var deltaDistanceX = deltaCenter * Math.sin(theta);
	var deltaDistanceY = deltaCenter * Math.cos(theta);
	distanceX = distanceX + deltaDistanceX;
	distanceY = distanceY + deltaDistanceY;
	

	console.log(deltaTheta, distanceX, distanceY);

	previousSpeedLeft = motors.left.desiredSpeed;
	previousSpeedRight = motors.right.desiredSpeed;

	//var direction = motors.desiredDirection*90/100;
	//var speed = motors.desiredSpeed;


});*/

module.exports = {};
