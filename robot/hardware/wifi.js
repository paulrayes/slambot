'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var childProcess = require('child_process');
var Promise = require('promise');
var lcd = require('./lcd');
//var lcd = {setRow: function() {}};

// Make a promiseified function so our code is neater and all the error handling is in one spot
// This runs a command in the terminal, options match the options of the exec function in node
// Returns a promise, it's resolved with stdout, or rejected if there is an error or any text in stderr
function exec(command, options) {
	return new Promise(function(resolve, reject) {
		childProcess.exec(command, options, function(err, stdout, stderr) {
			if (err) {
				if (stderr) {
					reject(stderr);
				} else {
					reject(err);
				}
				return;
			}
			resolve(stdout);
		})
	});
}

// List of all the networks we know, this would probably be good to put in a JSON file somewhere instead
var networks = [
	{
		ssid: 'ShadowOfMonsters',
		wpa_supplicant: '/etc/wpa_supplicant_ShadowOfMonsters.conf'
	},
	{
		ssid: 'ForestWithoutTrees',
		wpa_supplicant: '/etc/wpa_supplicant_ForestWithoutTrees.conf'
	}/*,
	{
		ssid: 'asu_encrypted',
		wpa_supplicant: '/etc/wpa_supplicant.conf'
	}*/
];

// Name of the WiFi network we're connected to
var network = '';
// Our IP address
var ip = '';

// Wait for some number of milliseconds
// val is passed through unchanged so you can have the thing before the pause send it's
// output to the thing after the pause
function pause(ms, val) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(val);
		}, ms);
	});
}

// Sets the module variables `network` and `ip` with the currently connected network and IP address
function getNetworkAndIp(val) {
	return exec('iwconfig wlan0 && ifconfig wlan0').then(function(stdout) {
		network = '';
		networks.forEach(function(nw) {
			if (stdout.indexOf(nw.ssid) > -1) {
				network = nw.ssid;
			}
		});
		ip = '';
		if (stdout.indexOf('inet addr') > -1) {
			ip = stdout.match(/inet\ addr:(\w|\.)+/)[0].substr(10);
		}
		module.exports.emit('change');
		return val;
	})
}

// Sets the module variable `network` with the currently connected network
function getNetwork(val) {
	return exec('iwconfig wlan0').then(function(stdout) {
		network = '';
		networks.forEach(function(nw) {
			if (stdout.indexOf(nw.ssid) > -1) {
				network = nw.ssid;
			}
		});
		module.exports.emit('change');
		return val;
	});
}

// Sets the module variable `ip` with the current IP address
function getIpAddress(val) {
	return exec('ifconfig wlan0').then(function(stdout) {
		ip = '';
		if (stdout.indexOf('inet addr') > -1) {
			ip = stdout.match(/inet\ addr:(\w|\.)+/)[0].substr(10);
		}
		module.exports.emit('change');
		return val;
	});
}

// Attempts to connect to the first known network
function connectWifi() {
	console.log('wifi: attempting to connect');
	lcd.setWrappedString('searching...');
	// Bring the wifi adapter up and search for known wifi networks
	return exec('ifconfig wlan0 up').then(function() {
		console.log('wifi: adapter is up, searching for networks');
		// Can't scan right away, 3 seconds seems to be long enough to wait
		return pause(3000).then(function() {
			return exec('iwlist wlan0 scan | grep ESSID');
		});
	}).then(function(stdout) {
		// Look through the list of networks and see if we know any of them
		var nw = false;
		networks.forEach(function(nnww) {
			if (stdout.indexOf(nnww.ssid) > -1) {
				nw = nnww;
			}
		});
		// If we know a network connect to it
		if (nw !== false) {
			network = nw.ssid;
			console.log('wifi: found network ' + network);
			lcd.setWrappedString( 'connecting..');
			return exec('wpa_supplicant -B -d -i wlan0 -c ' + nw.wpa_supplicant);
		} else {
			throw ('wifi: no known networks found');
		}
	}).then(function(stdout) {
		// wpa_supplicant takes time, it completes but we aren't actually connected for a few seconds
		return pause(5000, stdout);
		// Finally check to see if it worked
	}).then(getNetwork).then(function(stdout) {
		// See if we are now connected
		if (network !== '') {
			console.log('wifi: connected to ' + network);
			lcd.setWrappedString(network);
			return network;
		} else {
			console.log('wifi: wpa_supplicant could not connect');
			throw (stdout);
		}
	});
}

// Attempt to obtain an IP address lease with dhcp
function obtainIp() {
	lcd.setWrappedString(network + ' dhclient...');
	console.log('wifi: attempting to obtain ip address')
	return exec('dhclient -v -1 wlan0', {timeout: 15000}).then(function() {
		return pause(1000);
	}).then(getIpAddress).then(function() {
		if (ip !== '') {
			console.log('wifi: obtained IP address: ' + ip);
			lcd.setWrappedString(network + ' ' + ip);
		} else {
			console.log('wifi: could not obtain IP address');
			lcd.setWrappedString(network + ' dhclient err');
		}
	});
}

function setTime() {
	console.log('wifi: attempting to set time');
	return exec('ntpdate time.nist.gov').then(function() {
		return pause(500);
	}).then(displayTime);
}

function displayTime() {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var date = new Date();
	var day = date.getDate();
	var month = months[date.getMonth()];
	var year = date.getFullYear();
	var hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
	var ampm = date.getHours() > 11 ? 'PM' : 'AM';
	var minute = date.getMinutes();
	var second = date.getSeconds();
	console.log('wifi: Current time is ' + day + ' ' + month + ' ' + year + ', ' + hour + ':' + minute + ':' + second + ' ' + ampm);
}

// Determine whether we are currently connected to a network and if we have an IP address
lcd.setWrappedString('searching...');
getNetworkAndIp().then(function() {
	if (network !== '' && ip !== '') {
		// We are connected and have an IP address, we're done
		return;
	} else if (network !== '') {
		// We are connected but need an IP address, so do just that.
		lcd.setWrappedString(network);
		return obtainIp();
	} else {
		// We are not connected. Do everything.
		return connectWifi().then(obtainIp);
	}
}).then(function() {
	var date = new Date();
	if (date.getFullYear() > 2014) {
		return displayTime();
	} else {
		return setTime();
	}
}).then(function() {
	// guaranteed to be connected here
	console.log('wifi: connected to ' + network + ', ip ' + ip);
	lcd.setWrappedString(network + ' ' + ip);
	module.exports.emit('change');
}).catch(function(err) {
	// Something went wrong
	console.log('wifi error!');
	lcd.setWrappedString('Wifi error!');
	//Commented line below should display the error we reached but it isn't working
	//lcd.setRow(1, err);
	console.log(err);
});

module.exports = assign({}, EventEmitter.prototype, {
	isConnected: function() {
		return network !== '' && ip !== '';
	},
	getNetwork: function() {
		return network;
	},
	getIpAddress: function() {
		return ip;
	}
});
