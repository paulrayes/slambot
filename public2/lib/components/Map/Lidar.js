var React = require('react');

var EstimatedPositionStore = require('../../stores/EstimatedPositionStore');
var ActualPositionStore = require('../../stores/ActualPositionStore');
var LidarStore = require('../../stores/LidarStore');
var LidarReading = require('./LidarReading');

var LandmarksStore = require('../../stores/Landmarks');

module.exports = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return !(nextState.data === this.state.data);
	},
	getInitialState: function() {
		return {
			prevData: [],
			readings: LidarStore.data,
			position: EstimatedPositionStore.data,
			actualPosition: ActualPositionStore.data,
			data: LandmarksStore.data
		};
	},
	componentDidMount: function() {
		LidarStore.on('change', this.onChange);
		EstimatedPositionStore.on('change', this.onChange);
		ActualPositionStore.on('change', this.onChange);
		LandmarksStore.on('change', this.onChange);
	},
	render: function() {
		if (this.state.readings.count < 1 || typeof this.state.data.landmarkRange  === 'undefined') {
			return <g></g>;
		}
//console.log(EstimatedPositionStore.data);
		var things = {};
		//var transform='translate(' + this.props.width/2 + ',' + this.props.height/2 + ')';
		var transform='translate(' + this.state.position.x + ',' + (this.props.height-this.state.position.y) + ') rotate(' + -this.state.position.heading + ')';

		/*this.state.prevData.forEach(function(data) {
			if (typeof data === 'undefined' || data.count < 0) {
				return;
			}
			things['reading-' + data.count] = <g fill="#C99"><LidarReading count={data.count} readings={data.readings} prev={true} /></g>;
		});*/

		//things['reading-' + this.state.readings.count] = <g fill="#C36"><LidarReading count={this.state.readings.count} readings={this.state.readings.readings} prev={false} /></g>;
//console.log(EstimatedPositionStore.data);return <g></g>;
		var readings = this.state.readings;
		var landmarkDots = {};
		var estimatedPosition = this.state.data.estimatedPosition;
		var actualPosition = this.state.actualPosition;
		var landmarkRange = this.state.data.landmarkRange;
		var landmarks = this.state.data.allLandmarks;
		landmarks.forEach(function(landmark) {
			landmarkDots['landmark-' + landmark.x+'-'+landmark.y] = <rect x={estimatedPosition.x+landmark.x/10} y={this.props.height-estimatedPosition.y-landmark.y/10} width="1" height="1" fill="#f00" />;
		}.bind(this));
		var possibleLandmarks = this.state.data.possibleLandmarks;//filterLandmarks(landmarkRange, 0, estimatedPosition, landmarks);
		if (possibleLandmarks.length === 2) {
			var size = 4;
		} else {
			var size = 2;
		}
		possibleLandmarks.forEach(function(landmark) {
			landmarkDots['plandmark-' + landmark.x+'-'+landmark.y] = <rect x={estimatedPosition.x+landmark.x/10} y={this.props.height-estimatedPosition.y-landmark.y/10} width={size} height={size} fill="#00f" />;
		}.bind(this));

		return (
			<g>
				<g transform={transform}>
					{/*things*/}
					<g fill="#C36"><LidarReading count={readings.count} readings={readings.readings} prev={false} /></g>
				</g>
				<g fill="#333">
					{/* Box indicating range */}
					<rect x={landmarkRange.x[0]} y={this.props.height-landmarkRange.y[1]} width={landmarkRange.x[1]-landmarkRange.x[0]} height={landmarkRange.y[1]-landmarkRange.y[0]} fill="#3c3" opacity="0.2" />
					<text x={(landmarkRange.x[0]+landmarkRange.x[1])/2-2} y={this.props.height-(landmarkRange.y[0]+landmarkRange.y[1])/2+3} fontSize="6" fill="#3c3" opacity="0.8" style={{fontWeight:'bold'}}>{landmarkRange.i}</text>
					
					{/* Lidar readings * /}
					<g fill="#3c3" transform={'translate(' + actualPosition.x + ',' + (this.props.height-actualPosition.y) + ') rotate(' + actualPosition.heading + ')'}>
						<LidarReading readings={readings.readings} prev={false} />
					</g>*/}
					
					{/* Estimated Position */}
					<g fill="#33f" opacity="0.6" transform={'translate(' + estimatedPosition.x + ',' + (this.props.height-estimatedPosition.y) + ') rotate(' + (-estimatedPosition.heading) + ')'}>
						<polygon points="2,2 -2,2 0,-2" />
						<rect x="-2" y="1.9" width="4" height="3" />
					</g>
					{/*<rect x={estimatedPosition.x-2} y={this.props.height-estimatedPosition.y} width="3" height="3" fill="#33f" opacity="0.4" />*/}

					{/* Actual Position */}
					{/*<rect x={actualPosition.x} y={this.props.height-actualPosition.y} width="3" height="3" fill="#3c3" opacity="0.6" />*/}
					<g fill="#3c3" opacity="0.6" transform={'translate(' + actualPosition.x + ',' + (this.props.height-actualPosition.y) + ') rotate(' + (-actualPosition.heading) + ')'}>
						<polygon points="2,2 -2,2 0,-2" />
						<rect x="-2" y="1.9" width="4" height="3" />
					</g>
					
					{/* Landmarks */}
					{landmarkDots}
					<rect x={landmarkRange.landmark1.x} y={this.props.height-landmarkRange.landmark1.y} width="1" height="1" />
					<rect x={landmarkRange.landmark2.x} y={this.props.height-landmarkRange.landmark2.y} width="1" height="1" />
				</g>
			</g>
		);
	},
	onChange: function() {
		this.setState({
			prevData: [
				this.state.readings,
				this.state.prevData[0],
				this.state.prevData[1],
				this.state.prevData[2],
				this.state.prevData[3]
			],
			readings: LidarStore.data,
			position: EstimatedPositionStore.data,
			actualPosition: ActualPositionStore.data,
			data: LandmarksStore.data
		});
	}
});
