var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var socket = require('../socket');

var data = {
	key: -1,
	readings: []
};

var LidarStore = assign({}, EventEmitter.prototype, {
	data: data
});

socket.on('lidar:update', function(newData) {
	LidarStore.data = newData;
	LidarStore.emit('change');
});
//LidarStore.data = { count: 0, readings: require('../../lidarGen') };
//LidarStore.data = { count: 0, readings: require('../../../robot/fixture/landmarks') };

module.exports = LidarStore;
