'use strict';
var Promise = require('promise');
var Parallel = require('paralleljs');
var map = require('../fixture/map');
var grid = map.grid;

var readingCache = [];

// Exporting an object
module.exports = function(x, y, maxDistance, next) {
	x = x*10;
	y = y*10;
	if (typeof readingCache !== 'undefined' && typeof readingCache[x] !== 'undefined' && typeof readingCache[x][y] !== 'undefined') {
		return readingCache[x][y];
	}

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

			// Arithmetics using Pythagorean theorem
			var sinTheta = Math.sin(theta*Math.PI/180);
			var cosTheta = Math.cos(theta*Math.PI/180);
			var xx = Math.round(distance * sinTheta);
			var yy = Math.round(distance * cosTheta);

			while (grid[x+xx][y+yy] !== 1 && distance < maxDistance) {
				xx = Math.round(distance * sinTheta);
				distance = distance + 1;
			}

			// If statement that get new values of theta, distance
			if (grid[x+xx][y+yy] === 1) {
				readings.push({angle: theta, distance: distance});
			} else {
			}
		}
		if (typeof readingCache[x] === 'undefined') {
			readingCache[x] = [];
		}
		readingCache[x][y] = readings;
	return readings;
};
