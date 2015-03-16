var pru = require('prussdrv');

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

	// Calculate our calculations
	var ratio = lowCycles / totCycles * 100;
	var concentration = 1.1 * Math.pow(ratio, 3) - 3.8 * Math.pow(ratio, 2) + 520 * ratio + 0.62;
	var particles = concentration/0.000283;
	if (particles < 50000) {
		// Bad reading, we'll never reasonably get this few
		console.log('skip');
		return setTimeout(getReadings, 1000);
	}
	var pm25 = particles * particleWeight * 1000;
	var aqi = -5.951e-8 * Math.pow(pm25, 4) + 6.006e-5 * Math.pow(pm25, 3) - 0.02 * Math.pow(pm25, 2) + 3.149 * pm25 + 12.596;

	// Print out the numbers
	console.log(' ');
	//console.log(loopCounter + ': ' + lowCycles +  ' cycles low and   ' + totCycles + ' cycles total');
	//console.log(loopCounter + ': ' + ratio + ' %');
	//console.log(loopCounter + ': ' + Math.round(concentration) + ' pcs/283ml');
	console.log(loopCounter + ': ' + Math.round(particles/1000)/1000 + ' M pcs/m3 (>= 1um)');
	console.log(loopCounter + ': ' + Math.round(pm25) + ' ug/m3 (>= 1um, approx PM2.5)');
	console.log(loopCounter + ': ' + Math.round(aqi) + ' air quality index');

	// Also print out the ISO rating and AQI category
	if (particles < 0.083) {
		console.log('ISO 1');
	} else if (particles < 0.83) {
		console.log('ISO 2');
	} else if (particles < 8.3) {
		console.log('ISO 3');
	} else if (particles < 83) {
		console.log('ISO 4');
	} else if (particles < 832) {
		console.log('ISO 5');
	} else if (particles < 8320) {
		console.log('ISO 6');
	} else if (particles < 83200) {
		console.log('ISO 7');
	} else if (particles < 832000) {
		console.log('ISO 8');
	} else if (particles < 8320000) {
		console.log('ISO 9');
	} else {
		console.log('Rating above all ISO levels');
	}

	if (pm25 > 250.4) {
		console.log('AQI Category: Hazardous');
	} else if (pm25 > 150.4) {
		console.log('AQI Category: Very Unhealthy');
	} else if (pm25 > 55.4) {
		console.log('AQI Category: Unhealthy');
	} else if (pm25 > 35.4) {
		console.log('AQI Category: Unhealthy for Sensitive Groups');
	} else if (pm25 > 12) {
		console.log('AQI Category: Moderate');
	} else {
		console.log('AQI Category: Good');
	}

	setTimeout(getReadings, 1000);
}

setTimeout(getReadings, 1000);

module.exports = null;
