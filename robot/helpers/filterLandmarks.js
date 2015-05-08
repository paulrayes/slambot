'use strict';

function calculateDistance(point1, point2) {
	// Arithmetics that uses Pythagorean theorem
	var deltaX = Math.abs(point1.x - point2.x);
	var deltaY = Math.abs(point1.y - point2.y);
	var distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
	return distance;
}
function calculateAngle(position, point) {
	// Arithmetics that uses Pythagorean theorem
	var x = point.x - position.x;
	var y = point.y - position.y;
	var angle = Math.atan2(x, y)*180/Math.PI;
	return angle;
}

// Assigning initial data.
var DISTANCE_THRESHOLD = 5;
module.exports = function(landmarkRange, estimatedHeading, estimatedPosition, landmarks) {
	// Calculate the value of the desired distance, and theta based on landmarks and the estimated position.
	var desiredDistance1 = calculateDistance(landmarkRange.landmark1, estimatedPosition);
	var desiredDistance2 = calculateDistance(landmarkRange.landmark2, estimatedPosition);
	var theta1 = calculateAngle(estimatedPosition, landmarkRange.landmark1)-estimatedHeading;
	var theta2 = calculateAngle(estimatedPosition, landmarkRange.landmark2)-estimatedHeading;

	var possibleLandmarks = [];
	// Loop through all the landmarks and search for ones that fit the criteria
	landmarks.forEach(function(landmark1) {
		landmarks.forEach(function(landmark2) {
			// They should be about the right distance apart
			var p1 = {
				x: landmark1.x/10,
				y: landmark1.y/10
			};
			var p2 = {
				x: landmark2.x/10,
				y: landmark2.y/10
			};
			var distance = calculateDistance(p1, p2);

			// If statement that tests where the robot is.
			if (Math.abs(distance - landmarkRange.distance) > 5) {
				return;
			}

			var l1 = false;
			var l2 = false;

			// If statements that tests if the robot is in the appropriate landmark
			if (Math.abs(landmark1.distance/10 - desiredDistance1) < 20) {
				l1 = landmark1;
			} else if (Math.abs(landmark2.distance/10 - desiredDistance1) < 20) {
				l1 = landmark2;
			}
			if (Math.abs(landmark1.distance/10 - desiredDistance2) < 20) {
				l2 = landmark1;
			} else if (Math.abs(landmark2.distance/10 - desiredDistance2) < 20) {
				l2 = landmark2;
			}
			if (l1 === false || l2 === false) {
				return;
			}

			// Basic arithmetics
			var mtheta1 = calculateAngle(estimatedPosition, landmark1)-estimatedHeading;
			var mtheta2 = calculateAngle(estimatedPosition, landmark2)-estimatedHeading;

			// If statements that test if values of theta is in the correct landmark
			if (Math.abs(mtheta1 - theta1) > 60 && Math.abs(mtheta1 - theta2) > 60) {
				return;
			}
			if (Math.abs(mtheta2 - theta1) > 60 && Math.abs(mtheta2 - theta2) > 60) {
				return;
			}

			// Basic artimetics involving the absolute values.
			var deltaTheta = Math.abs(mtheta1 - mtheta2);
			var desiredDeltaTheta = Math.abs(theta1 - theta2);
			if (Math.abs(deltaTheta - desiredDeltaTheta) > 30) {
				return;
			}
			if (landmark1.type !== landmarkRange.landmark1.type && landmark1.type !== landmarkRange.landmark2.type) {
			}
			if (landmark2.type !== landmarkRange.landmark1.type && landmark2.type !== landmarkRange.landmark2.type) {
			}
			if (l1 === false || l2 === false) {
			}

			possibleLandmarks.push(landmark1);

		});
	});

	return possibleLandmarks;
};
