'use strict';

var locationRanges = [
	{ // 0
		x: [-10,  20],
		y: [-10,  52],
		landmark1: {x:  1, y: 1, type: 'innercorner'},
		landmark2: {x: 19, y: 1, type: 'innercorner'}
	},
	{ // 1
		x: [ 20,  61],
		y: [-10,  52],
		landmark1: {x: 21, y: 1, type: 'innercorner'},
		landmark2: {x: 60, y: 1, type: 'innercorner'}
	},
	{ // 2
		x: [ 61, 130],
		y: [-10,  30],
		landmark1: {x:  61, y: 1, type: 'innercorner'},
		landmark2: {x: 121, y: 1, type: 'innercorner'}
	},
	{ // 3
		x: [61, 102],
		y: [30, 52],
		landmark1: {x: 61, y: 50, type: 'innercorner'},
		landmark2: {x: 102, y:  50, type: 'innercorner'}
	},
	{ // 4
		x: [102, 130],
		y: [30, 60],
		landmark1: {x: 120, y: 70, type: 'innercorner'},
		landmark2: {x: 120, y:  1, type: 'innercorner'}
	},
	{ // 5
		x: [-10, 35],
		y: [ 52, 60],
		landmark1: {x: 1, y: 70, type: 'innercorner'},
		landmark2: {x: 36, y: 70, type: 'lowedge'}
	},
	{ // 6
		x: [-10, 35],
		y: [ 60, 70],
		landmark1: {x: 20, y: 52, type: 'innercorner'},
		landmark2: {x: 36, y: 52, type: 'lowedge'}
	},
	{ // 7
		x: [35, 70],
		y: [52, 100],
		landmark1: {x: 80, y: 71, type: 'outercorner'},
		landmark2: {x: 80, y: 102, type: 'outercorner'}
	},
	{ // 8
		x: [70, 105],
		y: [50, 60],
		landmark1: {x: 80, y: 71, type: 'outercorner'},
		landmark2: {x: 120, y: 71, type: 'innercorner'}
	},
	{ // 9
		x: [70, 130],
		y: [60, 70],
		landmark1: {x: 62, y: 52, type: 'lowedge'},
		landmark2: {x: 101, y: 52, type: 'highedge'}
	},
	{ // 10
		x: [70, 81],
		y: [52, 100],
		landmark1: {x: 36, y: 71, type: 'lowedge'},
		landmark2: {x: 36, y: 80, type: 'highedge'}
	},
	{ // 11
		x: [-10, 15],
		y: [70, 130],
		landmark1: {x: 34, y: 102, type: 'lowedge'},
		landmark2: {x: 34, y: 121, type: 'innercorner'}
	},
	{ // 12
		x: [15, 35],
		y: [70, 130],
		landmark1: {x: 1, y: 73, type: 'innercorner'},
		landmark2: {x: 1, y: 121, type: 'innercorner'}
	},
	{ // 13
		x: [81, 130],
		y: [70, 90],
		landmark1: {x: 91, y: 102, type: 'highedge'},
		landmark2: {x: 120, y: 102, type: 'innercorner'}
	},
	{ // 14
		x: [81, 130],
		y: [90, 102],
		landmark1: {x: 82, y: 72, type: 'innercorner'},
		landmark2: {x: 120, y: 72, type: 'innercorner'}
	},
	{ // 15
		x: [35, 48],
		y: [100, 130],
		landmark1: {x: 60, y: 103, type: 'lowedge'},
		landmark2: {x: 60, y: 121, type: 'innercorner'}
	},
	{ // 16
		x: [48, 60],
		y: [100, 130],
		landmark1: {x: 36, y: 103, type: 'innercorner'},
		landmark2: {x: 36, y: 121, type: 'innercorner'}
	},
	{ // 17
		x: [60, 90],
		y: [100, 130],
		landmark1: {x: 121, y: 121, type: 'innercorner'},
		landmark2: {x: 121, y: 103, type: 'innercorner'}
	},
	{ // 18
		x: [90, 130],
		y: [100, 130],
		landmark1: {x: 62, y: 121, type: 'innercorner'},
		landmark2: {x: 62, y: 102, type: 'highedge'}
	}
];

for (var i = 0; i < locationRanges.length; i++) {
	var range = locationRanges[i];
	range.i = i;
	var deltaX = range.landmark2.x - range.landmark1.x;
	var deltaY = range.landmark2.y - range.landmark1.y;
	range.distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

	if (range.landmark1.x === range.landmark2.x) {
		range.orientation = 'vertical';
	} else {
		range.orientation = 'horizontal';
	}
}

function getLandmarkRange(position) {
	for (var i = 0; i < locationRanges.length; i++) {
		if (locationRanges[i].x[0] <= position.x && position.x <= locationRanges[i].x[1] && 
			locationRanges[i].y[0] <= position.y && position.y <= locationRanges[i].y[1]) {
			return locationRanges[i];
		}
	}
	throw('no landmarks found at ' + position.x + ', ' + position.y);
}

module.exports = {
	getLandmarkRange: getLandmarkRange
};
