/*jslint node: true */
'use strict';
var express = require('express');

var port = 3002;

var app = express();

// Serve socket.io script, it's in a weird place but we want to keep it there so it's always the correct version.
// If we copied it elsewhere or installed it with bower like the other scripts, the robot's version might update at
// a different time. That would be pretty bad, as the client and server scripts must be the same version to work.
app.use(
	'/socket.io/',
	express.static(__dirname + '/../node_modules/socket.io/node_modules/socket.io-client/dist/')
);

// And serve all the other files
app.use(express.static(__dirname + '/../build/'));

// Start listening
app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});
