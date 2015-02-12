var React = require('react');

var MotorStore = require('../stores/MotorStore');

module.exports = React.createClass({
	getInitialState: function() {
		return MotorStore.data;
	},
	componentDidMount: function() {
		MotorStore.on('change', this.onChange);
	},
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Overall Speed/Direction</h3>
				</div>
				<table className="table table-bordered" style={{width:'100%'}}>
					<tr>
						<th>&nbsp;</th>
						<th>Speed</th>
						<th>Direction</th>
					</tr>
					<tr style={{color:'#C00'}}>
						<th>Desired</th>
						<td>{this.state.desiredSpeed}</td>
						<td>{this.state.desiredDirection}</td>
					</tr>
					<tr style={{color:'#666'}}>
						<th>Actual</th>
						<td>{this.state.actualSpeed}</td>
						<td>{this.state.actualDirection}</td>
					</tr>
				</table>
			</div>
		);
	},
	onChange: function() {
		this.setState(MotorStore.data);
	}
});
