var wallLocations = [
	[
		// vertical wall locations
		// read from pauls map drawing bottom to top, left to right
		[0, 0],
		[0, 48]
	],
	[
		[8, 0],
		[8, 20]
	],
	[
		[14, 28],
		[14, 32]
	],
	[
		[14, 40],
		[14, 48]
	],
	[
		[24, 0],
		[24, 20]
	],
	[
		[24, 40],
		[24, 48]
	],
	[
		[32, 28],
		[32, 40]
	],
	//*********
	//This wall location may be changed to create a door to connect with add-on environment
	// could be modified to [[48, 0], [48, 12]], [[48, 28], [48, 48]],
	[
		[48, 0],
		[48, 48]
	],
	//*********
	//
	// horizontal wall locations
	// read from pauls map drawing bottom to top, left to right
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

//initiate grid, set all values to zero
var grid = [];
for (var x = -5; x <= 125; x++) {
	grid[x] = [];
	for (var y = -5; y <= 125; y++) {
		grid[x][y] = 0;
	}
}

//Convert from inches to cm. Each value in wallLocations array is multiplied by 2.54
var x0, x1, y0, y1;
for (var k = 0, kk = wallLocations.length; k < kk; k++) {
	x0 = wallLocations[k][0][0] * 2.54;
	y0 = wallLocations[k][0][1] * 2.54;
	x1 = wallLocations[k][1][0] * 2.54;
	y1 = wallLocations[k][1][1] * 2.54;

	//within array, if x = x then its a vertical box, if y = y then its horizonal box
	if (x0 === x1) { //if both x's are equal, vertical

		x0 = x0 - 0.375 * 2.54;
		x1 = x1 + 0.375 * 2.54;

	} else { //if the x's are not equal then its a horizontal box
		y0 = y0 - 0.375 * 2.54;
		y1 = y1 + 0.375 * 2.54;
	}

	x0 = Math.round(x0); //round up value to nearest whole value
	x1 = Math.round(x1);
	y0 = Math.round(y0);
	y1 = Math.round(y1);
	/*console.log({
		x0: x0,
		y0: y0,
		x1: x1,
		y1: y1
	});*/

	for (x = x0; x <= x1; x++) {
		for (y = y0; y <= y1; y++) {
			grid[x][y] = 1;
		}
	}

	wallLocations[k][0][0] = x0;
	wallLocations[k][0][1] = y0;
	wallLocations[k][1][0] = x1;
	wallLocations[k][1][1] = y1;

}

// Declare string variable with string constructor
var checkString = '';
for (var y = 125; y >= -5; y--) { //read left to right, top to bottom
	for (var x = -5; x <= 125; x++) {
		if (grid[x][y] === 1) {
			checkString += 'X';
		} else {
			checkString += ' ';
		}
	}
	checkString += '\n';
}
//console.log('This is verifying the occupancy grid');
//console.log(checkString);

module.exports = {
	walls: wallLocations,
	grid: grid
};
