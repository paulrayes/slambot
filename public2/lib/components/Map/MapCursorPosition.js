// Requires files to run
var React = require('react');
var getLandmarkRange = require('../../../../robot/fixture/landmarks').getLandmarkRange;
var simulateLidar = require('../../../../robot/helpers/simulateLidar');
var findLandmarks = require('../../../../robot/helpers/findLandmarks');
var filterLandmarks = require('../../../../robot/helpers/filterLandmarks');
var LidarReading = require('./LidarReading');

var LidarStore = require('../../stores/LidarStore');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			data: LidarStore.data
		};
	},
	componentDidMount: function() {
		LidarStore.on('change', function() {
			this.setState({data: LidarStore.data});
		});
	},
	render: function() {
		var landmarkDots = {};
		var mapHeight = this.props.height;
		var mapWidth = this.props.width;

		// Get the wall positions from the store and create SVG elements for
		// each of them.
		var cursor = this.props.cursor;
		var text = '(' + Math.round(cursor.x) + ', ' + Math.round(mapHeight-cursor.y) + 'cm)';

		var lx = Math.round(cursor.x);
		var ly = this.props.height-Math.round(cursor.y);

		// Basic arithmetic
		var estimatedPosition = {x: 10, y: 18};
		var landmarkRange = getLandmarkRange(estimatedPosition);
		var readings = simulateLidar(9, 18, 2000);
		var landmarks = findLandmarks(readings);
		landmarks.forEach(function(landmark) {
			landmarkDots['landmark-' + landmark.x+'-'+landmark.y] = <rect x={estimatedPosition.x+landmark.x/10} y={this.props.height-estimatedPosition.y-landmark.y/10} width="1" height="1" fill="#f00" />;
		}.bind(this));

		// Filtering the landmarks based on the location of the robot
		var possibleLandmarks = filterLandmarks(landmarkRange, 0, estimatedPosition, landmarks);
		if (possibleLandmarks.length === 2) {
			var size = 4;
		} else {
			var size = 2;
		}

		// Displaying the possible landmark based on the location of the robot
		possibleLandmarks.forEach(function(landmark) {
			landmarkDots['plandmark-' + landmark.x+'-'+landmark.y] = <rect x={estimatedPosition.x+landmark.x/10} y={this.props.height-estimatedPosition.y-landmark.y/10} width={size} height={size} fill="#00f" />;
		}.bind(this));

		
		if (cursor.x > mapWidth - 25) {
			cursor.x = cursor.x - 25;
		}

		return (
			<g fill="#333">
				// Indicating the ranges robot is from the landmark
				{/* Box indicating range */}
				<rect x={landmarkRange.x[0]} y={this.props.height-landmarkRange.y[1]} width={landmarkRange.x[1]-landmarkRange.x[0]} height={landmarkRange.y[1]-landmarkRange.y[0]} fill="#3c3" opacity="0.2" />
				<text x={(landmarkRange.x[0]+landmarkRange.x[1])/2-2} y={this.props.height-(landmarkRange.y[0]+landmarkRange.y[1])/2+3} fontSize="6" fill="#3c3" opacity="0.8" style={{fontWeight:'bold'}}>{landmarkRange.i}</text>
				
				{/* Lidar readings */}
				// Indicating the readings from the Lidar
				<g fill="#f0c" transform={'translate(' + estimatedPosition.x + ',' + (this.props.height-estimatedPosition.y) + ')'}>
					<LidarReading key={lx + '-' + ly} count={readings.length} readings={readings} prev={true} />
				</g>
				
				{/* Estimated Position */}
				// Indicating the estimated position
				<rect x={estimatedPosition.x} y={this.props.height-estimatedPosition.y} width="3" height="3" fill="33f" opacity="0.4" />
				
				{/* Landmarks */}
				// Indicating the ranges robot is from the landmark
				{landmarkDots}
				<rect x={landmarkRange.landmark1.x} y={this.props.height-landmarkRange.landmark1.y} width="1" height="1" />
				<rect x={landmarkRange.landmark2.x} y={this.props.height-landmarkRange.landmark2.y} width="1" height="1" />
				
				{/* Cursor position */}
				<text x={this.props.cursor.x+5}
						y={this.props.cursor.y+3}
						fontSize="3">
					{text}</text>
			</g>
		);
	}
});
