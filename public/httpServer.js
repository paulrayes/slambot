/*jslint node: true */
'use strict';
var express = require('express');

var port = 8080;

var app = express();

app.use(express.static(__dirname + '/build'));

app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});
