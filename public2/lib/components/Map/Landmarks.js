var React = require('react');

//var LidarStore = require('../../stores/LidarStore');
var LidarReading = require('./LidarReading');
var landmarks = require('../../../../robot/fixture/landmarks');


module.exports = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return false;
	},
	render: function() {
		var things = {};
		//var transform='translate(' + this.props.width/2 + ',' + this.props.height/2 + ')';
		//var x = 10; y = 20; {
		for (var x = 0; x <= 120; x = x + 5) {
			for (var y = 0; y <= 120; y = y + 5) {
				//console.log(landmarks[x][y]);
				landmarks.landmarks[x][y].forEach(function(landmark) {
					//var angle = (landmark.angle - 90)*Math.PI/180;
					var xx = landmark.actualX;//x+landmark.x/10;//landmark.distance*Math.cos(angle)/10;
					var yy = landmark.actualY;//y+landmark.y/10;//landmark.distance*Math.sin(angle)/10;
					if (typeof things['landmark-' + xx+'-'+yy] === 'undefined') {
						//var opacity = landmarks.counts[Math.round(xx)][Math.round(yy)] / landmarks.maxCount;
						//if (opacity < 0.002) {
						//	console.log(opacity);
						var opacity = 1;
							things['landmark-' + xx+'-'+yy] = <rect x={xx} y={this.props.height-yy} width="0.5" height="0.5" opacity={opacity} />;//<g fill="#C99"><LidarReading count={data.count} readings={data.readings} prev={true} /></g>;
						//}
					}
				}.bind(this));
			}
		}

		//things['landmark-' + this.state.data.count] = <g fill="#C36"><LidarReading count={this.state.data.count} readings={this.state.data.readings} prev={false} /></g>;

		return (
			<g fill="#3C3">
				{things}
			</g>
		);
	},
	onChange: function() {
		this.setState({
			prevData: [
				this.state.data,
				this.state.prevData[0],
				this.state.prevData[1],
				this.state.prevData[2],
				this.state.prevData[3]
			],
			data: LidarStore.data
		});
	}
});
