var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var initialSpeed = {
	x: 0,
	y: 0
};

var SpeedStore = assign({}, EventEmitter.prototype, {
	data: initialSpeed
});

module.exports = SpeedStore;
