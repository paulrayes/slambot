var React = require('react');

var ImuStore = require('../stores/ImuStore');
var SpeedStore = require('../stores/SpeedStore');
var EstimatedPositionStore = require('../stores/EstimatedPositionStore');

module.exports = React.createClass({
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
			</div>
		);
	},
	onChange: function() {
		var data = ImuStore.data;

		data.heading = Math.round(data.heading);
		this.setState(data);
	}
});
