var startTime = Date.now();

// Initializing
var wallLocations = [
	[
		[0, 0],
		[120.8, 2]
	],
	[
		[0, 2],
		[2, 132]
	],
	[
		[20.9, 2],
		[22.9, 53]
	],
	[
		[22.9, 51],
		[36, 53]
	],
	[
		[59, 2],
		[61, 51]
	],
	[
		[59, 51],
		[98.9, 53]
	],
	[
		[79.9, 25.5],
		[100.2, 27.5]
	],
	[
		[118.8, 2],
		[120.8, 132]
	],
	[
		[0, 132],
		[120.8, 134]
	],
	[
		[60.7, 113.5],
		[62.7, 132]
	],
	[
		[82.7, 83],
		[84.7, 111.4]
	],
	[
		[84.7, 83],
		[118.8, 85]
	],
	[
		[2, 81.5],
		[34, 83.5]
	]
];


//initiate grid, set all values to zero
var grid = [];
for (var x = -50; x <= 1350; x++) {
	grid[x] = [];
	for (var y = -50; y <= 1350; y++) {
		grid[x][y] = 0;
	}
}

//Convert from inches to cm. Each value in wallLocations array is multiplied by 2.54
var x0, x1, y0, y1;
for (var k = 0, kk = wallLocations.length; k < kk; k++) {
	x0 = wallLocations[k][0][0];// * 2.54;
	y0 = wallLocations[k][0][1];// * 2.54;
	x1 = wallLocations[k][1][0];// * 2.54;
	y1 = wallLocations[k][1][1];// * 2.54;

/*
	//within array, if x = x then its a vertical box, if y = y then its horizonal box
	if (x0 === x1) { //if both x's are equal, vertical

		x0 = x0 - 0.375 * 2.54;
		x1 = x1 + 0.375 * 2.54;

	} else { //if the x's are not equal then its a horizontal box
		y0 = y0 - 0.375 * 2.54;
		y1 = y1 + 0.375 * 2.54;
	}
*/
	x0 = Math.round(x0); //round up value to nearest whole value
	x1 = Math.round(x1);
	y0 = Math.round(y0);
	y1 = Math.round(y1);

	for (x = x0*10; x <= x1*10; x++) {
		for (y = y0*10; y <= y1*10; y++) {
			grid[x][y] = 1;
		}
	}

	wallLocations[k][0][0] = x0;
	wallLocations[k][0][1] = y0;
	wallLocations[k][1][0] = x1;
	wallLocations[k][1][1] = y1;

}

// Declare string variable with string constructor
/*var checkString = '';
for (var y = 125; y >= -5; y--) { //read left to right, top to bottom
	for (var x = -5; x <= 125; x++) {
		if (grid[x][y] === 1) {
			checkString += 'X';
		} else {
			checkString += ' ';
		}
	}
	checkString += '\n';
}*/
//console.log('This is verifying the occupancy grid');
//console.log(checkString);

module.exports = {
	walls: wallLocations,
	grid: grid
};

console.log('Built map in ' + Math.round(Date.now()-startTime) + ' ms');
