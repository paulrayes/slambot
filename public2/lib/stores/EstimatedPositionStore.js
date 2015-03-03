var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var data = {
	x: 0,
	y: 0,
	z: 0
};

var all = [];

var EstimatedPositionStore = assign({}, EventEmitter.prototype, {
	data: data,
	getAll: function() {
		return all;
	}
});

socket.on('estimatedPosition:update', function(newData) {
	EstimatedPositionStore.data = newData;
	all.push(newData);
	EstimatedPositionStore.emit('change');
});

module.exports = EstimatedPositionStore;
