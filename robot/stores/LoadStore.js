var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var os = require('os');
var usage = require('usage');
var lag = require('event-loop-lag')(1000);
var io = require('../socket');

var data = {
	lag: 0,
	load: 0,
	cpu: 0,
	memory: 0
};

var LoadStore = assign({}, EventEmitter.prototype, {
	get: function() {
		return data;
	}
});


// Every five seconds send the CPU/memory usage out on the socket
var pid = process.pid;
var emitLoad = function() {
	usage.lookup(pid, { keepHistory: true }, function(err, result) {
		//console.log(result);
		data.load = os.loadavg()[0];
		data.cpu = result.cpu;
		data.memory = process.memoryUsage().heapTotal;
		LoadStore.emit('change');
		io.sockets.emit('load', data);
		/*io.sockets.emit('load', {
			lag: lag(),
			load: os.loadavg()[0],
			cpu: result.cpu,
			memory: process.memoryUsage().heapTotal //result.memory
		});*/
	});
	setTimeout(emitLoad, 5000);
};
setTimeout(emitLoad, 5000);



var update = function() {
	data.lag = lag();
	LoadStore.emit('change');
	setTimeout(update, 1000);
};
setTimeout(update, 1000);

module.exports = LoadStore;
