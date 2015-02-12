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
					<h3 className="panel-title">Motor Speeds</h3>
				</div>
				<table className="table table-bordered" style={{width:'100%'}}>
					<tr>
						<th>&nbsp;</th>
						<th>Left</th>
						<th>Right</th>
					</tr>
					<tr style={{color:'#C00'}}>
						<th>Desired</th>
						<td>{this.state.left.desiredSpeed}</td>
						<td>{this.state.right.desiredSpeed}</td>
					</tr>
					<tr style={{color:'#666'}}>
						<th>Actual</th>
						<td>{this.state.left.actualSpeed}</td>
						<td>{this.state.right.actualSpeed}</td>
					</tr>
					<tr style={{color:'#666'}}>
						<th>Actual RPMs</th>
						<td>{this.state.left.actualRpm}</td>
						<td>{this.state.right.actualRpm}</td>
					</tr>
				</table>
			</div>
		);
	},
	onChange: function() {
		this.setState(MotorStore.data);
	}
});
