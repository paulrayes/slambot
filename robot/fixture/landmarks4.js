
//var Promise = require('promise');
//var Parallel = require('paralleljs');

var findLandmarks = require('../helpers/findLandmarks');
var simulateLidar = require('../helpers/simulateLidar');
var map = require('../fixture/map');

var THRESHOLD = 3;
var MAX_DISTANCE = 1000;
var startTime = Date.now();

var x, y;

var landmarkLocations = [];

var corners = [];

// We are first going to find all the corner locations to make this easier for us
// Each wall has four corners
function addCorner(position) {
	// Ensure the corner doesn't already exist, duplicates are useless
	for (var i = 0; i < corners.length; i++) {
		if (corners[i].x === position.x && corners[i].y === position.y) {
			return;
		}
	}
	corners.push(position);
}
function isCorner(position) {
	var position5 = {
		x: Math.round(position.x/THRESHOLD)*THRESHOLD,
		y: Math.round(position.y/THRESHOLD)*THRESHOLD
	};
	for (var i = 0; i < corners5.length; i++) {
		if (corners5[i].x === position5.x && corners5[i].y === position5.y) {
			return true;
		}
	}
	return false;
}
map.walls.forEach(function(wall) {
	addCorner({x: wall[0][0], y: wall[0][1]});
	addCorner({x: wall[0][0], y: wall[1][1]});
	addCorner({x: wall[1][0], y: wall[0][1]});
	addCorner({x: wall[1][0], y: wall[1][1]});
});

// Now make some new corners where they're rounded to 5cm
// They'll be used to check if a landmark is a corner later
var corners5 = []
corners.forEach(function(corner) {
	corners5.push({
		x: Math.round(corner.x/THRESHOLD)*THRESHOLD,
		y: Math.round(corner.y/THRESHOLD)*THRESHOLD
	});
});
//console.log(JSON.stringify(corners5));
//throw('done');
console.log('Calculated corners in ' + Math.round(Date.now()-startTime) + ' ms');
startTime = Date.now();

/*function landmarksAreOnSameWall(landmark1, landmark2) {
	var same = false;
	map.walls.forEach(function(wall) {
		var points = [
			{x: Math.round(wall[0][0]/THRESHOLD), y: Math.round(wall[0][1]/THRESHOLD)},
			{x: Math.round(wall[0][0]/THRESHOLD), y: Math.round(wall[1][1]/THRESHOLD)},
			{x: Math.round(wall[1][0]/THRESHOLD), y: Math.round(wall[0][1]/THRESHOLD)},
			{x: Math.round(wall[1][0]/THRESHOLD), y: Math.round(wall[1][1]/THRESHOLD)}
		];
		var l1 = {x: Math.round(landmark1.actualX/THRESHOLD), y: Math.round(landmark1.actualY/THRESHOLD)};
		var l2 = {x: Math.round(landmark2.actualX/THRESHOLD), y: Math.round(landmark2.actualY/THRESHOLD)};
		var l1InPoints = false;
		var l2InPoints = false;
		points.forEach(point) {

		}
	});
}*/

// Calculate landmarks
// TODO: maybe calculate the exact angle to each corner within some distance
// away and only do the ray tracing for those?
var landmarks = [];
for (var x = 0; x <= 120; x = x + 5) {
	landmarks[x] = [];
	for (var y = 0; y <= 120; y = y + 5) {
		var localLandmarks = findLandmarks(simulateLidar(x, y, MAX_DISTANCE), MAX_DISTANCE);
		var localCornerLandmarks = [];
		localLandmarks.forEach(function(landmark) {
			var position = {
				x: x + landmark.x/10,
				y: y + landmark.y/10
			};
			if (isCorner(position)) {
				landmark.actualX = position.x;
				landmark.actualY = position.y;
				localCornerLandmarks.push(landmark);
			}
		});
		var parallelLandmarks = [];
		var lowestDistance = MAX_DISTANCE;
		localCornerLandmarks.forEach(function(landmark1) {
			if (landmark1.distance > lowestDistance) {
				return;
			}
			localCornerLandmarks.forEach(function(landmark2) {
				var horizontal = Math.abs(landmark1.actualX - landmark2.actualX) < THRESHOLD;
				var vertical = Math.abs(landmark1.actualY - landmark2.actualY) < THRESHOLD;
				if (!horizontal && !vertical) {
					return;
				}
				if (horizontal && vertical) {
					return;
				}
				if (horizontal) {
					var distance = Math.abs(landmark1.actualX - landmark2.actualX);
					var avgY = Math.round((landmark1.actualY*10 + landmark2.actualY*10) / 2);
					var minX = Math.round(Math.min(landmark1.actualX, landmark2.actualX)*10);
					var maxX = Math.round(Math.max(landmark1.actualX, landmark2.actualX)*10);
					for (var xx = minX+1; xx < maxX; xx++) {
						if (map.grid[xx][avgY] !== 1) {
							return;
						}
					}
				} else { // vertical
					var distance = Math.abs(landmark1.actualY - landmark2.actualY);
					var avgX = Math.round((landmark1.actualX*10 + landmark2.actualX*10) / 2);
					var minY = Math.round(Math.min(landmark1.actualY, landmark2.actualY)*10);
					var maxY = Math.round(Math.max(landmark1.actualY, landmark2.actualY)*10);
					for (var yy = minY+1; yy < maxY; yy++) {
						if (map.grid[avgX][yy] !== 1) {
							return;
						}
					}
				}
				lowestDistance = Math.min(landmark1.distance, landmark2.distance);
				parallelLandmarks = [landmark1, landmark2];
			});
		});
		//var finalLandmarks = [];

		landmarks[x][y] = parallelLandmarks;

		/*var lidarReadings = [];

		for (var i = 0; i < map.walls.length; i++) {
			var wall = map.walls[i];
			var vertical = false;
			var horizontal = false;
			var corners = [];
			if (Math.round(wall[0][0] - wall[1][0]) < THRESHOLD) {
				vertical = true;
			} else {
				horizontal = true;
			}
			corners.push({x: wall[0][0], y: wall[0][1]});
			corners.push({x: wall[0][0], y: wall[1][1]});
			corners.push({x: wall[1][0], y: wall[0][1]});
			corners.push({x: wall[1][0], y: wall[1][1]});

		}*/
	}
}
console.log('Calculated landmarks in ' + Math.round(Date.now()-startTime) + ' ms');
startTime = Date.now();

var landmarkCounts = [];
var maxCount = 0;
for (var x = -5; x <= 125; x++) {
	landmarkCounts[x] = [];
	for (var y = -5; y <= 125; y++) {
		landmarkCounts[x][y] = 0;
	}
}

for (var x = 0; x <= 120; x = x + 5) {
	for (var y = 0; y <= 120; y = y + 5) {
		landmarks[x][y].forEach(function (landmark) {
			landmarkCounts[Math.round(x+landmark.x/10)][Math.round(y+landmark.y/10)]++;
		});
	}
}

for (var x = -5; x <= 125; x++) {
	for (var y = -5; y <= 125; y++) {
		if (landmarkCounts[x][y] > maxCount) {
			maxCount = landmarkCounts[x][y];
		}
	}
}
//console.log(maxCount);

console.log('Calculated max landmark counts in ' + Math.round(Date.now()-startTime) + ' ms');
startTime = Date.now();

//console.log(calculateLandmarks(10, 20));
module.exports = {
	raw: landmarks,
	landmarks: landmarks,
	counts: landmarkCounts,
	maxCount: maxCount
};
