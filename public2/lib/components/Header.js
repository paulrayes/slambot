var React = require('react');

var version = require('../../package.json').version;

var LoadStore = require('../stores/LoadStore');

module.exports = React.createClass({
	getInitialState: function() {
		return LoadStore.data;
	},
	componentDidMount: function() {
		LoadStore.on('change', this.onChange);
	},
	render: function() {
		return (
			<div className="navbar navbar-inverse navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<a className="navbar-brand">TTGBot <small>v{version}</small></a>
					</div>
					<p className="navbar-text navbar-right">
						<span>Load: {this.state.load}</span>
						<span> | CPU: {this.state.cpu} %</span>
						<span> | RAM: {this.state.memory} MB</span>
					</p>
				</div>
			</div>
		);
	},
	onChange: function() {
		var data = LoadStore.data;
		data.load = Math.round(data.load * 100) / 100;
		data.cpu = Math.round(data.cpu * 10) / 10;
		data.memory = Math.round(data.memory / 1024 / 1024 * 10) / 10;
		this.setState(data);
	}
});
