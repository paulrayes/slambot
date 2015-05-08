'use strict';

var i2c = require('i2c');
var sourceCodePro = require('../fixture/sourceCodePro');

var wire = null;
var shownStrings = ['', '', '', ''];
var strings = ['', '', '', ''];
var positions = [0, 0, 0, 0];
var scroll = true;

function sendCommand(command) {
	wire.writeBytes(0x80, [command], function() {});
}
function sendByte(value) {
	wire.writeBytes(0x40, [value], function() {});
}

function delay(ms) {
	var endTime = Date.now() + ms;
	while (Date.now() < endTime) {}
}

function init_OLED() {
	sendCommand(0xae); //display off
	sendCommand(0x2e); //deactivate scrolling
	sendCommand(0xa4); //SET All pixels OFF

	//delay(50);
	sendCommand(0x20); //Set Memory Addressing Mode
	sendCommand(0x02); //Set Memory Addressing Mode to Page addressing mod
	sendCommand(0xa1); //colum address 127 mapped to SEG0 (POR) ** wires at top of board
	sendCommand(0xC8); // Scan from Left to Right               ** wires at top
	sendCommand(0xa6); // Set WHITE chars on BLACK backround
	//sendCommand(0xa7); // Set BLACK chars on WHITE backround
	sendCommand(0x81); // Setup CONTRAST CONTROL, following byte is the contrast Value
	sendCommand(0xff); // contrast value between 1 ( == dull) to 256 ( == bright)

	//delay(20);
	sendCommand(0xaf); //display on
	//delay(20);
}

function setXY(row, col) {
	sendCommand(0xb0+row);               //set page address
	sendCommand(0x00+(8*col&0x0f));      //set low col address
	sendCommand(0x10+((8*col>>4)&0x0f)); //set high col address
}

function clear_display() {
	for (var k=0;k<8;k++) {
		setXY(k,0);
		clear_line(k);
	}
}
function clear_line(k) {
	for (var i=0;i<128;i++) {
		sendByte(0);
	}
}

function sendStr(row, string, position) {
	var i, k;
	setXY(2*row, 0);
//	clear_line(row);
	for (k=0;k<12;k++) {
		if (k+position < string.length) {
			var charCode = string.charCodeAt(k+position);
			var charRow = Math.floor(charCode/25);
			var startIndex = 256*charRow*2 + (charCode-charRow*25)*10;
			for (i=0;i<10;i++) {
				sendByte(sourceCodePro[startIndex+i]);
				//delay(2);
			}
		} else {
			for (i=0;i<10;i++) {
				sendByte(0);
			}
		}
	}
	setXY(2*row+1, 0);
//	clear_line(row+1);
	for (k=0;k<12;k++) {
		if (k+position < string.length) {
			var charCode = string.charCodeAt(k+position);
			var charRow = Math.floor(charCode/25);
			var startIndex = 256*charRow*2 + 256 + (charCode-charRow*25)*10;
			for (i=0;i<10;i++) {
				sendByte(sourceCodePro[startIndex+i]);
				//delay(2);
			}
		} else {
			for (i=0;i<10;i++) {
				sendByte(0);
			}
		}
	}
}

function draw() {
	for (var i = 0; i < 4; i++) {
		if (strings[i] !== shownStrings[i]) {
			if (strings[i].length > 12) {
				strings[i] = '  ' + strings[i];
			}
			shownStrings[i] = strings[i];
			//console.log('lcd: drawing row ' + i);
			positions[i] = 0;
			sendStr(i, strings[i], positions[i]);
		} else if (strings[i].length > 12) {
			positions[i] = positions[i] + 1;
			if (positions[i] > strings[i].length-10) {
				positions[i] = 0;
			}
			sendStr(i, strings[i], positions[i]);
		}
	}
	if (scroll) {
		setTimeout(draw, 500);
	}
}


module.exports = {
	init: function() {
		wire = new i2c(0x3c, {device: '/dev/i2c-2'});
		init_OLED();
		clear_display();
		setTimeout(draw, 100);
	},
	setRow: function(row, string) {
		if (row < 0 || row > 3) {
			throw('lcd: row must be between 0 and 3');
		}
		if (typeof string !== 'string') {
			throw('lcd: string must be a string');
		}
		string = string.replace('\n', ' ');
		//console.log('lcd: setting row ' + row + ' to "' + string + '"');
		strings[row] = string;
		if (string.length > 12 && !scroll) {
			scroll = true;
			draw();
		}
	},
	setWrappedString: function(string) {
		if (typeof string !== 'string') {
			throw('lcd: string must be a string');
		}
		string = string.replace('\n', ' ');
		strings[0] = string.substr(0, 12);
		strings[1] = string.substr(12, 12);
		strings[2] = string.substr(24, 12);
		strings[3] = string.substr(36, 12);
		scroll = false;
		draw();
	}
};
