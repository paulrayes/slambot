'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var io = require('../socket');

var LandmarksStore = require('./Landmarks');

var data = {
	estimatedPosition: {x: 0, y: 0, heading: 0},
	landmarkRange: {},
	allLandmarks: [],
	possibleLandmarks: []
};

var latestFour = [data.estimatedPosition, data.estimatedPosition, data.estimatedPosition, data.estimatedPosition];

var initialPosition = require('../config').initialPosition;
var position = {
	x: initialPosition.x,
	y: initialPosition.y,
	heading: 0
};
var averagePosition = {
	x: initialPosition.x,
	y: initialPosition.y,
	heading: 0
};

var ActualPositionStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return averagePosition;
	}
});

LandmarksStore.on('change', function() {
	// Get data from stores
	var data = LandmarksStore.getAll();
	var possibleLandmarks = data.possibleLandmarks;
	var landmarkRange = data.landmarkRange;
	if (possibleLandmarks.length !== 2) {
		return;
	}
	var P1 = landmarkRange.landmark1;
	var P2 = landmarkRange.landmark2

	// Determine positioning of the two landmarks
	if (P1.x === P2.x) {
		var orientation = 'vertical';
		if (data.estimatedPosition.x < P1.x*10) {
			var direction = 'right';
		} else {
			var direction = 'left';
		}
	} else {
		var orientation = 'horizontal';
		if (data.estimatedPosition.y < P1.y*10) {
			var direction = 'above';
		} else {
			var direction = 'below';
		}
	}

	// Calculate distance between the two landmarks
	if (orientation === 'horizontal') {
		var z = Math.abs(P2.x - P1.x)*10;
	} else {
		var z = Math.abs(P2.y - P1.y)*10;
	}

	// Determine which landmark has the greater theta
	// From now on landmark1 has the greater theta and landmark2 has the smaller theta
	if (possibleLandmarks[0].angle > possibleLandmarks[1].angle) {
		var landmark1 = possibleLandmarks[0];
		var landmark2 = possibleLandmarks[1];
	} else {
		var landmark1 = possibleLandmarks[1];
		var landmark2 = possibleLandmarks[0];
	}

	// d and angle now should match up with P1
	// phi is the angle to form a right triangle with the robot and P1 at the two non-90 degree corners of the triangle
	if (landmark1.angle - landmark2.angle > 180) {
		// We are facing between the two landmarks
		var d = landmark2.distance;
		var angle = landmark2.angle;
		// phi = asin (d1 / z * sin(theta2 - theta1 - 180) )
		var phi = Math.asin(landmark1.distance / z * Math.sin((landmark2.angle - landmark1.angle - 180) * Math.PI/180));
	} else {
		// We are not facing between the two landmarks
		var d = landmark1.distance;
		var angle = landmark1.angle;
		// phi = asin (d2 / z * sin(theta1 - theta2) )
		var phi = Math.asin(landmark2.distance / z * Math.sin((landmark1.angle - landmark2.angle) * Math.PI/180));
	}

	if (isNaN(phi)) {
		return;
	}

	if (orientation === 'vertical') {
		//Δx = d * sin(phi)
		//Δy = d * cos(phi)
		var deltaX = d * Math.sin(phi);
		var deltaY = d * Math.cos(phi);
		if (direction === 'left') {
			//x = P1x + Δx
			//y = P1y - Δy
			position.x = P1.x*10 + deltaX;
			position.y = P1.y*10 - deltaY;
		} else {
			//x = P1x - Δx
			//y = P1y + Δy
			position.x = P1.x*10 - deltaX;
			position.y = P1.y*10 + deltaY;
		}
	} else {
		//Δx = d * cos(phi)
		//Δy = d * sin(phi)
		var deltaX = d * Math.cos(phi);
		var deltaY = d * Math.sin(phi);
		if (direction === 'below') {
			//x = P1x + Δx
			//y = P1y + Δy
			position.x = P1.x*10 + deltaX;
			position.y = P1.y*10 + deltaY;
		} else {
			//x = P1x - Δx
			//y = P1y - Δy
			position.x = P1.x*10 - deltaX;
			position.y = P1.y*10 - deltaY;
		}
	}
	// Convert to cm
	position.x = position.x / 10;
	position.y = position.y / 10;

	// base angle is the offset that the landmarks are at
	if (orientation === 'vertical' && direction === 'left') {
		var baseAngle = -90;
	} else if (orientation === 'vertical' && direction === 'right') {
		var baseAngle = 90;
	} else if (orientation === 'horizontal' && direction === 'below') {	
		var baseAngle = 180;
	} else if (orientation === 'horizontal' && direction === 'top') {
		var baseAngle = 0;
	}
	// rho is the third angle of the triangle
	var rho = 90 - phi*180/Math.PI;
	// Finally calculate heading
	position.heading = baseAngle + rho - angle;

	//data.estimatedPosition = EstimatedPositionStore.getAll()

	// Calculate landmarks
	//data.landmarkRange = getLandmarkRange(data.estimatedPosition);
	//data.allLandmarks = findLandmarks(readings);
	//data.possibleLandmarks = filterLandmarks(data.landmarkRange, 0, data.estimatedPosition, data.allLandmarks);

	//latestFour[3] = latestFour[2];
	//latestFour[2] = latestFour[1];
	//latestFour[1] = latestFour[0];
	//latestFour[0] = assign({}, position);

	//averagePosition.x = (latestFour[3].x + latestFour[2].x + latestFour[1].x + latestFour[0].x) / 4;
	//averagePosition.y = (latestFour[3].y + latestFour[2].y + latestFour[1].y + latestFour[0].y) / 4;
	//averagePosition.heading = (latestFour[3].heading + latestFour[2].heading + latestFour[1].heading + latestFour[0].heading) / 4;
//console.log('--');console.log(latestFour[1]);console.log('--');
	//position = assign({}, averagePosition);

	// Emit change
	ActualPositionStore.emit('change');
	io.sockets.emit('actualPosition:update', position);
	//io.sockets.emit('actualPosition:update', averagePosition);
});

module.exports = ActualPositionStore;
