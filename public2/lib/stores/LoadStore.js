var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var data = {
	load: 0,
	cpu: 0,
	memory: 0
};


var LoadStore = assign({}, EventEmitter.prototype, {
	data: data
});

socket.on('load', function(newData) {
	LoadStore.data = newData;
	LoadStore.emit('change');
});

module.exports = LoadStore;
