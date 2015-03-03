var React = require('react');

var ImuStore = require('../stores/ImuStore');
var SpeedStore = require('../stores/SpeedStore');
var EstimatedPositionStore = require('../stores/EstimatedPositionStore');
/*var MotorStore = require('../stores/MotorStore');

// Height and width of the map used by the store
var mapHeight = 125;
var mapWidth = 125;*/

module.exports = React.createClass({
	/*getInitialState: function() {
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
	},*/
	getInitialState: function() {
		var data = ImuStore.data;
		data.speed = SpeedStore.data;
		data.estimatedPosition = EstimatedPositionStore.data;
		return data;
	},
	componentDidMount: function() {
		ImuStore.on('change', this.onChange);
		SpeedStore.on('change', this.onChange);
	},
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
						<th style={{width:'17%'}}>X</th>
						<th style={{width:'17%'}}>Y</th>
						<th style={{width:'17%'}}>Z</th>
					</tr>
					<tr>
						<th>Acceleration (m/s<sup>2</sup>)<br /><small>referenced to robot</small></th>
						<td>{this.state.accel.x}</td>
						<td>{this.state.accel.y}</td>
						<td>{this.state.accel.z}</td>
					</tr>
					<tr>
						<th>Acceleration (m/s<sup>2</sup>)<br /><small>referenced to earth</small></th>
						<td>{this.state.accelTranslated.x}</td>
						<td>{this.state.accelTranslated.y}</td>
						<td></td>
					</tr>
					<tr>
						<th>Speed (m/s)<br /><small>referenced to earth</small></th>
						<td>{this.state.speed.x}</td>
						<td>{this.state.speed.y}</td>
						<td></td>
					</tr>
					<tr>
						<th>Position (m)<br /><small>referenced to earth</small></th>
						<td>{this.state.estimatedPosition.x}</td>
						<td>{this.state.estimatedPosition.y}</td>
						<td></td>
					</tr>
					{/*<tr>
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
					</tr>*/}
				</table>
			</div>
		);
	},
	onChange: function() {
		var data = ImuStore.data;
		data.speed = SpeedStore.data;
		data.speed = {
			x: Math.round(data.speed.x * 100) / 100,
			y: Math.round(data.speed.y * 100) / 100,
			z: Math.round(data.speed.z * 100) / 100
		};
		data.estimatedPosition = EstimatedPositionStore.data;
		data.estimatedPosition = {
			x: Math.round(data.estimatedPosition.x * 100) / 100,
			y: Math.round(data.estimatedPosition.y * 100) / 100,
			z: Math.round(data.estimatedPosition.z * 100) / 100
		};
		data.accel = {
			x: Math.round(data.accel.x * 1000) / 1000,
			y: Math.round(data.accel.y * 1000) / 1000,
			z: Math.round(data.accel.z * 1000) / 1000
		};
		data.accelTranslated = {
			x: Math.round(data.accelTranslated.x * 1000) / 1000,
			y: Math.round(data.accelTranslated.y * 1000) / 1000
		};
		data.heading = Math.round(data.heading);
		this.setState(data);
	}
});
