var React = require('react');

/*var MotorStore = require('../stores/MotorStore');

// Height and width of the map used by the store
var mapHeight = 125;
var mapWidth = 125;*/

module.exports = React.createClass({
	getInitialState: function() {
		return {
			accel: {
				x: 1, y: 2, z: 3
			},
			mag: {
				x:4,y:5,z:6
			},
			gyro: {
				x:7,y:8,z:9
			},
			temp: 21,
			heading: 76
		};
	},
	/*getInitialState: function() {
		return MotorStore.data;
	},
	componentDidMount: function() {
		MotorStore.on('change', this.onChange);
	},*/
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">IMU</h3>
				</div>
				<div className="panel-body">
					<p>Heading: {this.state.heading}°</p>
					<p>Temperature: {this.state.temp}°C</p>
				</div>
				<table className="table table-bordered" style={{width:'100%'}}>
					<tr>
						<th>&nbsp;</th>
						<th>X</th>
						<th>Y</th>
						<th>Z</th>
					</tr>
					<tr>
						<th>Acceleration</th>
						<td>{this.state.accel.x}</td>
						<td>{this.state.accel.y}</td>
						<td>{this.state.accel.z}</td>
					</tr>
					<tr>
						<th>Magnetic Fields</th>
						<td>{this.state.mag.x}</td>
						<td>{this.state.mag.y}</td>
						<td>{this.state.mag.z}</td>
					</tr>
					<tr>
						<th>Angular Velocity</th>
						<td>{this.state.gyro.x}</td>
						<td>{this.state.gyro.y}</td>
						<td>{this.state.gyro.z}</td>
					</tr>
				</table>
			</div>
		);
	}/*,
	onChange: function() {
		this.setState(MotorStore.data);
	}*/
});
