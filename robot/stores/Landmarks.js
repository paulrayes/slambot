'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var io = require('../socket');

var LidarStore = require('../hardware/lidar');
var EstimatedPositionStore = require('./EstimatedPositionStore');
var getLandmarkRange = require('../fixture/landmarks').getLandmarkRange;
var findLandmarks = require('../helpers/findLandmarks');
var filterLandmarks = require('../helpers/filterLandmarks');

var data = {
	estimatedPosition: {x: 0, y: 0},
	landmarkRange: {},
	allLandmarks: [],
	possibleLandmarks: []
};

var LandmarksStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return data;
	}
});

LidarStore.on('change', function() {
	// Get data from stores
	var readings = LidarStore.getAll();
	data.estimatedPosition = EstimatedPositionStore.getAll()

	// Calculate landmarks
	data.landmarkRange = getLandmarkRange(data.estimatedPosition);
	data.allLandmarks = findLandmarks(readings);
	data.possibleLandmarks = filterLandmarks(data.landmarkRange, 0, data.estimatedPosition, data.allLandmarks);

	// Emit change
	LandmarksStore.emit('change');
	io.sockets.emit('landmarks:update', data);
});

module.exports = LandmarksStore;
