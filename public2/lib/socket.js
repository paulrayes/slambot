var io = require('socket.io-client');
var secret = require('../secret');

if (typeof io === 'undefined') {
	// Not connected to robot, use a mock
	var socket = {
		emit: function(event, data) {
			//console.log('[socket.io mock] event ' + event + ' emitted.');
		},
		on: function(event, cb) {
			//console.log('[socket.io mock] callback for event ' + event + ' registered.');
		}
	};
	console.log('using socket.io mock');
} else {
	//var socket = io.connect(document.querySelector('body').dataset.robothostname);
	
	//var socket = io('192.168.7.2:8080');
	var socket = io(secret.sshHost + ':8080');
}

module.exports = socket;
