var x = 12;
var y = 20;
var theta = 175;

var distances = [];
for (var i = 0; i < 360; i = i + Math.random()*2.6) {
	var distance = 0;
	if (i < 15) {
		distance = (70-y) / Math.cos((i) * Math.PI / 180);
	} else if (i < 90) {
		distance = (20-x) / Math.cos((90 - i) * Math.PI / 180);
	} else if (i < 158) {
		distance = (20-x) / Math.cos((i - 90) * Math.PI / 180);
	} else if (i < 180) {
		distance = y / Math.cos((180 - i) * Math.PI / 180);
	} else if (i < 211) {
		distance = y / Math.cos((i - 180) * Math.PI / 180);
	} else if (i < 270) {
		distance = x / Math.cos((270 - i) * Math.PI / 180);
	} else if (i < 347) {
		distance = x / Math.cos((i - 270) * Math.PI / 180);
	} else {
		distance = (70-y) / Math.cos((360 - i) * Math.PI / 180);
	}
	distances.push({angle:i-theta, distance:distance});
}
var i = 0;
while (distances[i].angle > 4) {
	i++;
	if (distances[i].angle >= 360) {
		distances[i].angle = distances[i].angle - 360;
	}
	if (distances[i].angle < 0) {
		distances[i].angle = distances[i].angle + 360;
	}
	console.log(i, distances[i].angle);
}
var distances2 = [];
while (distances.length !== distances2.length) {
	if (distances[i].angle >= 360) {
		distances[i].angle = distances[i].angle - 360;
	}
	if (distances[i].angle < 0) {
		distances[i].angle = distances[i].angle + 360;
	}
	distances2.push(distances[i]);
	i++;
	if (i >= distances.length) {
		i = 0;
	}
}

console.log('float array [' + distances2.length + '][2] = {');
distances2.forEach(function(distance) {
	console.log('	{' + distance.angle + ', ' + distance.distance + '},');
})
console.log('};');
console.log();console.log();console.log();
console.log(distances2);

module.exports = distances2;