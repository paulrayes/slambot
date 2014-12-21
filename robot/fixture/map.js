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
		[16, 20],
		[32, 20]
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

//Convert from inches to cm. Each value in wallLocations array is multiplied by 2.54
for (var k = 0,
	var kk = wallLocations.length; k < kk; k++) {
	wallLocations[k][0][0] = wallLocations[k][0][0] * 2.54;
	wallLocations[k][0][1] = wallLocations[k][0][1] * 2.54;
	wallLocations[k][1][0] = wallLocations[k][1][0] * 2.54;
	wallLocations[k][1][1] = wallLocations[k][1][1] * 2.54;

	//within array, if x = x then its a vertical box, if y = y then its horizonal box
	if (wallLocations[k][0][0] == wallLocations[k][1][0]) { //if both x's are equal, vertical

		wallLocations[k][0][0] = wallLocations[k][0][0] - 0.375 * 2.54;
		wallLocations[k][1][0] = wallLocations[k][1][0] + 0.375 * 2.54;

	} else { //if the x's are not equal then its a horizontal box
		wallLocations[k][0][1] = wallLocations[k][0][1] - 0.375 * 2.54;
		wallLocations[k][1][1] = wallLocations[k][1][1] + 0.375 * 2.54;
	}

	wallLocations[k][0][0] = Math.round(wallLocations[k][0][0]); //round up value to nearest whole value
	wallLocations[k][1][0] = Math.round(wallLocations[k][1][0]);
	wallLocations[k][0][1] = Math.round(wallLocations[k][0][1]);
	wallLocations[k][1][1] = Math.round(wallLocations[k][1][1]);

	//create a box from line, start with (x, y) and add/subtract 0.375 to get a box
	//round up each value to 1. 
	//for loop 0 to 122 (on x-axis), -1 to 1 (on y-axis), 
	//set all x,y points to 1
	// for (var k = 0,
	// 	var kk = wallLocations.length,
	// 		k < kk; k++) {
	// 	wallLocations[k] = wallLocations[k] * 2.54;
	// 	console.log(“alkdsjflksadjf”);
	// }
	// var wallWidth = 0.75 * 2.54;
	//
	//