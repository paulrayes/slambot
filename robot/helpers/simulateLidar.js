'use strict';
//var Promise = require('promise');
//var Parallel = require('paralleljs');
var map = require('../fixture/map');
var grid = map.grid;

var readingCache = [];

module.exports = function(x, y, maxDistance, next) {
	x = x*10;
	y = y*10;
	if (typeof readingCache !== 'undefined' && typeof readingCache[x] !== 'undefined' && typeof readingCache[x][y] !== 'undefined') {
		return readingCache[x][y];
	}
	//var p = new Parallel([x, y, grid]).spawn(function(data) {
		//var x = data[0];
		//var y = data[1];
		//var grid = data[2];

		var startTime = Date.now();

		// Ensure we aren't sitting inside a wall, check a 4x4cm box
		for (var xx = -2; xx <= 2; xx++) {
			for (var yy = -2; yy <= 2; yy++) {
				if (typeof grid[x+xx] === 'undefined' || typeof grid[x+xx][y+yy] === 'undefined' || grid[x+xx][y+yy] === 1) {
					return [];
				}
			}
		}
		// Ensure we aren't outside the walls
		if (x < 0 || x > 1220 || y < 0 || y > 1220) {
			return [];
		}
		var readings = [];
		// Do some ray-tracing for different angles to get some LIDAR-like readings
		for (var theta = 0; theta < 360; theta = theta + 1) {
			// Check various distances starting at 1 until we hit an obstacle
			var distance = 1;
			//var isObstacle = false;
			var sinTheta = Math.sin(theta*Math.PI/180);
			var cosTheta = Math.cos(theta*Math.PI/180);
			var xx = Math.round(distance * sinTheta);
			var yy = Math.round(distance * cosTheta);

			while (grid[x+xx][y+yy] !== 1 && distance < maxDistance) {
				xx = Math.round(distance * sinTheta);
				yy = Math.round(distance * cosTheta);
				//console.log(x+xx, y+yy);
				//if (grid[x+xx][y+yy] === 1) {
					//isObstacle = true;
				//}
				distance = distance + 1;
			}
			if (grid[x+xx][y+yy] === 1) {
				readings.push({angle: theta, distance: distance});
			} else {
				//console.log('Could not find any obstacles at ('+x+','+y+') angle '+theta+', perhaps your map is too small?');
			}
		}
		//console.log('Calculated lidar readings in ' + Math.round(Date.now()-startTime) + ' ms');
	//	return readings;
	//}).then(function(readings) {
		if (typeof readingCache[x] === 'undefined') {
			readingCache[x] = [];
		}
		readingCache[x][y] = readings;
	//});
	return readings;
	//return p;
	/*function zeWorkerFunc() {
		self.addEventListener('message', function(e) {
			self.postMessage(e.data);
		}, false);
	}
	var workerData = window.URL.createObjectURL(new Blob(
		['(' + zeWorkerFunc.toString() + ')()'],
		{ type: "text/javascript"}
	));

	var myWorker = new Worker(workerData);

	myWorker.addEventListener('message', function(e) {
		//console.log(e.data);
		next(e.data);
	});
	myWorker.postMessage([x, y]);*/
};
