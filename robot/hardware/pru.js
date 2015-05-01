
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var pru = require('prussdrv');

var io = require('../socket');

pru.init();

// Set the AQ reading to 0 initially so we know it's working later
pru.setDataRAMInt(1, 0);
pru.setDataRAMInt(2, 0);
pru.setDataRAMInt(3, 0);

pru.execute('pru0/aq.bin');

var loopCounter = 0;

/*
http://onlineconversion.vbulletin.net/forum/main-forums/convert-and-calculate/4208-conversion-of-particles-cm3-to-mg-m3
Average Particle Size
1 microns = 0.000001 meters
Volume of a Sphere (4/3)*pi*r³
(4/3)*pi*(0.000001)³=4.1887902e-18
Average Volume of a Particle is, then, 4.1887902e-18 m³

Density of a Particle
Density is 2.2 g/cm³
1,000,000 cm³/m³
2.2 g/cm³ * 1,000,000 cm³/m³= 2,200,000 g/m³
1,000 mg/g
2,200,000 g/m³ * 1000 mg/g = 2,200,000,000 mg/m³

Average Particle Weight
4.1887902e-18 m³ * 2,200,000,000 mg/m³ = 9.21533844e-9 mg/Particle
*/
var particleWeight = 9.21533844e-9;

var readings = [];
var data = {
	unix: -1,
	counter: -1,
	lowCycles: -1,
	totCycles: -1,
	ratio: -1,
	concentration: -1,
	particles: -1,
	pm25: -1,
	aqi: -1,
	iso: -1,
	aqi: -1,
	aqiIndex: -1,
	aqiString: ''
};
function getReadings() {
	// Determine if we have a new reading
	var loopCounterNew = pru.getDataRAMInt(1);
	if (loopCounterNew === loopCounter) {
		return setTimeout(getReadings, 1000);
	}
	loopCounter = loopCounterNew;

	// Get the new reading
	var totCycles = pru.getDataRAMInt(3);
	var lowCycles = totCycles - pru.getDataRAMInt(2);

	//console.log(' ');
	//console.log('aq: ' + loopCounter + ': ' + lowCycles +  ' cycles low and   ' + totCycles + ' cycles total');

	// Calculate our calculations
	var ratio = lowCycles / totCycles * 100;
	var concentration = 1.1 * Math.pow(ratio, 3) - 3.8 * Math.pow(ratio, 2) + 520 * ratio + 0.62;
	var particles = concentration/0.000283;
	if (particles < 50000) {
		// Bad reading, we'll never reasonably get this few
		console.log('aq: skip, particles = ' + particles);
		return setTimeout(getReadings, 1000);
	}
	if (loopCounter < 3) {
		console.log('aq: skip, loopCounter = ' + loopCounter);
	}
	var pm25 = particles * particleWeight * 1000;
	var aqi = -5.951e-8 * Math.pow(pm25, 4) + 6.006e-5 * Math.pow(pm25, 3) - 0.02 * Math.pow(pm25, 2) + 3.149 * pm25 + 12.596;

	// Print out the numbers
	//console.log('aq: ' + loopCounter + ': ' + ratio + ' %');
	//console.log('aq: ' + loopCounter + ': ' + Math.round(concentration) + ' pcs/283ml');
	console.log('aq: ' + loopCounter + ': ' + Math.round(particles/1000)/1000 + ' M pcs/m3 (>= 1um)');
	//console.log('aq: ' + loopCounter + ': ' + Math.round(pm25) + ' ug/m3 (>= 1um, approx PM2.5)');
	console.log('aq: ' + loopCounter + ': ' + Math.round(aqi) + ' air quality index');

	data.unix = Date.now();
	//data.lowCycles = lowCycles;
	//data.totCycles = totCycles;
	//data.ratio = ratio;
	//data.concentration = concentration;
	data.particles = particles;
	//data.pm25 = pm25;
	//data.aqi = aqi;
	// Also print out the ISO rating and AQI category
	if (particles < 0.083) {
		data.iso = 1;
	} else if (particles < 0.83) {
		data.iso = 2;
	} else if (particles < 8.3) {
		data.iso = 3;
	} else if (particles < 83) {
		data.iso = 4;
	} else if (particles < 832) {
		data.iso = 5;
	} else if (particles < 8320) {
		data.iso = 6;
	} else if (particles < 83200) {
		data.iso = 7;
	} else if (particles < 832000) {
		data.iso = 8;
	} else if (particles < 8320000) {
		data.iso = 9;
	} else {
		data.iso = -1;
	}
	if (data.iso > -1) {
		console.log('aq: ISO ' + data.iso);
	} else {
		console.log('aq: ISO rating above all levels');
	}

	var aqiStrings = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
	if (pm25 > 250.4) {
		data.aqiIndex = 5;
	} else if (pm25 > 150.4) {
		data.aqiIndex = 4;
	} else if (pm25 > 55.4) {
		data.aqiIndex = 3;
	} else if (pm25 > 35.4) {
		data.aqiIndex = 2;
	} else if (pm25 > 12) {
		data.aqiIndex = 1;
	} else {
		data.aqiIndex = 0;
	}
	console.log('aq: AQI ' + aqiStrings[data.aqiIndex]);

	readings.unshift(assign({}, data));
	AqStore.emit('change');
	io.sockets.emit('aq:update', data);

	setTimeout(getReadings, 1000);
}
io.sockets.on('connection', function(socket) {
	socket.emit('aq:update', readings);
});

setTimeout(getReadings, 1000);

var AqStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return readings;
	},
	cleanup: function() {
		console.log('aq: pru exiting');
		pru.exit();
	}
});

module.exports = AqStore;
