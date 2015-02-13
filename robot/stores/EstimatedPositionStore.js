var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var initialPosition = {
	x: 10,
	y: 12
};

var EstimatedPositionStore = assign({}, EventEmitter.prototype, {
	data: initialPosition
});

module.exports = EstimatedPositionStore;
