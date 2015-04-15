'use strict';

function calculateDistance(point1, point2) {
	var deltaX = Math.abs(point1.x - point2.x);
	var deltaY = Math.abs(point1.y - point2.y);
	var distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
	return distance;
}
function calculateAngle(position, point) {
	var x = point.x - position.x;
	var y = point.y - position.y;
	var angle = Math.atan2(x, y)*180/Math.PI;
	return angle;
}

var DISTANCE_THRESHOLD = 5;
module.exports = function(landmarkRange, estimatedHeading, estimatedPosition, landmarks) {
	//console.log(landmarkRange.distance);
	//console.log(landmarks[0]);
	//var desiredDistance1 = landmarkRange.landmark1
	var desiredDistance1 = calculateDistance(landmarkRange.landmark1, estimatedPosition);
	var desiredDistance2 = calculateDistance(landmarkRange.landmark2, estimatedPosition);
//console.log(desiredDistance1, desiredDistance2);
	var theta1 = calculateAngle(estimatedPosition, landmarkRange.landmark1)-estimatedHeading;
	var theta2 = calculateAngle(estimatedPosition, landmarkRange.landmark2)-estimatedHeading;
	//console.log(landmarkRange.landmark1.x, theta1, landmarkRange.landmark2.x, theta2);
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
			if (Math.abs(distance - landmarkRange.distance) > 5) {
				//console.log(distance);
				return;
			}
			/*if (Math.abs(landmark1.distance/10 - desiredDistance1) > 10 && Math.abs(landmark1.distance/10 - desiredDistance2) > 10) {
				return;
			}
			if (Math.abs(landmark2.distance/10 - desiredDistance1) > 10 && Math.abs(landmark2.distance/10 - desiredDistance2) > 10) {
				return;
			}*/
			var l1 = false;
			var l2 = false;
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
			var mtheta1 = calculateAngle(estimatedPosition, landmark1)-estimatedHeading;
			var mtheta2 = calculateAngle(estimatedPosition, landmark2)-estimatedHeading;
			//console.log(mtheta1, mtheta2);
			if (Math.abs(mtheta1 - theta1) > 60 && Math.abs(mtheta1 - theta2) > 60) {
				return;
			}
			if (Math.abs(mtheta2 - theta1) > 60 && Math.abs(mtheta2 - theta2) > 60) {
				return;
			}
			var deltaTheta = Math.abs(mtheta1 - mtheta2);
			var desiredDeltaTheta = Math.abs(theta1 - theta2);
			if (Math.abs(deltaTheta - desiredDeltaTheta) > 30) {
				return;
			}
			if (landmark1.type !== landmarkRange.landmark1.type && landmark1.type !== landmarkRange.landmark2.type) {
				//return;
			}
			if (landmark2.type !== landmarkRange.landmark1.type && landmark2.type !== landmarkRange.landmark2.type) {
				//return;
			}
			if (l1 === false || l2 === false) {
				//return;
			}
	//(desiredDistance1, theta1, desiredDistance2, theta2);
			//console.log('e');

			 //landmarkRange.landmark2.type === landmark2.type
			// Must be correct orientation;
			/*var vertical = Math.abs(landmark1.x - landmark2.x) < 10;
			var horizontal = Math.abs(landmark1.y - landmark2.y) < 10;
			if (landmarkRange.orientation === 'vertical' && !vertical) {
				return;
			}
			if (landmarkRange.orientation === 'horizontal' && !horizontal) {
				return;
			}*/

			possibleLandmarks.push(landmark1);
			//possibleLandmarks.push(landmark2);
		});
	});
//console.log(possibleLandmarks);
	return possibleLandmarks;
};
