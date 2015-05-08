var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var data = [];/*{
	counter: -1,
	lowCycles: -1,
	totCycles: -1,
	ratio: -1,
	concentration: -1,
	particles: -1,
	pm25: -1,
	aqi: -1,
	iso: -1,
	aqi: -1,
	aqiIndex: -1,
	aqiString: ''
};*/

var AqStore = assign({}, EventEmitter.prototype, {
	data: data
});

socket.on('aq:update', function(newData) {
	AqStore.data = newData;
	AqStore.emit('change');
});

module.exports = AqStore;
