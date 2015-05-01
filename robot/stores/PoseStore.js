'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var io = require('../socket');

var EstimatedPositionStore = require('./EstimatedPositionStore');
var ActualPositionStore = require('./ActualPosition');

var pose = {
	location: {}
};
var PoseStore = assign({}, EventEmitter.prototype, {
	get: function() {
		return pose;
	}
});


EstimatedPositionStore.on('change', function() {
	pose.location = EstimatedPositionStore.getAll();
	PoseStore.emit('change');
	io.sockets.emit('pose:update', pose);
});
ActualPositionStore.on('change', function() {
	pose.location = ActualPositionStore.getAll();
	EstimatedPositionStore.setEstimate(pose.location);
	PoseStore.emit('change');
	io.sockets.emit('pose:update', pose);
});

/*PoseStore.on('change', function() {
	console.log(pose.location.x + ' ' + pose.location.y);
});*/
