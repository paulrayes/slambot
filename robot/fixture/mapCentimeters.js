var startTime = Date.now();

// Array that contains the location of each wall on our environment
var wallLocations = [
	[
		[0, 0],
		[0, 48]
	],
	[
		[8, 0],
		[8, 20.5]
	],
	[
		[14, 27.5],
		[14, 32]
	],
	[
		[14, 39.8],
		[14, 48]
	],
	[
		[24, 0],
		[24, 20.5]
	],
	[
		[24, 40],
		[24, 48]
	],
	[
		[32, 27.5],
		[32, 40]
	],
	[
		[48, 0],
		[48, 48]
	],

	[
		[0, 0],
		[48, 0]
	],
	[
		[32, 12],
		[40, 12]
	],
	[
		[8, 20],
		[14, 20]
	],
	[
		[24, 20],
		[40, 20]
	],
	[
		[0, 28],
		[14, 28]
	],
	[
		[32, 28],
		[48, 28]
	],
	[
		[14, 40],
		[16, 40]
	],
	[
		[36, 40],
		[48, 40]
	],
	[
		[0, 48],
		[48, 48]
	]
];

// Initiate grid, set all values to zero
var grid = [];
for (var x = -50; x <= 1250; x++) {
	grid[x] = [];
	for (var y = -50; y <= 1250; y++) {
		grid[x][y] = 0;
	}
}

// Convert from inches to cm. Each value in wallLocations array is multiplied by 2.54
var x0, x1, y0, y1;
for (var k = 0, kk = wallLocations.length; k < kk; k++) {
	x0 = wallLocations[k][0][0];// * 2.54;
	y0 = wallLocations[k][0][1];// * 2.54;
	x1 = wallLocations[k][1][0];// * 2.54;
	y1 = wallLocations[k][1][1];// * 2.54;

	// Within array, if x = x then its a vertical box, if y = y then its horizonal box
	if (x0 === x1) { //if both x's are equal, vertical

		x0 = x0 - 0.375 * 2.54;
		x1 = x1 + 0.375 * 2.54;

	} else { //if the x's are not equal then its a horizontal box
		y0 = y0 - 0.375 * 2.54;
		y1 = y1 + 0.375 * 2.54;
	}

	// Round up value to nearest whole value
	x0 = Math.round(x0);
	x1 = Math.round(x1);
	y0 = Math.round(y0);
	y1 = Math.round(y1);

	for (x = x0*10; x <= x1*10; x++) {
		for (y = y0*10; y <= y1*10; y++) {
			grid[x][y] = 1;
		}
	}

	// Location of wall based on lower left and top right of a block.
	wallLocations[k][0][0] = x0;
	wallLocations[k][0][1] = y0;
	wallLocations[k][1][0] = x1;
	wallLocations[k][1][1] = y1;

}


module.exports = {
	walls: wallLocations,
	grid: grid
};

console.log('Built map in ' + Math.round(Date.now()-startTime) + ' ms');
