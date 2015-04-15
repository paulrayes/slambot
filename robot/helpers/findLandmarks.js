'use strict';

/** Helper function to find landmarks in LIDAR readings
 * 
 * Give it an array of readings with angle and distance
 * 
 * Returns an array of landmarks, each landmark has a the following:
 * 
 * - angle: the angle of the landmark
 * - x,y: the position of the landmark, offset from the robot's position
 * - difference: the approximate difference between the landmark and the nearby value, only for edge landmarks
 * - type: one of the following
 *     - innercorner: readings on both sides of theta are similar but slightly smaller
 *     - outercorner: opposite of innercorner
 *     - lowedge: readings lower than theta are similar to theta, theta+1 is much greater
 *     - highedge: opposite of lowedge
 */

function getReading(readings, i) {
	while (i < 0) {
		i = i + readings.length;
	}
	var index = i % readings.length;
	return readings[index];
}

function getLandmarkType(readings, i, maxDistance) {
	// Reading should be at least 10cm away or we can't accurately detect it with the lidar
	if (readings[i].distance < 100) {
		return 'none';
	}
	// Reading should also not be super far away or it's too innacurate
	if (readings[i].distance > maxDistance) {
		return 'none';
	}

	if (i === 12) {
		//console.log(readings[i].angle, getReading(readings, i-2).distance, getReading(readings, i-1).distance, readings[i].distance, getReading(readings, i+1).distance, getReading(readings, i+2).distance);
	}

	// Edges appear as corners as well so look for edges first

	// See if this is a low edge
	if (//readings[i].distance > getReading(readings, i-2).distance && 
		readings[i].distance > getReading(readings, i-1).distance && 
		getReading(readings, i+1).distance - readings[i].distance > 50) {
		return 'lowedge';
	}

	// See if this is a high edge
	if (getReading(readings, i-1).distance - readings[i].distance > 50 &&
		readings[i].distance > getReading(readings, i+1).distance){// && 
		//readings[i].distance > getReading(readings, i+2).distance) {
		return 'highedge';
	}

	// See if this is an inner corner
	// Also checking that it is not next to an edge
	if (readings[i].distance > getReading(readings, i-2).distance && 
		readings[i].distance >= getReading(readings, i-1).distance && 
		readings[i].distance >= getReading(readings, i+1).distance && 
		readings[i].distance > getReading(readings, i+2).distance/* && 
		Math.abs(readings[i].distance - getReading(readings, i-1).distance) < 50 &&
		Math.abs(readings[i].distance - getReading(readings, i+1).distance) < 50*/) {
		return 'innercorner'
	}

	// See if this is an outer corner
	// Also checking that it is not next to an edge
	if (readings[i].distance < getReading(readings, i-2).distance && 
		readings[i].distance <= getReading(readings, i-1).distance && 
		readings[i].distance <= getReading(readings, i+1).distance && 
		readings[i].distance < getReading(readings, i+2).distance/* &&
		Math.abs(readings[i].distance - getReading(readings, i-1).distance) < 50 &&
		Math.abs(readings[i].distance - getReading(readings, i+1).distance) < 50*/) {
		return 'outercorner'
	}

	return 'none';
}

module.exports = function(readings, maxDistance) {
	var landmarks = [];
	// Loop through all the readings looking for a landmark
	for (var i = 0; i < readings.length; i++) {
		var landmarkType = getLandmarkType(readings, i, maxDistance);
		if (landmarkType !== 'none') {
			//console.log(readings[i].angle, readings[i].distance, landmarkType);
			var difference = null;
			if (landmarkType === 'lowedge') {
				difference = readings[i+1] - readings[i];
			} else if (landmarkType === 'highedge') {
				difference = readings[i-1] - readings[i];
			}
			var x = readings[i].distance * Math.cos((readings[i].angle-90)*Math.PI/180);
			var y = -readings[i].distance * Math.sin((readings[i].angle-90)*Math.PI/180);
			var exists = false;
			for (var j = 0; j < landmarks.length; j++) {
				if (Math.abs(landmarks[j].x - x) < 50 && Math.abs(landmarks[j].y - y) < 50) {
					exists = true;
				}
			}
			if (!exists) {
				landmarks.push({
					angle: readings[i].angle,
					distance: readings[i].distance,
					x: x,
					y: y,
					difference: difference,
					type: landmarkType
				});
			}
		}
	}
	return landmarks;
};
