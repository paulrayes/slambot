
//var Promise = require('promise');
//var Parallel = require('paralleljs');

var findLandmarks = require('../helpers/findLandmarks');
var simulateLidar = require('../helpers/simulateLidar');

var startTime = Date.now();

// We are going to identify visible landmarks at each 5-cm-apart position in the map

// Loop through all the 5-cm-apart positions
// Start 5cm away from the edges of the map as those cannot be places of interest
var x, y;
//for (x=0; x<grid.length-5; x = x + 5) {
//	for (y=0; y<grid.length-5; y = y + 5) {
//		calculateLandmarks(x, y);
//	}
//}
//calculateLandmarks(120, 200);
//module.exports = readings;

/*function calculateLandmarks(x, y) {
	var readings = simulateLidar(x, y);

	var landmarks = findLandmarks(readings);

	return landmarks;
}*/

/*var xValues = [];
for (var x = 0; x <= 120; x = x + 5) {
	xValues.push(x);
}

var p = new Parallel(xValues).require({fn: findLandmarks, name: 'findLandmarks'}).require({fn: simulateLidar, name: 'simulateLidar'});

var landmarks = [];

p.map(function pMap(x) {
	var landmarks = [];
	for (var y = 0; y <= 120; y = y + 5) {
		//landmarks[y] = calculateLandmarks(x, y);
		landmarks[y] = findLandmarks(simulateLidar(x, y));
	}
	return landmarks;
}).then(function() {
	for (var x = 0; x <= 120; x = x + 5) {
		landmarks[x] = arguments[x/5];
	}
	console.log(landmarks[10][20]);
});*/

var landmarks = [];
for (var x = 0; x <= 120; x = x + 5) {
	landmarks[x] = [];
	for (var y = 0; y <= 120; y = y + 5) {
		landmarks[x][y] = findLandmarks(simulateLidar(x, y));
	}
}

var landmarkCounts = [];
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

var maxCount = 0;
for (var x = -5; x <= 125; x++) {
	for (var y = -5; y <= 125; y++) {
		if (landmarkCounts[x][y] > maxCount) {
			maxCount = landmarkCounts[x][y];
		}
	}
}
//console.log(maxCount);

console.log('Calculated landmarks in ' + Math.round(Date.now()-startTime) + ' ms');

//console.log(calculateLandmarks(10, 20));
module.exports = {
	raw: landmarks,
	landmarks: landmarks,
	counts: landmarkCounts,
	maxCount: maxCount
};
