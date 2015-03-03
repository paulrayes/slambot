var React = require('react');

var MotorStore = require('../stores/MotorStore');

module.exports = React.createClass({
	getInitialState: function() {
		return this.getStateFromStores();
	},
	componentDidMount: function() {
		MotorStore.on('change', this.onChange);
	},
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Enable Flags</h3>
				</div>
				<div className="panel-body">
					<p><label><input type="checkbox" checked={this.state.motorDriver} onChange={this.onMotorDriverChange} /> Motor Driver</label></p>
				</div>
			</div>
		);
	},
	onMotorDriverChange: function() {
		MotorStore.setEnabled(!MotorStore.isEnabled());
	},
	onChange: function() {
		this.setState(this.getStateFromStores());
	},
	getStateFromStores: function() {
		return {
			motorDriver: MotorStore.isEnabled()
		};
	}
});
