var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var data = {
	landmarkRange: undefined,
	allLandmarks: [],
	possibleLandmarks: []
};

var LandmarksStore = assign({}, EventEmitter.prototype, {
	data: data
});

socket.on('landmarks:update', function(newData) {
	LandmarksStore.data = newData;
	LandmarksStore.emit('change');
});

module.exports = LandmarksStore;
