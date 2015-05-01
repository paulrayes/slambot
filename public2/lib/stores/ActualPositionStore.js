var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var initialPosition = require('../../../robot/config').initialPosition;
var data = {
	x: initialPosition.x,
	y: initialPosition.y,
	heading: 0
};

var ActualPositionStore = assign({}, EventEmitter.prototype, {
	data: data
});

socket.on('actualPosition:update', function(newData) {
	ActualPositionStore.data = newData;
	ActualPositionStore.emit('change');
});

module.exports = ActualPositionStore;
