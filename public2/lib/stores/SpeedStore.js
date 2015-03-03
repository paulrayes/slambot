var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var data = {
	x: 0,
	y: 0,
	z: 0
};

var SpeedStore = assign({}, EventEmitter.prototype, {
	data: data
});

socket.on('speed:update', function(newData) {
	SpeedStore.data = newData;
	SpeedStore.emit('change');
});

module.exports = SpeedStore;
