'use strict';

//This uses data from landmarks to determine the estimated position.
module.exports = function(landmarkRange, estimatedPosition, landmarks) {
	if (landmarks.length !== 2) {
		return estimatedPosition;
	}
	
}