if (typeof io === 'undefined') {
	// Not connected to robot, use a mock
	var socket = {
		emit: function(event, data) {
			console.log('[socket.io mock] event ' + event + ' emitted.');
		},
		on: function(event, cb) {
			console.log('[socket.io mock] callback for event ' + event + ' registered.');
		}
	};
} else {
	//var socket = io.connect(document.querySelector('body').dataset.robothostname);
	var socket = io('arm.local:8080');
}

module.exports = socket;
