var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// TODO the map should be retreived from the robot instead of being hard-coded here
var knownMap = require('../../../robot/fixture/map');

var KnownMapStore = assign({}, EventEmitter.prototype, {
	getGrid: function() {
		return knownMap.grid;
	},
	getWalls: function() {
		return knownMap.walls;
	}
});

module.exports = KnownMapStore;
