// 
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var os = require('os');
var usage = require('usage');
var lag = require('event-loop-lag')(1000);
var io = require('../socket');

//Default value
var data = {
	lag: 0,
	load: 0,
	cpu: 0,
	memory: 0
};

// Creating an object from an event.
var LoadStore = assign({}, EventEmitter.prototype, {
	get: function() {
		return data;
	}
});


// Every five seconds send the CPU/memory usage out on the socket
var pid = process.pid;
var emitLoad = function() {
	usage.lookup(pid, { keepHistory: true }, function(err, result) {
		data.load = os.loadavg()[0];
		data.cpu = result.cpu;
		data.memory = process.memoryUsage().heapTotal;
		LoadStore.emit('change');
		io.sockets.emit('load', data);
	});
	setTimeout(emitLoad, 5000);
};
setTimeout(emitLoad, 5000);


// Update the data every one second
var update = function() {
	data.lag = lag();
	LoadStore.emit('change');
	setTimeout(update, 1000);
};
setTimeout(update, 1000);

module.exports = LoadStore;
